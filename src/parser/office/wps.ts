import {
    ApplicationConfigState,
    ApplicationImpl,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
} from '../../types'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import plistParser = require('bplist-parser')

const WPS_MAC_INTERNATION: string = 'wps-mac-internation'

const extensionIcon: (string) => string = extensionName => {
    switch (extensionName) {
        case 'doc':
        case 'docx':
        case 'wps':
            return 'icon/doc.png'
        case 'xls':
        case 'xlsx':
        case 'et':
        case 'csv':
            return 'icon/xls.png'
        case 'ppt':
        case 'pptx':
        case 'wpp':
            return 'icon/ppt.png'
        case 'pdf':
            return 'icon/pdf.png'
        default:
            return ''
    }
}

export class WpsMacInternationalProjectItemImpl extends ProjectItemImpl {}

export class WpsMacInternationalApplicationImpl extends ApplicationImpl<WpsMacInternationalProjectItemImpl> {
    constructor() {
        super(
            'wps-mac-internation',
            'WPS Office Suite for Mac',
            'icon/wps-mac-internation.png',
            WPS_MAC_INTERNATION,
            [Platform.darwin],
            'Office',
            'com.kingsoft.plist',
        )
    }

    async generateProjectItems(): Promise<Array<WpsMacInternationalProjectItemImpl>> {
        let items: Array<WpsMacInternationalProjectItemImpl> = []
        let data = await plistParser.parseFile(this.config)
        if (!isNil(data) && !isEmpty(data)) {
            data = data[0]
            Object.keys(data)
                .filter(key => key.indexOf('RecentFiles') > -1)
                .sort((a, b) => data[b] - data[a])
                .forEach(key => {
                    let splitKey = '.RecentFiles.Sequence.'
                    let start = key.indexOf(splitKey)
                    let end = start + splitKey.length
                    let path = key.substr(end, key.length)
                    path = '/' + path.replace(/\./g, '/').replace(/·/g, '.')
                    let parser = parse(path)
                    let icon = extensionIcon(parser.ext.replace(/\./g, ''))
                    items.push({
                        id: '',
                        title: parser.name,
                        description: path,
                        icon: isEmpty(icon) ? this.icon : icon,
                        searchKey: path,
                        command: new ShellExecutor(`open "${path}"`),
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

export const applications: Array<ApplicationImpl<WpsMacInternationalProjectItemImpl>> = [
    new WpsMacInternationalApplicationImpl(),
]
