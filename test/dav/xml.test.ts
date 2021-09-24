import XMLBuilder from '../../src/dav/xml';

test('xml', () => {
    const builder = new XMLBuilder('D:multistatus', {'xmlns:D': 'DAV:'});
    const response = builder.elem('D:response');
    response.elem('D:href', {}, 'http://localhost:1900');
    const propstat = response.elem('D:propstat');
    propstat.elem('D:status', {}, 'HTTP/1.1 200 OK');
    const prop = propstat.elem('D:prop');
    prop.elem('D:getlastmodified', {}, 'Thu, ')
    const resourcetype = prop.elem('D:resourcetype');
    resourcetype.elem('D:collection');
    console.log(builder.toString());
})
