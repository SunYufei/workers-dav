import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();


export async function options(): Promise<Response> {
    console.log('options')
    return new Response(null, {
        headers: {
            'Allow': 'OPTIONS, PROPFIND, PROPPATCH, MLCOL, GET, HEAD, DELETE, PUT, COPY, MOVE',
            'DAV': '1'
        }
    })
}

export async function propfind(path: string, depth: string): Promise<Response> {
    console.log('propfind', path, depth)
    // TODO get info
    const body = [`<?xml version="1.0" encoding="UTF-8" ?>`];
    body.push(`
<d:multistatus xmlns:d="DAV:">
    <d:response>
        <d:href>${path}</d:href>
        <d:propstat>
            <d:prop>
                <d:getcontentlength>0</d:getcontentlength>
                <d:getcontenttype>httpd/unix-directory</d:getcontenttype>
                <d:resourcetype><d:collection/></d:resourcetype>
            </d:prop>
            <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
    </d:response>
</d:multistatus>`);
    return new Response(body.join(''), {
        status: 207,
        headers: {'Content-Type': 'text/xml; charset=UTF-8'}
    });
}

export async function proppatch() {

}

export async function mkcol(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function get(path: string, range: string): Promise<Response> {
    return await gd.fetchFile(path, range);
}

export async function head(path: string): Promise<Response> {
    // TODO fill body
    return new Response(null, {status: 200});
}

export async function unlink(path: string): Promise<Response> {
    // TODO for path, delete file in recursion
    // TODO for file, delete it
    return new Response(null, {status: 200});
}

export async function put() {

}

export async function copy() {

}

export async function move(src: string, dest: string): Promise<Response> {
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