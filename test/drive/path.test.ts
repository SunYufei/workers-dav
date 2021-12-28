import Path from '../../src/common/path'

test('Path.base', () => {
   ;[
      ['', '/', '/', ''],
      ['/', '/', '/', ''],
      ['/parent/', '/parent', '/', 'parent'],
      ['/parent/name/', '/parent/name', '/parent', 'name'],
      ["/parent'/name", "/parent\\'/name", "/parent\\'", 'name'],
      ["/parent/name'/", "/parent/name\\'", '/parent', "name\\'"],
   ].forEach((it) => {
      expect(Path.resolve(it[0])).toEqual(it[1])
      expect(Path.getParent(it[0])).toEqual(it[2])
      expect(Path.getName(it[0])).toEqual(it[3])
   })
})

test('Path.join', () => {
   expect(Path.join('', '')).toEqual('/')
   expect(Path.join('parent/subparent', 'name')).toEqual(
      '/parent/subparent/name'
   )
})

test('Path.parts', () => {
   expect(Path.parts('/')).toEqual([''])
   expect(Path.parts('/parent/name')).toEqual(['parent', 'name'])
})
