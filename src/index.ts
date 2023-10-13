import { get, head, mkcol, move, options, propfind, trash } from './handler'
import { HTTPCode } from './utils/http'
import Path from './utils/path'

export interface Env {}

export default {
   async fetch(
      request: Request,
      env: Env,
      ctx: ExecutionContext
   ): Promise<Response> {
      const url = new URL(request.url)
      const path = Path.resolve(url.pathname)
      const headers = request.headers
      const method = request.method

      // default response: 405 method not allowed
      let response = new Response(null, {
         status: HTTPCode.MethodNotAllowed,
      })
      if (method == 'OPTIONS') response = options()
      if (method == 'DELETE') response = await trash(path)
      if (method == 'GET') response = await get(path, headers.get('Range'))
      // if (method == 'HEAD') response = await head(path)
      if (method == 'MKCOL') response = await mkcol(path)
      if (method == 'MOVE')
         response = await move(path, headers.get('Destination') || '/')
      if (method == 'PROPFIND')
         response = await propfind(path, headers.get('Depth') || '0')
      // CORS config
      response = new Response(response.body, response)
      response.headers.set('Access-Control-Allow-Origin', url.origin)
      return response
   },
}
