## Google Drive 参数配置

### 获取 client_id, client_secret

登录开发账号，在 API 权限里创建相应的 OAuth 客户端获取，注意将 `http://localhost` 添加到已获授权的重定向 URI

### 获取 authorization_code

- 浏览器访问（注意替换 client_id）

```
https://accounts.google.com/o/oauth2/auth?scope=https://www.googleapis.com/auth/drive&response_type=code&access_type=offline&redirect_uri=http://localhost&client_id={client_id}
```

- 访问后进行账户登录和应用授权，在重定向地址 `http://localhost?code=xxxxxx&client_id=xxxxxx` 中可获取 authorization_code

### 获取 refresh_token

- 向 `https://oauth2.googleapis.com/token` 发送 POST 请求，注意替换请求体中的相应参数

```http request
POST /token
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded

code={authorization_code}&client_id={client_id}&client_secret={client_secret}&redirect_uri=http://localhost&grant_type=authorization_code
```

- 在响应 JSON 中可获取 refresh_token

```json
{
   "access_token": "xxxx",
   "expires_in": 3520,
   "token_type": "Bearer",
   "scope": "https://www.googleapis.com/auth/drive",
   "refresh_token": "xxxxxx"
}
```

### 将参数写入配置文件

将项目 `src/drive` 目录下的 `config.default.json` 复制为 `config.json`，填入如下参数

- client_id
- client_secret
- refresh_token
- root **（不使用 Google Team Drive 或不指定挂载文件夹无需修改此项）**

  网页访问 Google Drive，进入需要挂载的文件夹，填入地址栏 `https://drive.google.com/drive/folders/xxxxxx` 中的 `xxxxxx` 信息
