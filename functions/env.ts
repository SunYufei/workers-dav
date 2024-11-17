export interface Env {
   readonly KV: KVNamespace;
   readonly CLIENT_ID: string;
   readonly CLIENT_SECRET: string;
   readonly REFRESH_TOKEN: string;
   readonly ROOT: string;
   readonly GRANT_TYPE: string;
}
