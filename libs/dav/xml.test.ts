import { expect, it } from 'vitest';
import { XMLNode } from './xml';

it('XMLNode', () => {
   const root = new XMLNode('D:multistatus', { 'xmlns:D': 'DAV:' });
   const response = root.elem('D:response');
   response.elem('D:href', 'http://localhost:8787');
   const propStat = response.elem('D:propstat');
   propStat.elem('D:status', 'HTTP/1.1 200 OK');
   const prop = propStat.elem('D:prop');
   prop.elem('D:getlastmodified', 'Thu, ');
   const resourceType = prop.elem('D:resourcetype');
   resourceType.elem(new XMLNode('D:collection'));

   expect(root.toString())
      .contains('<D:multistatus xmlns:D="DAV:">')
      .contains('<D:href>http://localhost:8787</D:href>')
      .contains('<D:status>HTTP/1.1 200 OK</D:status>')
      .contains('<D:collection></D:collection>');
});
