import {client_id, client_secret, grant_type, refresh_token, root} from "./config.json";
import {pathJoin, pathParts} from "./path";

function encodeQuery(data: { [key: string]: string }): string {
    const ret = [];
    for (const key in data) {
        ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    }
    return ret.join('&');
}

export default class GoogleDrive {
    // accessToken and expires
    private accessToken = null;
    private expires = Date.now() - 1;
    // URIs
    private fileURI = 'https://p.ipear.ml/www.googleapis.com/drive/v3/files';
    private uploadURI = 'https://p.ipear.ml/www.googleapis.com/upload/drive/v3/files';
    private oAuthURI = 'https://p.ipear.ml/www.googleapis.com/oauth2/v4/token';
    // infoCache
    private infoCache: { [path: string]: { id: string, size: string, mimeType: string } } = {
        '/': {id: root, size: '0', mimeType: 'application/vnd.google-apps.folder'}
    };
    // list cache, save format -> folder: item
    private listCache: { [path: string]: Array<string> } = {};

    /**
     * fetch file content
     * @param path
     * @param range
     * @returns {Promise<Response>}
     */
    public async fetchFile(path: string, range: string): Promise<Response> {
        console.log('fetchFile', path, range);
        const info = await this.itemInfo(path);
        if (info != null) {
            const url = `${this.fileURI}/${info.id}?alt=media`;
            const requestOption = {
                method: 'GET',
                headers: await this.authHeader()
            }
            requestOption.headers['Range'] = range;
            return await fetch(url, requestOption);
        } else {
            return new Response(null, {status: 404});
        }
    }

    /**
     * get path info, include id, size, mimeType
     * @param path
     * @public
     */
    public async itemInfo(path: string): Promise<{ id: string; size: string; mimeType: string } | null> {
        // get info of each part of path
        let parent = '/';
        let id = this.infoCache[parent].id;

        for (let name of pathParts(path)) {
            name = decodeURIComponent(name.replace(/'/g, "\\'"));
            const next = pathJoin(parent, name);
            if (this.infoCache[next] == undefined) {
                const params = {
                    'supportsAllDrives': 'true',
                    'includeItemsFromAllDrives': 'true',
                    'q': `'${id}' in parents and trashed=false`,
                    'fields': 'files(id, name, mimeType, size)'
                };
                const url = `${this.fileURI}?${encodeQuery(params)}`;
                const requestOption = {
                    method: 'GET',
                    headers: await this.authHeader()
                }
                const response = await fetch(url, requestOption);
                const data = await response.json();
                if (data.files.length != 0) {
                    for (const file of data.files) {
                        this.infoCache[pathJoin(parent, file['name'])] = {
                            id: file['id'],
                            size: file['size'],
                            mimeType: file['mimeType']
                        }
                        if (this.listCache[parent] == undefined) {
                            this.listCache[parent] = [];
                        }
                        this.listCache[parent].push(file['name']);
                    }
                } else {
                    console.log('itemInfo', `get info of ${next} failed`);
                    return null;
                }
            }
            // get next part of path
            const nextInfo = this.infoCache[next];
            id = nextInfo != undefined ? nextInfo.id : '';
            parent = next;
        }
        return this.infoCache[path] || null;
    }

    public async mkdir(path: string): Promise<boolean> {
        if (await this.itemInfo(path) == undefined) {
            let parent = '/';
            let id = this.infoCache[parent].id;
            for (let name of pathParts(path)) {
                name = decodeURIComponent(name).replace(/'/g, "\\'");
                const next = `${parent}/${name}`;
                if (this.infoCache[next] == undefined) {
                    const body = {
                        'name': name,
                        'mimeType': 'application/vnd.google-apps.folder',
                        'parents': [id]
                    }
                    const requestOption = {
                        method: 'POST',
                        headers: await this.authHeader(),
                        body: JSON.stringify(body)
                    }
                    const response = await fetch(this.fileURI, requestOption);
                    // TODO handle response
                }
                // get next part of path
                id = this.infoCache[next].id;
                parent = next;
            }
        }
        return true;
    }

    public async unlink(path: string): Promise<boolean> {
        // TODO folder unlink
        const info = await this.itemInfo(path);
        if (info == null)
            return false;
        const url = `${this.fileURI}/${info.id}?supportsAllDrives=true`;
        const requestOption = {
            method: 'DELETE',
            headers: await this.authHeader()
        }
        const response = await fetch(url, requestOption);
        if (response.status === 200 && response.headers.get('Content-Length') === '0') {
            // delete info in infoCache
            delete this.infoCache[path];
            // TODO delete info in listCache
            return true;
        } else
            return false;
    }

    /**
     * authorization header
     * @private
     */
    private async authHeader(): Promise<{ [header: string]: string }> {
        return {
            'Authorization': `Bearer ${await this.getAccessToken()}`,
            'Content-Type': 'application/json'
        }
    }

    /**
     * get access token
     * @private
     */
    private async getAccessToken(): Promise<string | null> {
        // update access token when it's outdated
        if (this.accessToken == null || this.expires < Date.now()) {
            console.log('getAccessToken', 'access token outdated');
            const body = {
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token,
                grant_type: grant_type
            };
            const requestOption = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: encodeQuery(body)
            };
            const response = await fetch(this.oAuthURI, requestOption);
            const data = await response.json();
            // console.log(data);
            // update access token
            if (data['access_token'] != undefined) {
                console.log('getAccessToken', 'successful');
                this.accessToken = data['access_token'];
                this.expires = new Date(Date.now() + parseInt(data['expires_in']) * 1000).getTime();
            }
        }
        return this.accessToken;
    }
}