export class Context {
    static enableFilterNonExistsFilesId: string = 'setting-filter-non-exists-files'
    static enableGetFaviconFromNetId: string = 'setting-get-favicon-from-net'
    static enableGetFileIconId: string = 'setting-get-file-icon'
    static enableEditPathInputDirectlyId: string = 'setting-edit-path-input-directly'

    readonly enableFilterNonExistsFiles: boolean = false
    readonly enableGetFaviconFromNet: boolean = false
    readonly enableGetFileIcon: boolean = false
    readonly enableEditPathInputDirectly: boolean = false

    constructor(nativeId: string) {
        this.enableFilterNonExistsFiles = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableFilterNonExistsFilesId)) ?? false
        this.enableGetFaviconFromNet = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableGetFaviconFromNetId)) ?? false
        this.enableGetFileIcon = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableGetFileIconId)) ?? false
        this.enableEditPathInputDirectly = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableEditPathInputDirectlyId)) ?? false
    }

    static joinId(nativeId: string, id: string): string {
        return `${nativeId}/${id}`
    }

    static get(): Context {
        return new Context(utools.getNativeId())
    }

    static update(id: string, value: boolean): void {
        utools.dbStorage.setItem(Context.joinId(utools.getNativeId(), id), value)
    }
}
