import {exec} from 'child_process'
import {shell} from 'electron'
import {contain, isEmpty, isEqual, isNil} from 'licia'
import {Context} from './Context'
import {i18n, sentenceKey} from './i18n'
import {getName, initLanguage, platformFromUtools} from './Utils'
import {signCalculateAsync} from './utils/files/SignCalculate'
import {errorNotify, infoNotify} from './utils/log/NotificationLog'
import {existsToRead, nonExistsToRead} from './utils/promise/FsPromise'

/**
 * 命令执行器
 */
export interface Executor {
    readonly command: string
    execute: (context: Context) => void
}

/**
 * 没有命令执行器
 *
 * 用于表示没有执行器的概念, 用于提示性的结果项
 */
export class NoExecutor implements Executor {
    readonly command: string

    constructor() {
        this.command = ''
    }

    execute(context: Context): void {
    }
}

/**
 * 命令行执行器
 *
 * 使用 exec 命令在终端中执行指定的语句
 */
export class ShellExecutor implements Executor {
    readonly command: string

    constructor(command: string) {
        this.command = command
    }

    execute(context: Context): void {
        if (isEmpty(this.command)) {
            errorNotify(context, i18n.t(sentenceKey.errorArgs))
            return
        }
        exec(this.command, { windowsHide: true }, error => {
            if (context.isDev) {
                console.log('error', error)
            }
            if (isNil(error)) {
                if (context.enableOutPluginImmediately) {
                    utools.hideMainWindow()
                    utools.outPlugin()
                }
            } else {
                errorNotify(context, error?.message ?? i18n.t(sentenceKey.unknownError))
            }
        })
    }
}

export class NohupShellExecutor extends ShellExecutor {
    constructor(executor: string, path?: string, args?: string) {
        let platform: Platform = platformFromUtools()
        switch (platform) {
            case Platform.darwin:
            case Platform.linux:
                super(`nohup "${executor}" ${isNil(path) ? '' : `"${path}"`} ${args ?? ''} > /dev/null 2>&1 &`)
                break
            case Platform.win32:
                super(`powershell.exe -command "Start-Process -FilePath '${executor}' -ArgumentList '"""${path}"""'"`)
                break
            case Platform.unknown:
                super('')
                break
        }
    }
}

/**
 * Electron 执行器
 *
 * 使用 shell.openExternal 打开指定的链接, 即使用默认程度打开
 */
export class ElectronExecutor implements Executor {
    readonly command: string

    constructor(command: string) {
        this.command = command
    }

    execute(context: Context): void {
        if (isEmpty(this.command)) {
            errorNotify(context, i18n.t(sentenceKey.errorArgs))
            return
        }
        shell.openExternal(this.command)
            .then(() => {
                if (context.enableOutPluginImmediately) {
                    utools.hideMainWindow()
                    utools.outPlugin()
                }
            })
            .catch(error => {
                errorNotify(context, error?.message ?? i18n.t(sentenceKey.unknownError))
            })
    }
}

export class ElectronPathExecutor implements Executor {
    readonly command: string

    constructor(command: string) {
        this.command = command
    }

    execute(context: Context): void {
        if (isEmpty(this.command)) {
            errorNotify(context, i18n.t(sentenceKey.errorArgs))
            return
        }
        shell.openPath(this.command)
            .then(message => {
                if (isEmpty(message) && context.enableOutPluginImmediately) {
                    utools.hideMainWindow()
                    utools.outPlugin()
                } else {
                    infoNotify(context, message)
                }
            })
            .catch(error => {
                errorNotify(context, error?.message ?? i18n.t(sentenceKey.unknownError))
            })
    }

}

export class UtoolsExecutor implements Executor {
    readonly command: string

    constructor(command: string) {
        this.command = command
    }

    execute(context: Context): void {
        if (isEmpty(this.command)) {
            errorNotify(context, i18n.t(sentenceKey.errorArgs))
            return
        }
        try {
            utools.shellOpenExternal(this.command)
            if (context.enableOutPluginImmediately) {
                utools.hideMainWindow()
                utools.outPlugin()
            }
        } catch (error: any) {
            errorNotify(context, error?.message ?? i18n.t(sentenceKey.unknownError))
        }
    }
}

