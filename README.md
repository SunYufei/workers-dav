<h1 align="center">Workers-DAV</h1>
<p align="center">使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持</p>
<p align="center">WebDAV supports for Google Drive using Cloudflare Workers</p>
<p align="center"><b>功能开发中</b></p>

----

## 配置与部署

### 参数配置

#### Cloudflare Workers

1. 安装并配置 wrangler（Apple M1 需要安装 Rosetta2）
   ```bash
   npm i @cloudflare/wrangler -g
   ```
   访问 [https://dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) 新建 API 令牌，使用“编辑 Cloudflare Workers”模板，勾选 `Workers 脚本`、`Workers KV 存储`、`Workers 路由` 的编辑权限。新建完毕后投放此令牌。

   运行 `wrangler config` 填入刚才生成的令牌。

2. 将项目根目录下 `wrangler.default.toml` 文件复制为 `wrangler.toml`。访问 [https://dash.cloudflare.com/](https://dash.cloudflare.com/) ，将账户 ID 填入 account_id 字段中

4. 在根目录运行
   ```bash
   wrangler kv:namespace create "KV"
   ```
   创建 KV 空间，并将输出中的 id 填入 `wrangler.toml` 文件中
   > 本项目使用 Cloudflare KV 存储部分少量写入大量读取的参数，减少请求次数
   
#### Google Drive

1. 获取 client_id, client_secret

   登录开发账号，在 API 权限里创建相应的 OAuth 客户端获取，注意将 `http://localhost` 添加到已获授权的重定向 URI

2. 获取 authorization_code

   浏览器访问
   ```
   https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline&redirect_uri=http://localhost&client_id={client_id}
   ```
   注意将 client_id 替换。访问后进行账户登录和应用授权，在重定向地址 `http://localhost?code=xxxxxx&client_id=xxxxxx` 中可获取 authorization_code

3. 获取 refresh_token

   向 `https://oauth2.googleapis.com/token` 发送 POST 请求，注意替换请求体中的相应参数
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

   在响应 JSON 中可获取 refresh_token

   ```http
   {
       "access_token": "xxxx",
       "expires_in": 3520,
       "token_type": "Bearer",
       "scope": "https://www.googleapis.com/auth/drive",
       "refresh_token": "xxxxxx"
   }
   ```

4. 将 `src/drive` 目录下的 `config.default.json` 复制为 `config.json`，填入如下参数

   - client_id
   - client_secret
   - refresh_token
   - root，打开 Google Drive，进入需要挂载的文件夹，填入地址栏 `https://drive.google.com/drive/folders/xxxxxx` 中的 xxxxxx 信息

### 部署

在项目根目录执行 

```shell
npm install
wrangler publish
```

## 文档

1. [Cloudflare Workers 文档](docs/Cloudflare.md)
2. [Google Drive API](docs/Google.md)
3. [WebDAV 标准](docs/WebDAV.md)

## 参考内容

1. [CloudFlare Workers KV API](https://developers.cloudflare.com/workers/runtime-apis/kv)
2. [fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
3. [Google Drive API v3](https://developers.google.com/drive)
4. RFC 4918 (WebDAV revision) [原文](http://www.webdav.org/specs/rfc4918.html)
   , [中文文档](https://fullstackplayer.github.io/WebDAV-RFC4918-CN/)
5. [WebDAV Methods | Microsoft Docs](https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2003/aa142917(v=exchg.65))
<!--4. [OneDrive 开发人员平台](https://docs.microsoft.com/zh-cn/onedrive/developer/?view=odsp-graph-online)-->

## 许可

[MIT License](LICENSE)
