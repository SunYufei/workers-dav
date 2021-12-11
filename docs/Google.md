# Google Drive API

## 授权

```http request
POST https://www.googleapis.com/oauth2/v4/token
Content-Type: application/x-www-form-urlencoded

{
  "client_id": "xxx",
  "client_secret": "xxx", 
  "refresh_token": "xxx", 
  "grant_type": "refresh_token"
}
```

响应正文：

```
access_token: xxxxx
expires_in: 3599
scope: https://www.googleapis.com/auth/drive
token_type: Bearer
```

> 项目使用 Workers KV 存储 access_token，以减少 OAuth 请求次数

## Files API

### Files: delete

永久删除文件

**HTTP 请求**

```http request
DELETE https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|路径参数|||
|fileId|string|文件 ID|
|查询参数|||
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false）|

**请求正文**

无

**响应**

如果请求成功，返回空的响应正文




---

### 文件类型

- Blob：文本或二进制内容，如图像、视频或PDF。
- 文件夹：MIME type `application/vnd.google-apps.folder`.
- 快捷方式 **（不支持）**
- 第三方快捷方式 **（不支持）**
- Google Workspace document **（不支持）**


### 文件特征

- 文件 ID：每个文件拥有唯一的 ID。文件 ID 在文件的整个生命周期中都是稳定的，即使文件名发生了变化。[搜索表达式](https://developers.google.cn/drive/api/v3/search-files)用于按名称、类型、内容、父容器、所有者或其他元数据查找文件。

- *Metadata*

  Data that describes the content of the file. This data includes the name, type, creation and modification times. Some metadata fields, such as the are user-agnostic and appear the same for each user. Other fields, such as and contain user-specific values. File types, such as images and videos, contain additional metadata extracted from EXIF and other embedded metadata. `name`, `capabilities`, `viewedByMeDate`

  ```
  {
    "kind": "drive#file",     // 资源类型
    "id": string,             // file Id
    "name": string,           // file name
    "mimeType": string,       // MIME Type
    "description": string,    // 文件简短说明
    "trashed": boolean,
    "trashedTime": datetime,
    "parents": [  string  ],	// 父文件夹 ID
    "version": long,  		// 文件的单调增加版本号
    "webContentLink": string, 
    "webViewLink": string,    // 浏览器中查看链接
    "iconLink": string,       // 图标链接
    "hasThumbnail": boolean,  // 是否有缩略图
    "thumbnailLink": string,  // 缩略图链接
    "thumbnailVersion": long,
    "createdTime": datetime,  // 文件创建时间
    "modifiedTime": datetime, // 文件上次修改时间
    "owners": [
      {
        "kind": "drive#user",
        "displayName": string,
        "photoLink": string,
        "me": boolean,
        "permissionId": string,
        "emailAddress": string
      }
    ],
    "driveId": string,
    "originalFilename": string,
    "fullFileExtension": string,  // 完整文件扩展名 e.g. tar.gz
    "md5Checksum": string,    // MD5 校验和
    "size": long,             // 文件内容大小
    "contentHints": {
      "thumbnail": {  "image": bytes,  "mimeType": string  },
      "indexableText": string
    },
    "imageMediaMetadata": {   // 图像媒体元数据
      "width": integer,
      "height": integer,
      "rotation": integer,
      "location": {
        "latitude": double,
        "longitude": double,
        "altitude": double
      },
      "time": string,
      "cameraMake": string,
      "cameraModel": string,
      "exposureTime": float,
      "aperture": float,
      "flashUsed": boolean,
      "focalLength": float,
      "isoSpeed": integer,
      "meteringMode": string,
      "sensor": string,
      "exposureMode": string,
      "colorSpace": string,
      "whiteBalance": string,
      "exposureBias": float,
      "maxApertureValue": float,
      "subjectDistance": integer,
      "lens": string
    },
    "videoMediaMetadata": {   // 视频媒体元数据
      "width": integer,
      "height": integer,
      "durationMillis": long
    },
    "exportLinks": {    (key): string  },
  }
  ```

- 权限：用户、组、域或世界访问文件或文件夹层次结构的访问权限。用户使用访问控制列表（ACL）控制谁可以访问文件，ACL是文件的权限列表。有关详细信息，请参阅[共享文件、文件夹和驱动器](https://developers.google.cn/drive/api/v3/manage-sharing)。

- 内容：二进制或文本文件。一些可以存储在 Google Drive 中的内容示例包括图像、视频、文本和 PDF。

- 修订历史：只记录对文件内容的更改，而不是文件元数据。有关修订的详细信息，请参阅[更改和修订概述](https://developers.google.cn/drive/api/v3/change-overview).

- 缩略图：Google Drive 自动生成许多常见文件类型的缩略图。对于 GDrive 无法渲染的快捷方式和其他文件类型，可以提供缩略图。

### Files: copy

创建文件副本，但无法复制文件夹

**HTTP 请求**

```http request
POST https://www.googleapis.com/drive/v3/files/{fileId}/copy
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|fileId|string|文件 ID|
|fields|string|指定返回的响应字段，如 `files(id, name, mimeType)`|
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false)|

