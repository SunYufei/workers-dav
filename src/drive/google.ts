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
   private expires = 0

   /** property cache: { abs path: property } */
   private propCache: Record<string, ItemProperty> = {
      '/': { href: '/', id: root },
   }
   /** list cache: { parent: children[] } */
   private listCache: Record<string, string[]> = {}

   /**
    * get or update item property from:
    * 1. local memory
    * 2. TODO KV
    * 3. using files:list api
    * @param path
    * @param withChildren
    */
   async getItemProps(path: string, withChildren = false) {
      const LOG_MSG = 'getItemProps'
      console.log(LOG_MSG, path, 'withChildren:', withChildren)

      let current = '/'
      let id = this.propCache[current].id
      for (const name of Path.parts(
         withChildren ? Path.join(path, '.') : path
      )) {
         const next = Path.join(current, name)
         if (!this.propCache[next]) {
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
            this.listCache[current] = []
            for (const file of data['files']) {
               const item = Path.join(current, file['name'])
               this.listCache[current].push(item)
               this.propCache[item] = {
                  href: item,
                  id: file['id'],
                  contentLength: file['size'],
                  contentType: file['mimeType'],
                  lastModified: file['modifiedTime'],
                  creationDate: file['createdTime'],
               }
            }
         }
         if (!this.propCache[next]) break
         id = this.propCache[next].id
         current = next
      }

      const props = []
      if (this.propCache[path]) props.push(this.propCache[path])
      if (withChildren && this.listCache[path])
         for (const child of this.listCache[path])
            props.push(this.propCache[child])

      console.log(LOG_MSG, `find ${props.length} items`)
      return props[0] ? props : null
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

      console.log(LOG_MSG, path, 'not found')
      return new Response(null, {
         status: HTTPCode.NotFound,
      })
   }

   /**
    * mkdir using files:create api
    * @param path
    */
   async mkdir(path: string) {
      if ((await this.getItemProps(path)) == null) {
         let parent = '/'
         let id = this.propCache[parent].id
         for (let name of Path.parts(path)) {
            name = decodeURIComponent(name)
            const next = `${parent}/${name}`
            if (this.propCache[next] == undefined) {
               const response = await fetch(FILES_URI, {
                  method: 'POST',
                  headers: await this.getAuthHeaders(),
                  body: JSON.stringify({
                     'name': name.replace(/'/g, "\\'"),
                     'mimeType': GOOGLE_FOLDER,
                     'parents': [id],
                  }),
               })
               // TODO handle response
            }
            // get next part of path
            id = this.propCache[next].id
            parent = next
         }
      }
      return false
   }

   /**
    * delete file/path using files:delete api
    * @param path
    * @returns
    */
   async trash(path: string) {
      const LOG_MSG = 'trash'
      console.log(LOG_MSG, path)

      const props = await this.getItemProps(path, true)
      if (props == null) {
         console.log(LOG_MSG, path, 'not found')
         return false
      }
      for (const prop of props) {
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
            delete this.propCache[prop.href]
            console.log(LOG_MSG, prop.href, 'deleted in propCache')
            // delete info in listCache
            const parent = Path.getParent(prop.href)
            if (this.listCache[parent] != undefined) {
               delete this.listCache[parent]
               console.log(
                  LOG_MSG,
                  prop.href,
                  `parent ${parent} deleted in listCache`
               )
            }
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
    * get or update access token from:
    * 1. local memory
    * 2. KV
    * 3. OAuth API
    * @private
    */
   private async getAccessToken(): Promise<string | null> {
      const LOG_MSG = 'getAccessToken'
      const KV_TOKEN_KEY = 'gd_token'
      const KV_EXPIRES_KEY = 'gd_expires'

      if (!this.accessToken || this.expires < Date.now()) {
         console.log(LOG_MSG, 'local token outdated')
         // check KV
         this.accessToken = await KV.get(KV_TOKEN_KEY)
         if (!this.accessToken) {
            console.log(LOG_MSG, 'KV token outdated')
            // get access token using API
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
            // update access token
            const token = data['access_token']
            if (token != undefined) {
               const expiresIn = data['expires_in'] - 1
               // save to class
               this.accessToken = token
               this.expires = Date.now() + expiresIn * 1000
               // save to KV
               await KV.put(KV_TOKEN_KEY, token, {
                  expirationTtl: expiresIn,
               })
               await KV.put(KV_EXPIRES_KEY, this.expires.toString())
            }
         }
      }

      return this.accessToken
   }
}
