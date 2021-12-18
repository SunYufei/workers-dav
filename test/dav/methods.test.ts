require('isomorphic-fetch');

import HTTPCode from '../../src/common/code';
import * as dav from '../../src/dav/export';


test('options', async () => {
    console.log((await dav.options()).headers);
})

test('delete', async () => {
    expect((await dav.trash(true)).status)
        .toBe(HTTPCode.NoContent);
    expect((await dav.trash(false)).status)
        .toBe(HTTPCode.Forbidden)
})