import {Application, ProjectItemImpl, SettingType} from '../../types'
import {Component, Fragment, Img} from 'nano-jsx'
import {isEmpty, isNil} from 'licia'
import {iconMap} from '../../icon'
import {settingStore} from '../store'
import {Context} from '../../context'
import Nano = require('nano-jsx')
import fs = require('fs')

export interface SettingCardProps {
    context: Context
    application: Application<ProjectItemImpl>
}

export interface SettingCardState {}

export class SettingCard extends Component<SettingCardProps, SettingCardState> {
    store = settingStore.use()

    pathExistsCache: { [key: string]: boolean } = {}

    constructor(props: SettingCardProps) {
        super(props)
    }

    override didUnmount(): any {
        this.store.cancel()
    }

    updateApplication() {
        this.props.application.update(utools.getNativeId())
    }

    updateApplicationUI() {
        this.updateApplication()
        this.update()
        this.store.setState({ catalogueUpdate: !this.store.state.catalogueUpdate })
    }

    select(event, id: string, name: string) {
        let result = utools.showOpenDialog({
            title: name,
            message: name,
            properties: [
                'openFile',
                'treatPackageAsDirectory',
                'showHiddenFiles',
            ],
        })
        if (isNil(result) || isEmpty(result)) {
            alert('路径不存在或是您主动取消选择')
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    alert('路径指示的文件不存在或已被删除')
                    event.target.value = ''
                    return
                }
                this.pathExistsCache[path] = true
                utools.dbStorage.setItem(id, path)
                this.updateApplicationUI()
            }
        }
    }

    input(event, id: string) {
        let inputValue = event.target?.value
        if (isNil(inputValue)) {
            alert('出现未知的输入错误')
        } else if (isEmpty(inputValue)) {
            return
        } else {
            let path = inputValue
            if (!fs.existsSync(path)) {
                alert('路径指示的文件不存在或已被删除')
                event.target.value = ''
                return
            }
            this.pathExistsCache[path] = true
            utools.dbStorage.setItem(id, path)
            this.updateApplicationUI()
        }
    }

    switch(id: string, value: boolean) {
        utools.dbStorage.setItem(id, value)
        this.updateApplicationUI()
    }

    clear(id: string) {
        utools.dbStorage.removeItem(id)
        this.updateApplicationUI()
    }

    pathExists(path: string): boolean {
        if (isEmpty(path)) {
            return true
        }
        let exists = this.pathExistsCache[path]
        if (isNil(exists)) {
            exists = fs.existsSync(path)
            this.pathExistsCache[path] = exists
            return exists
        }
        return exists
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    class="gap"
                    id={this.props.application.id}
                />
                <div class="form-item setting-card card">
                    <div class="card-mark">{this.props.application.group}</div>
                    <div
                        class={this.props.application.beta ? 'form-legend card-header tooltip tooltip-top' : 'form-legend card-header'}
                        data-tooltip="beta 意味着这个功能处于试验阶段
但我无法测试所有使用场景
需要你在遇到无法正常使用的时候积极向我反馈"
                    >
                        <Img
                            class="icon"
                            src={iconMap[this.props.application.icon] ?? ''}
                        />
                        <span
                            class={this.props.application.beta ? 'title badge badge-unready' : 'title'}
                            data-badge="beta"
                        >
                            {this.props.application.name}
                        </span>
                    </div>
                    <div class="form-group card-body">
                        {isEmpty(this.props.application.description) ?
                            <span/>
                            :
                            <blockquote class="card-description">
                                <cite>{this.props.application.description}</cite>
                            </blockquote>}
                        {this.props.application.generateSettingItems(this.props.context, utools.getNativeId()).map(item => {
                            switch (item.type) {
                                case SettingType.path:
                                    return (
                                        <div class="form-group">
                                            <div class="form-label">{item.name}</div>
                                            {isEmpty(item.description)
                                                ? <Fragment/>
                                                :
                                                <div class="setting-item-description">{item.description}</div>}
                                            <div class="input-group">
                                                {this.props.context.enableEditPathInputDirectly
                                                    ? <Fragment>
                                                        <input
                                                            type="text"
                                                            class={`form-input input-sm ${this.pathExists(item.value as string) ? '' : 'is-error'}`}
                                                            value={item.value == null ? '' : item.value}
                                                            placeholder="输入文件路径"
                                                            onblur={event => this.input(event, item.id)}
                                                        />
                                                    </Fragment>
                                                    : <Fragment>
                                                        <input
                                                            type="text"
                                                            class={`form-input input-sm ${this.pathExists(item.value as string) ? '' : 'is-error'}`}
                                                            value={item.value == null ? '' : item.value}
                                                            placeholder="点击输入框选择路径"
                                                            onclick={event => this.select(event, item.id, item.name)}
                                                            readonly
                                                        />
                                                    </Fragment>}
                                                <button
                                                    class="btn btn-error btn-sm input-group-btn"
                                                    onclick={() => this.clear(item.id)}
                                                >
                                                    <i class="icon icon-cross"/>
                                                </button>
                                            </div>
                                            <div
                                                class="form-input-hint-error"
                                                style={`display: ${this.pathExists(item.value as string) ? 'none' : 'block'}`}
                                            >
                                                文件路径不存在
                                            </div>
                                        </div>
                                    )
                                case SettingType.switch:
                                    return (
                                        <div class="form-group d-flex">
                                            <div class="col-10 col-mr-auto">
                                                <div class="form-label">{item.name}</div>
                                                {isEmpty(item.description)
                                                    ? <Fragment/>
                                                    :
                                                    <div class="setting-item-description">{item.description}</div>}
                                            </div>
                                            <div class="col-1 flex-column-center">
                                                <label class="form-switch float-right">
                                                    {item.value
                                                        ? <input
                                                            type="checkbox"
                                                            checked
                                                            onchange={() => this.switch(item.id, false)}
                                                        />
                                                        : <input
                                                            type="checkbox"
                                                            onchange={() => this.switch(item.id, true)}
                                                        />}
                                                    <i class="form-icon"/>
                                                </label>
                                            </div>
                                        </div>
                                    )
                            }
                        })}
                    </div>
                </div>
            </Fragment>
        )
    }
}
