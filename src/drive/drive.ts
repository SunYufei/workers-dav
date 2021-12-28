import ItemProperty from '../common/property'

export default interface Drive {
   /**
    * 获取指定路径项目属性
    * @param path 路径
    * @param withChildren 是否包含子项目
    * @return 项目属性
    */
   getItemProps(
      path: string,
      withChildren: boolean
   ): Promise<ItemProperty[] | null>

   /**
    * 新建文件夹
    * @param path 路径
    * @return 新建文件夹是否成功
    */
   mkdir(path: string): Promise<boolean>

   /**
    * 删除文件/文件夹
    * @param path 路径
    * @return 删除是否成功
    */
   trash(path: string): Promise<boolean>
}
