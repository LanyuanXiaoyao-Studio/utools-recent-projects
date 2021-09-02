import {Application, ProjectItemImpl, SettingType} from '../../types'
import {Component, Fragment, Img} from 'nano-jsx'
import {isEmpty, isNil} from 'licia'
import {iconMap} from '../../icon'
import {settingStore} from '../store'
import Nano = require('nano-jsx')
import fs = require('fs')

export interface SettingCardProps {
    application: Application<ProjectItemImpl>
}

export interface SettingCardState {}

export class SettingCard extends Component<SettingCardProps, SettingCardState> {
    store = settingStore.use()

    pathExistsCache: { [key: string]: boolean } = {}

    constructor(props: SettingCardProps) {
        super(props)
    }

    didUnmount(): any {
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

    select(id: string, name: string) {
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
                }
                this.pathExistsCache[path] = true
                utools.dbStorage.setItem(id, path)
                this.updateApplicationUI()
            }
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

    render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    class="gap"
                    id={this.props.application.id}
                />
                <div class="form-item setting-card card">
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
                        {this.props.application.generateSettingItems(utools.getNativeId()).map(item => {
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
                                                <input
                                                    type="text"
                                                    class={`form-input input-sm ${this.pathExists(item.value as string) ? '' : 'is-error'}`}
                                                    value={item.value == null ? '' : item.value}
                                                    placeholder="点击输入框选择路径"
                                                    onclick={() => this.select(item.id, item.name)}
                                                    readonly
                                                />
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
                                        <div class="form-group">
                                            <div class="form-label">{item.name}</div>
                                            {isEmpty(item.description)
                                                ? <Fragment/>
                                                :
                                                <div class="setting-item-description">{item.description}</div>}
                                            <label class="form-switch">
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
                                    )
                            }
                        })}
                    </div>
                </div>
            </Fragment>
        )
    }
}