/**
 * 选项
 *
 * 对 uTools 模板插件中结果项的定义, 增加了 id 和 searchKey 的适配, 方便使用
 */
export interface Item {
    readonly id: string
    readonly title: string
    readonly description: string
    readonly icon: string
    readonly searchKey: Array<string>
}

/**
 * 对选项的简单抽象实现, 方便使用
 */
export abstract class ItemImpl implements Item {
    readonly id: string
    readonly title: string
    readonly description: string
    readonly icon: string
    readonly searchKey: Array<string>
    score?: number

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: Array<string>) {
        this.id = id
        this.title = title
        this.description = description
        this.icon = icon
        this.searchKey = searchKey
    }
}

/**
 * 项目选项
 *
 * 查询历史记录后的结果, 增加了用于打开该历史的 command 命令
 */
export abstract class ProjectItemImpl extends ItemImpl {
    exists: boolean
    command: Executor

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: Array<string>, exists: boolean, command: Executor) {
        super(id, title, description, icon, searchKey)
        this.exists = exists
        this.command = command
    }
}

export abstract class DatetimeProjectItemImpl extends ProjectItemImpl {
    datetime: number

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: Array<string>, exists: boolean, command: Executor, datetime: number) {
        super(id, title, description, icon, searchKey, exists, command)
        this.datetime = datetime
    }
}

/**
 * callbackSetList
 */
export type Callback<I extends Item> = (items: Array<I>) => never

export interface Action {
    code: string
    type: string
    payload: any
}

/**
 * Args 的三大操作方法
 */
export interface Args<I extends Item> {
    enter: (action: Action, callback: Callback<I>) => void
    search?: (action: Action, searchText: string, callback: Callback<I>) => void
    select?: (action: Action, item: I, callback: Callback<I>) => void
    readonly placeholder?: string
}

export abstract class ArgsImpl<I extends Item> implements Args<I> {
    abstract search?: (action: Action, searchText: string, callback: Callback<I>) => void
    abstract select?: (action: Action, item: I, callback: Callback<I>) => void
    abstract readonly placeholder?: string
    protected context: Context | undefined
    /**
     * 应用配置
     */
    protected readonly applications: Array<ApplicationImpl<ProjectItemImpl>> = []

    /**
     * 传入应用配置
     *
     * @param applications 应用配置, 可以多个聚合在一起
     */
    constructor(applications: Array<ApplicationImpl<ProjectItemImpl>>) {
        this.applications = applications
    }

    enter(action: Action, callback: Callback<I>): void {
        this.context = Context.get()
        initLanguage(this.context)
    }

    /**
     * 获取应用配置
     */
    getApplications() {
        return this.applications
    }

    /**
     * 更新应用配置
     *
     * @param nativeId 本机识别码, 用于区分不同机器上的配置
     */
    updateApplications: (nativeId: string) => void = nativeId => {
        this.applications.forEach(app => app.update(nativeId))
    }

    /**
     * 用于查询结果排序, 默认为不排序, 按查询结果的顺序显示
     *
     * @param p1
     * @param p2
     */
    compare(p1: I, p2: I): number {
        return 0
    }
}

export abstract class ProjectArgsImpl extends ArgsImpl<ProjectItemImpl> {
    /**
     * 缓存查询到的历史记录, 方便搜索时过滤
     */
    protected projectItemCache: Array<ProjectItemImpl> = []

    /**
     * 获取历史记录
     *
     * 遍历应用配置, 调用配置里定义的获取历史记录的流程把所有历史记录都查出来, 汇集到缓存里
     *
     * @param nativeId 本机识别码
     */
    getProjectItems: (nativeId: string) => Promise<Array<ProjectItemImpl>> = async nativeId => {
        this.updateApplications(nativeId)
        let platform = platformFromUtools()
        let context = Context.get()
        await Promise.allSettled(
            this.applications
                .map(async app => {
                    let finish = await app.isFinishConfig(context)
                    // 平台不适配的, 配置没有填完的, 都要被过滤掉
                    if (app.enabled && contain(app.platform, platform) && finish === ApplicationConfigState.done) {
                        return (await app.generateProjectItems(context))
                            .filter(p => context.enableFilterNonExistsFiles ? p.exists : true)
                            .forEach(p => this.projectItemCache.push(p))
                    } else if (finish === ApplicationConfigState.error) {
                        errorNotify(context, `${getName(app.name)} ${i18n.t(sentenceKey.getProjectsError)}`)
                        return
                    }
                })
                .filter(p => !isNil(p)),
        )
        return this.projectItemCache.sort(this.compare)
    }

