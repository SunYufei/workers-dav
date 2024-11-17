import { expect, it } from 'vitest';
import { DAV } from '.';

it('OPTIONS', () => {
   const options = DAV.OPTIONS;
   expect(options.headers.get('DAV')).toBe('1');
});
