import {
    ApplicationConfigState,
    ApplicationImpl,
    Executor,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
} from '../../types'
import {isEmpty, isNil, Url} from 'licia'
import {parse} from 'path'
import plistParser = require('bplist-parser')

const OFFICE_MAC: string = 'office-mac'

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

export class OfficeMacProjectItemImpl extends ProjectItemImpl {
    datetime: number

    constructor(id: string, title: string, description: string, icon: string, searchKey: string, command: Executor, datetime: number) {
        super(id, title, description, icon, searchKey, command)
        this.datetime = datetime
    }
}

export class OfficeMacApplicationImpl extends ApplicationImpl<OfficeMacProjectItemImpl> {
    constructor(id: string, name: string, icon: string, configFilename: string, description: string = '') {
        super(`office-mac-${id}`, name, icon, OFFICE_MAC, [Platform.darwin], 'Office', configFilename, description, true)
    }

    async generateProjectItems(): Promise<Array<OfficeMacProjectItemImpl>> {
        let items: Array<OfficeMacProjectItemImpl> = []
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

export const applications: Array<ApplicationImpl<OfficeMacProjectItemImpl>> = [
    new OfficeMacApplicationImpl('word', 'Word', 'icon/office-word.png', 'com.microsoft.Word.securebookmarks.plist'),
    new OfficeMacApplicationImpl('excel', 'Excel', 'icon/office-excel.png', 'com.microsoft.Excel.securebookmarks.plist'),
    new OfficeMacApplicationImpl('powerpoint', 'PowerPoint', 'icon/office-powerpoint.png', 'com.microsoft.Powerpoint.securebookmarks.plist'),
]
