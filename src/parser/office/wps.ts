import {
    ApplicationConfigImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    ShellExecutor,
} from '../../types'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import {existsOrNot, generateStringByOS} from '../../utils'
import {Context} from '../../context'
import plistParser = require('bplist-parser')

const WPS_MAC_INTERNATION: string = 'wps-mac-internation'

export class WpsMacInternationalProjectItemImpl extends ProjectItemImpl {}

export class WpsMacInternationalApplicationImpl extends ApplicationConfigImpl<WpsMacInternationalProjectItemImpl> {
    constructor() {
        super(
            'wps-mac-internation',
            'WPS Office',
            'icon/wps-mac-internation.png',
            WPS_MAC_INTERNATION,
            [Platform.darwin],
            Group[GroupName.office],
            `刚关闭的文档没有出现在历史记录里是因为配置文件还没有更新, 但 wps 更新配置文件的时机不明, 通常是等一会儿.
` + generateStringByOS({
                handler: text => `配置文件通常放在 ${text}`,
                darwin: '/Users/xxx/Library/Containers/com.kingsoft.wpsoffice.mac.global/Data/Library/Preferences/com.kingsoft.plist',
            }),
            false,
            'com.kingsoft.plist',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<WpsMacInternationalProjectItemImpl>> {
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
                    let { exists, description, icon } = existsOrNot(path, {
                        description: path,
                        icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                    })
                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: path,
                        exists: exists,
                        command: new ShellExecutor(`open "${path}"`),
                    })
                })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<WpsMacInternationalProjectItemImpl>> = [
    new WpsMacInternationalApplicationImpl(),
]
