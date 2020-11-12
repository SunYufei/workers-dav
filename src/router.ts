import GoogleDrive from './drive/drive';

const gd = new GoogleDrive();

/**
 * GET
 * @param path
 * @param range
 */
export async function get(path: string, range: string) {
    // if (path.slice(-1) === '/') {
    // TODO get path
    // } else {
    return await gd.fetchFile(path, range);
    // }
}

export async function propfind(path: string) {

}

export async function mkcol(path: string) {

}