**请求正文**

|参数名称|类型|说明|
|:---|:---|:---|
|contentRestrictions[].readOnly|boolean|文件是否只读|
|description|string|文件简短说明|
|id|string|文件 ID|
|mimeType|string|文件 MIME Type，不提供则自动检测|
|modifiedTime|datetime|文件修改时间 RFC3339|
|name|string|文件名，可在文件夹中不唯一|
|parents[]|list|包含该文件的父文件夹 ID|

**响应**

文件 Metadata

### Files: create

创建一个新文件，最大文件大小 5120GB，媒体类型 `*/*`

**请求**

对于媒体上传请求

```http request
POST https://www.googleapis.com/upload/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

对于仅元数据请求

```http request
POST https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|uploadType|string|上传到 URI 的请求类型，如果需要上传数据，此字段必须。包括：media，multipart，resumable|
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false）|

**请求正文**

|参数名称|类型|说明|
|:---|:---|:---|
|contentRestrictions[].readOnly|boolean|文件的内容是否为只读|
|createdTime|datetime|文件创建时间 RFC3339|
|description|string|文件的简短说明|
|mimeType|string|文件 MIME Type，不提供则自动检测|
|name|string|文件名，可在文件夹中不唯一|
|id|string|文件 ID|
|mimeType|string|文件 MIME Type，不提供则自动检测|
|modifiedTime|datetime|文件修改时间 RFC3339|
|parents[]|list|包含该文件的父文件夹 ID|

**响应**

若请求成功，响应正文中返回文件 metadata

### Files: update

更新文件的元数据和/或内容，最大文件大小 5120GB，媒体类型 `*/*`

**请求**

对于媒体上传请求

```http request
PATCH https://www.googleapis.com/upload/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

对于仅元数据请求

```http request
PATCH https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|fileId|string|文件 ID|
|uploadType|string|上传到 URI 的请求类型，如果需要上传数据，此字段必须。包括：media，multipart，resumable|
|addParents|string|要添加的父 ID 的逗号分隔列表|
|removeParents|string|要删除的父 ID 的逗号分隔列表|
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false）|

**请求正文**

| 参数名称                       | 类型     | 说明                             |
| :----------------------------- | :------- | :------------------------------- |
| contentRestrictions[].readOnly | boolean  | 文件的内容是否为只读             |
| description                    | string   | 文件的简短说明                   |
| mimeType                       | string   | 文件 MIME Type，不提供则自动检测 |
| modifiedTime                   | datetime | 文件修改时间 RFC3339             |
| name                           | string   | 文件名，可在文件夹中不唯一       |

**响应**

若请求成功，响应正文中返回文件 metadata


### Files: emptyTrash

永久删除所有垃圾文件

**HTTP 请求**

```http request
DELETE https://www.googleapis.com/drive/v3/files/trash
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数、请求正文**

无

**响应**

如果请求成功，返回空的响应正文

### Files: get

通过 ID 获取文件元数据或内容

**HTTP 请求**

```http request
GET https://www.googleapis.com/drive/v3/files/{fileId}
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|fileId|string|文件 ID|
|alt|string|alt=media 获取文件内容，不指定获取 metadata|
|fields|string|指定返回的响应字段，如 `files(id, name, mimeType, size)`|
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false）|

**请求正文**

无

**响应**

如果请求成功，在响应正文中返回文件资源

### Files: list

列出或搜索文件

**HTTP 请求**

