import {
    ApplicationConfigState,
    ApplicationImpl,
    Executor,
    InputSettingItem,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
} from '../../types'
import {isEmpty, isNil, Url} from 'licia'
import {join, parse} from 'path'
import {execSync} from 'child_process'
import {existsOrNot} from '../../utils'
import {lstatSync, readdirSync} from 'fs'
import plistParser = require('bplist-parser')

const OFFICE_MAC: string = 'office-mac'
const OFFICE_WIN: string = 'office-win'

export class OfficeProjectItemImpl extends ProjectItemImpl {
    datetime: number

    constructor(id: string, title: string, description: string, icon: string, searchKey: string, exists: boolean, command: Executor, datetime: number) {
        super(id, title, description, icon, searchKey, exists, command)
        this.datetime = datetime
    }
}

export class OfficeMacApplicationImpl extends ApplicationImpl<OfficeProjectItemImpl> {
    constructor(id: string, name: string, icon: string, configFilename: string, description: string = '') {
        super(`office-mac-${id}`, name, icon, OFFICE_MAC, [Platform.darwin], 'Office', configFilename, description, true)
    }

    async generateProjectItems(): Promise<Array<OfficeProjectItemImpl>> {
        let items: Array<OfficeProjectItemImpl> = []
        let data = await plistParser.parseFile(this.config)
        if (!isNil(data) && !isEmpty(data)) {
            data = data[0]
            Object.keys(data)
                .forEach(key => {
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
                    let { exists, description, icon } = existsOrNot(url.pathname, {
                        description: url.pathname,
                        icon: utools.getFileIcon(url.pathname),
                    })
                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: url.pathname,
                        exists: exists,
                        command: new ShellExecutor(`open ${url}`),
                        datetime: date,
                    })
                })
        }
        return items
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `设置 ${this.name} 「${this.configFilename}」文件路径`,
                this.config,
            ),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        if (isEmpty(this.config)) {
            return ApplicationConfigState.empty
        } else if (this.nonExistsPath(this.config)) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }
}

export class OfficeWinApplicationImpl extends ApplicationImpl<OfficeProjectItemImpl> {
    constructor() {
        super(
            `office-win`,
            'Office 2019',
            'icon/office.png',
            OFFICE_WIN,
            [Platform.win32],
            'Office',
            'Recent',
            'Office 2019 通过解析 C:\\Users\\Administrator\\AppData\\Roaming\\Microsoft\\Office\\Recent 下的文件记录来得到历史打开文件列表, 这种方式依赖于默认的 Office 行为, 目前仅支持有限的 Office 文档格式',
            true,
        )
    }

    private recentPath: string = 'C:\\Users\\Administrator\\AppData\\Roaming\\Microsoft\\Office\\Recent'
    private permitExtension: (string) => boolean = p => {
        let ext = parse(p).ext
        if (isEmpty(ext)) return false
        return '.docx .docm .doc .dotx .dot .xps .odt .xlsx .xlsm .xlsb .xls .csv .xltx .xltm .xlt .prn .dif .slk .xlam .xla .ods .pptx .pptm .ppt .potx .potm .pot .thmx .ppsx .ppsm .pps .ppam .ppa .mp4 .wmv .gif .jpg .png .tif .bmp .wmf .emf .svg .odp .pub .ps .mht .mhtml .html .htm .mpp .mpt .vsdx .vssx .vstx .vsdm .vssm .vstm .vsd .vss .vst .svgz .dwg .dxf .accdb .mdb .accdt .accde '.indexOf(ext) > -1
    }
    private generateCommand: (string) => string = link => `(New-Object -COM WScript.Shell).CreateShortcut('${link}').TargetPath;`

    async generateProjectItems(): Promise<Array<OfficeProjectItemImpl>> {
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
        let result = execSync(`powershell.exe -command "chcp 65001;${command}"`, { encoding: 'utf8' }).trim()
        let paths = result.split(/\r?\n/).slice(1)
        paths.forEach(p => {
            let parser = parse(p)
            let { exists, description, icon } = existsOrNot(p, {
                description: p,
                icon: utools.getFileIcon(p),
            })
            items.push({
                id: '',
                title: parser.name,
                description: description,
                icon: icon,
                searchKey: p,
                exists: exists,
                command: new ShellExecutor(`powershell.exe -command "Invoke-Item '${p}'"`),
                datetime: 0,
            })
        })
        return items
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return []
    }

    isFinishConfig(): ApplicationConfigState {
        return ApplicationConfigState.done
    }
}

export const applications: Array<ApplicationImpl<OfficeProjectItemImpl>> = [
    new OfficeMacApplicationImpl('word', 'Word 2019', 'icon/office-word.png', 'com.microsoft.Word.securebookmarks.plist'),
    new OfficeMacApplicationImpl('excel', 'Excel 2019', 'icon/office-excel.png', 'com.microsoft.Excel.securebookmarks.plist'),
    new OfficeMacApplicationImpl('powerpoint', 'PowerPoint 2019', 'icon/office-powerpoint.png', 'com.microsoft.Powerpoint.securebookmarks.plist'),
    new OfficeWinApplicationImpl(),
]
