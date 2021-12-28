import { driveType } from './drive/config.json'
import dav from './dav/export'
import GoogleDrive from './drive/google'
import { HTTPCode } from './common/http'

const drive = ((driveType) => {
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
