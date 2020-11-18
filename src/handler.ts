import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();


export async function options(): Promise<Response> {
    return new Response(null, {
        headers: {
            'Allow': 'GET, POST, OPTIONS, HEAD, MKCOL, PUT, PROPFIND, PROPPATCH, DELETE, MOVE, COPY, LOCK, UNLOCK',
            // TODO confirm 'DAV': '1,2'
        }
    })
}

export async function propfind(path: string, depth: string): Promise<Response> {
    console.log('propfind', path, depth)
    let body = '';
    // TODO fill body
    return new Response(body, {
        status: 207,
        headers: { 'Content-Type': 'text/xml; charset=UTF-8' }
    });
}


export async function get(path: string, range: string): Promise<Response> {
    return await gd.fetchFile(path, range);
}

export async function head(path: string): Promise<Response> {

}

export async function move(src: string, dest: string): Promise<Response> {

}

export async function unlink(path: string): Promise<Response> {

}

export async function mkcol(path: string): Promise<Response> {

}

export async function lock(path: string): Promise<Response> {

}

export async function unlock(): Promise<Response> {
    return new Response(null, { status: 204 });
}