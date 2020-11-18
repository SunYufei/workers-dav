<center><image src="https://cdn.jsdelivr.net/gh/SunYufei/gdrive-webdav-cfworkers@master/doc/icon.png" /></center>

使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持

WebDAV supports for Google Drive using Cloudflare Workers

__功能开发中 / This project is under development.__

## 特性

- 获取文件列表
- 下载文件
- 新建文件（计划中）
- 新建文件夹
- 上传文件

## 部署 / Deploy

_待补充..._

## 文档 / Docs

1. [Google Drive API](doc/Google%20Drive%20API.md)

2. [WebDAV Methods](doc/WebDAV.md)

    |请求|请求处理函数|Google Drive 接口|
    |:--|:--|:--|
    |OPTIONS|options()|/|
    |GET|get(path, range)|fetchFile(path, range)|
    |HEAD|_TBD_|_TBD_|
    |LOCK|_TBD_|_TBD_|
    |UNLOCK|_TBD_|_TBD_|
    |MKCOL|mkcol(path)|createPath(path)|
    |MOVE|move(src, dest)|_TBD_|
    |DELETE|delete(path)|_TBD_|
    |PROPFIND|propfind(path, depth)|_TBD_|
    |PROPPATCH|_TBD_|_TBD_|
    |PUT|_TBD_|_TBD_|


## 参考内容 / References

1. [Google Drive API v3](https://developers.google.com/drive)
2. [RFC 2518](http://www.webdav.org/specs/rfc2518.html) (First WebDAV spec)
3. [RFC 4918](https://tools.ietf.org/pdf/rfc4918.pdf) (WebDAV revision)

## 许可 / License

[MIT License](LICENSE)