import {execFileSync} from 'child_process'
import {isEmpty, isNil, unique} from 'licia'
import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    Group,
    GroupName,
    InputSettingItem,
    Platform,
    SettingItem,
    UtoolsExecutor,
} from '../../Types'
import {parseSqliteDefaultResult} from '../../utils/sqlite/ParseResult'
import {Context} from '../../Context'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {systemUser} from '../../Utils'
import {i18n, sentenceKey} from '../../i18n'
import {parse} from 'path'

const EVERNOTE: string = 'evernote'

export class EvernoteProjectItemImpl extends DatetimeProjectItemImpl {}

export class EvernoteApplicationImpl extends ApplicationCacheConfigAndExecutorImpl<EvernoteProjectItemImpl> {
    constructor() {
        super(
            EVERNOTE,
            '印象笔记',
            'icon/evernote.png',
            EVERNOTE,
            [Platform.darwin],
            Group[GroupName.notes],
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, 其中 xxx 是用户 id, 如果只登录过一个账号, 那么只会有一个文件夹, 根据实际情况选择`,
            true,
            'LocalNoteStore.sqlite')
    }

    override defaultConfigPath(): string {
        return `/Users/${systemUser()}/Library/Application Support/com.yinxiang.Mac/accounts/app.yinxiang.com/xxx/localNoteStore/LocalNoteStore.sqlite`
    }

    // sqlite3
    override defaultExecutorPath(): string {
        return ``
    }

    async generateCacheProjectItems(context: Context): Promise<Array<EvernoteProjectItemImpl>> {
        let items: Array<EvernoteProjectItemImpl> = []
        let userId = parse(parse(parse(this.config).dir).dir).name
        if (isNil(userId) || isEmpty(userId)) return items
        // language=SQLite
        let sql = 'select n.ZGUID                 as id,\n       n.ZTITLE                as title,\n       n.ZUPDATESEQUENCENUMBER as seq,\n       n.ZSMARTTAGS            as tag,\n       nb.ZNAME                as level_one,\n       nb.ZSTACK               as level_two\nfrom ZENNOTE n,\n     ZENNOTEBOOK nb\nwhere n.ZNOTEBOOK = nb.Z_PK\n  and n.ZACTIVE = 1\norder by n.ZUPDATESEQUENCENUMBER desc'
        let result = execFileSync(this.executor, [this.config, sql, '-readonly'], {
            encoding: 'utf-8',
            maxBuffer: 20971520,
        })
        if (!isEmpty(result)) {
            let array = parseSqliteDefaultResult(result, ['id', 'title', 'n/seq', 'tag', 'level_one', 'level_two'])
            array.forEach(i => {
                let title: string = i['title'] ?? ''
                let id: string = i['id'] ?? ''
                let description: string = ''
                let tagText = i['tag'] ?? ''
                if (!isEmpty(i['level_one'])) {
                    description = `[${i['level_one']}${!isEmpty(i['level_two']) ? ` → ${i['level_two']}` : ''}]`
                }
                if (!isEmpty(tagText)) {
                    let tags = JSON.parse(tagText) as Array<string>
                    description += ` Tags：${tags.join('，')}`
                }
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
                    command: new UtoolsExecutor(`evernote:///view/${userId}/s0/${id}/${id}/`),
                    datetime: i['seq'] ?? 0,
                })
            })
        }
        return items
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            this.enabledSettingItem(context, nativeId),
            this.configSettingItem(context, nativeId),
            new InputSettingItem(
                this.executorId(nativeId),
                i18n.t(sentenceKey.sqlite3),
                this.executor,
                i18n.t(sentenceKey.sqlite3Desc),
            ),
        ]
    }
}

export const applications: Array<ApplicationImpl<EvernoteProjectItemImpl>> = [
    new EvernoteApplicationImpl(),
]
