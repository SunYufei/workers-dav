import * as http from 'http';
import XMLBuilder from '../xml';
import ItemProperty from '../../common/property';
import HTTPCode from '../../common/code';

function date2RFC3339(date?: Date | string): string {
    date = date || new Date();
    if (date instanceof String)
        date = new Date(date);
    return '';
}

function date2RFC1123(date?: Date | string): string {
    date = date || new Date();
    if (date instanceof String)
        date = new Date(date);
    return '';
}

function buildResponse(property: ItemProperty, status = HTTPCode.OK): XMLBuilder {
    const builder = new XMLBuilder('D:response');
    builder.elem('D:href', {}, property.path);
    const propstat = builder.elem('D:propstat');
    propstat.elem('D:status', {}, `HTTP/1.1 ${status} ${http.STATUS_CODES[status]}`);
    const prop = builder.elem('D:prop');
    prop.elem('D:getetag', {}, property.id);
    prop.elem('D:getlastmodified', {}, date2RFC1123(property.lastModified));
    prop.elem('D:creationdate', {}, date2RFC3339(property.creationDate));
    prop.elem('D:displayname', {}, property.displayName);
    const resourceType = prop.elem('D:resourcetype');
    if (property.contentType.includes('folder')) {
        // 对于文件夹，指定其 resource type 为 collection
        // TODO 此处仅判断 google drive folder mime type
        resourceType.elem('D:collection');
    } else {
        // 对于文件，构造其 content length 和 content type
        prop.elem('D:getcontentlength', {}, property.contentLength.toString());
        prop.elem('D:getcontenttype', {}, property.contentType);
    }
    return builder;
}

export async function propfind(properties: ItemProperty[]) {
    const builder = new XMLBuilder('D:multistatus', { 'xmlns:D': 'DAV:' });
    for (const item of properties)
        builder.add(buildResponse(item));
    return new Response(builder.build(), {
        status: HTTPCode.MultiStatus,
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    })
}
