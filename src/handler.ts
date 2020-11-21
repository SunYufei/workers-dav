import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();


export async function options(): Promise<Response> {
    console.log('options')
    return new Response(null, {
        headers: {
            'Allow': 'GET, POST, OPTIONS, HEAD, MKCOL, PUT, PROPFIND, PROPPATCH, DELETE, MOVE, COPY, LOCK, UNLOCK',
            'DAV': '1, 2'
        }
    })
}

export async function propfind(path: string, depth: string): Promise<Response> {
    console.log('propfind', path, depth)
    // TODO handle depth = 0 here
    let body = `<?xml version="1.0" encoding="UTF-8" ?>
<D:multistatus xmlns:d="DAV:">
    <D:response>
        <D:href>${path}</D:href>
        <D:propstat>
            <D:prop>
                <D:getcontenttype>httpd/unix-directory</D:getcontenttype>
                <D:resourcetype><D:collection/></D:resourcetype>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>`;
    if (depth === '1') {
        // TODO fill body here
    }
    return new Response(body, {
        status: 207,
        headers: {'Content-Type': 'text/xml; charset=UTF-8'}
    });
}

export async function get(path: string, range: string): Promise<Response> {
    return await gd.fetchFile(path, range);
}

export async function head(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function move(src: string, dest: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function unlink(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function mkcol(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function lock(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function unlock(): Promise<Response> {
    return new Response(null, {status: 204});
}