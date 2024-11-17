import { Env } from './env';
import { DAV } from 'libs/dav';
import { GoogleDrive } from 'libs/drive/google';
import { Path } from 'libs/path';

let gd: GoogleDrive;

export const onRequestOptions: PagesFunction = (_) => DAV.OPTIONS;

export const onRequestDelete: PagesFunction<Env> = async ({ env, request }) => {
   init(env);
   const url = new URL(request.url);
   const path = Path.resolve(url.pathname);
   return DAV.trash(await gd.trash(path));
};

function init(env: Env) {
   if (!gd) {
      gd = new GoogleDrive(
         env.KV,
         env.CLIENT_ID,
         env.CLIENT_SECRET,
         env.REFRESH_TOKEN,
         env.ROOT,
         env.GRANT_TYPE,
      );
   }
}
