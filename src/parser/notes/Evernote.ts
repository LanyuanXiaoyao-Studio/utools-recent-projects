import {isEmpty, isNil, reverse, unique} from 'licia'
import {parse} from 'path'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {
    ApplicationCacheConfigImpl,
    ApplicationConfigState,
    ApplicationImpl,
    DatetimeProjectItemImpl,
    GROUP_NOTES,
    PlainSettingItem,
    PLATFORM_MACOS,
    PLATFORM_WINDOWS,
    SettingItem,
    SettingProperties,
    UtoolsExecutor,
} from '../../Types'
import {configExtensionFilter, systemUser} from '../../Utils'
import {generatePinyinIndex} from '../../utils/index-generator/PinyinIndex'
import {queryFromSqlite} from '../../utils/sqlite/SqliteExecutor'

const EVERNOTE_MAC: string = 'evernote-mac'
const EVERNOTE_WIN: string = 'evernote-win'

export class EvernoteMacProjectItemImpl extends DatetimeProjectItemImpl {}

export class EvernoteMacApplicationImpl extends ApplicationCacheConfigImpl<EvernoteMacProjectItemImpl> {
    constructor() {
        super(
            EVERNOTE_MAC,
            () => i18n.t(sentenceKey.evernote),
            'https://www.yinxiang.com/',
            'icon/evernote.png',
            EVERNOTE_MAC,
            PLATFORM_MACOS,
            GROUP_NOTES,
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()}, 其中 xxx 是用户 id, 如果只登录过一个账号, 那么只会有一个文件夹, 根据实际情况选择`,
            true,
            'LocalNoteStore.sqlite')
    }

    override defaultConfigPath(): string {
        return `/Users/${systemUser()}/Library/Application Support/com.yinxiang.Mac/accounts/app.yinxiang.com/xxx/localNoteStore/LocalNoteStore.sqlite`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('sqlite'),
        }
    }

    async generateCacheProjectItems(context: Context): Promise<Array<EvernoteMacProjectItemImpl>> {
        let items: Array<EvernoteMacProjectItemImpl> = []
        let userId = parse(parse(parse(this.config).dir).dir).name
        if (isNil(userId) || isEmpty(userId)) return items
        // language=SQLite
        let sql = 'select n.ZGUID                 as id,\n       n.ZTITLE                as title,\n       n.ZUPDATESEQUENCENUMBER as seq,\n       tm.name                 as tag,\n       n.ZSMARTTAGS            as smart_tag,\n       nb.ZNAME                as level_one,\n       nb.ZSTACK               as level_two\nfrom ZENNOTE n,\n     ZENNOTEBOOK nb\n         left join (select n.ZGUID as guid, group_concat(t.ZNAME) as name\n                    from ZENNOTE n,\n                         Z_10TAGS tm,\n                         ZENTAG t\n                    where n.ZACTIVE = 1\n                      and n.Z_PK = tm.Z_10NOTES\n                      and t.Z_PK = tm.Z_23TAGS\n                    group by n.ZGUID) tm on n.ZGUID = tm.guid\nwhere n.ZNOTEBOOK = nb.Z_PK\n  and n.ZACTIVE = 1\norder by n.ZUPDATESEQUENCENUMBER desc'
        let array = await queryFromSqlite(this.config, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? '',
                    id: string = i['id'] ?? '',
                    description: string = '',
                    tagText = i['tag'] ?? '',
                    smartTagText = i['smart_tag'] ?? ''

                if (!isEmpty(i['level_one'])) {
                    description = `[${i['level_one']}${!isEmpty(i['level_two']) ? ` → ${i['level_two']}` : ''}]`
                }
                if (!isEmpty(tagText)) {
                    let tags = tagText.split(',')
                    description += ` [${i18n.t(sentenceKey.tag)}：${tags.join('，')}]`
                }
                if (!isEmpty(smartTagText)) {
                    let tags = JSON.parse(smartTagText) as Array<string>
                    description += ` [${i18n.t(sentenceKey.smartTag)}：${tags.join('，')}]`
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
}

export class EvernoteWinProjectItemImpl extends DatetimeProjectItemImpl {}

export class EvernoteWinApplicationImpl extends ApplicationCacheConfigImpl<EvernoteWinProjectItemImpl> {
    private user: string = ''
    private readonly regex = /[\da-f]{2}/ig

    constructor() {
        super(
            EVERNOTE_WIN,
            () => i18n.t(sentenceKey.evernote),
            'https://www.yinxiang.com/',
            'icon/evernote.png',
            EVERNOTE_WIN,
            PLATFORM_WINDOWS,
            GROUP_NOTES,
            () => `${i18n.t(sentenceKey.configFileAt)} ${this.defaultConfigPath()} 其中 xxx 是用户标识`,
            true,
            'xxx#app.yinxiang.com.exb')
    }

    override defaultConfigPath(): string {
        return `C:\\Users\\${systemUser()}\\Yinxiang Biji\\Databases\\xxx#app.yinxiang.com.exb`
    }

