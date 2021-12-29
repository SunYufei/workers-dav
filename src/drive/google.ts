import {
   clientId,
   clientSecret,
   grantType,
   refreshToken,
   root,
} from './config.json'
import encodeQuery from './query'
import Drive from './drive'
import { HTTPCode } from '../common/http'
import ItemProperty from '../common/property'
import Path from '../common/path'

// URIs
const FILES_URI = 'https://www.googleapis.com/drive/v3/files'
const OAUTH_URI = 'https://www.googleapis.com/oauth2/v4/token'

// Google Drive 特定文件夹 MIME Type
const GOOGLE_FOLDER = 'application/vnd.google-apps.folder'

type RespJson = Record<string, any>

export default class GoogleDrive implements Drive {
   // access token
   private accessToken: string | null = null
   private expires: number = 0

   /** 缓存: { 绝对路径: ItemProperty } */
   private readonly cache: Record<string, ItemProperty> = {
      '/': { href: '/', id: root, children: [] },
   }

   /**
    * 以下面的顺序获取项目属性
    * 1. 内存
    * 2. KV
    * 3. 使用 files:list API
    */
   async getItemProps(path: string, withChildren: boolean = false) {
      const LOG_MSG = 'getItemProps'
      console.log(LOG_MSG, path, 'withChildren:', withChildren)

      // 从根目录开始获取目录属性
      let parent = '/'
      let id = this.cache[parent].id
      const parts = Path.parts(path)
      if (withChildren) parts.push('.')
      for (const name of parts) {
         const next = Path.join(parent, name)
         if (!this.cache[next]) {
            console.log(LOG_MSG, '本地缓存不存在', next)
            // 检查 KV 缓存
            const kvCache = await KV.get(next, { type: 'json' })
            if (kvCache) {
               this.cache[next] = kvCache as ItemProperty
               id = this.cache[next].id
               parent = next
               console.log(LOG_MSG, '使用KV缓存', next)
               continue
            }
            // 使用 files:list API 获取
            console.log(LOG_MSG, 'KV缓存不存在', next)
            const params = {
               'supportsAllDrives': 'true',
               'includeItemsFromAllDrives': 'true',
               'q': `'${id}' in parents and trashed=false`,
               'fields':
                  'files(id,name,size,mimeType,modifiedTime,createdTime)',
            }
            const url = `${FILES_URI}?${encodeQuery(params)}`
            const response = await fetch(url, {
               method: 'GET',
               headers: await this.getAuthHeaders(),
            })
            if (response.status != HTTPCode.OK) break
            const data = await response.json<RespJson>()
            if (!data['files'] || data['files'].length == 0) break

            // 检查是否需要更新父目录 children 字段
            let freshParent = false
            if (this.cache[parent].children?.length != data['files'].length) {
               this.cache[parent].children = []
               freshParent = true
            }

            // 解析存储文件属性
            for (const file of data['files']) {
               const item = Path.join(parent, file['name'])
               if (freshParent) this.cache[parent].children?.push(item)
               if (!this.cache[item]) {
                  this.cache[item] = {
                     href: item,
                     id: file['id'],
                     contentLength: file['size'],
                     contentType: file['mimeType'],
                     lastModified: file['modifiedTime'],
                     creationDate: file['createdTime'],
                  }
                  if (this.cache[item].contentType == GOOGLE_FOLDER) {
                     delete this.cache[item].contentType
                     this.cache[item].children = []
                  }
                  // 写入 KV
                  console.log(LOG_MSG, '写入KV', item)
                  await KV.put(item, JSON.stringify(this.cache[item]))
               }
            }

            // 存在目录结构变化，更新缓存
            if (freshParent) {
               await KV.put(parent, JSON.stringify(this.cache[parent]))
               console.log(LOG_MSG, '更新KV', parent)
            }
         }

         // 更新变量，准备下一轮循环
         if (!this.cache[next]) break
         id = this.cache[next].id
         parent = next
      }

      if (!this.cache[path]) return null

      const props = [this.cache[path]]
      if (withChildren && this.cache[path].children)
         for (const child of this.cache[path].children as string[])
            props.push(this.cache[child])

      console.log(LOG_MSG, `获取到 ${props.length} 个项目`)
      return props
   }

