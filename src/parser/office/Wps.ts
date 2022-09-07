import plistParser from 'bplist-parser'
import {readFile} from 'fs/promises'
import {isEmpty, isNil, unique} from 'licia'
import {parse} from 'path'
import WinReg from 'winreg'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {
    ApplicationConfigAndExecutorImpl,
    ApplicationConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    PLATFORM_LINUX,
    PLATFORM_MACOS,
    PLATFORM_WINDOWS,
    SettingProperties,
    ShellExecutor,
} from '../../Types'
import {configExtensionFilter, existsOrNot, listRegistry, systemUser} from '../../Utils'
import {generateFilePathIndex} from '../../utils/index-generator/FilePathIndex'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const WPS_WIN_INTERNATION: string = 'wps-win-internation'
const WPS_MAC_INTERNATION: string = 'wps-mac-internation'
const WPS_LINUX_INTERNATION: string = 'wps-linux-internation'

export class WpsWinInternationalProjectItemImpl extends DatetimeProjectItemImpl {}

export class WpsWinInternationalApplicationImpl extends ApplicationImpl<WpsWinInternationalProjectItemImpl> {
    constructor() {
        super(
            WPS_WIN_INTERNATION,
            'WPS Office (International)',
            'https://www.wps.com/',
            'icon/wps-internation.png',
            WPS_WIN_INTERNATION,
            PLATFORM_WINDOWS,
            Group[GroupName.office],
            () => `数据通过读取注册表 HKEY_CURRENT_USER\\SOFTWARE\\kingsoft\\Office\\6.0\\xxx\\RecentFiles\\Sequence 获得, 仅读取, 不会修改注册表信息`,
            true,
        )
    }

    async generateProjectItems(context: Context): Promise<Array<WpsWinInternationalProjectItemImpl>> {
        let items: Array<WpsWinInternationalProjectItemImpl> = []
        let results = [
            ...await listRegistry(WinReg.HKCU, '\\SOFTWARE\\kingsoft\\Office\\6.0\\wps\\RecentFiles\\Sequence'),
            ...await listRegistry(WinReg.HKCU, '\\SOFTWARE\\kingsoft\\Office\\6.0\\pdf\\RecentFiles\\Sequence'),
            ...await listRegistry(WinReg.HKCU, '\\SOFTWARE\\kingsoft\\Office\\6.0\\et\\RecentFiles\\Sequence'),
            ...await listRegistry(WinReg.HKCU, '\\SOFTWARE\\kingsoft\\Office\\6.0\\wpp\\RecentFiles\\Sequence'),
            ...await listRegistry(WinReg.HKCU, '\\SOFTWARE\\kingsoft\\Office\\6.0\\ofd\\RecentFiles\\Sequence'),
        ]
        if (!isNil(results) && !isEmpty(results)) {
            results.forEach(result => {
                let path = result.path
                let datetime = result.datetime
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
                    searchKey: unique([
                        ...generatePinyinIndex(context, parser.name),
                        ...generateFilePathIndex(context, path),
                        parser.name,
                    ]),
                    exists: exists,
                    command: new ShellExecutor(`powershell.exe -command "Invoke-Item '${path}'"`),
                    datetime: datetime,
                })
            })
        }
        return items
    }
}

export class WpsMacInternationalProjectItemImpl extends DatetimeProjectItemImpl {}

export class WpsMacInternationalApplicationImpl extends ApplicationConfigImpl<WpsMacInternationalProjectItemImpl> {
    constructor() {
        super(
            WPS_MAC_INTERNATION,
            'WPS Office (International)',
            'https://www.wps.com/',
            'icon/wps-internation.png',
            WPS_MAC_INTERNATION,
            PLATFORM_MACOS,
            Group[GroupName.office],
            () => `刚关闭的文档没有出现在历史记录里是因为配置文件还没有更新, 但 wps 更新配置文件的时机不明, 通常是等一会儿.
配置文件通常放在 ${this.defaultConfigPath()}`,
            false,
            'com.kingsoft.plist',
        )
    }

    override defaultConfigPath(): string {
        return `/Users/${systemUser()}/Library/Containers/com.kingsoft.wpsoffice.mac.global/Data/Library/Preferences/com.kingsoft.plist`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: [...configExtensionFilter('plist')],
        }
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
                        searchKey: unique([
                            ...generatePinyinIndex(context, parser.name),
                            ...generateFilePathIndex(context, path),
                            parser.name,
                        ]),
                        exists: exists,
                        command: new ShellExecutor(`open "${path}"`),
                        datetime: 0,
                    })
                })
        }
        return items
    }
}

export class WpsLinuxInternationalProjectItemImpl extends DatetimeProjectItemImpl {}

export class WpsLinuxInternationalApplicationImpl extends ApplicationConfigAndExecutorImpl<WpsLinuxInternationalProjectItemImpl> {
    constructor() {
        super(
            WPS_LINUX_INTERNATION,
            'WPS Office (International)',
            'https://www.wps.com/',
            'icon/wps-internation.png',
            WPS_LINUX_INTERNATION,
            PLATFORM_LINUX,
            Group[GroupName.office],
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, ${i18n.t(sentenceKey.executorFileAt)} ${this.defaultExecutorPath()}, 也可以直接填入 xdg-open 命令使用`,
            false,
            'Office.conf',
        )
    }

    override defaultConfigPath(): string {
        return `/home/${systemUser()}/.config/Kingsoft/Office.conf`
    }

    override defaultExecutorPath(): string {
        return `/usr/bin/wps`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('conf'),
        }
    }

    async generateProjectItems(context: Context): Promise<Array<WpsLinuxInternationalProjectItemImpl>> {
        let items: Array<WpsLinuxInternationalProjectItemImpl> = []
        let content = await readFile(this.config, { encoding: 'utf-8' })
        content.split('\n')
            .filter(line => /^(et|wps|wpp)\\RecentFiles\\files.+$/.test(line))
            .map(line => {
                let groups = line.match(/path=(.+)$/)
                if (!isNil(groups) && !isEmpty(groups)) {
                    return groups![1]
                }
                return null
            })
            .filter(line => !isNil(line))
            .map(line => line!.replace(/\\x/g, '%u'))
            .map(line => unescape(line))
            .forEach(path => {
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
                    searchKey: unique([
                        ...generatePinyinIndex(context, parser.name),
                        ...generateFilePathIndex(context, path),
                        parser.name,
                    ]),
                    exists: exists,
                    command: new ShellExecutor(`${this.executor} "${path}"`),
                    datetime: 0,
                })
            })
        return items
    }
}

export const applications: Array<ApplicationImpl<DatetimeProjectItemImpl>> = [
    new WpsMacInternationalApplicationImpl(),
    new WpsLinuxInternationalApplicationImpl(),
    new WpsWinInternationalApplicationImpl(),
]
