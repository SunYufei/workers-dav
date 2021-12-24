## Cloudflare 参数配置

### API Token

- 访问 [这里](https://dash.cloudflare.com/profile/api-tokens) 新建 API 令牌，使用 `编辑 Cloudflare Workers` 模板，勾选 `Workers 脚本`、`Workers KV 存储`、`Workers 路由` 的编辑权限，新建完毕后投放此令牌

- 运行 `wrangler config` 填入刚才生成的令牌

### 项目属性

- 将项目根目录下 `wrangler.default.toml` 文件复制为 `wrangler.toml`
- 访问 [这里](https://dash.cloudflare.com/) ，选择一个域名，将账户 ID 填入 `account_id` 字段中，将区域 ID 填入 `zone_id` 字段中
- 创建 KV 空间
   ```shell
   wrangler kv:namespace create "KV"
   ```
  将输出中的 id 填入 `wrangler.toml` 文件中
  > 本项目使用 Cloudflare KV 存储部分少量写入大量读取的参数，减少网盘 API 请求次数