    /**
     * 清理历史记录缓存, 防止和下一次使用时混杂在一起
     */
    clearCache() {
        this.projectItemCache = []
    }
}

/**
 * Feature 一个功能点
 */
export interface Feature<A extends Args<any>> {
    args: A
    mode: 'list' | 'none'
}

/**
 * 操作系统类型的枚举
 */
export enum Platform {
    win32,
    darwin,
    linux,
    unknown,
}

export const PLATFORM_ALL: Array<Platform> = [
    Platform.win32,
    Platform.darwin,
    Platform.linux,
]

export const PLATFORM_NO_MACOS: Array<Platform> = [
    Platform.win32,
    Platform.linux,
]

export const PLATFORM_NO_LINUX: Array<Platform> = [
    Platform.win32,
    Platform.darwin,
]

export const PLATFORM_WINDOWS: Array<Platform> = [
    Platform.win32,
]

export const PLATFORM_MACOS: Array<Platform> = [
    Platform.darwin,
]

export const PLATFORM_LINUX: Array<Platform> = [
    Platform.linux,
]

/**
 * 配置项的类型
 */
export enum SettingType {
    /**
     * 输入文本类型的配置
     */
    plain,
    /**
     * 输入路径类型的配置
     */
    path,
    /**
     * 开关类型的配置
     */
    switch,
}

export interface SettingProperties {
    readonly openFile: boolean
    readonly openDirectory: boolean
    readonly treatPackageAsDirectory: boolean
    readonly filters: Array<{ name: string, extensions: Array<string> }>
}

export class DefaultSettingProperties implements SettingProperties {
    readonly openFile: boolean = true
    readonly openDirectory: boolean = false
    readonly treatPackageAsDirectory: boolean = true
    readonly filters: Array<{ name: string, extensions: Array<string> }> = []
}

export class SelectMacAppSettingProperties extends DefaultSettingProperties {
    override readonly treatPackageAsDirectory: boolean = false
}

export interface SettingItem {
    readonly type: SettingType
    readonly id: string
    readonly name: string
    readonly value: string | boolean
    readonly description?: string | DescriptionGetter
    readonly placeholder?: string | DescriptionGetter
    readonly properties: SettingProperties
}

export abstract class SettingItemImpl implements SettingItem {
    readonly type: SettingType
    readonly id: string
    readonly name: string
    readonly value: string | boolean
    readonly description?: string | DescriptionGetter
    readonly placeholder?: string | DescriptionGetter
    readonly properties: SettingProperties

    protected constructor(
        type: SettingType,
        id: string,
        name: string,
        value: string | boolean,
        description?: string | DescriptionGetter,
        placeholder?: string | DescriptionGetter,
        properties: SettingProperties = new DefaultSettingProperties(),
    ) {
        this.type = type
        this.id = id
        this.name = name
        this.value = value
        this.description = description
        this.placeholder = placeholder
        this.properties = properties
    }
}

export class PlainSettingItem extends SettingItemImpl {
    constructor(id: string, name: string, value: string, description?: string | DescriptionGetter, placeholder?: string | DescriptionGetter, properties?: SettingProperties) {
        super(SettingType.plain, id, name, value, description, placeholder, properties)
    }
}

export class InputSettingItem extends SettingItemImpl {
    constructor(id: string, name: string, value: string, description?: string | DescriptionGetter, properties?: SettingProperties) {
        super(SettingType.path, id, name, value, description, undefined, properties)
    }
}

export class SwitchSettingItem extends SettingItemImpl {
    constructor(id: string, name: string, value: boolean, description?: string | DescriptionGetter, properties?: SettingProperties) {
        super(SettingType.switch, id, name, value, description, undefined, properties)
    }
}

export enum ApplicationConfigState {
    empty,
    undone,
    done,
    error,
}

