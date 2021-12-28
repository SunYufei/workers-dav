import encodeQuery from '../../src/drive/query'

test('encodeQuery', () => {
   expect(
      encodeQuery({
         'key1': 'value 1',
         'key2': 'value2',
      })
   ).toEqual('key1=value%201&key2=value2')
})
