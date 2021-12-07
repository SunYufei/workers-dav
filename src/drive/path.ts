export default class PathUtil {
    static resolve(path: string): string {
        path = this.trim(path);
        const parts = path.split('/');
        return `/${parts.join('/')}`;
    }

    static getParent(path: string): string {
        path = this.resolve(path);
        const index = path.lastIndexOf('/');
        const parent = path.substring(0, index);
        return parent == '' ? '/' : parent;
    }

    static getName(path: string): string {
        path = this.resolve(path);
        const index = path.lastIndexOf('/');
        return path.substring(index + 1);
    }

    static join(parent: string, name: string): string {
        parent = this.trim(parent);
        name = this.trim(name);
        return parent == '' ? `/${name}` : `/${parent}/${name}`;
    }

    private static trim(path: string): string {
        // decode URI component
        path = decodeURIComponent(path);
        // ‘ -> \'
        path = path.replace(/'/g, "\\'");
        // trim slash
        path = path.replace(/^(\s|\/)+|(\s|\/)+$/g, '');
        return path;
    }
}