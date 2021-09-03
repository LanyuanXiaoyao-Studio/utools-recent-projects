export class Context {
    static enableFilterNonExistsFilesId: string = 'setting-filter-non-exists-files'
    static enableGetFaviconFromNetId: string = 'setting-get-favicon-from-net'

    readonly enableFilterNonExistsFiles: boolean = false
    readonly enableGetFaviconFromNet: boolean = false

    constructor(nativeId: string) {
        this.enableFilterNonExistsFiles = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableFilterNonExistsFilesId)) ?? false
        this.enableGetFaviconFromNet = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableGetFaviconFromNetId)) ?? false
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
