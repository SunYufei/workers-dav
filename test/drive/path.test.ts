import Path from '../../src/drive/path';


test('Path.resolve', () => {
    expect(Path.resolve(''))
        .toStrictEqual('/')
    expect(Path.resolve('/'))
        .toStrictEqual('/')
    expect(Path.resolve("/name'/"))
        .toStrictEqual("/name\\'")
    expect(Path.resolve("/'"))
        .toStrictEqual("/\\'")
    expect(Path.resolve('/parent/name/'))
        .toStrictEqual('/parent/name')
})

test('Path.getParent', () => {
    expect(Path.getParent('/'))
        .toStrictEqual('/')
    expect(Path.getParent('/parent/'))
        .toStrictEqual('/')
    expect(Path.getParent('/parent/name/'))
        .toStrictEqual('/parent')
    expect(Path.getParent("/parent'/name"))
        .toStrictEqual("/parent\\'")
})

test('Path.getName', () => {
    expect(Path.getName('/'))
        .toStrictEqual('')
    expect(Path.getName('/name'))
        .toStrictEqual('name')
    expect(Path.getName("/name'/"))
        .toStrictEqual("name\\'")
})