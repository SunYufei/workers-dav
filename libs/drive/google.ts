import { Drive } from './drive';
import { ContentType, HttpHeader } from 'libs/http/header';
import { doPost } from 'libs/http/request';

// URIs
const OAUTH_URI = 'https://www.googleapis.com/oauth2/v4/token';

export class GoogleDrive implements Drive {
   private readonly kv: KVNamespace;
   private readonly clientId: string;
   private readonly clientSecret: string;
   private readonly refreshToken: string;
   private readonly root: string;
   private readonly grantType: string;
   // access token
   private accessToken: string | null = null;

   constructor(
      kv: KVNamespace,
      clientId: string,
      clientSecret: string,
      refreshToken: string,
      root: string,
      grantType: string,
   ) {
      this.kv = kv;
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.refreshToken = refreshToken;
      this.root = root;
      this.grantType = grantType;
   }

   async trash(path: string): Promise<boolean> {
      return true;
   }

   private async getAuthHeaders(): Promise<Record<string, string>> {
      return {
         [HttpHeader.AUTHORIZATION]: `Bearer ${await this.getAccessToken()}`,
         [HttpHeader.CONTENT_TYPE]: ContentType.JSON,
      };
   }

   private async getAccessToken() {
      const LOG_MSG = 'getAccessToken';
      const KV_TOKEN_KEY = 'gd_token';
      // 本地
      if (this.accessToken) {
         return this.accessToken;
      }
      console.log(LOG_MSG, '本地token不存在');
      // KV
      this.accessToken = await this.kv.get(KV_TOKEN_KEY);
      if (this.accessToken) {
         return this.accessToken;
      }
      console.log(LOG_MSG, 'KV缓存过期');
      // 使用 API 获取
      const resp = await doPost(OAUTH_URI, {
         form: {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            refresh_token: this.refreshToken,
            grant_type: this.grantType,
         },
      });
      const data = await resp.json<Record<string, any>>();
      // 更新 access token
      const token = data['access_token'];
      if (token) {
         this.accessToken = token;
         // 存到 KV
         await this.kv.put(KV_TOKEN_KEY, token, { expirationTtl: data['expires_in'] - 1 });
         console.log(LOG_MSG, 'access token 写入 KV');
      } else {
         console.error(LOG_MSG, 'access token 请求失败');
      }
      return this.accessToken;
   }
}
