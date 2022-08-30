import {isEmpty} from 'licia'
import Nano, {Fragment} from 'nano-jsx'
import {i18n, sentenceKey} from '../../../../i18n'
import {ApplicationImpl, ProjectItemImpl, SwitchSettingItem} from '../../../../Types'
import {AdapterSettingItem, AdapterSettingItemProps, AdapterSettingItemState} from '../AdapterSettingItem'

export interface SwitchProps extends AdapterSettingItemProps {
    item: SwitchSettingItem
}

export class Switch extends AdapterSettingItem<SwitchProps, AdapterSettingItemState> {
    override render() {
        return (
            <Fragment>
                <div class="form-group d-flex">
                    <div class="col-10 col-mr-auto">
                        <div class="form-label">{this.props.item.name}</div>
                        {isEmpty(this.props.item.description)
                            ? <Fragment/>
                            :
                            <div class="setting-item-description">{this.props.item.description}</div>}
                    </div>
                    <div class="col-1 flex-column-center">
                        <label class="form-switch float-right">
                            <input
                                type="checkbox"
                                {...(this.props.item.value ? { checked: true } : {})}
                                onChange={() => this.switch(this.props.item.id, !this.props.item.value)}
                            />
                            <i class="form-icon"/>
                        </label>
                    </div>
                </div>
            </Fragment>
        )
    }

    private switch(id: string, value: boolean) {
        utools.dbStorage.setItem(id, value)
        this.props.update()
    }
}

export interface EnableSwitchProps extends AdapterSettingItemProps {
    application: ApplicationImpl<ProjectItemImpl>
}

export class EnableSwitch extends AdapterSettingItem<EnableSwitchProps, AdapterSettingItemState> {
    private readonly settingItem: SwitchSettingItem

    constructor(props: EnableSwitchProps) {
        super(props)

        let nativeId = utools.getNativeId()
        this.settingItem = new SwitchSettingItem(
            props.application.enabledId(nativeId),
            i18n.t(sentenceKey.enableLabel),
            props.application.enabled,
            i18n.t(sentenceKey.enableDesc),
        )
    }

    override render() {
        return (
            <Fragment>
                <Switch
                    item={this.settingItem}
                    context={this.props.context}
                    update={() => this.props.update()}
                />
            </Fragment>
        )
    }
}
