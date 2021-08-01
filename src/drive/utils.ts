export function encodeQuery(data: { [key: string]: string }): string {
    return Object.keys(data).map(key => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
    }).join('&');
}

export function pathSplit(path: string): { parent: string, name: string } {
    const parts = pathParts(path);
    const name = parts.pop() || '';
    return {
        parent: `/${parts.length == 1 ? '' : parts.join('/')}`,
        name: name
    }
}

function pathParts(path: string): string[] {
    // trim slash
    path = decodeURIComponent(path);
    path = path.replace(/^(\s|\/)+|(\s|\/)+$/g, '');
    return path.split('/');
}

