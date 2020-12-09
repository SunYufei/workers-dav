import GoogleDrive from "../src/drive/drive";
import {log} from "util";

global.fetch = require('node-fetch');
jest.setTimeout(15000);

const gd = new GoogleDrive();

test('gd', async () => {
    const paths = [
        "/2020.The.Queen's.Gambit.后翼齐兵",
        "/",
        "/1940.Tom.and.Jerry.猫和老鼠/001 1940 Puss Gets the Boot.avi"
    ];
    for (const path of paths) {
        console.log(path, await gd.itemInfo(path))
    }
})