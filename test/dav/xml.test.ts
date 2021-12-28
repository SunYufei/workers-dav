import XMLBuilder from '../../src/dav/xml'

test('xml', () => {
   const builder = new XMLBuilder('D:multistatus', {
      'xmlns:D': 'DAV:',
   })
   const response = builder.elem('D:response')
   response.elem('D:href', 'http://localhost:8787')
   const propStat = response.elem('D:propstat')
   propStat.elem('D:status', 'HTTP/1.1 200 OK')
   const prop = propStat.elem('D:prop')
   prop.elem('D:getlastmodified', 'Thu, ')
   const resourceType = prop.elem('D:resourcetype')
   resourceType.elem('D:collection')

   expect(builder.build()).toContain('</D:multistatus>')
})
