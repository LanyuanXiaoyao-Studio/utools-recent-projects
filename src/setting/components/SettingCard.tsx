import {
    Application,
    DescriptionGetter,
    InputSettingItem,
    PlainSettingItem,
    ProjectItemImpl,
    SettingType,
    SwitchSettingItem,
} from '../../Types'
import Nano, {Component, Fragment, Img} from 'nano-jsx'
import {isEmpty, isFn, isNil} from 'licia'
import {iconMap} from '../../Icon'
import {settingStore} from '../Store'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import fs from 'fs'
import {Plain} from './adapter-settings/setting-items/Plain'
import {Switch} from './adapter-settings/setting-items/Switch'
import {Input} from './adapter-settings/setting-items/Input'

export interface SettingCardProps {
    context: Context
    application: Application<ProjectItemImpl>
}

export interface SettingCardState {}

export class SettingCard extends Component<SettingCardProps, SettingCardState> {
    store = settingStore.use()

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

    clear(id: string) {
        utools.dbStorage.removeItem(id)
        this.updateApplicationUI()
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
                                case SettingType.plain:
                                    return <Plain
                                        item={item as PlainSettingItem}
                                        context={this.props.context}
                                        update={() => this.updateApplicationUI()}
                                    />
                                case SettingType.path:
                                    return <Input
                                        item={item as InputSettingItem}
                                        context={this.props.context}
                                        update={() => this.updateApplicationUI()}
                                    />
                                case SettingType.switch:
                                    return <Switch
                                        item={item as SwitchSettingItem}
                                        context={this.props.context}
                                        update={() => this.updateApplicationUI()}
                                    />
                            }
                        })}
                    </div>
                </div>
            </Fragment>
        )
    }
}
