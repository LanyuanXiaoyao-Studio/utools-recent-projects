import {Sentence} from './index'

export class EnUs implements Sentence {
    readonly betaDesc: string = `beta means that this adaption
is in preview version
I can't test all the use scenes
I need you submit the feedback 
when you meet some error`
    readonly browserPathDescPrefix: string = 'file usually at: '
    readonly configPrefix: string = 'Configure'
    readonly configSuffix: string = 'file path'
    readonly enableDesc: string = 'Closing this option will be as if this application is not configured'
    readonly enableLabel: string = 'Enable'
    readonly error: string = 'Error'
    readonly executorPrefix: string = 'Configure'
    readonly executorSuffix: string = 'executable file path'
    readonly filePathNonExistsTips: string = 'File path is non-exists'
    readonly fileSelectorPlaceholder: string = 'Click the input to select file'
    readonly filterNonExistsFiles: string = 'Filter non-exists\' files'
    readonly filterNonExistsFilesDesc: string = 'The plugin will display the history content, just like the software itself, but if you want the plugin to filter out the non-exists files, then you can consider enabling this option.'
    readonly getFavicon: string = 'Get favicon for website'
    readonly getFaviconDesc: string = 'Enable this option, the plugin would use the 「api.clowntool.cn」 to get the website icon and show it in the result instead of the browser icon, but the API may slow; Plugin need to send the URL to this API, the privacy problem is also best considering within'
    readonly getFileIcon: string = 'Get file icon from system'
    readonly getFileIconDesc: string = 'Enable this option, Plugin would get the file icon from system and display it in the result, but this will affect some performance, which is not recommended on low-performance machines.'
    readonly inputDirectlyPlaceholder: string = 'Input the file path'
    readonly inputPathDirectly: string = 'Input path directly (Without file selector)'
    readonly inputPathDirectlyDesc: string = 'Enable this option to input the path directly instead of the file selector. But it is also easy for running error because the path is incorrect.'
    readonly languageSetting: string = 'Language'
    readonly languageSettingDesc: string = 'Although uTools has almost no foreign users, you can also choose language.'
    readonly nativeId: string = 'Native ID'
    readonly notifyFileOpen: string = 'Notify when file is opened'
    readonly notifyFileOpenDesc: string = 'Enable this option, The system notification is pop-up when the project is turned on, and some software opens the project requires a certain startup time, which is intended to help the user confirm the operating status of the plugin.'
    readonly openInNew: string = 'Open In New Window'
    readonly openInNewDesc: string = 'Always open in new window if target is folder'
    readonly pluginSetting: string = 'Setting'
    readonly ready: string = 'Complete'
    readonly requestMoreApplication: string = 'Apply More Adaption'
    readonly settingDocument: string = 'Document'
    readonly sourceCodeRepository: string = 'Source Code'
    readonly sqlite3: string = 'Configure Sqlite3 executable file path'
    readonly sqlite3Desc: string = 'Read the data needs Sqlite3 cli, you can go to「https://www.sqlite.org/download.html」and download the cli'
    readonly systemInformation: string = 'System Information'
    readonly systemVersion: string = 'System Version'
    readonly unready: string = 'Incomplete'
    readonly utoolsVersion: string = 'uTools Version'
    readonly safariBookmarkDesc: string = `Safari bookmark path is not need to configure.`
}
