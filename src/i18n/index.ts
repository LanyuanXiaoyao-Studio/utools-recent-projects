import {EnUs} from './EnUs'
import {ZhCn} from './ZhCn'
import {I18n} from 'licia'

export const sentenceKey = {
    auto: 'auto',
    beta: 'beta',
    betaDesc: 'betaDesc',
    browser: 'browser',
    browserPathDescPrefix: 'browserPathDescPrefix',
    cloud: 'cloud',
    cloudDesc: 'cloudDesc',
    configFileAt: 'configFileAt',
    configPrefix: 'configPrefix',
    configSuffix: 'configSuffix',
    devTip: 'devTip',
    emptyTipsDesc: 'emptyTipsDesc',
    emptyTipsTitle: 'emptyTipsTitle',
    enableDesc: 'enableDesc',
    enableLabel: 'enableLabel',
    enhanceConfig: 'enhanceConfig',
    enhanceConfigChipDesc: 'enhanceConfigChipDesc',
    enhanceConfigDesc: 'enhanceConfigDesc',
    error: 'error',
    errorArgs: 'errorArgs',
    errorInfoToClipboard: 'errorInfoToClipboard',
    evernoteUserId: 'evernoteUserId',
    evernoteUserIdDesc: 'evernoteUserIdDesc',
    evernoteUserIdPlaceholder: 'evernoteUserIdPlaceholder',
    executorFileAt: 'executorFileAt',
    executorPrefix: 'executorPrefix',
    executorSuffix: 'executorSuffix',
    file: 'file',
    fileOpening: 'fileOpening',
    filePathNonExistsTips: 'filePathNonExistsTips',
    fileSelectorPlaceholder: 'fileSelectorPlaceholder',
    filterNonExistsFiles: 'filterNonExistsFiles',
    filterNonExistsFilesDesc: 'filterNonExistsFilesDesc',
    getFavicon: 'getFavicon',
    getFaviconDesc: 'getFaviconDesc',
    getFileIcon: 'getFileIcon',
    getFileIconDesc: 'getFileIconDesc',
    getProjectsError: 'getProjectsError',
    historyLimit: 'historyLimit',
    historyLimitDesc: 'historyLimitDesc',
    inputDirectlyPlaceholder: 'inputDirectlyPlaceholder',
    inputPathDirectly: 'inputPathDirectly',
    inputPathDirectlyDesc: 'inputPathDirectlyDesc',
    languageSetting: 'languageSetting',
    languageSettingDesc: 'languageSettingDesc',
    local: 'local',
    localDesc: 'localDesc',
    nativeId: 'nativeId',
    nativeIdDesc: 'nativeIdDesc',
    needReboot: 'needReboot',
    needRebootDesc: 'needRebootDesc',
    nonExistsFileOrDeleted: 'nonExistsFileOrDeleted',
    nonExistsPathOrCancel: 'nonExistsPathOrCancel',
    notifyFileOpen: 'notifyFileOpen',
    notifyFileOpenDesc: 'notifyFileOpenDesc',
    openInNew: 'openInNew',
    openInNewDesc: 'openInNewDesc',
    pathNotFound: 'pathNotFound',
    pinyinIndex: 'pinyinIndex',
    pinyinIndexDesc: 'pinyinIndexDesc',
    placeholder: 'placeholder',
    pluginSetting: 'pluginSetting',
    ready: 'ready',
    requestMoreApplication: 'requestMoreApplication',
    safariBookmarkDesc: 'safariBookmarkDesc',
    search: 'search',
    settingBetaDesc: 'settingBetaDesc',
    settingDocument: 'settingDocument',
    smartTag: 'smartTag',
    sourceCodeRepository: 'sourceCodeRepository',
    sqlite3: 'sqlite3',
    sqlite3Desc: 'sqlite3Desc',
    sqliteGlobal: 'sqliteGlobal',
    sqliteGlobalDesc: 'sqliteGlobalDesc',
    systemInformation: 'systemInformation',
    systemUser: 'systemUser',
    systemVersion: 'systemVersion',
    tag: 'tag',
    unSupportTipsDesc: 'unSupportTipsDesc',
    unSupportTipsTitle: 'unSupportTipsTitle',
    unknownError: 'unknownError',
    unknownInputError: 'unknownInputError',
    unready: 'unready',
    utoolsVersion: 'utoolsVersion',
    showBookmarkCatalogue: 'showBookmarkCatalogue',
    showBookmarkCatalogueDesc: 'showBookmarkCatalogueDesc',
    filePathInMatch: 'filePathInMatch',
    filePathInMatchDesc: 'filePathInMatchDesc',
}

