<div style='text-align: center'>
   <h1>Workers-DAV</h1>
   <p>使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持</p>
   <p>WebDAV supports for Google Drive using Cloudflare Workers</p>
   <b>功能开发中</b>
</div>

---

## 配置与部署

[安装 Wrangler CLI](https://github.com/cloudflare/wrangler#installation) （Apple M1 需要安装 Rosetta2）

```sh
npm i -g @cloudflare/wrangler
```

拉取项目

```sh
wrangler generate workers-dav https://github.com/SunYufei/workers-dav
```

安装项目依赖

```sh
cd workers-dav
npm install
```

配置项目属性

- [Cloudflare Workers](docs/config/Cloudflare.md)
- [Google Drive](docs/config/Google.md)

部署

```sh
cd workers-dav
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

<!--2. [OneDrive 开发人员平台](https://docs.microsoft.com/zh-cn/onedrive/developer/?view=odsp-graph-online)-->

## 许可

[MIT License](LICENSE)
