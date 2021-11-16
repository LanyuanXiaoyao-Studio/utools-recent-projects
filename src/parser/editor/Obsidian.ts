import {
    ApplicationConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    UtoolsExecutor,
} from '../../Types'
import {Context} from '../../Context'
import {readFileSync, statSync} from 'fs'
import {endWith, isEmpty, isNil, unique} from 'licia'
import {existsOrNot, generateStringByOS, systemUser, walker} from '../../Utils'
import {parse, resolve} from 'path'
import {i18n, sentenceKey} from '../../i18n'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const OBSIDIAN: string = 'obsidian'

export class ObsidianProjectItemImpl extends DatetimeProjectItemImpl {}

export class ObsidianApplicationImpl extends ApplicationConfigImpl<ObsidianProjectItemImpl> {
    constructor() {
        super(
            OBSIDIAN,
            'Obsidian',
            'icon/obsidian.png',
            OBSIDIAN,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${generateStringByOS({
                win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\obsidian\\obsidian.json`,
                darwin: `/Users/${systemUser()}/Library/Application Support/obsidian/obsidian.json`,
                linux: `/home/${systemUser()}/.config/obsidian/obsidian.json`,
            })}`,
            true,
            'obsidian.json',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<ObsidianProjectItemImpl>> {
        let items: Array<ObsidianProjectItemImpl> = []
        let data = readFileSync(this.config, { encoding: 'utf8' })
        if (!isEmpty(data)) {
            let root = JSON.parse(data)
            if (!isNil(root['vaults']) && !isEmpty(root['vaults'])) {
                let vaults = root['vaults']
                Object.keys(vaults)
                    .map(key => {
                        let d = vaults[key]
                        let p = d['path']
                        if (!isNil(p) && !isEmpty(p)) {
                            return walker(resolve(p), (fullPath, stat) => {
                                if ((stat?.isDirectory() ?? false)) {
                                    return !endWith(fullPath, '.obsidian')
                                }
                                return endWith(fullPath, 'md')
                            })
                                .map(filename => {
                                    return {
                                        id: key,
                                        path: filename,
                                    }
                                })
                        }
                        return []
                    })
                    .flatMap(x => x)
                    .forEach(obj => {
                        let { exists, description, icon } = existsOrNot(obj.path, {
                            description: obj.path,
                            icon: context.enableGetFileIcon ? utools.getFileIcon(obj.path) : this.icon,
                        })
                        let parseObj = parse(obj.path)
                        let stat = statSync(obj.path)
                        items.push({
                            id: '',
                            title: parseObj.name,
                            description: description,
                            icon: icon,
                            searchKey: unique([...generatePinyinIndex(context, parseObj.name), parseObj.name, obj.path]),
                            exists: exists,
                            command: new UtoolsExecutor(`obsidian://open?vault=${obj.id}&file=${parseObj.name}`),
                            datetime: stat.atimeMs,
                        })
                    })
            }
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<ObsidianProjectItemImpl>> = [
    new ObsidianApplicationImpl(),
]
