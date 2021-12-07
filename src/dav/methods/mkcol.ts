import HTTPCode from '../../common/code';

export async function mkcol(success: boolean) {
    return new Response(null, { status: success ? HTTPCode.Created : HTTPCode.Forbidden });
}
