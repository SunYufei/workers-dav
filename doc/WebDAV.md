# WebDAV 请求方法

## PROPFIND 检索资源属性、目录层次结构

Depth: 0

```http
PROPFIND http://x.x.x.x/ HTTP/1.1
Depth: 0
translate: f
Content-Length: 0
Host: x.x.x.x
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=utf-8
Content-Length: xxx

<?xml version="1.0" encoding="utf-8" ?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>/</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>/</D:displayname>
                <D:getlastmodified>Thu, 12 Nov 2020 12:02:17 GMT</D:getlastmodified>
                <D:resourcetype>
                    <D:collection/>
                </D:resourcetype>
                <D:lockdiscovery/>
                <D:supportedlock>
                </D:supportedlock>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>    
```

Depth: 1

```http
PROPFIND http://x.x.x.x/ HTTP/1.1
Depth: 1
translate: f
Host: x.x.x.x
Content-Length: 0
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=utf-8
Content-Length: xxx

<?xml version="1.0" encoding="utf-8" ?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>/</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>/</D:displayname>
                <D:getlastmodified>Thu, 12 Nov 2020 12:02:17 GMT</D:getlastmodified>
                <D:resourcetype>
                    <D:collection/>
                </D:resourcetype>
                <D:lockdiscovery/>
                <D:supportedlock></D:supportedlock>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
    <D:response>
        <D:href>/a/</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>a</D:displayname>
                <D:getlastmodified>Thu, 12 Nov 2020 11:56:44 GMT</D:getlastmodified>
                <D:resourcetype>
                	<D:collection/>
                </D:resourcetype>
                <D:lockdiscovery/>
                <D:supportedlock></D:supportedlock>
            </D:prop>
        	<D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
    <D:response>
        <D:href>/b/</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>b</D:displayname>
                <D:getlastmodified>Thu, 12 Nov 2020 12:00:51 GMT</D:getlastmodified>
                <D:resourcetype>
                	<D:collection/>
                </D:resourcetype>
                <D:lockdiscovery/>
                <D:supportedlock></D:supportedlock>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
    <D:response>
        <D:href>/test.txt</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>test.txt</D:displayname>
                <D:getcontentlength>0</D:getcontentlength>
                <D:getlastmodified>Sun, 15 Nov 2020 09:28:22 GMT</D:getlastmodified>
                <D:resourcetype></D:resourcetype>
                <D:lockdiscovery/>
                <D:supportedlock></D:supportedlock>
            </D:prop>
        	<D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>
```

## 其他方法（文档待补充）

- [ ] GET：检索文档
- [ ] HEAD：类似于 GET，用于检查资源是否存在，以及得到资源元数据
- [ ] POST：添加资源
- [ ] PUT：修改资源
- [ ] MKCOL：创建集合或目录
- [ ] COPY，MOVE：资源复制/移动
- [ ] DELETE：销毁资源或集合
- [ ] OPTIONS：询问可执行哪些方法
- [ ] TRACE：远程诊断服务器
- PropPatch：更改和删除资源属性 **（暂不支持）**
- Lock：锁定资源 **（暂不支持）**
- Unlock：解除资源锁定 **（暂不支持）**