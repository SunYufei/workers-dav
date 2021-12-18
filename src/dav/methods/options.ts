export async function options() {
    return new Response(null, {
        headers: {
            'Allow': 'OPTIONS, PROPFIND, PROPPATCH, MLCOL, GET, HEAD, DELETE, COPY, MOVE',
            'DAV': '1'
        }
    });
}
