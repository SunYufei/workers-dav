import {client_id, client_secret, grant_type, refresh_token} from './config.json';

export default class GoogleDrive {
    // access token
    private accessToken: string | null = null;

    // URIs
    private fileURI = `https://www.googleapis.com/drive/v3/files`;
    private oAuthURI = `https://www.googleapis.com/oauth2/v4/token`;

    public async itemInfo(path: string): Promise<{ id: string, size: string, mimeType: string } | null> {
        console.log('itemInfo', path);
        // TODO fill this
        return null;
    }

    /**
     * get file metadata or file content
     * @param path
     * @param range
     * @param withContent
     */
    public async fetchFile(path: string, range: string | null, withContent = true): Promise<Response> {
        console.log('fetchFile', path, range, withContent);
        const info = await this.itemInfo(path);
        if (info != null) {
            let url = `${this.fileURI}/${info.id}`;
            if (withContent)
                url = `${url}?alt=media`;
            const requestOption = {
                method: 'GET',
                headers: await this.authHeader()
            }
            if (range != null)
                requestOption.headers['Range'] = range;
            return await fetch(url, requestOption);
        } else {
            return new Response(null, {status: 404});
        }
    }

    /**
     * authorization header
     * @private
     */
    private async authHeader(): Promise<{ [_: string]: string }> {
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
     */
    private async getAccessToken(): Promise<string | null> {
        if (this.accessToken == null) {
            console.log('getAccessToken', 'local token outdated');

            this.accessToken = await KV.get('token');
            if (this.accessToken == null) {
                console.log('getAccessToken', 'KV token outdated');
                // get access token from Google Drive API
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
                const data: { [_: string]: any } = await response.json();
                console.log('getAccessToken', data);
                // update access token
                const token = data['access_token'];
                if (token != undefined) {
                    this.accessToken = token;
                    // write to KV
                    await KV.put('accessToken', token, {expirationTtl: data['expires_in'] - 1});
                }
            }
        }
        return this.accessToken;
    }
}

function encodeQuery(data: { [_: string]: string }): string {
    const res = [];
    for (const key in data) {
        res.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
    return res.join('&');
}