import { expect, it } from 'vitest';
import { Path } from './';

it('path', () => {
   const path = 'root/first/second';
   const resolve = Path.resolve(path);
   expect(resolve).toBe('/root/first/second');
   expect(Path.parts(path)[0]).toBe('root');
   const parent = Path.getParent(path);
   const name = Path.getName(path);
   expect(parent).toBe('/root/first');
   expect(name).toBe('second');
   expect(Path.join(parent, name)).toBe(resolve);
});