   async fetchFile(path: string, range: string | null, withContent: boolean) {
      const LOG_MSG = 'fetchFile'
      console.log(LOG_MSG, path, 'Range', range, 'withContent', withContent)

      const props = await this.getItemProps(path)
      if (props) {
         let url = `${FILES_URI}/${props[0].id}?supportsAllDrives=true`
         if (withContent) url = `${url}&alt=media`
         const headers = await this.getAuthHeaders()
         if (range != null) headers['Range'] = range
         return await fetch(url, {
            method: 'GET',
            headers: headers,
         })
      }

      console.log(LOG_MSG, '文件未找到', path)
      return new Response(null, {
         status: HTTPCode.NotFound,
      })
   }

   /** 使用 files:create API 新建文件夹 */
   async mkdir(path: string) {
      if ((await this.getItemProps(path)) == null) {
         let parent = '/'
         let id = this.cache[parent].id
         for (let name of Path.parts(path)) {
            name = decodeURIComponent(name)
            const next = `${parent}/${name}`
            if (this.cache[next] == undefined) {
               const response = await fetch(FILES_URI, {
                  method: 'POST',
                  headers: await this.getAuthHeaders(),
                  body: JSON.stringify({
                     'name': name.replace(/'/g, "\\'"),
                     'mimeType': GOOGLE_FOLDER,
                     'parents': [id],
                  }),
               })
               if (response.status != HTTPCode.OK) break
               // TODO handle response
            }
            // get next part of path
            id = this.cache[next].id
            parent = next
         }
      }
      return false
   }

   /** 使用 files:delete API 删除文件/文件夹 */
   async trash(path: string) {
      const LOG_MSG = 'trash'
      console.log(LOG_MSG, path)

      const props = await this.getItemProps(path, true)
      if (props == null) {
         console.log(LOG_MSG, path, 'not found')
         return false
      }
      for (const prop of props) {
         // TODO props[0] 删除父目录内容
         const url = `${FILES_URI}/${prop.id}?supportsAllDrives=true`
         const response = await fetch(url, {
            method: 'DELETE',
            headers: await this.getAuthHeaders(),
         })
         if (
            response.status == HTTPCode.OK &&
            response.headers.get('Content-Length') == '0'
         ) {
            // delete info in propCache
            delete this.cache[prop.href]
            await KV.delete(prop.href)
            console.log(LOG_MSG, '删除本地和KV存储', prop.href)
         }
      }
      return true
   }

   private async getAuthHeaders(): Promise<Record<string, string>> {
      return {
         'Authorization': `Bearer ${await this.getAccessToken()}`,
         'Content-Type': 'application/json',
      }
   }

   /**
    * 以下面的顺序获取/更新 Access Token
    * 1. 内存
    * 2. KV
    * 3. OAuth API
    * @private
    */
   private async getAccessToken(): Promise<string | null> {
      const LOG_MSG = 'getAccessToken'
      const KV_TOKEN_KEY = 'gd_token'
      const KV_EXPIRES_KEY = 'gd_expires'

      const that = this
      if (!this.accessToken || this.expires < Date.now()) {
         if (!that.accessToken) console.log(LOG_MSG, '本地token不存在')
         if (that.expires < Date.now()) console.log(LOG_MSG, '本地token过期')

         // 检查 KV
         that.accessToken = await KV.get(KV_TOKEN_KEY)
         that.expires = Number(await KV.get(KV_EXPIRES_KEY))
         if (!that.accessToken) {
            console.log(LOG_MSG, 'KV缓存过期')
            // 使用 API 获取
            const response = await fetch(OAUTH_URI, {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
               },
               body: encodeQuery({
                  client_id: clientId,
                  client_secret: clientSecret,
                  refresh_token: refreshToken,
                  grant_type: grantType,
               }),
            })
            const data = await response.json<RespJson>()
            // 更新 access token
            const token = data['access_token']
            if (token) {
               const expiresIn = data['expires_in'] - 1
               // 存入内存
               that.accessToken = token
               that.expires = Date.now() + expiresIn * 1000
               // 存到 KV
               await KV.put(KV_TOKEN_KEY, token, {
                  expirationTtl: expiresIn,
               })
               await KV.put(KV_EXPIRES_KEY, that.expires.toString())
               console.log(LOG_MSG, 'access token & expires写入KV')
            }
         }
      }

      return this.accessToken
   }
}
