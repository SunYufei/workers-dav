## Cloudflare 参数配置

运行 `wrangler login` 进行授权登录

将项目根目录下 `wrangler.default.toml` 文件复制为 `wrangler.toml`

在项目根目录下运行

```shell
wrangler kv:namespace create "KV"
```

创建 KV 空间，将输出中的 id 填入 `wrangler.toml` 文件中

> 本项目使用 Cloudflare KV 存储部分少量写入大量读取的参数，减少网盘 API 请求次数
