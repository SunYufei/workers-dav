import { HTTPCode, StatusCode } from '../../common/http'
import ItemProperty from '../../common/property'
import XMLBuilder from '../xml'

function date2RFC3339(date?: Date | string): string {
   date = date || new Date()
   if (typeof date == 'string') date = new Date(date)
   return date.toISOString()
}

function date2RFC1123(date?: Date | string): string {
   date = date || new Date()
   if (typeof date == 'string') date = new Date(date)
   return date.toUTCString()
}

function buildResponse(
   property: ItemProperty,
   status: number = HTTPCode.OK
): XMLBuilder {
   const builder = new XMLBuilder('D:response')
   builder.elem('D:href', property.href)
   const propStat = builder.elem('D:propstat')
   propStat.elem('D:status', `HTTP/1.1 ${status} ${StatusCode[status]}`)
   const prop = builder.elem('D:prop')
   prop.elem('D:getetag', property.id)
   prop.elem('D:getlastmodified', date2RFC1123(property.lastModified))
   prop.elem('D:creationdate', date2RFC3339(property.creationDate))
   if (property.displayName) {
      prop.elem('D:displayname', property.displayName)
   }
   const resourceType = prop.elem('D:resourcetype')
   if (!property.contentType || !property.contentLength) {
      // 对于文件夹，指定其 resource type 为 collection
      resourceType.elem('D:collection')
   } else {
      // 对于文件，构造其 content length 和 content type
      prop.elem('D:getcontentlength', property.contentLength.toString())
      prop.elem('D:getcontenttype', property.contentType)
   }
   return builder
}

export default function propfind(props: ItemProperty[] | null) {
   if (props == null) {
      return new Response(null, { status: HTTPCode.NotFound })
   }
   const builder = new XMLBuilder('D:multistatus', {
      'xmlns:D': 'DAV:',
   })
   for (const prop of props) {
      builder.add(buildResponse(prop))
   }
   return new Response(builder.build(), {
      status: HTTPCode.MultiStatus,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
   })
}
