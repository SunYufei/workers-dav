import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();

export async function options(): Promise<Response> {
    console.log('options');
    return new Response(null, {
        headers: {
            'Allow': 'OPTIONS, PROPFIND, PROPPATCH, MLCOL, GET, HEAD, DELETE, PUT, COPY, MOVE',
            'DAV': '1'
        }
    })
}