# Google Drive API

## 授权

```http request
POST https://www.googleapis.com/oauth2/v4/token
Content-Type: application/x-www-form-urlencoded

client_id=xxx&client_secret=xxx&refresh_token=xxx&grant_type=refresh_token
```

响应正文：

```json
{
  "access_token": "xxx",
  "expires_in": 3599,
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer"
}
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

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| 路径参数 | | |
| fileId | string | 文件 ID |
| 查询参数 | | |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持个人驱动器和共享驱动器。（默认：false） |

**请求正文**

无

**响应**

如果请求成功，返回空的响应正文

### Files: list

列出或搜索文件

**HTTP 请求**

```http request
GET https://www.googleapis.com/drive/v3/files
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| driveId | string | 共享驱动器 ID |
| fields | string | 指定返回的响应字段，如 `files(id, name, mimeType)`，可配置字段见[这里](https://developers.google.com/drive/api/v3/reference/files) |
| includeItemsFromAllDrives | boolean | 结果中包含我的驱动器和共享驱动器项目 |
| orderBy | string | |
| pageSize | integer | 每页返回的最大文件数，默认 100 |
| pageToken | string | 用于在下一页继续上一个列表请求的令牌|
| q | string | 查询条件，[文档](https://developers.google.cn/drive/api/v3/ref-search-terms) |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false) |

**请求正文**

无

**响应**

如果请求成功，返回以下结构的响应正文

```json
{
  "kind": "drive#fileList",
  "nextPageToken": string,
  "incompleteSearch": boolean,
  "files": []
}
```

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| kind | string | 标识资源类型，`drive#fileList` |
| nextPageToken | string | 文件下一页的页面令牌，若到文件列表的末尾，不存在此项 |
| files[] | list | 文件列表，包含请求参数中 `fields` 中只能的参数 |
| incompleteSearch | boolean | 搜索过程是否完整 |

---

### Files: copy

创建文件副本，但无法复制文件夹

**HTTP 请求**

```http request
POST https://www.googleapis.com/drive/v3/files/{fileId}/copy
Authorization: Bearer {AccessToken}
Content-Type: application/json
```

**请求参数**

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| fileId | string | 文件 ID |
| fields | string | 指定返回的响应字段，如 `files(id, name, mimeType)` |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false) |

**请求正文**

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| contentRestrictions[].readOnly | boolean | 文件是否只读 |
| description | string | 文件简短说明 |
| id | string | 文件 ID |
| mimeType | string | 文件 MIME Type，不提供则自动检测 |
| modifiedTime | datetime | 文件修改时间 RFC3339 |
| name | string | 文件名，可在文件夹中不唯一 |
| parents[] | list | 包含该文件的父文件夹 ID |

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

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| uploadType | string | 上传到 URI 的请求类型，如果需要上传数据，此字段必须。包括：media，multipart，resumable |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false） |

**请求正文**

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| contentRestrictions[].readOnly | boolean | 文件的内容是否为只读 |
| createdTime | datetime | 文件创建时间 RFC3339 |
| description | string | 文件的简短说明 |
| mimeType | string | 文件 MIME Type，不提供则自动检测 |
| name | string | 文件名，可在文件夹中不唯一 |
| id | string | 文件 ID |
| mimeType | string | 文件 MIME Type，不提供则自动检测 |
| modifiedTime | datetime | 文件修改时间 RFC3339 |
| parents[] | list | 包含该文件的父文件夹 ID |

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

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| fileId | string | 文件 ID |
| uploadType | string | 上传到 URI 的请求类型，如果需要上传数据，此字段必须。包括：media，multipart，resumable |
| addParents | string | 要添加的父 ID 的逗号分隔列表 |
| removeParents | string | 要删除的父 ID 的逗号分隔列表 |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false） |

**请求正文**

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| contentRestrictions[].readOnly | boolean | 文件的内容是否为只读 |
| description | string | 文件的简短说明 |
| mimeType | string | 文件 MIME Type，不提供则自动检测 |
| modifiedTime | datetime | 文件修改时间 RFC3339 |
| name | string | 文件名，可在文件夹中不唯一 |

**响应**

若请求成功，响应正文中返回文件 metadata

### Files: emptyTrash

永久删除所有回收站文件

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

| 参数名称 | 类型 | 说明 |
| :--- | :--- | :--- |
| fileId | string | 文件 ID |
| alt | string | alt=media 获取文件内容，不指定获取 metadata |
| fields | string | 指定返回的响应字段，如 `files(id, name, mimeType, size)` |
| supportsAllDrives | boolean | 请求的应用程序是否同时支持我的驱动器和共享驱动器。（默认：false） |

**请求正文**

无

**响应**

如果请求成功，在响应正文中返回文件资源
