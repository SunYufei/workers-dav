import {
   clientId,
   clientSecret,
   grantType,
   refreshToken,
   root,
} from './config.json'
import Drive from './drive'
import { encodeQuery, HTTPCode } from '../utils/http'
import Path from '../utils/path'

// URIs
const FILES_URI = 'https://www.googleapis.com/drive/v3/files'
const OAUTH_URI = 'https://www.googleapis.com/oauth2/v4/token'

// Google Drive 特定文件夹 MIME Type
const GOOGLE_FOLDER = 'application/vnd.google-apps.folder'

export default class GoogleDrive implements Drive {
   // access token
   private accessToken: string | null = null

   /** 缓存: { 绝对路径: ItemProperty } */
   private readonly cache: Record<string, ItemProperty> = {
      '/': { href: '/', id: root, children: [] },
   }

   /**
    * 以下面的顺序获取项目属性
    * 1. 内存
    * 2. KV
    * 3. 使用 files:list API
    * @returns [pathProp, ...childrenProps]
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
            const data = await response.json<StrAny>()
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

      console.error(LOG_MSG, '文件未找到', path)
      return new Response(null, {
         status: HTTPCode.NotFound,
      })
   }

   /** 使用 files:create API 新建文件夹 */
   async mkdir(path: string) {
      const LOG_MSG = 'mkdir'
      console.log(LOG_MSG, path)

      // 文件夹存在则忽略
      const prop = await this.getItemProps(path, false)
      if (prop) {
         console.log(LOG_MSG, '文件夹已存在', path)
         return true
      }

      // 判断父文件夹是否存在
      const parent = Path.getParent(path)
      const props = await this.getItemProps(parent, false)
      if (!props) {
         console.error(LOG_MSG, '父文件夹不存在', path)
         return false
      }

      // 使用 files:create API 创建文件夹
      console.log(LOG_MSG, '使用 API 新建文件夹', path)
      const resp = await fetch(FILES_URI, {
         method: 'POST',
         headers: await this.getAuthHeaders(),
         body: JSON.stringify({
            'name': Path.getName(path),
            'mimeType': GOOGLE_FOLDER,
            'parents': [props[0].id],
         }),
      })
      if (resp.status != HTTPCode.OK) {
         console.error(LOG_MSG, 'API请求失败', path)
         return false
      }
      const data = await resp.json<StrAny>()
      if (!data || !data.id) {
         console.error(LOG_MSG, '文件夹新建失败', path)
         return false
      }
      // 写入内存
      this.cache[path] = {
         href: path,
         id: data.id,
         children: [],
      }
      this.cache[parent].children?.push(path)
      // 写入 KV
      await KV.put(parent, JSON.stringify(this.cache[parent]))
      await KV.put(path, JSON.stringify(this.cache[path]))

      return true
   }

   async move(src: string, dst: string) {
      return true
   }

   /** 使用 files:delete API 删除文件/文件夹 */
   async trash(path: string) {
      const LOG_MSG = 'trash'
      console.log(LOG_MSG, path)

      const props = await this.getItemProps(path, true)
      if (props == null) {
         console.error(LOG_MSG, '文件/文件夹不存在', path)
         return false
      }

      // 清除父目录中的部分信息
      const parent = Path.getParent(path)
      this.cache[parent].children = []
      await KV.delete(parent)

      // 删除目录及其文件
      for (const prop of props) {
         const url = `${FILES_URI}/${prop.id}?supportsAllDrives=true`
         const resp = await fetch(url, {
            method: 'DELETE',
            headers: await this.getAuthHeaders(),
         })
         if (
            resp.status == HTTPCode.OK &&
            resp.headers.get('Content-Length') == '0'
         ) {
            // 删除缓存信息
            delete this.cache[prop.href]
            await KV.delete(prop.href)
            console.log(LOG_MSG, '删除本地和KV存储', prop.href)
         } else {
            console.error(LOG_MSG, '删除文件/文件夹失败', prop.href)
            return false
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

      const that = this
      if (!this.accessToken) {
         console.log(LOG_MSG, '本地token不存在')

         // 检查 KV
         that.accessToken = await KV.get(KV_TOKEN_KEY)
         if (!that.accessToken) {
            console.log(LOG_MSG, 'KV缓存过期')
            // 使用 API 获取
            const resp = await fetch(OAUTH_URI, {
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
            const data = await resp.json<StrAny>()
            // 更新 access token
            const token = data['access_token']
            if (token) {
               // 存入内存
               that.accessToken = token
               // 存到 KV
               await KV.put(KV_TOKEN_KEY, token, {
                  expirationTtl: data['expires_in'] - 1,
               })
               console.log(LOG_MSG, 'access token 写入 KV')
            } else {
               console.error(LOG_MSG, 'access token 请求失败')
            }
         }
      }

      return this.accessToken
   }
}
