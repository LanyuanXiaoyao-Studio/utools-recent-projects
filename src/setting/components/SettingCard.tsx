import {Application, DescriptionGetter, ProjectItemImpl, SettingType} from '../../types'
import {Component, Fragment, Img} from 'nano-jsx'
import {isEmpty, isFn, isNil} from 'licia'
import {iconMap} from '../../icon'
import {settingStore} from '../store'
import {Context} from '../../context'
import {i18n, sentenceKey} from '../../i18n'
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
            alert(i18n.t(sentenceKey.nonExistsPathOrCancel))
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
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
            alert(i18n.t(sentenceKey.unknownInputError))
        } else if (isEmpty(inputValue)) {
            return
        } else {
            let path = inputValue
            if (!fs.existsSync(path)) {
                alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
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
                        data-tooltip={i18n.t(sentenceKey.betaDesc)}
                    >
                        <Img
                            class="icon"
                            src={iconMap[this.props.application.icon] ?? ''}
                        />
                        <span
                            class={'title' + (this.props.application.beta ? ' badge badge-unready' : '')}
                            data-badge={i18n.t(sentenceKey.beta)}
                        >
                            {this.props.application.name}
                        </span>
                    </div>
                    <div class="form-group card-body">
                        {isNil(this.props.application.description)
                            ? <Fragment/>
                            :
                            <blockquote class="card-description">
                                <cite>
                                    {isFn(this.props.application.description)
                                        ? (this.props.application.description as DescriptionGetter)()
                                        : this.props.application.description}
                                </cite>
                            </blockquote>}
                        {this.props.application.generateSettingItems(this.props.context, utools.getNativeId()).map(item => {
                            switch (item.type) {
                                case SettingType.path:
                                    return (
                                        <div class="form-group">
                                            <div class="form-label">{item.name}</div>
                                            {isNil(item.description)
                                                ? <Fragment/>
                                                :
                                                <div class="setting-item-description">
                                                    {isFn(item.description)
                                                        ? (item.description as DescriptionGetter)()
                                                        : item.description}
                                                </div>}
                                            <div class="input-group">
                                                {this.props.context.enableEditPathInputDirectly
                                                    ? <Fragment>
                                                        <input
                                                            type="text"
                                                            class={`form-input input-sm ${this.pathExists(item.value as string) ? '' : 'is-error'}`}
                                                            value={item.value == null ? '' : item.value}
                                                            placeholder={i18n.t(sentenceKey.inputDirectlyPlaceholder)}
                                                            onblur={event => this.input(event, item.id)}
                                                        />
                                                    </Fragment>
                                                    : <Fragment>
                                                        <input
                                                            type="text"
                                                            class={`form-input input-sm ${this.pathExists(item.value as string) ? '' : 'is-error'}`}
                                                            value={item.value == null ? '' : item.value}
                                                            placeholder={i18n.t(sentenceKey.fileSelectorPlaceholder)}
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
                                                {i18n.t(sentenceKey.filePathNonExistsTips)}
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
