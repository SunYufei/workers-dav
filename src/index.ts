import {get, head, lock, mkcol, move, options, propfind, unlink, unlock} from './handler';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // default response: 405 method not allowed
    let response = new Response(null, {status: 405});

    if (method === 'OPTIONS')
        response = await options();
    else if (method === 'PROPFIND')
        response = await propfind(path, request.headers.get('Depth') || 'infinity');
    else if (method === 'PROPPATCH') {

    } else if (method === 'MKCOL')
        response = await mkcol(path);
    else if (method === 'GET')
        response = await get(path, request.headers.get('Range') || '0');
    else if (method === 'HEAD')
        response = await head(path);
    else if (method === 'POST') {

    } else if (method === 'DELETE')
        response = await unlink(path);
    else if (method === 'PUT') {

    } else if (method === 'COPY') {

    } else if (method === 'MOVE')
        response = await move(path, request.headers.get('Destination'));
    else if (method === 'LOCK')
        response = await lock(path);
    else if (method === 'UNLOCK')
        response = await unlock();

    // CORS config
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', url.origin);
    return response;
}