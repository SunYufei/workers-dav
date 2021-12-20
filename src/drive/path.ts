export default class PathUtil {
   static getParts(path: string): string[] {
      path = this.trim(path)
      return path.split('/')
   }

   static getParent(path: string): string {
      const parts = this.getParts(path)
      parts.pop()
      return `/${parts.join('/')}`
   }

   static getName(path: string): string {
      const parts = this.getParts(path)
      return parts.pop() || ''
   }

   static join(parent: string, name: string): string {
      parent = this.trim(parent)
      name = this.trim(name)
      return parent == '' ? `/${name}` : `/${parent}/${name}`
   }

   private static trim(path: string): string {
      // decode URI component
      path = decodeURIComponent(path)
      // ‘ -> \'
      path = path.replace(/'/g, '\\\'')
      // trim slash
      path = path.replace(/^(\s|\/)+|(\s|\/)+$/g, '')
      return path
   }
}
