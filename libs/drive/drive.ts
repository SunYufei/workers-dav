export interface Drive {
   trash(path: string): Promise<boolean>;
}
