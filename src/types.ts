import {contain, isEmpty, isNil} from 'licia'
import {exec} from 'child_process'
import {shell} from 'electron'
import {platformFromUtools} from './utils'

export interface Executor {
    readonly command: string
    execute: () => void
}

export class NoExecutor implements Executor {
    readonly command: string

    constructor() {
        this.command = ''
    }

    execute(): void {
    }
}

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
            if (isNil(error)) {
                utools.hideMainWindow()
                utools.outPlugin()
            } else {
                utools.showNotification(error?.message ?? '未知错误，请向作者反馈')
            }
        })
    }
}

export class UToolsExecutor implements Executor {
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
 */
export interface Item {
    id: string
    title: string
    description: string
    icon: string
    searchKey: string
}

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

export abstract class ProjectItemImpl extends ItemImpl {
    command: Executor

    protected constructor(id: string, title: string, description: string, icon: string, searchKey: string, command: Executor) {
        super(id, title, description, icon, searchKey)
        this.command = command
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

    applications: Array<Application<ProjectItemImpl>> = []

    constructor(applications: Array<Application<ProjectItemImpl>>) {
        this.applications = applications
    }

    updateApplications: (nativeId: string) => void = nativeId => {
        this.applications.forEach(app => app.update(nativeId))
    }

    compare(p1: I, p2: I): number {
        return 0
    }
}

export abstract class ProjectArgsImpl extends ArgsImpl<ProjectItemImpl> {
    projectItemCache: Array<ProjectItemImpl> = []

    getProjectItems: (localId: string) => Promise<Array<ProjectItemImpl>> = async localId => {
        this.updateApplications(localId)
        let platform = platformFromUtools()
        for (let app of this.applications) {
            if (app.isFinishConfig() === ApplicationConfigState.done && contain(app.platform, platform)) {
                (await app.generateProjectItems()).forEach(p => this.projectItemCache.push(p))
            }
        }
        return this.projectItemCache.sort(this.compare)
    }

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

export enum Platform {
    win32,
    darwin,
    linux,
    unknown,
}

export enum SettingType {
    input,
    switch,
}

export type SettingValue = string | boolean

export interface SettingItem {
    readonly type: SettingType
    readonly id: string
    readonly name: string
    readonly value: SettingValue
    readonly description?: string
}

export abstract class AbstractSettingItem implements SettingItem {
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

export class InputSettingItem extends AbstractSettingItem {
    constructor(id: string, name: string, value: string, description?: string) {
        super(SettingType.input, id, name, value, description)
    }
}

export class SwitchSettingItem extends AbstractSettingItem {
    constructor(id: string, name: string, value: boolean, description?: string) {
        super(SettingType.switch, id, name, value, description)
    }
}

export enum ApplicationConfigState {
    empty,
    undone,
    done,
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
        } else {
            return ApplicationConfigState.done
        }
    }

    abstract generateProjectItems(): Promise<Array<P>>
}
