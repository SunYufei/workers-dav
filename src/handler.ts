import { driveType } from './drive/config.json';
import GoogleDrive from './drive/google';
import * as dav from './dav/export';

const drive = (function (driveType) {
    return new GoogleDrive();
})(driveType)

export async function options() {
    console.log('OPTIONS');
    return dav.options();
}

export async function trash(path: string) {
    console.log('DELETE', path);
    return dav.trash(await drive.trash(path));
}

export async function mkcol(path: string) {
    console.log('MKCOL', path);
    return dav.mkcol(await drive.mkdir(path));
}

export async function get(path: string, range: string | null) {
    console.log('GET', path, 'range:', range);
    // return await gd.fetchFile(path, range, true)
}

export async function head(path: string) {
    console.log('HEAD', path);
    // return await gd.fetchFile(path, null, false);
}

export async function propfind(path: string, depth: string) {
    console.log('PROPFIND', path, 'depth:', depth);
    // disable infinity depth
    if (depth == 'infinity')
        depth = '1';
    const properties = await drive.getItemProperty(path, depth == '1');
    return dav.propfind(properties);
}
