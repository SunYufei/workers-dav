import {client_id, client_secret, refresh_token, root} from './config.json';

function enQuery(data: { [key: string]: string }) {
    const ret = [];
    for (const key in data) {
        ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    return ret.join('&');
}

function trimSlash(path: string) {
    return path.replace(/^\/+|\/+$/g, '');
}

export default class GoogleDrive {
    private accessToken = null;
    private expires = new Date(Date.now() - 1000).getMilliseconds();
    private fileURI = 'https://www.googleapis.com/drive/v3/files';
    // private _uploadURI = 'https://www.googleapis.com/upload/drive/v3/files';
    private oAuthURI = 'https://www.googleapis.com/oauth2/v4/token';
    private idCache = Object({'': {'': root}});

    /**
     * fetch file content
     * @param path
     * @param range
     * @returns {Promise<Response>}
     */
    public async fetchFile(path: string, range: string) {
        console.log('fetchFile', path, range);
        const id = this.itemId(path);
        if (id != null) {
            const url = `${this.fileURI}/${id}?alt=media`;
            const option = await this.requestOption();
            option.headers['Range'] = range;
            return await fetch(url, option);
        } else {
            return new Response(null, {status: 404});
        }
    }

    /**
     * get or fetch item id
     * @param path
     * @private
     */
    private async itemId(path: string) {
        let parent = '';
        let id = this.idCache[parent][''];
        // get id of each part of path
        for (let name of trimSlash(path).split('/')) {
            name = decodeURIComponent(name).replace(/'/g, "\\'");
            if (this.idCache[parent][name] === undefined) {
                const params = Object({
                    'includeItemsFromAllDrives': true,
                    'supportsAllDrives': true,
                    'q': `'${id}' in parents and name='${name}' and trashed=false`,
                    'fields': 'files(id, name, mimeType)'
                });
                const url = `${this.fileURI}?${enQuery(params)}`;
                const option = await this.requestOption();
                const response = await fetch(url, option);
                const data = await response.json();
                if (data.files[0] === undefined) {
                    return null;
                } else {
                    // save to cache
                    this.idCache[parent][name] = data.files[0].id;
                }
            }
            // get next part of path
            id = this.idCache[parent][name];
            parent = `${parent}/${name}`;
            if (parent.slice(1) !== path && this.idCache[parent] === undefined) {
                this.idCache[parent] = {};
            }
        }
        return id;
    }

    /**
     * default request option
     * @private
     */
    private async requestOption() {
        return {
            method: 'GET',
            headers: Object({
                'authorization': `Bearer ${await this.getAccessToken()}`,
                'content-type': 'application/json'
            })
        }
    }

    /**
     * get or update access token
     * @private
     */
    private async getAccessToken() {
        // update access token when it's outdated
        if (this.accessToken == null || this.expires < Date.now()) {
            console.log('_getAccessToken', 'get access token');
            const postData = {
                client_id: client_id,
                client_secret: client_secret,
                refresh_token: refresh_token,
                grant_type: 'refresh_token'
            };
            const requestOption = {
                method: 'POST',
                headers: {'content-type': 'application/x-www-form-urlencoded'},
                body: enQuery(postData)
            };
            const response = await fetch(this.oAuthURI, requestOption);
            const data = await response.json();
            console.log(data);
            // update access token
            if (data['access_token'] !== undefined) {
                this.accessToken = data['access_token'];
                this.expires = new Date(Date.now() + parseInt(data['expires_in']) * 1000).getMilliseconds();
            }
        }
        return this.accessToken;
    }
}