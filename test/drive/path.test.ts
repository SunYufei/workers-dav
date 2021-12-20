import PathUtil from '../../src/drive/path'

test('Path.getParent', () => {
   expect(PathUtil.getParent('/')).toStrictEqual('/')
   expect(PathUtil.getParent('/parent/')).toStrictEqual('/')
   expect(PathUtil.getParent('/parent/name/')).toStrictEqual('/parent')
   expect(PathUtil.getParent("/parent'/name")).toStrictEqual("/parent\\'")
})

test('Path.getName', () => {
   expect(PathUtil.getName('/')).toStrictEqual('')
   expect(PathUtil.getName('/name')).toStrictEqual('name')
   expect(PathUtil.getName("/name'/")).toStrictEqual("name\\'")
})

test('Path.join', () => {
   expect(PathUtil.join('', '')).toStrictEqual('/')
})
