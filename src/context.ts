export class Context {
    static languageSettingId: string = 'language-setting'
    static enableFilterNonExistsFilesId: string = 'setting-filter-non-exists-files'
    static enableGetFaviconFromNetId: string = 'setting-get-favicon-from-net'
    static enableGetFileIconId: string = 'setting-get-file-icon'
    static enableOpenNotificationId: string = 'setting-open-notification'
    static enableEditPathInputDirectlyId: string = 'setting-edit-path-input-directly'

    readonly languageSetting: string = 'auto'
    readonly enableFilterNonExistsFiles: boolean = false
    readonly enableGetFaviconFromNet: boolean = false
    readonly enableGetFileIcon: boolean = false
    readonly enableOpenNotification: boolean = false
    readonly enableEditPathInputDirectly: boolean = false

    constructor(nativeId: string) {
        this.languageSetting = utools.dbStorage.getItem(Context.joinId(nativeId, Context.languageSettingId)) ?? 'auto'
        this.enableFilterNonExistsFiles = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableFilterNonExistsFilesId)) ?? false
        this.enableGetFaviconFromNet = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableGetFaviconFromNetId)) ?? false
        this.enableGetFileIcon = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableGetFileIconId)) ?? false
        this.enableOpenNotification = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableOpenNotificationId)) ?? false
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