    override configSettingItemProperties(): SettingProperties {
        return {
            ...super.configSettingItemProperties(),
            filters: configExtensionFilter('exb'),
        }
    }

    async generateCacheProjectItems(context: Context): Promise<Array<EvernoteWinProjectItemImpl>> {
        let items: Array<EvernoteWinProjectItemImpl> = []
        // language=SQLite
        let sql = 'select hex(i.guid)    as guid,\n       n.title        as title,\n       n.date_updated as seq,\n       n.tags         as tag,\n       nb.name        as level_one,\n       nb.stack       as level_two\nfrom note_attr n,\n     notebook_attr nb,\n     items i\nwhere n.uid = i.uid\n  and n.notebook_uid is not null\n  and n.notebook_uid = nb.uid\n  and n.is_deleted is null\norder by n.date_updated desc'
        let array = await queryFromSqlite(this.config, sql)
        if (!isEmpty(array)) {
            array.forEach(i => {
                let title: string = i['title'] ?? '',
                    id: string = this.convertGuid(i['guid'] ?? ''),
                    description: string = '',
                    tagText = i['tag'] ?? ''

                if (!isEmpty(i['level_one'])) {
                    description = `[${i['level_one']}${!isEmpty(i['level_two']) ? ` → ${i['level_two']}` : ''}]`
                }
                if (!isEmpty(tagText)) {
                    let tags = tagText.split(',')
                    description += ` [${i18n.t(sentenceKey.tag)}：${tags.join('，')}]`
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
                    command: new UtoolsExecutor(`evernote:///view/${this.user}/s0/${id}/${id}/`),
                    datetime: i['seq'] ?? 0,
                })
            })
        }
        return items
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.user = utools.dbStorage.getItem(this.userId(nativeId)) ?? ''
    }

    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.user) && isEmpty(this.config)) {
            return ApplicationConfigState.empty
        } else if (!isEmpty(this.user) && !isEmpty(this.config)) {
            return ApplicationConfigState.done
        } else {
            return ApplicationConfigState.undone
        }
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            new PlainSettingItem(
                this.userId(nativeId),
                i18n.t(sentenceKey.evernoteUserId),
                this.user,
                i18n.t(sentenceKey.evernoteUserIdDesc),
            ),
            this.configSettingItem(context, nativeId),
        ]
    }

    private doubleReverse(text: string): string {
        return reverse(text.match(this.regex) ?? []).join('')
    }

    private convertGuid(guid: string): string {
        if (isEmpty(guid)) return ''
        let source = guid,
            prefix = source.substring(0, 16),
            suffix = source.substring(16, 32),
            block1 = prefix.substring(0, 8),
            block2 = prefix.substring(8, 12),
            block3 = prefix.substring(12, 16),
            block4 = suffix.substring(0, 4),
            block5 = suffix.substring(4, 16)
        return `${this.doubleReverse(block1)}-${this.doubleReverse(block2)}-${this.doubleReverse(block3)}-${block4}-${block5}`.toLowerCase()
    }

    private userId(nativeId: string) {
        return `${nativeId}/${this.id}-user`
    }
}

export const applications: Array<ApplicationImpl<EvernoteMacProjectItemImpl>> = [
    new EvernoteMacApplicationImpl(),
    new EvernoteWinApplicationImpl(),
]
