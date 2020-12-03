import {client_id, client_secret, grant_type, refresh_token, root} from './config.json';

function enQuery(data: { [key: string]: string }): string {
    const ret = [];
    for (const key in data) {
        ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    return ret.join('&');
}

function trimSlash(path: string): string {
    return path.replace(/^\/+|\/+$/g, '');
}

export default class GoogleDrive {
    // access token
    private accessToken = null;
    private expires = new Date(Date.now() - 1000).getMilliseconds();
    // URIs
    private fileURI = 'https://www.googleapis.com/drive/v3/files?supportsAllDrives=true';
    private uploadURI = 'https://www.googleapis.com/upload/drive/v3/files?supportsAllDrives=true';
    private oAuthURI = 'https://www.googleapis.com/oauth2/v4/token';
    // info cache, save format -> path: id
    private infoCache = Object({'/': {id: root, contentLength: 0, contentType: 'httpd/unix-directory'}});
    // list cache, save format -> folder: item
    private listCache = Object({'/': []});

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
            const option = await this.requestOption();
            option.headers['Range'] = range;
            return await fetch(url, option);
        } else {
            return new Response(null, {status: 404});
        }
    }

    private async itemInfo(path: string): Promise<{ id: string, contentLength: number, contentType: string } | null> {
        // get info of each part of path
        let parent = '/';
        let id = this.infoCache[parent][''];
        // get id of each part of path
        for (let name of trimSlash(path).split('/')) {
            name = decodeURIComponent(name).replace(/'/g, "\\'");
            if (this.infoCache[parent][name] === undefined) {
                const params = {
                    'includeItemsFromAllDrives': 'true',
                    'q': `'${id}' in parents and trashed=false`,
                    'fields': 'files(id, name, mimeType)'
                };
                const url = `${this.fileURI}?${enQuery(params)}`;
                const option = await this.requestOption();
                const response = await fetch(url, option);
                const data = await response.json();
                if (data.files.length == 0) {
                    return null
                } else {
                    // TODO save to infoCache and listCache
                    // TODO merge two caches
                    // TODO find param path's info
                }
            }
            // get next part of path
            // TODO change id
            parent = `${parent}/${name}`;
            // TODO mkdir in cache
        }
        return this.infoCache[path];
    }

    public async mkdir(path: string): Promise<boolean> {
        return false;
    }

    public async unlink(path: string): Promise<boolean> {
        return false;
    }

    /**
     * default request option
     * @private
     */
    private async requestOption(): Promise<{ method: string, headers: { [header: string]: string } }> {
        return {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`,
                'Content-Type': 'application/json'
            }
        }
    }

    /**
     * get or update access token
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
                body: enQuery(body)
            };
            const response = await fetch(this.oAuthURI, requestOption);
            const data = await response.json();
            console.log(data);
            // update access token
            if (data['access_token'] !== undefined) {
                console.log('getAccessToken', 'successful');
                this.accessToken = data['access_token'];
                this.expires = new Date(Date.now() + parseInt(data['expires_in']) * 1000).getMilliseconds();
            }
        }
        return this.accessToken;
    }
}