export const GROUP_BROWSER_HISTORY = 'Browser History'
export const GROUP_BROWSER_BOOKMARK = 'Browser Bookmark'
export const GROUP_EDITOR = 'Editor'
export const GROUP_NOTES = 'Notes'
export const GROUP_IDE = 'IDE'
export const GROUP_OFFICE = 'Office'
export const GROUP_SYSTEM = 'System'

export type NameGetter = (context?: Context) => string

export type DescriptionGetter = (context?: Context) => string | undefined

/**
 * 应用
 */
export interface Application<P extends ProjectItemImpl> {
    readonly id: string
    readonly name: string | NameGetter
    readonly homepage: string
    readonly icon: string
    readonly type: string
    readonly platform: Array<Platform>
    readonly group: string
    readonly description: string | DescriptionGetter
    readonly beta: boolean
    enabled: boolean
    update: (nativeId: string) => void
    generateSettingItems: (context: Context, nativeId: string) => Array<SettingItem>
    generateProjectItems: (context: Context) => Promise<Array<P>>
    isFinishConfig: (context: Context) => Promise<ApplicationConfigState>
}

/**
 * 应用实现
 * 定义了获取 configId 和 executorId 的方法
 */
export abstract class ApplicationImpl<P extends ProjectItemImpl> implements Application<P> {
    readonly id: string
    readonly name: string | NameGetter
    readonly homepage: string
    readonly icon: string
    readonly type: string
    readonly platform: Array<Platform>
    readonly group: string
    readonly description: string | DescriptionGetter
    readonly beta: boolean
    enabled: boolean = false

    protected constructor(id: string, name: string | NameGetter, homepage: string = '', icon: string, type: string, platform: Array<Platform>, group: string = 'default', description: string | DescriptionGetter = '', beta: boolean = false) {
        this.id = id
        this.name = name
        this.homepage = homepage
        this.icon = icon
        this.type = type
        this.platform = platform
        this.group = group
        this.description = description
        this.beta = beta
    }

    enable() { return this.enabled }

    disEnable() { return !this.enable() }

    update(nativeId: string) {
        this.enabled = utools.dbStorage.getItem(this.enabledId(nativeId)) ?? false
    }

    enabledId(nativeId: string): string {
        return `${nativeId}/${this.id}-enabled`
    }

    // Enable Setting 作为顶层设置项固定显示在 SettingCard 里, 不在额外设置, 为了保留兼容性
    // SettingCard 中还是会引用 ApplicationImpl 中设置的 EnableId 信息
    // 此外 application 的 enable 也需要自身更新, 所以不适合提取赋值方法到其他地方
    // 综上, 这个提取操作只能作为一个比较不美观的操作作为 Setting Item 的特例
    generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return []
    }

    abstract generateProjectItems(context: Context): Promise<Array<P>>

    async isFinishConfig(context: Context): Promise<ApplicationConfigState> {
        if (this.disEnable())
            return ApplicationConfigState.empty
        return ApplicationConfigState.done
    }

    protected async nonExistsPath(path: string): Promise<boolean> {
        return await nonExistsToRead(path)
    }

    protected async existsPath(path: string): Promise<boolean> {
        return await existsToRead(path)
    }
}

export interface ApplicationCache<P extends ProjectItemImpl> {
    cache: Array<P>

    isNew(): Promise<boolean>

    generateCacheProjectItems(context: Context): Promise<Array<P>>

    clearCache(): Promise<void>
}

export abstract class ApplicationCacheImpl<P extends ProjectItemImpl> extends ApplicationImpl<P> implements ApplicationCache<P> {
    cache: Array<P> = []

    abstract generateCacheProjectItems(context: Context): Promise<Array<P>>

    abstract isNew(): Promise<boolean>

    override async generateProjectItems(context: Context): Promise<Array<P>> {
        if (await this.isNew()) {
            this.cache = await this.generateCacheProjectItems(context)
        }
        return this.cache
    }

    async clearCache(): Promise<void> {
        this.cache = []
    }
}

export abstract class ApplicationConfigImpl<P extends ProjectItemImpl> extends ApplicationImpl<P> {
    protected readonly configFilename: string
    protected config: string = ''

