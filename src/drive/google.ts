import { clientId, clientSecret, grantType, refreshToken, root } from './config.json';
import Drive from './drive';
import ItemProperty from '../common/property';
import HTTPCode from '../common/code';
import PathUtil from './path';

// URIs
const FILES_URI = 'https://p.ipear.ml/www.googleapis.com/drive/v3/files';
const OAUTH_URI = 'https://p.ipear.ml/www.googleapis.com/oauth2/v4/token';

// MIME type
const MIME_FOLDER = 'application/vnd.google-apps.folder';


export default class GoogleDrive implements Drive {
    // access token
    private accessToken: string | null = null;
    private expires = 0;

    // cache
    private propCache: { [path: string]: ItemProperty } = {
        '/': {
            path: '/',
            id: root,
            contentLength: 0,
            contentType: MIME_FOLDER
        }
    }
    private listCache: { [path: string]: string } = {}

    async getItemProperty(path: string, withChildren: boolean): Promise<ItemProperty[]> {
        const LOG_MSG = 'getItemProperties';
        console.log(LOG_MSG, path, 'withChildren: ', withChildren);

        const result: ItemProperty[] = [];

        // result.push(this.infoCache[path]);
        if (withChildren) {
            // push in list cache
        }
        return result;
    }

    async fetchFile(path: string, range: string | null, withContent: boolean) {
        const LOG_MSG = 'fetchFile';
        console.log(LOG_MSG, path, 'Range', range, 'withContent', withContent);

        const property = await this.getItemProperty(path, false);
        if (property.length > 0) {
            const url = new URL(`${FILES_URI}/${property[0].id}?supportsAllDrives=true`);
            if (withContent)
                url.searchParams.set('alt', 'media');
            const headers = await this.getAuthHeader();
            if (range != null)
                headers.set('Range', range);
            console.log(url.toString())
            // return await fetch(url.toString(), {
            //     method: 'GET',
            //     headers: headers
            // })
        }
        console.log(LOG_MSG, path, 'not found');
    }

    async mkdir(path: string): Promise<boolean> {
        return false;
    }

    async trash(path: string): Promise<boolean> {
        const LOG_MSG = 'trash';
        console.log(LOG_MSG, path);

        const property = await this.getItemProperty(path, true);
        if (property.length == 0) {
            console.log(LOG_MSG, path, 'not found');
            return false;
        }
        for (const prop of property) {
            const url = `${FILES_URI}/${prop.id}?supportsAllDrives=true`;
            const options = {
                method: 'DELETE',
                headers: await this.getAuthHeader(),
            }
            const response = await fetch(url.toString(), options);
            if (response.status == HTTPCode.OK && response.headers.get('Content-Length') == '0') {
                // delete info in propCache
                delete this.propCache[prop.path];
                console.log(LOG_MSG, prop.path, 'deleted in propCache');
                // delete info in listCache
                const parent = PathUtil.getParent(prop.path);
                if (this.listCache[parent] != undefined) {
                    delete this.listCache[parent];
                    console.log(LOG_MSG, prop.path, `parent ${parent} deleted in listCache`);
                }
            }
        }
        return true;
    }

    private async getAuthHeader(): Promise<Headers> {
        return new Headers({
            'Authorization': `Bearer ${await this.getAccessToken()}`,
            'Content-Type': 'application/json'
        })
    }

    /**
     * get or update access token from:
     * 1. local memory
     * 2. KV
     * 3. Google Drive API
     * @private
     */
    private async getAccessToken(): Promise<string | null> {
        const LOG_MSG = 'getAccessToken';
        const KV_TOKEN_KEY = 'gd_token';
        const KV_EXPIRES_KEY = 'gd_expires';

        if (this.accessToken == null || this.expires < Date.now()) {
            console.log(LOG_MSG, 'local token outdated');
            // check KV
            this.accessToken = await KV.get(KV_TOKEN_KEY);
            if (this.accessToken == null) {
                console.log(LOG_MSG, 'KV token outdated');
                // get access token using API
                const response = await fetch(OAUTH_URI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        refresh_token: refreshToken,
                        grant_type: grantType
                    })
                });
                const data: { [_: string]: any } = await response.json();
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
