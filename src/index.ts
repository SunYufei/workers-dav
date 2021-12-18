import HTTPCode from './common/code';
import { options, propfind } from './handler';

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // default response: 405 method not allowed
    let response = new Response(null, { status: HTTPCode.MethodNotAllowed });

    if (method == 'OPTIONS')
        response = await options();
    // else if (method == 'DELETE')
    //     response = await Delete(path);
    // else if (method == 'MKCOL')
    //      response = await mkcol(path);
    else if (method == 'PROPFIND')
        response = await propfind(path, request.headers.get('Depth') || '0');
    // else if (method == 'GET')
    //     response = await get(path, request.headers.get('Range'));
    // else if (method == 'HEAD')
    //     response = await head(path);

    // CORS config
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', url.origin);
    return response;
}
