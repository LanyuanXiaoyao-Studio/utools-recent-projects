import {EnUs} from './en-us'
import {ZhCn} from './zh-cn'
import {I18n} from 'licia'

export const sentenceKey = {
    enableDesc: 'enableDesc',
    enableLabel: 'enableLabel',
    filterNonExistsFiles: 'filterNonExistsFiles',
    filterNonExistsFilesDesc: 'filterNonExistsFilesDesc',
    getFavicon: 'getFavicon',
    getFaviconDesc: 'getFaviconDesc',
    getFileIcon: 'getFileIcon',
    getFileIconDesc: 'getFileIconDesc',
    inputPathDirectly: 'inputPathDirectly',
    inputPathDirectlyDesc: 'inputPathDirectlyDesc',
    languageSetting: 'languageSetting',
    languageSettingDesc: 'languageSettingDesc',
    nativeId: 'nativeId',
    notifyFileOpen: 'notifyFileOpen',
    notifyFileOpenDesc: 'notifyFileOpenDesc',
    pluginSetting: 'pluginSetting',
    requestMoreApplication: 'requestMoreApplication',
    settingDocument: 'settingDocument',
    sourceCodeRepository: 'sourceCodeRepository',
    systemInformation: 'systemInformation',
    systemVersion: 'systemVersion',
    utoolsVersion: 'utoolsVersion',
    configPrefix: 'configPrefix',
    configSuffix: 'configSuffix',
    executorPrefix: 'executorPrefix',
    executorSuffix: 'executorSuffix',
    unready: 'unready',
    ready: 'ready',
    error: 'error',
    inputDirectlyPlaceholder: 'inputDirectlyPlaceholder',
    fileSelectorPlaceholder: 'fileSelectorPlaceholder',
    filePathNonExistsTips: 'filePathNonExistsTips',
    openInNew: 'openInNew',
    openInNewDesc: 'openInNewDesc',
    sqlite3: 'sqlite3',
    sqlite3Desc: 'sqlite3Desc',
    browserPathDescPrefix: 'browserPathDescPrefix',
}

export interface Sentence {
    readonly enableDesc: string
    readonly enableLabel: string
    readonly filterNonExistsFiles: string
    readonly filterNonExistsFilesDesc: string
    readonly getFavicon: string
    readonly getFaviconDesc: string
    readonly getFileIcon: string
    readonly getFileIconDesc: string
    readonly inputPathDirectly: string
    readonly inputPathDirectlyDesc: string
    readonly languageSetting: string
    readonly languageSettingDesc: string
    readonly nativeId: string
    readonly notifyFileOpen: string
    readonly notifyFileOpenDesc: string
    readonly pluginSetting: string
    readonly requestMoreApplication: string
    readonly settingDocument: string
    readonly sourceCodeRepository: string
    readonly systemInformation: string
    readonly systemVersion: string
    readonly utoolsVersion: string
    readonly configPrefix: string
    readonly configSuffix: string
    readonly executorPrefix: string
    readonly executorSuffix: string
    readonly unready: string
    readonly ready: string
    readonly error: string
    readonly inputDirectlyPlaceholder: string
    readonly fileSelectorPlaceholder: string
    readonly filePathNonExistsTips: string
    readonly openInNew: string
    readonly openInNewDesc: string
    readonly sqlite3: string
    readonly sqlite3Desc: string
    readonly browserPathDescPrefix: string
}

let languageData = new I18n('zh-CN', {
    'zh-CN': { ...(new ZhCn()) },
    'en-US': { ...(new EnUs()) },
})
languageData.locale(navigator.language)

export const i18n = languageData
