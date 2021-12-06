export class Context {
    static languageSettingId: string = 'setting-language-setting'
    static enableFilterNonExistsFilesId: string = 'setting-filter-non-exists-files'
    static enableGetFaviconFromNetId: string = 'setting-get-favicon-from-net'
    static enableGetFileIconId: string = 'setting-get-file-icon'
    static enableOpenNotificationId: string = 'setting-open-notification'
    static enableEditPathInputDirectlyId: string = 'setting-edit-path-input-directly'
    static enablePinyinIndexId: string = 'setting-pinyin-index'
    static browserHistoryLimitId: string = 'browser-history-limit'

    readonly languageSetting: string = 'auto'
    readonly enableFilterNonExistsFiles: boolean = false
    readonly enableGetFaviconFromNet: boolean = false
    readonly enableGetFileIcon: boolean = false
    readonly enableOpenNotification: boolean = false
    readonly enableEditPathInputDirectly: boolean = false
    readonly enablePinyinIndex: boolean = true
    readonly browserHistoryLimit: number = 100

    constructor(nativeId: string) {
        this.languageSetting = utools.dbStorage.getItem(Context.languageSettingId) ?? 'auto'
        this.enableFilterNonExistsFiles = utools.dbStorage.getItem(Context.enableFilterNonExistsFilesId) ?? false
        this.enableGetFaviconFromNet = utools.dbStorage.getItem(Context.enableGetFaviconFromNetId) ?? false
        this.enableGetFileIcon = utools.dbStorage.getItem(Context.enableGetFileIconId) ?? false
        this.enableOpenNotification = utools.dbStorage.getItem(Context.enableOpenNotificationId) ?? false
        this.enablePinyinIndex = utools.dbStorage.getItem(Context.enablePinyinIndexId) ?? true
        this.browserHistoryLimit = parseInt(utools.dbStorage.getItem(Context.browserHistoryLimitId) ?? '100')
        // 本地生效
        this.enableEditPathInputDirectly = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableEditPathInputDirectlyId)) ?? false
    }

    static joinId(nativeId: string, id: string): string {
        return `${nativeId}/${id}`
    }

    static get(): Context {
        return new Context(utools.getNativeId())
    }

    static update(id: string, value: any): void {
        utools.dbStorage.setItem(id, value)
    }

    static updateNative(id: string, value: any): void {
        utools.dbStorage.setItem(Context.joinId(utools.getNativeId(), id), value)
    }

    static remove(id: string): void {
        utools.dbStorage.removeItem(id)
    }

    static removeNative(id: string) {
        utools.dbStorage.removeItem(Context.joinId(utools.getNativeId(), id))
    }
}
