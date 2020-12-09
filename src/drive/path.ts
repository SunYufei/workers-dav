function trimSlash(path: string): string {
    return path.replace(/^(\s|\/)+|(\s|\/)+$/g, '');
}

export function pathParts(path: string): string[] {
    return trimSlash(path).split('/');
}

export function pathSplit(path: string): { parent: string, name: string } {
    const parts = pathParts(path);
    const name = parts.pop() || '';
    return {
        parent: `/${parts.length == 1 ? '' : parts.join('/')}`,
        name: name
    }
}

export function pathJoin(parent: string, name: string): string {
    return parent != '/' ? `${parent}/${name}` : `/${name}`
}