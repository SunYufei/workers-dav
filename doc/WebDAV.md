# WebDAV Methods

以如下目录结构为例

```
/DAVTest
	|- folder1/
	|- file1.txt
	|- file2.doc
```


## PROPFIND

### 检查资源属性 Depth: 0

```http
PROPFIND http://a.net/DAVTest HTTP/1.1
Depth: 0
translate: f
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:multistatus xmlns:d="DAV:" xmlns:s="http://a.net">
	<d:response>
		<d:href>/DAVTest/</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 10:34:40 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag/>
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
                </d:current-user-privilege-set>
                <d:getcontenttype>httpd/unix-directory</d:getcontenttype>
                <d:displayname>DAVTest</d:displayname>
                <d:resourcetype><d:collection/></d:resourcetype>
            </d:prop>
            <d:status>HTTP/1.1 200 OK</d:status>
        </d:propstat>
    </d:response>
</d:multistatus>
```

```http
PROPFIND http://a.net/DAVTest/file1.txt HTTP/1.1
Depth: 0
translate: f
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
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
				</d:current-user-privilege-set>
				<d:getcontenttype>text/plain</d:getcontenttype>
				<d:displayname>file1.txt</d:displayname>
				<d:resourcetype/>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
</d:multistatus>
```

### 目录层次结构 Depth: 1

```http
PROPFIND http://a.net/DAVTest HTTP/1.1
Depth: 1
translate: f
```

```http
HTTP/1.1 207 Multi-Status
Content-Type: text/xml; charset=UTF-8

<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<d:multistatus xmlns:d="DAV:" xmlns:s="http://a.net">
	<d:response>
		<d:href>/DAVTest</d:href>
		<d:propstat>
			<d:prop>
				<d:getlastmodified>Mon, 16 Nov 2020 10:34:40 GMT</d:getlastmodified>
				<d:getcontentlength>0</d:getcontentlength>
				<d:getetag/>
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
				</d:current-user-privilege-set>
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
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
				</d:current-user-privilege-set>
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
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
				</d:current-user-privilege-set>
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
				<d:current-user-privilege-set>
					<d:privilege><d:read/></d:privilege>
					<d:privilege><d:write/></d:privilege>
					<d:privilege><d:all/></d:privilege>
					<d:privilege><d:read_acl/></d:privilege>
					<d:privilege><d:write_acl/></d:privilege>
				</d:current-user-privilege-set>
				<d:getcontenttype>httpd/unix-directory</d:getcontenttype>
				<d:displayname>folder1</d:displayname>
				<d:resourcetype><d:collection/></d:resourcetype>
			</d:prop>
			<d:status>HTTP/1.1 200 OK</d:status>
		</d:propstat>
	</d:response>
```

## MKCOL 创建目录

```http
MKCOL http://a.net/folder HTTP/1.1
translate: f
```

```http
HTTP/1.1 201 Created
```

## MOVE 资源移动或重命名

```http
MOVE http://a.net/src HTTP/1.1
Destination: http://a.net/dest
Overwrite: F
translate: f
```

```http
HTTP/1.1 201 Created
```

## GET 获取资源

```http
GET http://a.net/DAVTest/file1.txt HTTP/1.1
translate: f
```

```http
HTTP/1.1 200 OK
```

## HEAD 检查资源是否存在，得到资源元数据

```http
HEAD http://a.net/DAVTest/file1.txt HTTP/1.1
```

```http
HTTP/1.1 200 OK
```

## LOCK 锁定资源

```http
LOCK http://a.net/DAVTest/file1.txt HTTP/1.1
Content-Type: text/xml; charset=utf-8
translate: f

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

## UNLOCK 解除资源锁定

```http
UNLOCK http://a.net/DAVTest/file1.txt HTTP/1.1
translate: f
Lock-Token: <opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce>
```

```http
HTTP/1.1 204 No Content
```

## PUT 修改资源

```http
PUT http://a.net/DAVTest/file1.txt HTTP/1.1
If: (<opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce>)
translate: f

content in file1.txt
```

```http
HTTP/1.1 204 No Content
X-File-Version: 2
```

## PROPPATCH 更改和删除资源属性

```http
PROPPATCH https://dav.jianguoyun.com/dav/Cloud/DAVTest/file1.txt HTTP/1.1
Content-Type: text/xml; charset=UTF-8
If: (<opaquelocktoken:46cafbd3-d674-46ee-9856-3bb566ec35ce>)
translate: f

<?xml version="1.0" encoding="utf-8" ?>
<D:propertyupdate xmlns:D="DAV:" xmlns:Z="urn:schemas-microsoft-com:">
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

## DELETE 销毁资源或集合

```http
DELETE https://a.net/DAVTest/folder2 HTTP/1.1
translate: f
```

```http
HTTP/1.1 204 No Content
```

## 其他

- POST 添加资源
- COPY 资源复制
- TRACE 远程诊断服务器
- OPTIONS 询问可执行哪些方法


# 举例

## 新建文件

以在新建 `/dav/file1.txt` 为例

|步骤|HTTP 请求|说明|
|:--:|:--|:--|
|1|PUT /dav/file1.txt|新建文件|
|2|LOCK /dav/file1.txt|锁定文件|
|3|HEAD /dav/file1.txt||
|4|PUT /dav/file1.txt|添加文件内容（非必需）|
|5|PROPPATCH /dav/file1.txt|修改文件参数，如修改日期|
|6|UNLOCK /dav/file1.txt|解除锁定|

## 复制文件

以将 `/dav/file1.txt` 复制到同目录下 `/dav/file2.txt` 为例

|步骤|HTTP 请求|说明|
|:--:|:--|:--|
|1|GET /dav/file1.txt|获取源文件内容|
|2|PUT /dav/file2.txt|新建文件|
|3|LOCK /dav/file2.txt|锁定文件|
|4|PROPPATCH /dav/file1.txt|修改文件参数|
|5|HEAD /dav/file2.txt||
|6|PUT /dav/file2.txt|将源文件内容写入新文件中|
|7|PROPPATCH /dav/file2.txt|修改文件参数|
|8|UNLOCK /dav/file2.txt|解除锁定|