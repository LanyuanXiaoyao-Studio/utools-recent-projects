/**
 * 参考实现 https://gitee.com/squallliu/utools-recent-projects/commit/e22d4d07f339682606dda083f404a3e94db90559
 * 感谢 https://gitee.com/squallliu 的贡献
 */
import {
    ApplicationConfigAndExecutorImpl,
    ApplicationImpl,
    Group,
    GroupName,
    Platform,
    ProjectItemImpl,
    ShellExecutor,
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

export class GeanyApplicationImpl extends ApplicationConfigAndExecutorImpl<GeanyProjectItemImpl> {
    constructor() {
        super(
            GEANY,
            'geany',
            'icon/geany.png',
            GEANY,
            [Platform.linux],
            Group[GroupName.editor],
            () => `${i18n.t(sentenceKey.configFileAt)} ${generateStringByOS({
                linux: '/home/xxx/.config/geany/geany.conf',
            })}, ${i18n.t(sentenceKey.executorFileAt)} ${generateStringByOS({
                linux: '/usr/bin/geany',
            })}`,
            false,
            'geany.conf',
        )
    }

    async generateProjectItems(context: Context): Promise<Array<GeanyProjectItemImpl>> {
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
                    items.push({
                        id: '',
                        title: parser.name,
                        description: description,
                        icon: icon,
                        searchKey: unique([...generatePinyinIndex(context, parser.name), parser.name]),
                        exists: exists,
                        command: new ShellExecutor(`${this.executor} "${path}"`),
                    })
                })
                readObj.close()
            })
            readObj.on('close', () => resolve(items))
        })
    }
}

export const applications: Array<ApplicationImpl<GeanyProjectItemImpl>> = [
    new GeanyApplicationImpl(),
]
