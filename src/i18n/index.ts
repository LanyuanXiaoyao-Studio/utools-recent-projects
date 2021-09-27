import {EnUs} from './en-us'
import {ZhCn} from './zh-cn'
import {I18n} from 'licia'

export const sentenceKey = {
    betaDesc: 'betaDesc',
    browserPathDescPrefix: 'browserPathDescPrefix',
    configPrefix: 'configPrefix',
    configSuffix: 'configSuffix',
    emptyTipsDesc: 'emptyTipsDesc',
    emptyTipsTitle: 'emptyTipsTitle',
    enableDesc: 'enableDesc',
    enableLabel: 'enableLabel',
    error: 'error',
    errorArgs: 'errorArgs',
    errorInfoToClipboard: 'errorInfoToClipboard',
    executorPrefix: 'executorPrefix',
    executorSuffix: 'executorSuffix',
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
    inputDirectlyPlaceholder: 'inputDirectlyPlaceholder',
    inputPathDirectly: 'inputPathDirectly',
    inputPathDirectlyDesc: 'inputPathDirectlyDesc',
    languageSetting: 'languageSetting',
    languageSettingDesc: 'languageSettingDesc',
    nativeId: 'nativeId',
    nativeIdDesc: 'nativeIdDesc',
    needReboot: 'needReboot',
    nonExistsFileOrDeleted: 'nonExistsFileOrDeleted',
    nonExistsPathOrCancel: 'nonExistsPathOrCancel',
    notifyFileOpen: 'notifyFileOpen',
    notifyFileOpenDesc: 'notifyFileOpenDesc',
    openInNew: 'openInNew',
    openInNewDesc: 'openInNewDesc',
    pathNotFound: 'pathNotFound',
    pluginSetting: 'pluginSetting',
    ready: 'ready',
    requestMoreApplication: 'requestMoreApplication',
    safariBookmarkDesc: 'safariBookmarkDesc',
    settingDocument: 'settingDocument',
    sourceCodeRepository: 'sourceCodeRepository',
    sqlite3: 'sqlite3',
    sqlite3Desc: 'sqlite3Desc',
    systemInformation: 'systemInformation',
    systemVersion: 'systemVersion',
    unknownError: 'unknownError',
    unknownInputError: 'unknownInputError',
    unready: 'unready',
    unSupportTipsTitle: 'unSupportTipsTitle',
    unSupportTipsDesc: 'unSupportTipsDesc',
    utoolsVersion: 'utoolsVersion',
}

export interface Sentence {
    readonly betaDesc: string
    readonly browserPathDescPrefix: string
    readonly configPrefix: string
    readonly configSuffix: string
    readonly emptyTipsDesc: string
    readonly emptyTipsTitle: string
    readonly enableDesc: string
    readonly enableLabel: string
    readonly error: string
    readonly errorArgs: string
    readonly errorInfoToClipboard: string
    readonly executorPrefix: string
    readonly executorSuffix: string
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
    readonly inputDirectlyPlaceholder: string
    readonly inputPathDirectly: string
    readonly inputPathDirectlyDesc: string
    readonly languageSetting: string
    readonly languageSettingDesc: string
    readonly nativeId: string
    readonly nativeIdDesc: string
    readonly needReboot: string
    readonly nonExistsFileOrDeleted: string
    readonly nonExistsPathOrCancel: string
    readonly notifyFileOpen: string
    readonly notifyFileOpenDesc: string
    readonly openInNew: string
    readonly openInNewDesc: string
    readonly pathNotFound: string
    readonly pluginSetting: string
    readonly ready: string
    readonly requestMoreApplication: string
    readonly safariBookmarkDesc: string
    readonly settingDocument: string
    readonly sourceCodeRepository: string
    readonly sqlite3: string
    readonly sqlite3Desc: string
    readonly systemInformation: string
    readonly systemVersion: string
    readonly unknownError: string
    readonly unknownInputError: string
    readonly unready: string
    readonly unSupportTipsDesc: string
    readonly unSupportTipsTitle: string
    readonly utoolsVersion: string
}

let languageData = new I18n('zh-CN', {
    'zh-CN': { ...(new ZhCn()) },
    'en-US': { ...(new EnUs()) },
})
languageData.locale(navigator.language)

export const i18n = languageData
