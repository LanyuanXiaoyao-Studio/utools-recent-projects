import {Sentence} from './index'

export class EnUs implements Sentence {
    readonly auto: string = 'Auto'
    readonly beta: string = 'Beta'
    readonly betaDesc: string = `beta means that this adaption\nis in preview version\nI can't test all the use scenes\nI need you submit the feedback \nwhen you meet some error`
    readonly browser: string = 'Browser'
    readonly browserPathDescPrefix: string = 'file usually at: '
    readonly catalogueSearchPlaceHolder: string = 'Search and filter adapter'
    readonly cloud: string = 'Global'
    readonly cloudDesc: string = 'Sync this setting on device that\nlogin with the same account'
    readonly configFileAt: string = 'Config file usually at'
    readonly configPrefix: string = 'Configure'
    readonly configSuffix: string = 'file path'
    readonly devTip: string = 'In development mode now'
    readonly emptyTipsDesc: string = 'If you are not configure this program, please configure it in the setting page. Click this to setting page'
    readonly emptyTipsTitle: string = 'Found nothing'
    readonly enableDesc: string = 'Closing this option will be as if this application is not configured'
    readonly enableLabel: string = 'Enable'
    readonly enhanceConfig: string = 'Advanced Options'
    readonly enhanceConfigChipDesc: string = 'If you cannot understand this option\ndo not change it'
    readonly enhanceConfigDesc: string = 'Enable this option, it will show advanced options, you can configure the plugin in more behavior.'
    readonly error: string = 'Error'
    readonly errorArgs: string = 'Arguments error, feedback please'
    readonly errorInfoToClipboard: string = 'Error message is copied to clipboard'
    readonly evernoteUserId: string = 'User ID'
    readonly evernoteUserIdDesc: string = 'About "How to find my evernote user id" is in 「https://yuanliao.info/d/3978-300/80」'
    readonly executorFileAt: string = 'Executor file usually at'
    readonly executorPrefix: string = 'Configure'
    readonly executorSuffix: string = 'executable file path'
    readonly file: string = 'File'
    readonly fileOpening: string = 'Opening'
    readonly filePathInMatch: string = 'Add file path to index of search'
    readonly filePathInMatchDesc: string = 'Enable this option would add file path to index of search for history that type is file, it is useful for who is disturbed by file path when search can close this option.'
    readonly filePathNonExistsTips: string = 'File path is non-exists'
    readonly fileSelectorPlaceholder: string = 'Click the input to select file'
    readonly filterNonExistsFiles: string = 'Filter non-exists\' files'
    readonly filterNonExistsFilesDesc: string = 'The plugin will display the history content, just like the software itself, but if you want the plugin to filter out the non-exists files, then you can consider enabling this option.'
    readonly fullUrlInMatch: string = 'Add full url to index of search'
    readonly fullUrlInMatchDesc: string = 'Enable this option would add full url to index of search for history that type is URL, it is useful for who want to search the query params of the url.'
    readonly getFavicon: string = 'Get favicon for website'
    readonly getFaviconDesc: string = 'Enable this option, the plugin would use the 「f1.allesedv.com」 to get the website icon and show it in the result instead of the browser icon, but the API may slow; Plugin need to send the URL to this API, the privacy problem is also best considering within'
    readonly getFileIcon: string = 'Get file icon from system'
    readonly getFileIconDesc: string = 'Enable this option, Plugin would get the file icon from system and display it in the result, but this will affect some performance, which is not recommended on low-performance machines.'
    readonly getProjectsError: string = 'Error for getting projects, check settings please'
    readonly historyLimit: string = 'History limit'
    readonly historyLimitDesc: string = 'Set the max of history item, but you need to know that it configure single browser\'s max, if you set 200 at this, and have configured 2 browser, finally you will get 400 history item.'
    readonly inputDirectlyPlaceholder: string = 'Input the file path'
    readonly inputPathDirectly: string = 'Input path directly'
    readonly inputPathDirectlyDesc: string = 'Enable this option to input the \npath directly instead of the file selector. But it is also easy for running error because the path is incorrect.'
    readonly languageSetting: string = 'Language'
    readonly languageSettingDesc: string = 'Although uTools has almost no foreign users, you can also choose language.'
    readonly local: string = 'Local'
    readonly localDesc: string = 'The setting is active on current device only'
    readonly nativeId: string = 'Native ID'
    readonly nativeIdDesc: string = `Native ID is used to identify the prefix of the configuration item.\nNative configuration could be \nfound in「账号与数据」`
    readonly needReboot: string = 'Reboot plugin needed'
    readonly needRebootDesc: string = 'Close all window of plugin and reopen it'
    readonly nonExistsFileOrDeleted: string = 'Path non-exists or deleted'
    readonly nonExistsPathOrCancel: string = 'Path non-exists or you cancel the selector'
    readonly notifyFileOpen: string = 'Notify when file is opened'
    readonly notifyFileOpenDesc: string = 'Enable this option, The system notification is pop-up when the project is turned on, and some software opens the project requires a certain startup time, which is intended to help the user confirm the operating status of the plugin.'
    readonly openInNew: string = 'Open In New Window'
    readonly openInNewDesc: string = 'Always open in new window if target is folder'
    readonly pathNotFound: string = 'Path not found'
    readonly pinyinIndex: string = 'Pinyin & First Letter Index'
    readonly pinyinIndexDesc: string = 'Enable this option, it will create the Pinyin and Pinyin first letter index for results, but decrease the performance'
    readonly placeholder: string = 'Search, support pinyin and first letter.'
    readonly pluginSetting: string = 'Setting'
    readonly ready: string = 'Complete'
    readonly requestMoreApplication: string = 'Apply More Adaption'
    readonly safariBookmarkDesc: string = 'Safari bookmark path is not need to configure.'
    readonly search: string = 'Search'
    readonly settingBetaDesc: string = 'The setting is in preview\nIt may be remove in the feature'
    readonly settingDocument: string = 'Document'
    readonly showBookmarkCatalogue: string = 'Show bookmark catalogue'
    readonly showBookmarkCatalogueDesc: string = 'Enable this option would show the catalogue of the bookmark item before the result item\'s title, it is useful for who want to search the keyword in catalogue name'
    readonly smartTag: string = 'Smart Tag'
    readonly sourceCodeRepository: string = 'Source Code'
    readonly sqlite3: string = 'Configure Sqlite3 executable file path'
    readonly sqlite3Desc: string = 'Read the data needs Sqlite3 cli, you can go to「https://www.sqlite.org/download.html」and download the cli'
    readonly sqliteGlobal: string = 'SQLite executor path (Global)'
    readonly sqliteGlobalDesc: string = 'This path would be used by any software that need to parse SQLite database config, and you can override it in specific configuration.'
    readonly systemInformation: string = 'System Information'
    readonly systemUser: string = 'System User'
    readonly systemVersion: string = 'System Version'
    readonly tag: string = 'Tag'
    readonly unknownError: string = 'Unknown error, feedback please'
    readonly unknownInputError: string = 'Unknown input error'
    readonly unready: string = 'Incomplete'
    readonly unSupportTipsDesc: string = 'The current keyword corresponds to the historical project index does not support the current platform. If you affect your daily operation, you can disable in the plugin details.'
    readonly unSupportTipsTitle: string = 'Feature is not support this platform'
    readonly utoolsVersion: string = 'uTools Version'
}
