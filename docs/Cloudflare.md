# Cloudflare Workers 文档

## 部署工具 wrangler

### 安装

```shell
npm i -g @cloudflare/wrangler
```

其他安装方法及注意事项见[官方文档](https://github.com/cloudflare/wrangler)

### 配置

```shell
wrangler config
```

填入 Cloudflare API Token

## 项目配置

复制 `wrangler.default.toml` 到 `wrangler.toml`

将 `account_id` 填入 `wrangler.toml`

在项目根目录运行

```shell
wrangler kv:namespace create "KV"
```

会输出如下内容

```text
kv_namespaces = [
    { binding = "KV", id = "xxxxxx" }
]
```

将上述内容写入 `wrangler.toml` 末尾

## Workers KV API

> 未完待续