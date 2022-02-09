import {
    ApplicationCacheConfigImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    NohupShellExecutor,
    Platform,
} from '../../Types'
import {isEmpty, isNil, unique} from 'licia'
import {statSync} from 'fs'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../utils/sqlite/SqliteExecutor'

const SHORTCUTS: string = 'shortcuts'

export class ShortcutsProjectItemImpl extends DatetimeProjectItemImpl {}

export class ShortcutsApplicationImpl extends ApplicationCacheConfigImpl<ShortcutsProjectItemImpl> {
    constructor() {
        super(
            SHORTCUTS,
            () => i18n.t(sentenceKey.shortcuts),
            'icon/shortcuts.png',
            SHORTCUTS,
            [Platform.darwin],
            Group[GroupName.system],
            () => ``,
            true,
            'Shortcuts.sqlite',
        )
    }

    override defaultConfigPath(): string {
        return `${utools.getPath('home')}/Library/Shortcuts/Shortcuts.sqlite`
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.config = this.defaultConfigPath()
    }

    async generateCacheProjectItems(context: Context): Promise<Array<ShortcutsProjectItemImpl>> {
        let items: Array<ShortcutsProjectItemImpl> = []
        if (isNil(statSync(this.config))) {
            throw new Error(`无法找到配置文件 ${this.config}`)
        }
        // language=SQLite
        let sql = 'select ZNAME as title, ZACTIONSDESCRIPTION as description, ZLASTRUNEVENTDATE as datetime\nfrom ZSHORTCUT'
        let array = await queryFromSqlite(this.config, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? '',
                    description: string = i['description'] ?? ''
                items.push({
                    id: '',
                    title: title,
                    description: description,
                    icon: this.icon,
                    searchKey: unique([
                        ...generatePinyinIndex(context, title),
                        ...generatePinyinIndex(context, description),
                        title,
                        description,
                    ]),
                    exists: true,
                    command: new NohupShellExecutor('/usr/bin/shortcuts', 'run', `"${title}"`),
                    datetime: i['datetime'] ?? 0.0,
                })
            })
        }
        return items
    }
}

export const applications: Array<ApplicationImpl<ShortcutsProjectItemImpl>> = [
    new ShortcutsApplicationImpl(),
]
