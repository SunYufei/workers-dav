import { date2RFC1123, date2RFC3339 } from './date';
import { XMLNode } from './xml';
import { HttpCode, StatusCode } from 'libs/http/code';
import { ContentType, HttpHeader } from 'libs/http/header';

export class DAV {
   static OPTIONS = new Response(null, {
      headers: {
         [HttpHeader.ALLOW]: 'OPTIONS, PROPFIND, PROPPATCH, MKCOL, GET, HEAD, DELETE, COPY, MOVE',
         [HttpHeader.DAV]: '1',
      },
   });

   static move = (success: boolean) =>
      new Response(null, { status: success ? HttpCode.Created : HttpCode.Forbidden });

   static mkcol = (success: boolean) =>
      new Response(null, { status: success ? HttpCode.Created : HttpCode.Forbidden });

   static trash = (success: boolean) =>
      new Response(null, { status: success ? HttpCode.NoContent : HttpCode.InternalServerError });

   static propfind(props: ItemProperty[] | null) {
      if (props == null) {
         return new Response(null, { status: HttpCode.NotFound });
      }
      const root = new XMLNode('D:multistatus', { 'xmlns:D': 'DAV:' });
      for (const prop of props) {
         root.elem(this.buildResponse(prop));
      }
      return new Response(root.toString(), {
         status: HttpCode.MultiStatus,
         headers: { [HttpHeader.CONTENT_TYPE]: ContentType.XML },
      });
   }

   private static buildResponse(item: ItemProperty, status: number = HttpCode.OK): XMLNode {
      const node = new XMLNode('D:response');
      node.elem('D:href', item.href);
      const propStat = node.elem('D:propstat');
      propStat.elem('D:status', `HTTP/1.1 ${status} ${StatusCode[status]}`);
      const prop = propStat.elem('D:prop');
      prop.elem('D:getetag', item.id);
      prop.elem('D:getlastmodified', date2RFC1123(item.lastModified));
      prop.elem('D:creationdate', date2RFC3339(item.creationDate));
      if (item.displayName) {
         prop.elem('D:displayname', item.displayName);
      }
      const resourceType = prop.elem('D:resourcetype');
      if (!item.contentType || !item.contentLength) {
         // 对于文件夹，指定其 resource type 为 collection
         resourceType.elem('D:collection');
      } else {
         // 对于文件，构造其 content length 和 content type
         prop.elem('D:getcontentlength', item.contentLength.toString());
         prop.elem('D:getcontenttype', item.contentType);
      }
      return node;
   }
}
