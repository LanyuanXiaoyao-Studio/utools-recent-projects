import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    InputSettingItem,
    NohupShellExecutor,
    Platform,
    SettingItem,
} from '../../Types'
import {isEmpty, isNil, unique} from 'licia'
import {statSync} from 'fs'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {getSqliteExecutor, isEmptySqliteExecutor} from '../../utils/sqlite/CheckSqliteExecutor'
import {execFileSync} from 'child_process'
import {parseSqliteDefaultResult} from '../../utils/sqlite/ParseResult'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'

const SHORTCUTS: string = 'shortcuts'

export class ShortcutsProjectItemImpl extends DatetimeProjectItemImpl {}

export class ShortcutsApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<ShortcutsProjectItemImpl> {
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

    // sqlite3
    override defaultExecutorPath(): string {
        return ``
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.config = this.defaultConfigPath()
    }

    async generateCacheProjectItems(context: Context): Promise<Array<ShortcutsProjectItemImpl>> {
        let items: Array<ShortcutsProjectItemImpl> = []
        if (isEmptySqliteExecutor(context, this.executor)) throw new Error(`无法找到 Sqlite3 可执行文件`)
        if (isNil(statSync(this.config))) {
            throw new Error(`无法找到配置文件 ${this.config}`)
        }
        // language=SQLite
        let sql = 'select ZNAME as title, ZACTIONSDESCRIPTION as description, ZLASTRUNEVENTDATE as datetime\nfrom ZSHORTCUT'
        let result = execFileSync(getSqliteExecutor(context, this.executor), [this.config, sql, '-readonly'], {
            encoding: 'utf-8',
            maxBuffer: 20971520,
            windowsHide: true,
        })
        if (!isEmpty(result)) {
            let array = parseSqliteDefaultResult(result, ['title', 'description', 'f/datetime'])
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

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.executorId(nativeId),
                i18n.t(sentenceKey.sqlite3),
                this.executor,
                i18n.t(sentenceKey.sqlite3Desc),
            ),
        ]
    }

    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.executor)) {
            if (isEmpty(context.sqliteExecutorPath)) {
                return ApplicationConfigState.undone
            } else if (this.nonExistsPath(context.sqliteExecutorPath)) {
                return ApplicationConfigState.error
            }
            return ApplicationConfigState.done
        } else {
            if (this.nonExistsPath(this.executor)) {
                return ApplicationConfigState.error
            }
            return ApplicationConfigState.done
        }
    }
}

export const applications: Array<ApplicationImpl<ShortcutsProjectItemImpl>> = [
    new ShortcutsApplicationImpl(),
]
