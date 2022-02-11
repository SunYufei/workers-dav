import { get, head, mkcol, options, propfind, trash } from './handler'
import { HTTPCode } from './common/http'
import Path from './common/path'

addEventListener('fetch', (event) => {
   event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
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
   if (method == 'PROPFIND')
      response = await propfind(path, headers.get('Depth') || '0')
   // CORS config
   response = new Response(response.body, response)
   response.headers.set('Access-Control-Allow-Origin', url.origin)
   return response
}
