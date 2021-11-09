/**
 * 参考实现 https://gitee.com/squallliu/utools-recent-projects/commit/e22d4d07f339682606dda083f404a3e94db90559
 * 感谢 https://gitee.com/squallliu 的贡献
 */
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    Group,
    GroupName,
    NohupShellExecutor,
    Platform,
    ProjectItemImpl,
    SettingItem,
    ShellExecutor,
    SwitchSettingItem,
} from '../../Types'
import {i18n, sentenceKey} from '../../i18n'
import {existsOrNot, generateStringByOS} from '../../Utils'
import {Context} from '../../Context'
import {createInterface} from 'readline'
import {createReadStream} from 'fs'
import {isEmpty, isNil, unique} from 'licia'
import {parse} from 'path'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const GEANY: string = 'geany'

export class GeanyProjectItemImpl extends ProjectItemImpl {}

export class GeanyApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<GeanyProjectItemImpl> {
    openInNew: boolean = false
    private isMacOs: boolean = utools.isMacOs()

    constructor() {
        super(
            GEANY,
            'Geany',
            'icon/geany.png',
            GEANY,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${generateStringByOS({
                win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\geany\\geany.conf',
                darwin: '/Users/xxx/.config/geany/geany.conf',
                linux: '/home/xxx/.config/geany/geany.conf',
            })}, ${i18n.t(sentenceKey.executorFileAt)} ${generateStringByOS({
                win32: 'C:\\Program Files\\Geany\\bin\\geany.exe',
                darwin: '/Applications/Geany.app/Contents/MacOS/geany',
                linux: '/usr/bin/geany',
            })}`,
            false,
            'geany.conf',
        )
    }

    async generateCacheProjectItems(context: Context): Promise<Array<GeanyProjectItemImpl>> {
        return new Promise(resolve => {
            const items: Array<GeanyProjectItemImpl> = []
            const readObj = createInterface({ input: createReadStream(this.config) })
            readObj.on('line', line => {
                if (!/^recent_files=.+$/.test(line)) {
                    return
                }

                const groups = line.match(/^recent_files=(.+)$/)
                if (isNil(groups) || isEmpty(groups)) {
                    return
                }

                let paths = groups![1]
                if (isNil(paths)) {
                    return
                }

                paths.split(';')?.forEach(path => {
                    let parser = parse(path)
                    let { exists, description, icon } = existsOrNot(path, {
                        description: path,
                        icon: context.enableGetFileIcon ? utools.getFileIcon(path) : this.icon,
                    })
                    let args = this.openInNew ? '-i' : ''
                    let command = this.isMacOs
                        ? new NohupShellExecutor(this.executor, path, args)
                        : new ShellExecutor(`${this.executor} "${path}" "${args}"`)
                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: unique([...generatePinyinIndex(context, parser.name), parser.name, path]),
                        exists: exists,
                        command: command,
                    })
                })
                readObj.close()
            })
            readObj.on('close', () => resolve(items))
        })
    }

    openInNewId(nativeId: string) {
        return `${nativeId}/${this.id}-open-in-new`
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.openInNew = utools.dbStorage.getItem(this.openInNewId(nativeId)) ?? false
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        let superSettings = super.generateSettingItems(context, nativeId)
        superSettings.splice(1, 0, new SwitchSettingItem(
            this.openInNewId(nativeId),
            i18n.t(sentenceKey.openInNew),
            this.openInNew,
            i18n.t(sentenceKey.openInNewDesc),
        ))
        return superSettings
    }
}

export const applications: Array<ApplicationImpl<GeanyProjectItemImpl>> = [
    new GeanyApplicationImpl(),
]
