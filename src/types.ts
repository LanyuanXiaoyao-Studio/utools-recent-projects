import {contain, isEmpty, isNil} from 'licia'
import {exec} from 'child_process'
import {shell} from 'electron'
import {platformFromUtools} from './utils'
import {existsSync} from 'fs'
import {enableFilterNonExistsFilesId} from './setting/components/ApplicationSettingCard'

/**
 * 命令执行器
 */
export interface Executor {
    readonly command: string
    execute: () => void
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

    execute(): void {
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

    execute(): void {
        if (isEmpty(this.command)) {
            utools.showNotification('参数错误，请向作者反馈')
            return
        }
        exec(this.command, error => {
            console.log('error', error)
            if (isNil(error)) {
                utools.hideMainWindow()
                utools.outPlugin()
            } else {
                utools.showNotification(error?.message ?? '未知错误，请向作者反馈')
            }
        })
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

    execute(): void {
        if (isEmpty(this.command)) {
            utools.showNotification('参数错误，请向作者反馈')
            return
        }
        shell.openExternal(this.command)
            .then(() => {
                utools.hideMainWindow()
                utools.outPlugin()
            })
            .catch(error => utools.showNotification(error?.message ?? '未知错误，请向作者反馈'))
    }
}

/**
 * 选项
 *
 * 对 uTools 模板插件中结果项的定义, 增加了 id 和 searchKey 的适配, 方便使用
 */
export interface Item {
    id: string
    title: string
    description: string
    icon: string
    searchKey: string
}

/**
 * 对选项的简单抽象实现, 方便使用
 */
export abstract class ItemImpl implements Item {
    id: string
    title: string
    description: string
    icon: string
    searchKey: string

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: string) {
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

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: string, exists: boolean, command: Executor) {
        super(id, title, description, icon, searchKey)
        this.exists = exists
        this.command = command
    }
}

export abstract class DatetimeProjectItemImpl extends ProjectItemImpl {
    datetime: number

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: string, exists: boolean, command: Executor, datetime: number) {
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
    abstract enter: (action: Action, callback: Callback<I>) => void
    abstract search?: (action: Action, searchText: string, callback: Callback<I>) => void
    abstract select?: (action: Action, item: I, callback: Callback<I>) => void
    abstract readonly placeholder?: string

    /**
     * 应用配置
     */
    applications: Array<Application<ProjectItemImpl>> = []

    /**
     * 传入应用配置
     *
     * @param applications 应用配置, 可以多个聚合在一起
     */
    constructor(applications: Array<Application<ProjectItemImpl>>) {
        this.applications = applications
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
    projectItemCache: Array<ProjectItemImpl> = []

    /**
     * 获取历史记录
     *
     * 遍历应用配置, 调用配置里定义的获取历史记录的流程把所有历史记录都查出来, 汇集到缓存里
     *
     * @param localId 本机识别码
     */
    getProjectItems: (localId: string) => Promise<Array<ProjectItemImpl>> = async localId => {
        this.updateApplications(localId)
        let platform = platformFromUtools()
        let enableFilterNonExistsFiles = utools.dbStorage.getItem(enableFilterNonExistsFilesId(localId)) ?? false
        for (let app of this.applications) {
            let finish = app.isFinishConfig()
            // 平台不适配的, 配置没有填完的, 都要被过滤掉
            if (finish === ApplicationConfigState.done && contain(app.platform, platform)) {
                (await app.generateProjectItems())
                    .filter(p => enableFilterNonExistsFiles ? p.exists : true)
                    .forEach(p => this.projectItemCache.push(p))
            } else if (finish === ApplicationConfigState.error) {
                utools.showNotification(`${app.name} 获取项目记录错误, 请检查配置`)
            }
        }
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
export interface Feature<I extends Item> {
    args: Args<I>
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

/**
 * 配置项的类型
 */
export enum SettingType {
    /**
     * 输入文本类型的配置
     */
    path,
    /**
     * 开关类型的配置
     */
    switch,
}

/**
 * 配置值类型
 */
export type SettingValue = string | boolean

export interface SettingItem {
    readonly type: SettingType
    readonly id: string
    readonly name: string
    readonly value: SettingValue
    readonly description?: string
}

export abstract class SettingItemImpl implements SettingItem {
    readonly type: SettingType
    readonly id: string
    readonly name: string
    readonly value: SettingValue
    readonly description?: string


    protected constructor(type: SettingType, id: string, name: string, value: SettingValue, description?: string) {
        this.type = type
        this.id = id
        this.name = name
        this.value = value
        this.description = description
    }
}

export class InputSettingItem extends SettingItemImpl {
    constructor(id: string, name: string, value: string, description?: string) {
        super(SettingType.path, id, name, value, description)
    }
}

export class SwitchSettingItem extends SettingItemImpl {
    constructor(id: string, name: string, value: boolean, description?: string) {
        super(SettingType.switch, id, name, value, description)
    }
}

export enum ApplicationConfigState {
    empty,
    undone,
    done,
    error,
}

export enum GroupName {
    browser,
    editor,
    ide,
    jetbrains,
    vsStudio,
    xcode,
    office,
}

export const Group: { [keys in GroupName]: string } = {
    [GroupName.browser]: 'Browser',
    [GroupName.editor]: 'Editor',
    [GroupName.ide]: 'IDE',
    [GroupName.jetbrains]: 'JetBrains',
    [GroupName.vsStudio]: 'Visual Studio',
    [GroupName.xcode]: 'Xcode',
    [GroupName.office]: 'Office',
}

/**
 * 应用
 */
export interface Application<P extends ProjectItemImpl> {
    readonly id: string
    readonly name: string
    readonly icon: string
    readonly type: string
    readonly platform: Array<Platform>
    readonly group: string
    readonly beta: boolean
    readonly description: string
    config: string
    configId: (nativeId: string) => string
    executor: string
    executorId: (nativeId: string) => string
    update: (nativeId: string) => void
    generateSettingItems: (nativeId: string) => Array<SettingItem>
    generateProjectItems: () => Promise<Array<P>>
    isFinishConfig: () => ApplicationConfigState
}

/**
 * 应用实现
 * 定义了获取 configId 和 executorId 的方法
 */
export abstract class ApplicationImpl<P extends ProjectItemImpl> implements Application<P> {
    readonly id: string
    readonly name: string
    readonly icon: string
    readonly type: string
    readonly platform: Array<Platform>
    readonly group: string
    readonly configFilename: string
    readonly description: string
    readonly beta: boolean
    config: string = ''
    executor: string = ''

    protected constructor(id: string, name: string, icon: string, type: string, platform: Array<Platform>, group: string = 'default', configFilename: string, description: string = '', beta: boolean = false) {
        this.id = id
        this.name = name
        this.icon = icon
        this.type = type
        this.platform = platform
        this.group = group
        this.configFilename = configFilename
        this.description = description
        this.beta = beta
    }

    configId(nativeId: string): string {
        return `${nativeId}/${this.id}-config`
    }


    executorId(nativeId: string): string {
        return `${nativeId}/${this.id}-executor`
    }

    update(nativeId: string) {
        this.config = utools.dbStorage.getItem(this.configId(nativeId))
        this.executor = utools.dbStorage.getItem(this.executorId(nativeId))
    }

    generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `设置 ${this.name} 「${this.configFilename}」文件路径`,
                this.config,
            ),
            new InputSettingItem(
                this.executorId(nativeId),
                `设置 ${this.name} 可执行程序路径`,
                this.executor,
            ),
        ]
    }

    isFinishConfig(): ApplicationConfigState {
        if (isEmpty(this.config) && isEmpty(this.executor)) {
            return ApplicationConfigState.empty
        } else if (isEmpty(this.config) || isEmpty(this.executor)) {
            return ApplicationConfigState.undone
        } else if (this.nonExistsPath(this.config) || this.nonExistsPath(this.executor)) {
            return ApplicationConfigState.error
        } else {
            return ApplicationConfigState.done
        }
    }

    abstract generateProjectItems(): Promise<Array<P>>

    protected nonExistsPath(path: string): boolean {
        return !this.existsPath(path)
    }

    protected existsPath(path: string): boolean {
        return existsSync(path)
    }
}