export interface Sentence {
    readonly auto: string
    readonly beta: string
    readonly betaDesc: string
    readonly browser: string
    readonly browserPathDescPrefix: string
    readonly cloud: string
    readonly cloudDesc: string
    readonly configFileAt: string
    readonly configPrefix: string
    readonly configSuffix: string
    readonly devTip: string
    readonly emptyTipsDesc: string
    readonly emptyTipsTitle: string
    readonly enableDesc: string
    readonly enableLabel: string
    readonly enhanceConfig: string
    readonly enhanceConfigChipDesc: string
    readonly enhanceConfigDesc: string
    readonly error: string
    readonly errorArgs: string
    readonly errorInfoToClipboard: string
    readonly evernoteUserId: string
    readonly evernoteUserIdDesc: string
    readonly executorFileAt: string
    readonly executorPrefix: string
    readonly executorSuffix: string
    readonly file: string
    readonly fileOpening: string
    readonly filePathNonExistsTips: string
    readonly fileSelectorPlaceholder: string
    readonly filterNonExistsFiles: string
    readonly filterNonExistsFilesDesc: string
    readonly getFavicon: string
    readonly getFaviconDesc: string
    readonly getFileIcon: string
    readonly getFileIconDesc: string
    readonly getProjectsError: string
    readonly historyLimit: string
    readonly historyLimitDesc: string
    readonly inputDirectlyPlaceholder: string
    readonly inputPathDirectly: string
    readonly inputPathDirectlyDesc: string
    readonly languageSetting: string
    readonly languageSettingDesc: string
    readonly local: string
    readonly localDesc: string
    readonly nativeId: string
    readonly nativeIdDesc: string
    readonly needReboot: string
    readonly needRebootDesc: string
    readonly nonExistsFileOrDeleted: string
    readonly nonExistsPathOrCancel: string
    readonly notifyFileOpen: string
    readonly notifyFileOpenDesc: string
    readonly openInNew: string
    readonly openInNewDesc: string
    readonly pathNotFound: string
    readonly pinyinIndex: string
    readonly pinyinIndexDesc: string
    readonly placeholder: string
    readonly pluginSetting: string
    readonly ready: string
    readonly requestMoreApplication: string
    readonly safariBookmarkDesc: string
    readonly search: string
    readonly settingBetaDesc: string
    readonly settingDocument: string
    readonly smartTag: string
    readonly sourceCodeRepository: string
    readonly sqlite3: string
    readonly sqlite3Desc: string
    readonly sqliteGlobal: string
    readonly sqliteGlobalDesc: string
    readonly systemInformation: string
    readonly systemUser: string
    readonly systemVersion: string
    readonly tag: string
    readonly unSupportTipsDesc: string
    readonly unSupportTipsTitle: string
    readonly unknownError: string
    readonly unknownInputError: string
    readonly unready: string
    readonly utoolsVersion: string
    readonly showBookmarkCatalogue: string
    readonly showBookmarkCatalogueDesc: string
    readonly filePathInMatch: string
    readonly filePathInMatchDesc: string
}

let languageData = new I18n('zh-CN', {
    'zh-CN': { ...(new ZhCn()) },
    'en-US': { ...(new EnUs()) },
})
languageData.locale(navigator.language)

export const i18n = languageData
