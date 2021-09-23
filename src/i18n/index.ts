import {EnUs} from './en-us'
import {ZhCn} from './zh-cn'
import {I18n} from 'licia'

export const sentenceKey = {
    betaDesc: 'betaDesc',
    browserPathDescPrefix: 'browserPathDescPrefix',
    configPrefix: 'configPrefix',
    configSuffix: 'configSuffix',
    enableDesc: 'enableDesc',
    enableLabel: 'enableLabel',
    error: 'error',
    executorPrefix: 'executorPrefix',
    executorSuffix: 'executorSuffix',
    filePathNonExistsTips: 'filePathNonExistsTips',
    fileSelectorPlaceholder: 'fileSelectorPlaceholder',
    filterNonExistsFiles: 'filterNonExistsFiles',
    filterNonExistsFilesDesc: 'filterNonExistsFilesDesc',
    getFavicon: 'getFavicon',
    getFaviconDesc: 'getFaviconDesc',
    getFileIcon: 'getFileIcon',
    getFileIconDesc: 'getFileIconDesc',
    inputDirectlyPlaceholder: 'inputDirectlyPlaceholder',
    inputPathDirectly: 'inputPathDirectly',
    inputPathDirectlyDesc: 'inputPathDirectlyDesc',
    languageSetting: 'languageSetting',
    languageSettingDesc: 'languageSettingDesc',
    nativeId: 'nativeId',
    notifyFileOpen: 'notifyFileOpen',
    notifyFileOpenDesc: 'notifyFileOpenDesc',
    openInNew: 'openInNew',
    openInNewDesc: 'openInNewDesc',
    pluginSetting: 'pluginSetting',
    ready: 'ready',
    requestMoreApplication: 'requestMoreApplication',
    settingDocument: 'settingDocument',
    sourceCodeRepository: 'sourceCodeRepository',
    sqlite3: 'sqlite3',
    sqlite3Desc: 'sqlite3Desc',
    systemInformation: 'systemInformation',
    systemVersion: 'systemVersion',
    unready: 'unready',
    utoolsVersion: 'utoolsVersion',
    safariBookmarkDesc: 'safariBookmarkDesc',
}

export interface Sentence {
    readonly betaDesc: string
    readonly browserPathDescPrefix: string
    readonly configPrefix: string
    readonly configSuffix: string
    readonly enableDesc: string
    readonly enableLabel: string
    readonly error: string
    readonly executorPrefix: string
    readonly executorSuffix: string
    readonly filePathNonExistsTips: string
    readonly fileSelectorPlaceholder: string
    readonly filterNonExistsFiles: string
    readonly filterNonExistsFilesDesc: string
    readonly getFavicon: string
    readonly getFaviconDesc: string
    readonly getFileIcon: string
    readonly getFileIconDesc: string
    readonly inputDirectlyPlaceholder: string
    readonly inputPathDirectly: string
    readonly inputPathDirectlyDesc: string
    readonly languageSetting: string
    readonly languageSettingDesc: string
    readonly nativeId: string
    readonly notifyFileOpen: string
    readonly notifyFileOpenDesc: string
    readonly openInNew: string
    readonly openInNewDesc: string
    readonly pluginSetting: string
    readonly ready: string
    readonly requestMoreApplication: string
    readonly settingDocument: string
    readonly sourceCodeRepository: string
    readonly sqlite3: string
    readonly sqlite3Desc: string
    readonly systemInformation: string
    readonly systemVersion: string
    readonly unready: string
    readonly utoolsVersion: string
    readonly safariBookmarkDesc: string
}

let languageData = new I18n('zh-CN', {
    'zh-CN': { ...(new ZhCn()) },
    'en-US': { ...(new EnUs()) },
})
languageData.locale(navigator.language)

export const i18n = languageData
