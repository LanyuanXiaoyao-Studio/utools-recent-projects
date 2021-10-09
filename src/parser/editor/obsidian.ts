import {
    ApplicationConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    Platform,
    UtoolsExecutor,
} from '../../types'
import {Context} from '../../context'
import {readFileSync, statSync} from 'fs'
import {endWith, isEmpty, isNil, unique} from 'licia'
import {existsOrNot, generateSearchKeyWithPinyin, walker} from '../../utils'
import {parse, resolve} from 'path'

const OBSIDIAN: string = 'obsidian'

export class ObsidianProjectItemImpl extends DatetimeProjectItemImpl {}

export class ObsidianApplicationImpl extends ApplicationConfigImpl<ObsidianProjectItemImpl> {
    constructor() {
        super(
            OBSIDIAN,
            'Obsidian',
            'icon/typora.png',
            OBSIDIAN,
            [Platform.win32, Platform.darwin, Platform.linux],
            Group[GroupName.editor],
            undefined,
            undefined,
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
                            return walker(resolve(p), i => endWith(i, 'md'))
                                .map(filname => {
                                    console.log(filname)
                                    return {
                                        id: key,
                                        path: filname,
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
                            searchKey: unique([...generateSearchKeyWithPinyin(parseObj.name), obj.path]),
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
