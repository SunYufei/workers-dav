<center><image src="doc/icon.png" /></center>

使用 Cloudflare Workers 为 Google Drive 提供 WebDAV 支持

WebDAV supports for Google Drive using Cloudflare Workers

__功能开发中 / This project is under development.__

## 主要功能

|功能|WebDAV 请求|请求处理方法|Google Drive 接口|
|:--|:--|:--|:--|
|获取支持选项|OPTIONS|options()|/|
|获取资源属性/目录层次结构|PROPFIND|propfind(path, depth)|**TBD**|
|新建目录|MKCOL|mkcol(path)|createPath(path)|
|删除文件/目录|DELETE|delete(path)|delete(path)|
|移动/重命名文件/目录|MOVE|move(src, dest)|**TBD**|
|获取文件内容|GET|get(path, range)|fetchFile(path, range)|
|无响应消息体的 GET|HEAD|head(path)|**TBD**|
|修改文件内容|PUT|**TBD**|**TBD**|
|更改/删除资源属性|PROPPATCH|**TBD**|**TBD**|
|锁定文件/目录|LOCK|lock(path)|暂不支持|
|解锁文件/目录|UNLOCK|unlock(path)|暂不支持|


## 文档 / Docs

1. [Google Drive API](doc/Google%20Drive%20API.md)
2. [WebDAV Methods](doc/WebDAV.md)


## TODO

1. 参考 RFC 4918 修改已有的 WebDAV 文档
2. 考虑到 WebDAV 客户端是可靠的，逐步移除部分异常处理代码
3. 添加部署文档

## 参考内容 / References

1. [Google Drive API v3](https://developers.google.com/drive)
2. [RFC 4918](https://tools.ietf.org/pdf/rfc4918.pdf) (WebDAV revision)
3. [RFC 2518](http://www.webdav.org/specs/rfc2518.html) (First WebDAV spec)

## 许可 / License

[MIT License](LICENSE)