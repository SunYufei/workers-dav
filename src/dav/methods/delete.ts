import HTTPCode from '../../common/code';

export async function trash(success: boolean) {
    return new Response(null, {
        status: success ?
            HTTPCode.NoContent :
            HTTPCode.InternalServerError
    });
}
