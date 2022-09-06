export class Context {
    static languageSettingId: string = 'setting-language-setting'
    static enableFilterNonExistsFilesId: string = 'setting-filter-non-exists-files'
    static enableGetFaviconFromNetId: string = 'setting-get-favicon-from-net'
    static enableGetFileIconId: string = 'setting-get-file-icon'
    static enableOpenNotificationId: string = 'setting-open-notification'
    static enableEditPathInputDirectlyId: string = 'setting-edit-path-input-directly'
    static enablePinyinIndexId: string = 'setting-pinyin-index'
    static browserHistoryLimitId: string = 'setting-browser-history-limit'
    static enableEnhanceConfigId: string = 'setting-enhance-config'
    static enableShowBookmarkCatalogueId: string = 'setting-show-bookmark-catalogue'
    static enableFilePathInMatchId: string = 'setting-file-path-in-match'
    static enableFullUrlInMatchId: string = 'setting-full-url-in-match'
    static enableOutPluginImmediatelyId: string = 'setting-out-plugin-immediately'
    static enableRoundRoundId: string = 'setting-round-round'
    readonly isDev: boolean
    readonly languageSetting: string = 'auto'
    readonly enableFilterNonExistsFiles: boolean = false
    readonly enableGetFaviconFromNet: boolean = false
    readonly enableGetFileIcon: boolean = false
    readonly enableOpenNotification: boolean = false
    readonly enableEditPathInputDirectly: boolean = false
    readonly enablePinyinIndex: boolean = true
    readonly browserHistoryLimit: number = 100
    readonly enableEnhanceConfig: boolean = false
    readonly enableShowBookmarkCatalogue: boolean = true
    readonly enableFilePathInMatch: boolean = true
    readonly enableFullUrlInMatch: boolean = false
    readonly enableOutPluginImmediately: boolean = true
    readonly enableRoundRound: boolean = false

    constructor(nativeId: string) {
        this.isDev = utools.isDev() ?? false

        this.languageSetting = utools.dbStorage.getItem(Context.languageSettingId) ?? 'auto'
        this.enableFilterNonExistsFiles = utools.dbStorage.getItem(Context.enableFilterNonExistsFilesId) ?? false
        this.enableGetFaviconFromNet = utools.dbStorage.getItem(Context.enableGetFaviconFromNetId) ?? false
        this.enableGetFileIcon = utools.dbStorage.getItem(Context.enableGetFileIconId) ?? false
        this.enableOpenNotification = utools.dbStorage.getItem(Context.enableOpenNotificationId) ?? false
        this.enablePinyinIndex = utools.dbStorage.getItem(Context.enablePinyinIndexId) ?? true
        this.browserHistoryLimit = parseInt(utools.dbStorage.getItem(Context.browserHistoryLimitId) ?? '100')
        this.enableEnhanceConfig = utools.dbStorage.getItem(Context.enableEnhanceConfigId) ?? false
        this.enableShowBookmarkCatalogue = utools.dbStorage.getItem(Context.enableShowBookmarkCatalogueId) ?? true
        this.enableFilePathInMatch = utools.dbStorage.getItem(Context.enableFilePathInMatchId) ?? true
        this.enableFullUrlInMatch = utools.dbStorage.getItem(Context.enableFullUrlInMatchId) ?? false
        this.enableEditPathInputDirectly = utools.dbStorage.getItem(Context.joinId(nativeId, Context.enableEditPathInputDirectlyId)) ?? false
        this.enableOutPluginImmediately = utools.dbStorage.getItem(Context.enableOutPluginImmediatelyId) ?? true
        this.enableRoundRound = utools.dbStorage.getItem(Context.enableRoundRoundId) ?? false
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
