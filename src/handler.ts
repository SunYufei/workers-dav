import { driveType } from './drive/config.json'
import dav from './dav/export'
import GoogleDrive from './drive/google'

const drive = (function(driveType) {
   // TODO support other drives, e.g. OneDrive, AliyunDrive
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

export async function get(
   path: string,
   range: string | null,
   withContent: boolean,
) {
   console.log('GET', path, range, withContent)
   return new Response(path)
}

export async function head(path: string) {
   console.log('HEAD', path)
   return new Response(path)
}

export async function propfind(path: string, depth: string) {
   console.log('PROPFIND', path, 'depth:', depth)
   // disable infinity depth
   if (depth == 'infinity') depth = '1'
   const properties = await drive.getItemProperty(path, depth == '1')
   return dav.propfind(properties)
}
