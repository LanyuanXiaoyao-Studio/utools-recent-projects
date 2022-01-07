import {Sentence} from './index'

export class ZhCn implements Sentence {
    readonly auto: string = '自动'
    readonly beta: string = '测试'
    readonly betaDesc: string = `beta 意味着这个功能处于试验阶段\n但我无法测试所有使用场景\n需要你在遇到无法正常使用的时候积极向我反馈`
    readonly browser: string = '浏览器'
    readonly browserPathDescPrefix: string = '文件通常放在: '
    readonly cloud: string = '全局'
    readonly cloudDesc: string = '同账号的设备同步该设置'
    readonly configFileAt: string = '配置文件通常放在'
    readonly configPrefix: string = '设置'
    readonly configSuffix: string = '文件路径'
    readonly devTip: string = '当前处于开发模式'
    readonly emptyTipsDesc: string = '如果你还没有设置该软件的相关配置，请先在 Setting 关键字中设置相关配置内容，点击可跳转设置界面'
    readonly emptyTipsTitle: string = '似乎什么都找不到'
    readonly enableDesc: string = '关闭这个选项将如同没有配置这个应用适配一样'
    readonly enableLabel: string = '是否启用该应用'
    readonly error: string = '有错误'
    readonly errorArgs: string = '参数错误，请向作者反馈'
    readonly errorInfoToClipboard: string = '错误信息已复制到剪贴板'
    readonly evernoteUserId: string = '用户 ID'
    readonly evernoteUserIdDesc: string = '在「https://yuanliao.info/d/3978-300/80」查看如何获取印象笔记用户 ID'
    readonly executorFileAt: string = '可执行文件通常放在'
    readonly executorPrefix: string = '设置'
    readonly executorSuffix: string = '可执行程序路径'
    readonly file: string = '文件'
    readonly fileOpening: string = '正在打开项目'
    readonly filePathNonExistsTips: string = '文件路径不存在'
    readonly fileSelectorPlaceholder: string = '点击输入框选择路径'
    readonly filterNonExistsFiles: string = '过滤不存在的文件'
    readonly filterNonExistsFilesDesc: string = '插件会如实显示历史记录内容，如同软件本身一样，但如果你希望插件替你将不存在的文件过滤掉，那么可以考虑启用该选项'
    readonly getFavicon: string = '获取 favicon'
    readonly getFaviconDesc: string = '启动该选项可以使用互联网提供的「f1.allesedv.com」来获取网站图标显示在结果里代替浏览器图标，但该 API 较慢; 另由于需要将网址传到该 API，隐私问题也最好考虑在内'
    readonly getFileIcon: string = '获取文件图标'
    readonly getFileIconDesc: string = '启动该选项可以在文件型历史记录的结果里显示系统文件图标作为 Icon，但这会影响一些性能，在低性能的机器上不建议开启'
    readonly getProjectsError: string = '获取项目记录错误，请检查配置'
    readonly historyLimit: string = '历史记录获取条数'
    readonly historyLimitDesc: string = '可以设置历史记录获取的最大数量，值得注意的是这是单个浏览器的限制而不是总的数量，如果设置数量为200，浏览器配置了2个，那么最大获取历史记录的数量为400'
    readonly inputDirectlyPlaceholder: string = '输入文件路径'
    readonly inputPathDirectly: string = '直接输入路径'
    readonly inputPathDirectlyDesc: string = '启动该选项可直接在路径框中输入路径而非使用文件选择器，特殊情况可能会带来方便，但也容易因为人为输入失误导致插件运行错误。（重启插件指完全退出插件后再次打开设置）'
    readonly languageSetting: string = '语言设置'
    readonly languageSettingDesc: string = '尽管 uTools 几乎没有国外用户，但还是可以选择其他语言'
    readonly local: string = '本地'
    readonly localDesc: string = '该设置仅本地生效'
    readonly nativeId: string = 'Native ID'
    readonly nativeIdDesc: string = `Native ID 用于标识配置文件项的前缀\n本机配置文件可以在「账号与数据」中找到`
    readonly needReboot: string = '重启插件生效'
    readonly needRebootDesc: string = '完全关闭插件所有页面再重新打开'
    readonly nonExistsFileOrDeleted: string = '路径指示的文件不存在或已被删除'
    readonly nonExistsPathOrCancel: string = '路径不存在或是您主动取消选择'
    readonly notifyFileOpen: string = '项目打开通知'
    readonly notifyFileOpenDesc: string = '启动该选项会在打开项目时弹出系统通知，部分软件打开项目需要一定的启动时间，该设置旨在帮助用户确认插件的运行状态'
    readonly openInNew: string = '新窗口打开'
    readonly openInNewDesc: string = '如果打开的是文件夹，无论是否打开该选项，都将在新窗口打开'
    readonly pathNotFound: string = '文件不存在'
    readonly pinyinIndex: string = '使用拼音及拼音首字母搜索'
    readonly pinyinIndexDesc: string = '启动该选项会使插件生成书签和历史记录名称的拼音和拼音首字母索引供搜索，但在结果多的时候会影响插件打开后的首次检索速度'
    readonly placeholder: string = '快速搜索结果，支持全拼和拼音首字母'
    readonly pluginSetting: string = '插件配置'
    readonly ready: string = '已配置'
    readonly requestMoreApplication: string = '适配更多软件'
    readonly safariBookmarkDesc: string = 'Safari 书签配置固定，无需额外配置'
    readonly search: string = '搜索'
    readonly settingBetaDesc: string = '该设置处于预览\n之后可能会被移除'
    readonly settingDocument: string = '配置文档'
    readonly smartTag: string = 'AI 标签'
    readonly sourceCodeRepository: string = '源码主页'
    readonly sqlite3: string = '设置 Sqlite3 可执行程序路径'
    readonly sqlite3Desc: string = '读取数据需要使用 Sqlite3 命令行程序，可以自行前往「https://www.sqlite.org/download.html」下载对应平台的可执行文件'
    readonly sqliteGlobal: string = 'SQLite 可执行文件路径 (全局配置)'
    readonly sqliteGlobalDesc: string = '该选项可支持需要使用 SQLite 解析配置文件的软件使用同样的 SQLite 可执行文件路径，在具体的配置中也可以覆盖该选项的路径'
    readonly systemInformation: string = '系统信息'
    readonly systemUser: string = 'System 用户'
    readonly systemVersion: string = 'System 版本'
    readonly tag: string = '标签'
    readonly unknownError: string = '未知错误，请向作者反馈'
    readonly unknownInputError: string = '出现未知的输入错误'
    readonly unready: string = '待完善'
    readonly unSupportTipsDesc: string = '当前关键字对应的历史项目索引不支持当前平台，如果影响了你的日常操作，可以在插件详情中禁用'
    readonly unSupportTipsTitle: string = '该关键字不支持当前平台'
    readonly utoolsVersion: string = 'uTools 版本'
}
