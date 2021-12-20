export default function options() {
   return new Response(null, {
      headers: {
         'Allow':
            'OPTIONS, PROPFIND, PROPPATCH, MKCOL, GET, HEAD, DELETE, COPY, MOVE',
         'DAV': '1',
      },
   })
}
