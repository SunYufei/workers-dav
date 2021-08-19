<h1 align="center">Workers-DAV</h1>
<p align="center">使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持</p>
<p align="center">WebDAV supports for Google Drive using Cloudflare Workers</p>
<p align="center"><b>功能开发中</b></p>

----

## 开发与部署

### 参数配置

#### Cloudflare Workers

1. 安装 wrangler
2. 将项目根目录下 wrangler.default.toml 文件复制为 wrangler.toml
3. 填入 account_id
4. 在根目录运行 `wrangler kv:namespace create "KV"` 创建 KV 空间，并将其 id 填入文件中
   
#### Google Drive

1. 获取 client_id, client_secret

   登录开发账号，在 API 权限里创建相应的 OAuth 客户端获取，注意将 `http://localhost` 添加到已获授权的重定向 URI

2. 获取 authorization_code
   
   浏览器访问 `https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline&redirect_uri=http://localhost&client_id={client_id}`，注意将 client_id 替换，访问后可在地址栏获取 authorization_code

3. 获取 refresh_token
   
   ```http
   POST /token HTTP/1.1
   Host: oauth2.googleapis.com
   Content-Type: application/x-www-form-urlencoded

   code={authorization_code}
   client_id={client_id}
   client_secret={client_secret}
   redirect_uri=http://localhost
   grant_type=authorization_code
   ```

   ```http
   {
       "access_token": "xxxx",
       "expires_in": 3520,
       "token_type": "Bearer",
       "scope": "https://www.googleapis.com/auth/drive",
       "refresh_token": "xxxxxx"
   }
   ```

4. 将 src/drive/config.default.json 复制为 config.json，填入如下参数

   - client_id
   - client_secret
   - refresh_token
   - root，打开 Google Drive，进入需要挂载的文件夹，填入地址栏 `https://drive.google.com/drive/folders/xxxxxx` 中的 xxxxxx 信息

### 部署

在项目根目录执行 `wrangler publish` 即可


## 文档

1. [Cloudflare Workers 文档](docs/Cloudflare.md)
2. [Google Drive API](docs/Google.md)
3. [WebDAV 标准](docs/WebDAV.md)

## 参考内容

1. [Google Drive API v3](https://developers.google.com/drive)
2. RFC 4918 (WebDAV revision) [原文](http://www.webdav.org/specs/rfc4918.html), [中文文档](https://fullstackplayer.github.io/WebDAV-RFC4918-CN/)
3. [WebDAV Methods | Microsoft Docs](https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2003/aa142917(v=exchg.65))
4. [CloudFlare Workers KV API](https://developers.cloudflare.com/workers/runtime-apis/kv)

## 许可

[MIT License](LICENSE)
