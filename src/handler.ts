import DAV from './dav'
import GoogleDrive from './drive/google'
import { driveType } from './drive/config.json'
import { HTTPCode } from './utils/http'

const dav = new DAV()
const drive = ((driveType: string) => {
   // TODO support other drives, e.g. OneDrive, AliYunDrive
   return new GoogleDrive()
})(driveType)

export function options() {
   console.log('OPTIONS')
   return dav.options()
}

export async function trash(path: string) {
   console.log('DELETE', path)
   return dav.trash(await drive.trash(path))
}

export async function mkcol(path: string) {
   console.log('MKCOL', path)
   return dav.mkcol(await drive.mkdir(path))
}

export async function move(src: string, dst: string) {
   console.log('MOVE', src, dst)
   return dav.move(await drive.move(src, dst))
}

export async function get(path: string, range: string | null) {
   console.log('GET', path, range)
   return await drive.fetchFile(path, range, true)
}

export async function head(path: string) {
   console.log('HEAD', path)
   return await drive.fetchFile(path, null, false)
}

export async function propfind(path: string, depth: string) {
   console.log('PROPFIND', path, 'depth:', depth)

   // refuse infinity depth
   if (depth == 'infinity')
      return new Response(null, { status: HTTPCode.Forbidden })
   return dav.propfind(await drive.getItemProps(path, depth == '1'))
}
