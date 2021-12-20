import { HTTPCode } from '../../common/http'

export default function trash(success: boolean) {
   return new Response(null, {
      status: success ? HTTPCode.NoContent : HTTPCode.InternalServerError,
   })
}
