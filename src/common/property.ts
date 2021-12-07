export default interface ItemProperty {
    /**
     * path, e.g. /folder/file.ext
     */
    path: string
    id: string
    /**
     * date format: RFC1123
     */
    lastModified?: Date | string
    /**
     * date format: RFC3339
     */
    creationDate?: Date | string
    displayName?: string
    contentLength: number | string
    contentType: string
}