```http request
GET https://www.googleapis.com/drive/v3/files
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

|参数名称|类型|说明|
|:---|:---|:---|
|driveId|string|共享驱动器 ID|
|fields|string|指定返回的响应字段，如 `files(id, name, mimeType)`|
|includeItemsFromAllDrives|boolean|结果中包含我的驱动器和共享驱动器项目|
|orderBy|string||
|pageSize|integer|每页返回的最大文件数，默认 11000100|
|pageToken|string|用于在下一页继续上一个列表请求的令牌|
|q|string|查询条件|
|supportsAllDrives|boolean|请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false)|

**请求正文**

无

**响应**

如果请求成功，返回以下结构的响应正文

```
{
  "kind": "drive#fileList",
  "nextPageToken": string,
  "incompleteSearch": boolean,
  "files": [
    files Resource
  ]
}
```

|属性名|类型|说明|
|:---|:---|:---|
|kind|string|标识资源类型，`drive#fileList`|
|nextPageToken|string|文件下一页的页面令牌，若到文件列表的末尾，不存在此项|
|files[]|list|文件列表|
|incompleteSearch|boolean|搜索过程是否完整|


## [上传文件数据](https://developers.google.cn/drive/api/v3/manage-uploads)

The Drive API allows you to upload file data when you create or update a [`File`](https://developers.google.cn/drive/api/v3/reference/files). For information on how to create a metadata-only `File`, refer to [Create files](https://developers.google.cn/drive/api/v3/create-file).

文件上传有三种形式：

### 简单上传 (计划中)

Use this upload type to quickly transfer a small media file (5 MB or less) without supplying metadata.

### Multipart upload (计划中)

Use this upload type to quickly transfer a small file (5 MB or less) and metadata that describes the file, in a single request.

### Resumable upload

Use this upload type for large files (greater than 5 MB) and when there's a high chance of network interruption, such as when creating a file from a mobile app. Resumable uploads are also a good choice for most applications because they also work for small files at a minimal cost of one additional HTTP request per upload.

A resumable upload allows you to resume an upload operation after a communication failure interrupts the flow of data. Because you don't have to restart large file uploads from the start, resumable uploads can also reduce your bandwidth usage if there is a network failure.

Resumable uploads are useful when your file sizes might vary greatly or when there is a fixed time limit for requests (mobile OS background tasks and certain AppEngine requests). You might also use resumable uploads for situations where you want to show an upload progress bar.

A resumable upload consists of three high-level steps:

1. Send the initial request and retrieve the resumable session URI.
2. Upload the data and monitor upload state.
3. (optional) If upload is disturbed, resume the upload.

#### 发送初始请求

1. Create a `POST` request to the method's /upload URI with the query parameter of `uploadType=resumable`:

   ```http request
   POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable
   ```

   If the initiation request succeeds, the response includes a `200 OK` HTTP status code. In addition, it includes a `Location` header that specifies the resumable session URI:

   ```http request
   HTTP/1.1 200 OK
   Location: https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=xa298sd_sdlkj2
   Content-Length: 0
   ```

   You should save the resumable session URI so you can upload the file data and query the upload status. A resumable session URI expires after one week.

2. If you have metadata for the file, add the metadata to the request body in JSON format. Otherwise, leave the request body empty.
3. Add these HTTP headers:
    - `X-Upload-Content-Type`. Optional. Set to the MIME type of the file data, which is transferred in subsequent requests. If the MIME type of the data is not specified in metadata or through this header, the object is served as `application/octet-stream.`
    - `X-Upload-Content-Length`. Optional. Set to the number of bytes of file data, which is transferred in subsequent requests.
    - `Content-Type`. Required if you have metadata for the file. Set to `application/json;` `charset=UTF-8`.
    - `Content-Length`. Required unless you use chunked transfer encoding. Set to the number of bytes in the body of this initial request.
4. Send the request. If the session initiation request succeeds, the response includes a `200 OK HTTP` status code. In addition, the response includes a `Location` header that specifies the resumable session URI. Use the resumable session URI to upload the file data and query the upload status. A resumable session URI expires after one week.
5. Copy and save the resumable session URL.
6. Continue to [Uploading content](https://developers.google.cn/drive/api/v3/manage-uploads#uploading)

#### 上传数据

There are two ways to upload a file with a resumable session:

- Upload content in a single request. Use this approach when the file can be uploaded in one request, if there is no fixed time limit for any single request, or you don't need to display an upload progress indicator. This approach is usually best because it requires fewer requests and results in better performance.

    1. Create a `PUT` request to the resumable session URI.
    2. Add the file's data to the request body.
    3. Add a Content-Length HTTP header, set to the number of bytes in the file.
    4. Send the request. If the upload request is interrupted, or if you receive a 5xx response, follow the procedure in [Resume an interrupted upload](https://developers.google.cn/drive/api/v3/manage-uploads#resume-upload).

- Upload the content in multiple chunks. Use this approach if you need to reduce the amount of data transferred in any single request. You might need to reduce data transferred when there is a fixed time limit for individual requests, as can be the case for certain classes of Google App Engine requests. This approach is also useful if you need to provide a customized indicator to show the upload progress.

    1. Create a `PUT` request to the resumable session URI.
    2. Add the chunk's data to the request body. Create chunks in multiples of 256 KB (256 x 1024 bytes) in size, except for the final chunk that completes the upload. Keep the chunk size as large as possible so that the upload is efficient.
    3. Add these HTTP headers:
        - `Content-Length`. Set to the number of bytes in the current chunk.
        - `Content-Range`. Set to show which bytes in the file you upload. For example, `Content-Range: bytes 0-524287/2000000` shows that you upload the first 524,288 bytes (256 x 1024 x 2) in a 2,000,000 byte file.
    4. Send the request, and process the response. If the upload request is interrupted, or if you receive a 5xx response, follow the procedure in [Resume an interrupted upload](https://developers.google.cn/drive/api/v3/manage-uploads#resume-upload).
    5. Repeat steps 1 through 4 for each chunk that remains in the file. Use the `Range` header in the response to determine where to start the next chunk. Do not assume that the server received all bytes sent in the previous request.

  When the entire file upload is complete, you receive a `200 OK` or `201 Created` response, along with any metadata associated with the resource.

#### Resume an interrupted upload

If an upload request is terminated before a response, or if you receive a `503 Service Unavailable` response, then you need to resume the interrupted upload.

1. To request the upload status, create an empty `PUT` request to the resumable session URI.
2. Add a `Content-Range` header to indicate that the current position in the file is unknown. For example, set the `Content-Range` to `*/2000000` if your total file length is 2,000,000 bytes. If you don't know the full size of the file, set the `Content-Range` to `*/*`.
3. Send the request.
4. Process the response:
    - A `200 OK` or `201 Created` response indicates that the upload was completed, and no further action is necessary.
    - A `308 Resume Incomplete` response indicates that you need to continue to upload the file.
    - A `404 Not Found` response indicates the upload session has expired and the upload needs to be restarted from the start.
5. If you received a `308 Resume Incomplete` response, process the response's `Range` header, to determine which bytes the server has received. If the response doesn't have a `Range` header, no bytes have been received. For example, a `Range` header of `bytes=0-42` indicates that the first 43 bytes of the file have been received and that the next chunk to upload would start with byte 43.
6. Now that you know where to resume the upload, continue to upload the file beginning with the next byte. Include a `Content-Range` header to indicate which portion of the file you send. For example, `Content-Range: bytes 43-1999999/2000000` indicates that you send bytes 43 through 1,999,999.

### 处理媒体文件上传错误

When you upload media, follow these best practices to handle errors:

- For 5xx errors, resume or retry uploads that fail due to connection interruptions. For further information on handling 5xx errors, refer to [Resolve errors](https://developers.google.cn/drive/api/v3/handle-errors#resolve_a_500_error_backend_error)
- For 403 rate limit errors, retry the upload. For further information on handling 403 rate limit errors, refer to [Resolve a 403 error: Rate limit exceeded](https://developers.google.cn/drive/api/v3/handle-errors#resolve_a_403_error_rate_limit_exceeded)
- For any 4xx errors (including 403) during a resumable upload, restart the upload. These errors indicate the upload session has expired and must be restarted by [requesting a new session URI](https://developers.google.cn/drive/api/v3/manage-uploads#resumable). Upload sessions also expire after 1 week of inactivity.

### Use a pregenerated ID to upload files

The Drive API allows you to retrieve a list of pregenerated file IDs used to upload and create resources. Upload and file creation requests can use these pregenerated IDs. Set the `id` field in the file metadata.

To create pregenerated IDs, call [file.generateIds](https://developers.google.cn/drive/api/v3/reference/files/generateIds) with the number of IDs to create.

You can safely retry uploads with pregenerated IDs in the case of an indeterminate server error or timeout. If the file was successfully created, subsequent retries return a `HTTP 409` error, they do not create duplicate files.