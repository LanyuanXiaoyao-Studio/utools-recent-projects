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
        case 'wps':
        case 'wpt':
        case 'doc':
        case 'dot':
        case 'rtf':
        case 'txt':
        case 'docx':
        case 'dotx':
        case 'docm':
        case 'dotm':
        case 'xml':
        case 'mht':
        case 'mhtml':
        case 'html':
        case 'htm':
            return 'icon/wps-doc.png'
        case 'et':
        case 'ett':
        case 'xls':
        case 'xlt':
        case 'xlsx':
        case 'xlsm':
        case 'dbf':
        case 'csv':
        case 'prn':
        case 'dif':
        case 'xltx':
        case 'xltm':
            return 'icon/wps-xls.png'
        case 'dps':
        case 'dpt':
        case 'ppt':
        case 'pot':
        case 'pps':
        case 'pptx':
        case 'pptm':
        case 'potx':
        case 'potm':
        case 'ppsx':
        case 'ppsm':
        case 'jpg':
        case 'png':
        case 'tif':
        case 'bmp':
            return 'icon/wps-ppt.png'
        case 'pdf':
            return 'icon/wps-pdf.png'
        default:
            return 'icon/wps-mac-internation.png'
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
            '刚关闭的文档没有出现在历史记录里是因为配置文件还没有更新, 但 wps 更新配置文件的时机不明, 通常是等一会儿',
            true,
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
