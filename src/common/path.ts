export default class Path {
   static resolve(path: string): string {
      return `/${this.trim(path)}`
   }

   static parts(path: string): string[] {
      return this.trim(path).split('/')
   }

   static getParent(path: string): string {
      const parts = this.parts(path)
      parts.pop()
      return `/${parts.join('/')}`
   }

   static getName(path: string): string {
      const parts = this.parts(path)
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
      // ' -> \'
      path = path.replace(/'/g, "\\'")
      // trim slash
      path = path.replace(/^(\s|\/)+|(\s|\/)+$/g, '')
      return path
   }
}
