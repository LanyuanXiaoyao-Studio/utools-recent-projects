import {Application, ProjectItemImpl} from '../../types'
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

    select(id: string) {
        let result = utools.showOpenDialog({
            properties: [
                'openFile',
                'treatPackageAsDirectory',
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
                utools.dbStorage.setItem(id, path)
                this.updateApplicationUI()
            }
        }
    }

    clear(id: string) {
        utools.dbStorage.removeItem(id)
        this.updateApplicationUI()
    }

    render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    class="gap"
                    id={this.props.application.id}
                />
                <div class="form-item card">
                    <div class="form-legend card-header">
                        <Img
                            class="form-legend-icon"
                            src={iconMap[this.props.application.icon]}
                        />
                        <span class="form-legend-title">{this.props.application.name}</span>
                    </div>
                    <div class="form-group card-body">
                        {this.props.application.generateSettingItems(utools.getNativeId()).map(item => (
                            <Fragment>
                                <div class="form-label">{item.name}</div>
                                <div class="input-group">
                                    <input
                                        type="text"
                                        class="form-input input-sm"
                                        value={item.value == null ? '' : item.value}
                                        placeholder="点击输入框选择路径"
                                        onclick={() => this.select(item.id)}
                                        readonly
                                    />
                                    <button
                                        class="btn btn-error btn-sm input-group-btn"
                                        onclick={() => this.clear(item.id)}
                                    >
                                        <i class="icon icon-cross"/>
                                    </button>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Fragment>
        )
    }
}