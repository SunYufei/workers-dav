## Cloudflare Workers API

> 以下是部分文档，全文见[这里](https://developers.cloudflare.com/workers/runtime-apis/kv#docs-content)

### 写入 KV

```ts
await NAMESPACE.put(key, value, {
   expirationTtl: secondsSinceNow
})
```

- key: string
   - 最大大小 512B
   - 不允许为空、`.`和`..`
   - 重复 key 会更新 `value`
- value: string | ReadableStream | ArrayBuffer
   - 最大大小为 25MB
- expirationTtl: number

### 读取 KV

```ts
await NAMESPACE.get(key, { type: 'text' })
```

参数 `type` 可以为

- text（默认）
- json，json 解析后的 value
- arrayBuffer
- stream

### 删除 KV

```ts
await NAMESPACE.delete(key)
```

### 列出所有 key

```ts
await NAMESPACE.list()
```