    constructor(id: string, name: string | NameGetter, homepage: string = '', icon: string, type: string, platform: Array<Platform>, group: string = 'default', description: string | DescriptionGetter = '', beta: boolean = false, configFilename: string) {
        super(id, name, homepage, icon, type, platform, group, description, beta)
        this.configFilename = configFilename
    }

    override update(nativeId: string) {
        super.update(nativeId)
        this.config = utools.dbStorage.getItem(this.configId(nativeId)) ?? ''
    }

    configId(nativeId: string): string {
        return `${nativeId}/${this.id}-config`
    }

    configSettingItem(context: Context, nativeId: string): SettingItem {
        return new InputSettingItem(
            this.configId(nativeId),
            `${i18n.t(sentenceKey.configPrefix)} ${getName(this.name)}「${this.configFilename}」${i18n.t(sentenceKey.configSuffix)}`,
            this.config,
            undefined,
            this.configSettingItemProperties(),
        )
    }

    configSettingItemProperties(): SettingProperties {
        return new DefaultSettingProperties()
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            ...super.generateSettingItems(context, nativeId),
            this.configSettingItem(context, nativeId),
        ]
    }

    override async isFinishConfig(context: Context): Promise<ApplicationConfigState> {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.config)) {
            return ApplicationConfigState.undone
        } else if (await this.nonExistsPath(this.config)) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }

    abstract defaultConfigPath(): string
}

export abstract class ApplicationCacheConfigImpl<P extends ProjectItemImpl> extends ApplicationConfigImpl<P> implements ApplicationCache<P> {
    cache: Array<P> = []
    private sign: string = ''

    abstract generateCacheProjectItems(context: Context): Promise<Array<P>>

    async isNew(): Promise<boolean> {
        let last = this.sign
        this.sign = await signCalculateAsync(this.config)
        return isEmpty(last) ? true : !isEqual(this.sign, last)
    }

    override async generateProjectItems(context: Context): Promise<Array<P>> {
        if (await this.isNew()) {
            this.cache = await this.generateCacheProjectItems(context)
        }
        return this.cache
    }

    async clearCache(): Promise<void> {
        this.cache = []
    }
}

export abstract class ApplicationConfigAndExecutorImpl<P extends ProjectItemImpl> extends ApplicationConfigImpl<P> {
    protected executor: string = ''

    override update(nativeId: string) {
        super.update(nativeId)
        this.executor = utools.dbStorage.getItem(this.executorId(nativeId)) ?? ''
    }

    executorId(nativeId: string): string {
        return `${nativeId}/${this.id}-executor`
    }

    executorSettingItem(context: Context, nativeId: string): SettingItem {
        return new InputSettingItem(
            this.executorId(nativeId),
            `${i18n.t(sentenceKey.executorPrefix)} ${getName(this.name)} ${i18n.t(sentenceKey.executorSuffix)}`,
            this.executor,
            undefined,
            this.executorSettingItemProperties(),
        )
    }

    executorSettingItemProperties(): SettingProperties {
        return new DefaultSettingProperties()
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            ...super.generateSettingItems(context, nativeId),
            this.executorSettingItem(context, nativeId),
        ]
    }

    override async isFinishConfig(context: Context): Promise<ApplicationConfigState> {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.config) || isEmpty(this.executor)) {
            return ApplicationConfigState.undone
        } else if ((await this.nonExistsPath(this.config)) || (await this.nonExistsPath(this.executor))) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }

    abstract defaultExecutorPath(): string
}

export abstract class ApplicationCacheConfigAndExecutorImpl<P extends ProjectItemImpl> extends ApplicationConfigAndExecutorImpl<P> implements ApplicationCache<P> {
    cache: Array<P> = []
    private sign: string = ''

    abstract generateCacheProjectItems(context: Context): Promise<Array<P>>

    async isNew(): Promise<boolean> {
        let last = this.sign
        this.sign = await signCalculateAsync(this.config)
        return isEmpty(last) ? true : !isEqual(this.sign, last)
    }

    override async generateProjectItems(context: Context): Promise<Array<P>> {
        if (await this.isNew()) {
            this.cache = await this.generateCacheProjectItems(context)
        }
        return this.cache
    }

    async clearCache(): Promise<void> {
        this.cache = []
    }
}
