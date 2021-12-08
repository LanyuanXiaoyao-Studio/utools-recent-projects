import Nano, {Fragment} from 'nano-jsx'
import {SwitchSettingItem} from '../../../../Types'
import {AdapterSettingItem, AdapterSettingItemProps, AdapterSettingItemState} from '../AdapterSettingItem'
import {isEmpty} from 'licia'

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
