import {Component} from 'nano-jsx'
import {Context} from '../../../Context'

export interface AdapterSettingItemProps {
    context: Context
    update: () => void
}

export interface AdapterSettingItemState {}

export class AdapterSettingItem<props extends AdapterSettingItemProps, state extends AdapterSettingItemState> extends Component<props, state> {
    protected clear(id: string) {
        utools.dbStorage.removeItem(id)
        this.props.update()
    }
}
