import { client_id, client_secret, grant_type, refresh_token, root } from './config.json';
import { encodeQuery, pathSplit } from './utils';


export default class GoogleDrive {
    // access token
    private accessToken: string | null = null;
    private expires = 0;

    // URIs
    private filesURI = `https://www.googleapis.com/drive/v3/files`;
    private oAuthURI = `https://www.googleapis.com/oauth2/v4/token`;

    // info cache
    private infoCache: { [path: string]: { id: string, size: string, mimeType: string } } = {
        '/': { id: root, size: '0', mimeType: 'application/vnd.google-apps.folder' }
    }
    private listCache: { [path: string]: string[] } = {}


    /**
     * get file metadata or file content
     * @param path
     * @param range
     * @param withContent
     */
    public async fetchFile(path: string, range: string | null, withContent = true): Promise<Response> {
        const LOG_MSG = 'fetchFile';

        console.log(LOG_MSG, path, range, withContent);
        const info = await this.getItemInfo(path);
        if (info != null) {
            let url = `${this.filesURI}/${info.id}`;
            if (withContent)
                url = `${url}?alt=media`;
            const option = {
                method: 'GET',
                headers: await this.getAuthHeader()
            }
            if (range != null)
                option.headers['Range'] = range;
            return await fetch(url, option);
        } else {
            return new Response(null, { status: 404 });
        }
    }

    public async mkdir(path: string): Promise<boolean> {
        const LOG_MSG = 'mkdir';

        const split = pathSplit(path)
        const parent = split.parent;
        const name = split.name;

        // check parent
        const parentInfo = await this.getItemInfo(parent);
        if (parentInfo == null) {
            return false;
        }

        // mkdir using API


        return true;
    }

    /**
     * get item info
     * @param path path
     * @returns 
     */
    private async getItemInfo(path: string): Promise<{ id: string, size: string, mimeType: string } | null> {
        const LOG_MSG = 'getItemInfo';

        // TODO

        return this.infoCache[path] || null;
    }

    /**
     * authorization header
     * @private
     * @returns
     */
    private async getAuthHeader(): Promise<{ [header: string]: string }> {
        return {
            'Authorization': `Bearer ${await this.getAccessToken()}`,
            'Content-Type': 'application/json'
        }
    }

    /**
     * get or update access token from:
     * 1. local memory
     * 2. KV
     * 3. Google Drive API
     * @private
     * @returns
     */
    private async getAccessToken(): Promise<string | null> {
        const LOG_MSG = 'getAccessToken';
        const KV_TOKEN_KEY = 'token';
        const KV_EXPIRES_KEY = 'expires';

        if (this.accessToken == null || this.expires < Date.now()) {
            console.log(LOG_MSG, 'local token outdated');

            this.accessToken = await KV.get(KV_TOKEN_KEY);
            if (this.accessToken == null) {
                console.log(LOG_MSG, 'KV token outdated');
                // get access token using API
                const body = {
                    client_id: client_id,
                    client_secret: client_secret,
                    refresh_token: refresh_token,
                    grant_type: grant_type
                }
                const option = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: encodeQuery(body)
                }
                const response = await fetch(this.oAuthURI, option);
                const data = await response.json();
                console.log(LOG_MSG, data);
                // update access token
                const token = data['access_token'];
                if (token != undefined) {
                    const expiresIn = data['expires_in'] - 1;
                    // save to class
                    this.accessToken = token;
                    this.expires = Date.now() + expiresIn * 1000;
                    // save to KV
                    await KV.put(KV_TOKEN_KEY, token, { expirationTtl: expiresIn });
                    await KV.put(KV_EXPIRES_KEY, this.expires.toString());
                }
            }
        }
        return this.accessToken;
    }
}