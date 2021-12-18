# 模块调用关系

|WebDAV 请求方法<br>index.ts|请求处理函数<br>handler.ts|DAV 调用<br>dav/|Drive 调用<br>drive/|
|:---:|:---:|:---:|:---:|
|[OPTIONS](WebDAV.md#OPTIONS)<br>获取支持方法|options()|options()|/|
|PROPFIND<br>获取资源属性/目录层次结构|propfind(path, depth)|propfind(properties)|getItemProperties(path, withChildren)|
|PROPPATCH<br>更改/删除资源属性|/|/|/|
|GET<br>获取文件内容|get(path, range)|||
|HEAD|head(path)|||
|MKCOL<br>创建目录|mkcol(path)|mkcol(success)|mkdir(path)|
|COPY<br>复制文件/目录||||
|MOVE<br>移动/重命名文件/目录|move(src, dest)|||
|PUT<br>修改文件内容|/|/|/|
|[DELETE](WebDAV.md#DELETE)<br>删除文件/目录|trash(path)|trash(success)|trash(path)|
|LOCK<br>锁定文件|/|/|/|
|UNLOCK<br>解锁文件|/|/|/|

> 注:
>
> 1. DAV 兼容级别为 1 级，不支持 2 级 LOCK、UNLOCK 请求
> 2. 暂不支持 PROPPATCH、PUT 请求
> 3. DELETE 默认执行移至回收站操作
