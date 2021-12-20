import { clientId, clientSecret, grantType, refreshToken, root } from './config.json'
import Drive from './drive'
import ItemProperty from '../common/property'
import PathUtil from './path'
import { HTTPCode } from '../common/http'
import encodeQuery from './query'

// URIs
const FILES_URI = 'https://www.googleapis.com/drive/v3/files'
const OAUTH_URI = 'https://www.googleapis.com/oauth2/v4/token'

// special MIME type
const MIME_FOLDER = 'application/vnd.google-apps.folder'

// special type
type RespJson = Record<string, any>

export default class GoogleDrive implements Drive {
   // access token
   private accessToken: string | null = null
   private expires = 0

   // cache
   private propCache: Record<string, ItemProperty> = {
      '/': {
         path: '/',
         id: root,
         contentLength: 0,
         contentType: MIME_FOLDER,
      },
   }
   private listCache: Record<string, string[]> = {}

   /**
    * get or update item property from:
    * 1. local memory
    * 2. using files:list api
    * @param path
    * @param withChildren
    */
   async getItemProperty(
      path: string,
      withChildren: boolean = false,
   ): Promise<ItemProperty[]> {
      const LOG_MSG = 'getItemProperties'
      console.log(LOG_MSG, path, 'withChildren: ', withChildren)

      const result = []

      // path
      if (this.propCache[path] == undefined) {
         const parent = PathUtil.getParent(path)
         const params = {
            'supportsAllDrives': 'true',
            'includeItemsFromAllDrives': 'true',
            'q': `'${parent}' in parents and trashed=false`,
            'fields':
               'files(id, name, mimeType, size, modifiedTime, createdTime',
         }
         const url = `${FILES_URI}?${encodeQuery(params)}`
         const response = await fetch(url, {
            method: 'GET',
            headers: await this.getAuthHeaders(),
         })
         const data = await response.json<RespJson>()
         // TODO support multi-page search
         const files = data['files']
         if (files != undefined) {
            for (const file of files) {
               console.log(file)
            }
         }
      }
      result.push(this.propCache[path])

      // children
      if (withChildren) {
         if (this.listCache[path] == undefined) {
         }
         for (const name of this.listCache[path])
            result.push(this.propCache[''])
      }
      return result
   }

   async fetchFile(path: string, range: string | null, withContent: boolean) {
      const LOG_MSG = 'fetchFile'
      console.log(LOG_MSG, path, 'Range', range, 'withContent', withContent)

      const property = await this.getItemProperty(path, false)
      if (property.length > 0) {
         let url = `${FILES_URI}/${property[0].id}?supportsAllDrives=true`
         if (withContent) url = `${url}&alt=media`
         const headers = await this.getAuthHeaders()
         if (range != null) headers['Range'] = range
         console.log(url, headers)
         // await fetch(url, {
         //     method: 'GET',
         //     headers: headers
         // })
      }
      console.log(LOG_MSG, path, 'not found')
      return new Response()
   }

   /**
    * mkdir using files:create api
    * @param path
    */
   async mkdir(path: string): Promise<boolean> {
      if ((await this.getItemProperty(path)) == undefined) {
         let parent = '/'
         let id = this.propCache[path].id
         for (let name of PathUtil.getParts(path)) {
            name = decodeURIComponent(name)
            const next = `${parent}/${name}`
            if (this.propCache[next] == undefined) {
               const response = await fetch(FILES_URI, {
                  method: 'POST',
                  headers: await this.getAuthHeaders(),
                  body: JSON.stringify({
                     'name': name.replace(/'/g, '\\\''),
                     'mimeType': MIME_FOLDER,
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
   async trash(path: string): Promise<boolean> {
      const LOG_MSG = 'trash'
      console.log(LOG_MSG, path)

      const property = await this.getItemProperty(path, true)
      if (property.length == 0) {
         console.log(LOG_MSG, path, 'not found')
         return false
      }
      for (const prop of property) {
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
            delete this.propCache[prop.path]
            console.log(LOG_MSG, prop.path, 'deleted in propCache')
            // delete info in listCache
            const parent = PathUtil.getParent(prop.path)
            if (this.listCache[parent] != undefined) {
               delete this.listCache[parent]
               console.log(
                  LOG_MSG,
                  prop.path,
                  `parent ${parent} deleted in listCache`,
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
    * 3. Google Drive API
    * @private
    */
   private async getAccessToken(): Promise<string | null> {
      const LOG_MSG = 'getAccessToken'
      const KV_TOKEN_KEY = 'gd_token'
      const KV_EXPIRES_KEY = 'gd_expires'

      if (this.accessToken == null || this.expires < Date.now()) {
         console.log(LOG_MSG, 'local token outdated')
         // check KV
         this.accessToken = await KV.get(KV_TOKEN_KEY)
         if (this.accessToken == null) {
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
            // console.log(LOG_MSG, data);
            // update access token
            const token = data['access_token']
            if (token != undefined) {
               const expiresIn = data['expires_in'] - 1
               // save to class
               this.accessToken = token
               this.expires = Date.now() + expiresIn * 1000
               // save to KV
               await KV.put(KV_TOKEN_KEY, token, { expirationTtl: expiresIn })
               await KV.put(KV_EXPIRES_KEY, this.expires.toString())
            }
         }
      }

      return this.accessToken
   }
}
