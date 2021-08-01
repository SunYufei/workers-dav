<h1 align="center">Workers-DAV</h1>
<p align="center">使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持</p>
<p align="center">WebDAV supports for Google Drive using Cloudflare Workers</p>
<p align="center"><b>功能开发中</b></p>

----

## 文档

1. [Cloudflare Workers 文档](docs/Cloudflare.md)
2. [Google Drive API](docs/Google.md)
3. [WebDAV 标准](docs/WebDAV.md)

### 参考内容

1. [Google Drive API v3](https://developers.google.com/drive)
2. RFC 4918 (WebDAV revision) [原文](http://www.webdav.org/specs/rfc4918.html), [中文文档](https://fullstackplayer.github.io/WebDAV-RFC4918-CN/)
3. [WebDAV Methods | Microsoft Docs](https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2003/aa142917(v=exchg.65))
4. [CloudFlare Workers KV API](https://developers.cloudflare.com/workers/runtime-apis/kv)

## 许可

[MIT License](LICENSE)


<!-- ## 主要功能 / Functions

| |WebDAV Methods|请求处理方法|Google Drive 接口|
|---:|:---:|:---|:---|
|√|OPTIONS<br>获取支持选项|options()|/|
| |PROPFIND<br>获取资源属性或目录层次结构|propfind(path, depth)|**TBD**|
| |PROPPATCH<br>更改/删除资源属性|**TBD**|**TBD**|
| |MKCOL<br>新建目录|mkcol(path)|mkdir(path)|
| |GET<br>获取文件内容|get(path, range)|fetchFile(path, range)|
| |HEAD|head(path)|**TBD**|
| |DELETE<br>删除文件/目录|unlink(path)|unlink(path)|
| |PUT<br>修改文件内容|**TBD**|**TBD**|
| |COPY<br>复制文件/目录|**TBD**|**TBD**|
| |MOVE<br>移动/重命名文件/目录|move(src, dest)|**TBD**|
| |LOCK<br>锁定文件/目录|lock(path)|**暂不支持**|
|√|UNLOCK<br>解锁文件/目录|unlock()|**暂不支持**| -->