import GoogleDrive from '../../src/drive/google';

const gd = new GoogleDrive();

test('gd', () => {
    gd.fetchFile('/', null, false).then();
    gd.trash('/test').then();
})
