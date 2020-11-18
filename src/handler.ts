import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();

/**
 * GET file content
 * @param path
 * @param range 
 */
export async function get(path: string, range: string) {
    return await gd.fetchFile(path, range);
}

export async function options() {
    return new Response(null, {
        headers: {
            'Allow': 'GET, POST, OPTIONS, HEAD, MKCOL, PUT, PROPFIND, PROPPATCH, DELETE, MOVE, COPY, LOCK, UNLOCK',
            // TODO 'DAV': '1,2'
        }
    })
}

export async function propfind(path: string, depth: string) {
    let body = '';
    // TODO fill body
    return new Response(body, {
        status: 207,
        headers: {
            'Content-Type': 'text/xml; charset=UTF-8'
        }
    });
}

/**
 * MKCOL create path
 * @param path 
 */
export async function mkcol(path: string) {
    const id = await gd.createPath(path);
    if (id != null)
        return new Response(null, { status: 201 });
    else
        return new Response(null, { status: 403 });
}
