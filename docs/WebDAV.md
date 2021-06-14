# WebDAV Methods

## OPTIONS

询问可执行哪些方法

```http request
OPTIONS http://a.net/ HTTP/1.1
```

```http request
HTTP/1.1 200 OK
Allow: OPTIONS, PROPFIND, PROPPATCH, MLCOL, GET, HEAD, POST, DELETE, PUT, COPY, MOVE
DAV: 1
```

或

```http request
HTTP/1.1 200 OK
Allow: OPTIONS, PROPFIND, PROPPATCH, MKCOL, GET, HEAD, POST, DELETE, PUT, COPY, MOVE, LOCK, UNLOCK
DAV: 1, 2
```

> 目前只支持 `DAV: 1`

## PROPFIND 

获取资源属性、目录层次结构

### Depth Header

- 仅用于资源（Depth: 0）
- 仅应用于资源及其内部成员（Depth: 1）
- 应用于资源及其所有成员（Depth: infinity，默认）

### Depth: 0

```http
PROPFIND http://a.net/DAVTest/file1.txt HTTP/1.1
Depth: 0
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:multistatus xmlns:d="DAV:" xmlns:s="http://a.net">
	<d:response>
		<d:href>/DAVTest/file1.txt</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 11:21:59 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag>cLyPS3KoaSFGi_joRB3OUQ</d:getetag>
				<d:getcontenttype>text/plain</d:getcontenttype>
				<d:displayname>file1.txt</d:displayname>
				<d:resourcetype/>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
</d:multistatus>
```

### Depth: 1

```http
PROPFIND http://a.net/DAVTest HTTP/1.1
Depth: 1
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:multistatus xmlns:d="DAV:">
	<d:response>
		<d:href>/DAVTest</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 10:34:40 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag/>
				<d:getcontenttype>httpd/unix-directory</d:getcontenttype>
				<d:displayname>DAVTest</d:displayname>
				<d:resourcetype><d:collection/></d:resourcetype>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
	<d:response>
		<d:href>/DAVTest/file1.txt</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 11:29:04 GMT</d:getlastmodified>
				<d:getcontentlength>20</d:getcontentlength>
				<d:getetag>fpzNe4oLhplhz57y8v9iiA</d:getetag>
				<d:getcontenttype>text/plain</d:getcontenttype>
				<d:displayname>file1.txt</d:displayname>
				<d:resourcetype/>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
	<d:response>
		<d:href>/DAVTest/file2.docx</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 11:22:07 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag>cLyPS3KoaSFGi_joRB3OUQ</d:getetag>
				<d:getcontenttype>application/vnd.openxmlformats-officedocument.wordprocessingml.document</d:getcontenttype>
				<d:displayname>file2.docx</d:displayname>
				<d:resourcetype/>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
	<d:response>
		<d:href>/DAVTest/folder1</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 11:21:50 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag/>
				<d:getcontenttype>httpd/unix-directory</d:getcontenttype>
				<d:displayname>folder1</d:displayname>
				<d:resourcetype><d:collection/></d:resourcetype>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
</d:multistatus>
```

## PROPPATCH 

更改和删除资源属性

```http
PROPPATCH https://dav.jianguoyun.com/dav/Cloud/DAVTest/file1.txt HTTP/1.1
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="utf-8" ?>
<D:propertyupdate xmlns:D="DAV:">
	<D:set>
		<D:prop>
			<Z:Win32LastAccessTime>Mon, 16 Nov 2020 11:29:04 GMT</Z:Win32LastAccessTime>
			<Z:Win32LastModifiedTime>Mon, 16 Nov 2020 11:29:04 GMT</Z:Win32LastModifiedTime>
		</D:prop>
	</D:set>
</D:propertyupdate>
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:multistatus xmlns:d="DAV:" xmlns:s="http://a.net">
	<d:response>
		<d:href>/DAVTest/file1.txt</d:href>
		<d:propstat>
			<d:prop>
				<m:Win32LastAccessTime xmlns:m="urn:schemas-microsoft-com:"/>
				<m:Win32CreationTime xmlns:m="urn:schemas-microsoft-com:"/>
				<m:Win32LastModifiedTime xmlns:m="urn:schemas-microsoft-com:"/>
				<m:Win32FileAttributes xmlns:m="urn:schemas-microsoft-com:"/>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
</d:multistatus>
```

## MKCOL 

创建目录

```http
MKCOL http://a.net/folder HTTP/1.1
```

```http
HTTP/1.1 201 Created
```

## GET 

获取资源

```http
GET http://a.net/DAVTest/file1.txt HTTP/1.1
```

```http
HTTP/1.1 200 OK
```

## HEAD 

检查资源是否存在，得到资源元数据

```http
HEAD http://a.net/DAVTest/file1.txt HTTP/1.1
```

```http
HTTP/1.1 200 OK
```

## DELETE 

销毁资源或集合

对于文件

```http
DELETE https://a.net/folder/file1.txt HTTP/1.1
```

```http
HTTP/1.1 204 No Content
```

对于目录，若目录中的某项内容被锁定，则需要返回 207 Multi Status


```http
DELETE /folder/ HTTP/1.1
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: application/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" ?>
<d:multistatus xmlns:d="DAV:">
	<d:response>
		<d:href>http://a.net/container/file1.txt</d:href>
		<d:status>HTTP/1.1 423 Locked</d:status>
		<d:error><d:lock-token-submitted/></d:error>
	</d:response>
</d:multistatus>
```

在成功的删除操作后，对目标的后续 URI 请求 GET / HEAD / PROPFIND 请求必须返回 404 Not Found

## PUT 

修改资源

```http
PUT http://a.net/DAVTest/file1.txt HTTP/1.1

content in file1.txt
```

```http
HTTP/1.1 204 No Content
X-File-Version: 2
```

## COPY 

资源复制

## MOVE 

资源移动或重命名

```http
MOVE http://a.net/src HTTP/1.1
Destination: http://a.net/dest
Overwrite: F
translate: f
```

```http
HTTP/1.1 201 Created
```

## LOCK 

锁定资源

```http
LOCK http://a.net/DAVTest/file1.txt HTTP/1.1
Content-Type: text/xml; charset=utf-8

<?xml version="1.0" encoding="utf-8" ?>
<D:lockinfo xmlns:D="DAV:">
	<D:lockscope><D:exclusive/></D:lockscope>
	<D:locktype><D:write/></D:locktype>
	<D:owner>
		<D:href>USERNAME</D:href>
	</D:owner>
</D:lockinfo>
```

```http
HTTP/1.1 200 OK
Content-Type: text/xml; charset=UTF-8
Lock-Token: opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:prop xmlns:d="DAV:">
	<d:lockdiscovery>
		<d:activelock>
			<d:locktype><d:write/></d:locktype>
			<d:lockscope><d:exclusive/></d:lockscope>
			<d:depth>infinity</d:depth>
			<d:owner>USERNAME</d:owner>
			<d:timeout>Infinite</d:timeout>
			<d:locktoken>
				<d:href>opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce</d:href>
			</d:locktoken>
		</d:activelock>
	</d:lockdiscovery>
</d:prop>
```

## UNLOCK 

解除资源锁定

```http
UNLOCK http://a.net/DAVTest/file1.txt HTTP/1.1
Lock-Token: <opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce>
```

```http
HTTP/1.1 204 No Content
```
