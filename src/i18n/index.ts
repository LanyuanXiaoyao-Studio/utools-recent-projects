import {I18n} from 'licia'
import {EnUs} from './EnUs'
import {ZhCn} from './ZhCn'

export const sentenceKey = {
    auto: 'auto',
    beta: 'beta',
    betaDesc: 'betaDesc',
    browser: 'browser',
    browserPathDescPrefix: 'browserPathDescPrefix',
    catalogueSearchPlaceHolder: 'catalogueSearchPlaceHolder',
    catsxpBrowser: 'catsxpBrowser',
    centBrowser: 'centBrowser',
    cloud: 'cloud',
    cloudDesc: 'cloudDesc',
    configFileAt: 'configFileAt',
    configPrefix: 'configPrefix',
    configSuffix: 'configSuffix',
    deepinBrowser: 'deepinBrowser',
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
    evernote: 'evernote',
    evernoteUserId: 'evernoteUserId',
    evernoteUserIdDesc: 'evernoteUserIdDesc',
    evernoteUserIdPlaceholder: 'evernoteUserIdPlaceholder',
    executorFileAt: 'executorFileAt',
    executorPrefix: 'executorPrefix',
    executorSuffix: 'executorSuffix',
    file: 'file',
    fileOpening: 'fileOpening',
    filePathInMatch: 'filePathInMatch',
    filePathInMatchDesc: 'filePathInMatchDesc',
    filePathNonExistsTips: 'filePathNonExistsTips',
    fileSelectorPlaceholder: 'fileSelectorPlaceholder',
    filterNonExistsFiles: 'filterNonExistsFiles',
    filterNonExistsFilesDesc: 'filterNonExistsFilesDesc',
    fullUrlInMatch: 'fullUrlInMatch',
    fullUrlInMatchDesc: 'fullUrlInMatchDesc',
    getFavicon: 'getFavicon',
    getFaviconDesc: 'getFaviconDesc',
    getFileIcon: 'getFileIcon',
    getFileIconDesc: 'getFileIconDesc',
    getProjectsError: 'getProjectsError',
    historyLimit: 'historyLimit',
    historyLimitDesc: 'historyLimitDesc',
    huaweiBrowser: 'huaweiBrowser',
    inputDirectlyPlaceholder: 'inputDirectlyPlaceholder',
    inputPathDirectly: 'inputPathDirectly',
    inputPathDirectlyDesc: 'inputPathDirectlyDesc',
    languageSetting: 'languageSetting',
    languageSettingDesc: 'languageSettingDesc',
    liebaoBrowser: 'liebaoBrowser',
    local: 'local',
    localDesc: 'localDesc',
    maxthonBrowser: 'maxthonBrowser',
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
    outPluginImmediately: 'outPluginImmediately',
    outPluginImmediatelyDesc: 'outPluginImmediatelyDesc',
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
    shortcuts: 'shortcuts',
    showBookmarkCatalogue: 'showBookmarkCatalogue',
    showBookmarkCatalogueDesc: 'showBookmarkCatalogueDesc',
    smartTag: 'smartTag',
    sourceCodeRepository: 'sourceCodeRepository',
    systemInformation: 'systemInformation',
    systemUser: 'systemUser',
    systemVersion: 'systemVersion',
    tag: 'tag',
    twinkstarBrowser: 'twinkstarBrowser',
    unknownError: 'unknownError',
    unknownInputError: 'unknownInputError',
    unready: 'unready',
    unSupportTipsDesc: 'unSupportTipsDesc',
    unSupportTipsTitle: 'unSupportTipsTitle',
    utoolsVersion: 'utoolsVersion',
    xiaobaiBrowser: 'xiaobaiBrowser',
    homepage: 'homepage',
    clickToOpen: 'clickToOpen',
    roundTips: 'roundTips',
    roundCloseTips: 'roundCloseTips',
    unlimited: 'unlimited',
    decreasePerformance: 'decreasePerformance',
    decreasePerformanceDesc: 'decreasePerformanceDesc',
}

export interface Sentence {
    readonly auto: string
    readonly beta: string
    readonly betaDesc: string
    readonly browser: string
    readonly browserPathDescPrefix: string
    readonly catalogueSearchPlaceHolder: string
    readonly catsxpBrowser: string
    readonly centBrowser: string
    readonly cloud: string
    readonly cloudDesc: string
    readonly configFileAt: string
    readonly configPrefix: string
    readonly configSuffix: string
    readonly deepinBrowser: string
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
    readonly evernote: string
    readonly evernoteUserId: string
    readonly evernoteUserIdDesc: string
    readonly executorFileAt: string
    readonly executorPrefix: string
    readonly executorSuffix: string
    readonly file: string
    readonly fileOpening: string
    readonly filePathInMatch: string
    readonly filePathInMatchDesc: string
    readonly filePathNonExistsTips: string
    readonly fileSelectorPlaceholder: string
    readonly filterNonExistsFiles: string
    readonly filterNonExistsFilesDesc: string
    readonly fullUrlInMatch: string
    readonly fullUrlInMatchDesc: string
    readonly getFavicon: string
    readonly getFaviconDesc: string
    readonly getFileIcon: string
    readonly getFileIconDesc: string
    readonly getProjectsError: string
    readonly historyLimit: string
    readonly historyLimitDesc: string
    readonly huaweiBrowser: string
    readonly inputDirectlyPlaceholder: string
    readonly inputPathDirectly: string
    readonly inputPathDirectlyDesc: string
    readonly languageSetting: string
    readonly languageSettingDesc: string
    readonly liebaoBrowser: string
    readonly local: string
    readonly localDesc: string
    readonly maxthonBrowser: string
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
    readonly outPluginImmediately: string
    readonly outPluginImmediatelyDesc: string
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
    readonly shortcuts: string
    readonly showBookmarkCatalogue: string
    readonly showBookmarkCatalogueDesc: string
    readonly smartTag: string
    readonly sourceCodeRepository: string
    readonly systemInformation: string
    readonly systemUser: string
    readonly systemVersion: string
    readonly tag: string
    readonly twinkstarBrowser: string
    readonly unknownError: string
    readonly unknownInputError: string
    readonly unready: string
    readonly unSupportTipsDesc: string
    readonly unSupportTipsTitle: string
    readonly utoolsVersion: string
    readonly xiaobaiBrowser: string
    readonly homepage: string
    readonly clickToOpen: string
    readonly roundTips: string
    readonly roundCloseTips: string
    readonly unlimited: string
    readonly decreasePerformance: string
    readonly decreasePerformanceDesc: string
}

let languageData = new I18n('zh-CN', {
    'zh-CN': { ...(new ZhCn()) },
    'en-US': { ...(new EnUs()) },
})
languageData.locale(navigator.language)

export const i18n = languageData
