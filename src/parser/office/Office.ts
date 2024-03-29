import plistParser from 'bplist-parser'
import {lstatSync, readdirSync} from 'fs'
import {isEmpty, isNil, unique, Url} from 'licia'
import {join, parse} from 'path'
import {Context} from '../../Context'
import {
    ApplicationCacheConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    DescriptionGetter,
    GROUP_OFFICE,
    NameGetter,
    PLATFORM_MACOS,
    PLATFORM_WINDOWS,
    ShellExecutor,
} from '../../Types'
import {existsOrNot, existsOrNotAsync, systemUser} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {execAsync} from '../../utils/promise/ExecPromise'

const OFFICE_MAC: string = 'office-mac'
const OFFICE_WIN: string = 'office-win'

export class OfficeProjectItemImpl extends DatetimeProjectItemImpl {}

export class OfficeMacApplicationImpl extends ApplicationCacheConfigImpl<OfficeProjectItemImpl> {
    private readonly defaultConfig

    constructor(id: string, name: string | NameGetter, icon: string, configFilename: string, defaultConfig: string | DescriptionGetter = '') {
        super(
            `office-mac-${id}`,
            name,
            'https://www.office.com/',
            icon,
            OFFICE_MAC,
            PLATFORM_MACOS,
            GROUP_OFFICE,
            () => `配置文件通常放在 ${defaultConfig}`,
            false,
            configFilename,
        )
        this.defaultConfig = defaultConfig
    }

    override defaultConfigPath(): string {
        return this.defaultConfig
    }

    async generateCacheProjectItems(context: Context): Promise<Array<OfficeProjectItemImpl>> {
        let items: Array<OfficeProjectItemImpl> = []
        let data = await plistParser.parseFile(this.config)
        if (!isNil(data) && !isEmpty(data)) {
            data = data[0]
            for (let key of Object.keys(data)) {
                let date
                try {
                    date = new Date(data[key]['kLastUsedDateKey']).getTime()
                } catch (error) {
                    console.log(error)
                    date = 0
                }
                key = decodeURI(key)
                let url = Url.parse(key)
                let parser = parse(url.pathname)
                let { exists, description, icon } = await existsOrNotAsync(url.pathname, {
                    description: url.pathname,
                    icon: context.enableGetFileIcon ? utools.getFileIcon(url.pathname) : this.icon,
                })
                items.push({
                    id: '',
                    title: parser.name,
                    description: description,
                    icon: icon,
                    searchKey: unique([
                        ...generatePinyinIndex(context, parser.name),
                        ...generateFilePathIndex(context, url.pathname),
                        parser.name,
                    ]),
                    exists: exists,
                    command: new ShellExecutor(`open ${url}`),
                    datetime: date,
                })
            }
        }
        return items
    }
}

export class OfficeWinApplicationImpl extends ApplicationImpl<OfficeProjectItemImpl> {
    private readonly recentPath: string

    constructor() {
        super(
            OFFICE_WIN,
            'Office 2019',
            'https://www.office.com/',
            'icon/office.png',
            OFFICE_WIN,
            PLATFORM_WINDOWS,
            GROUP_OFFICE,
            () => `Office 2019 通过解析 C:\\Users\\${systemUser()}\\AppData\\Roaming\\Microsoft\\Office\\Recent 下的文件记录来得到历史打开文件列表, 这种方式依赖于默认的 Office 行为, 目前仅支持有限的 Office 文档格式`,
            false,
        )
        this.recentPath = `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Microsoft\\Office\\Recent`
    }

    async generateProjectItems(context: Context): Promise<Array<OfficeProjectItemImpl>> {
        let items: Array<OfficeProjectItemImpl> = []
        let command = readdirSync(this.recentPath)
            .map(p => join(this.recentPath, p))
            .filter(p => p.endsWith('LNK'))
            .filter(p => this.permitExtension(p.replace(/\.LNK$/, '')))
            .map(p => {
                let stat = lstatSync(p)
                return {
                    path: p,
                    datetime: stat.mtimeMs,
                }
            })
            .sort((p1, p2) => p2.datetime - p1.datetime)
            .map(p => this.generateCommand(p.path))
            .join('')
        let result = await execAsync(`powershell.exe -command "chcp 65001;${command}"`, {
            encoding: 'utf8',
            windowsHide: true,
        })
        let paths = result.split(/\r?\n/).slice(1)
        paths.forEach(path => {
            let parser = parse(path)
            let { exists, description, icon } = existsOrNot(path, {
                description: path,
                icon: utools.getFileIcon(path),
            })
            items.push({
                id: '',
                title: parser.name,
                description: description,
                icon: icon,
                searchKey: unique([
                    ...generatePinyinIndex(context, parser.name),
                    ...generateFilePathIndex(context, path),
                    parser.name,
                ]),
                exists: exists,
                command: new ShellExecutor(`powershell.exe -command "Invoke-Item '${path}'"`),
                datetime: 0,
            })
        })
        return items
    }

    private permitExtension: (string) => boolean = p => {
        let ext = parse(p).ext
        if (isEmpty(ext)) return false
        return '.docx .docm .doc .dotx .dot .xps .odt .xlsx .xlsm .xlsb .xls .csv .xltx .xltm .xlt .prn .dif .slk .xlam .xla .ods .pptx .pptm .ppt .potx .potm .pot .thmx .ppsx .ppsm .pps .ppam .ppa .mp4 .wmv .gif .jpg .png .tif .bmp .wmf .emf .svg .odp .pub .ps .mht .mhtml .html .htm .mpp .mpt .vsdx .vssx .vstx .vsdm .vssm .vstm .vsd .vss .vst .svgz .dwg .dxf .accdb .mdb .accdt .accde '.indexOf(ext) > -1
    }

    private generateCommand: (string) => string = link => `(New-Object -COM WScript.Shell).CreateShortcut('${link}').TargetPath;`
}

export const applications: Array<ApplicationImpl<OfficeProjectItemImpl>> = [
    new OfficeMacApplicationImpl('word', 'Word 2019', 'icon/office-word.png', 'com.microsoft.Word.securebookmarks.plist', `/Users/${systemUser()}/Library/Containers/Microsoft Word/Data/Library/Preferences/com.microsoft.Word.securebookmarks.plist`),
    new OfficeMacApplicationImpl('excel', 'Excel 2019', 'icon/office-excel.png', 'com.microsoft.Excel.securebookmarks.plist', `/Users/${systemUser()}/Library/Containers/Microsoft Excel/Data/Library/Preferences/com.microsoft.Excel.securebookmarks.plist`),
    new OfficeMacApplicationImpl('powerpoint', 'PowerPoint 2019', 'icon/office-powerpoint.png', 'com.microsoft.Powerpoint.securebookmarks.plist', `/Users/${systemUser()}/Library/Containers/Microsoft Powerpoint/Data/Library/Preferences/com.microsoft.Powerpoint.securebookmarks.plist`),
    new OfficeWinApplicationImpl(),
]
