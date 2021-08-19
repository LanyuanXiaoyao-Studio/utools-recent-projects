import {
    ApplicationConfigState,
    ApplicationImpl,
    Executor,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
    UToolsExecutor,
} from '../../types'
import {isEmpty, isNil, Url} from 'licia'
import {join, parse} from 'path'
import {execSync} from 'child_process'
import plistParser = require('bplist-parser')
import fs = require('fs')

const OFFICE_MAC: string = 'office-mac'
const OFFICE_WIN: string = 'office-win'

const extensionIcon: (string) => string = extensionName => {
    switch (extensionName) {
        case 'doc':
        case 'docx':
            return 'icon/office-word.png'
        case 'xls':
        case 'xlsx':
        case 'csv':
            return 'icon/office-excel.png'
        case 'ppt':
        case 'pptx':
            return 'icon/office-powerpoint.png'
        default:
            return 'icon/office.png'
    }
}

export class OfficeProjectItemImpl extends ProjectItemImpl {
    datetime: number

    constructor(id: string, title: string, description: string, icon: string, searchKey: string, command: Executor, datetime: number) {
        super(id, title, description, icon, searchKey, command)
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
                    items.push({
                        id: '',
                        title: parser.name,
                        description: url.pathname,
                        icon: extensionIcon(parser.ext.replace(/\./g, '')),
                        searchKey: url.pathname,
                        command: new ShellExecutor(`open ${url}`),
                        datetime: date,
                    })
                })
        }
        return items
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        let configId = this.configId(nativeId)
        let configTitle = `设置 ${this.name} 「${this.configFilename}」文件路径`
        return [
            Object.create({
                id: configId,
                name: configTitle,
                value: this.config,
            }),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        if (isEmpty(this.config)) {
            return ApplicationConfigState.empty
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
            undefined,
            true,
        )
    }

    private recentPath: string = 'C:\\Users\\Administrator\\AppData\\Roaming\\Microsoft\\Office\\Recent'
    private permitExtension: (string) => boolean = p => {
        let parser = parse(p)
        switch (parser.ext) {
            case '.docx':
            case '.xlsx':
                return true
            default:
                return false
        }
    }
    private generateCommand: (string) => string = link => `(New-Object -COM WScript.Shell).CreateShortcut('${link}').TargetPath;`

    async generateProjectItems(): Promise<Array<OfficeProjectItemImpl>> {
        let items: Array<OfficeProjectItemImpl> = []
        let command = fs.readdirSync(this.recentPath)
            .map(p => join(this.recentPath, p))
            .filter(p => p.endsWith('LNK'))
            .filter(p => this.permitExtension(p.replace(/\.LNK$/, '')))
            .map(p => {
                let stat = fs.lstatSync(p)
                return {
                    path: p,
                    datetime: stat.mtimeMs,
                }
            })
            .sort((p1, p2) => p2.datetime - p1.datetime)
            .map(p => this.generateCommand(p.path))
            .join('')
        execSync('chcp 65001')
        let result = execSync(`powershell.exe -command "${command}"`, { encoding: 'utf8' }).trim()
        let paths = result.split(/\r?\n/)
        paths.forEach(p => {
            let parser = parse(p)
            items.push({
                id: '',
                title: parser.name,
                description: p,
                icon: extensionIcon(parser.ext.replace(/\./g, '')),
                searchKey: p,
                command: new UToolsExecutor(p),
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
    new OfficeMacApplicationImpl('word', 'Word', 'icon/office-word.png', 'com.microsoft.Word.securebookmarks.plist'),
    new OfficeMacApplicationImpl('excel', 'Excel', 'icon/office-excel.png', 'com.microsoft.Excel.securebookmarks.plist'),
    new OfficeMacApplicationImpl('powerpoint', 'PowerPoint', 'icon/office-powerpoint.png', 'com.microsoft.Powerpoint.securebookmarks.plist'),
    new OfficeWinApplicationImpl(),
]
