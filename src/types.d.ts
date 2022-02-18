declare const KV: KVNamespace

declare type StrAny = Record<string, any>

declare type ItemProperty = {
   /** 路径 /folder/file.ext */
   href: string
   id: string
   /** 日期格式 RFC1123 */
   lastModified?: Date | string
   /** 日期格式 RFC3339 */
   creationDate?: Date | string
   displayName?: string
   contentLength?: number | string
   contentType?: string
   /** 子项目绝对路径 */
   children?: string[]
}
