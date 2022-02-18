import { HTTPCode } from '../../utils/http'

export default function trash(success: boolean) {
   return new Response(null, {
      status: success ? HTTPCode.NoContent : HTTPCode.InternalServerError,
   })
}
