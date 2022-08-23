<div align='center'>
   <h1>Workers-DAV</h1>
   <p>使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持</p>
   <p>WebDAV supports for Google Drive using Cloudflare Workers</p>
   <b>功能开发中</b>
</div>

---

## 主要功能

-  [x] 网盘挂载
-  [x] 文件列表获取
-  [ ] 文件下载
-  [ ] 文件/文件夹移动
-  [x] 文件/文件夹删除

## 配置与部署

拉取项目

```shell
git clone --depth=1 https://github.com/SunYufei/workers-dav.git
```

安装项目依赖

```sh
cd workers-dav
npm install
```

配置项目属性

-  [Cloudflare Workers](docs/config/Cloudflare.md)
-  [Google Drive](docs/config/Google.md)

部署

```shell
cd workers-dav
npm run prod
```

## 文档

1. [模块调用关系](docs/README.md)
2. [Cloudflare Workers 文档](docs/Cloudflare.md)
3. [Google Drive API](docs/Google.md)
4. [WebDAV 标准](docs/WebDAV.md)

## 参考内容

-  API 文档
   -  [CloudFlare Workers KV API](https://developers.cloudflare.com/workers/runtime-apis/kv)
   -  [fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
   -  [Google Drive API v3](https://developers.google.com/drive)
   -  RFC 4918 (WebDAV revision)
      -  [原文](http://www.webdav.org/specs/rfc4918.html), [中文文档](https://fullstackplayer.github.io/WebDAV-RFC4918-CN/)
   -  [WebDAV Methods | Microsoft Docs](<https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2003/aa142917(v=exchg.65)>)
-  开源项目
   -  [npm-WebDAV-Server](https://github.com/OpenMarshal/npm-WebDAV-Server)

<!--2. [OneDrive 开发人员平台](https://docs.microsoft.com/zh-cn/onedrive/developer/?view=odsp-graph-online)-->

## 许可

[MIT License](LICENSE)
