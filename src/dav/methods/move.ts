import { HTTPCode } from '../../utils/http'

export default function move(success: boolean) {
   return new Response(null, {
      status: success ? HTTPCode.Created : HTTPCode.Forbidden,
   })
}
