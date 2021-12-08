import { Component } from "nano-jsx";

export interface AdapterSettingItemProps {
    update: () => void
}

export interface AdapterSettingItemState { }

export class AdapterSettingItem<props extends AdapterSettingItemProps, state extends AdapterSettingItemState> extends Component<props, state> {
    protected clear(id: string) {
        utools.dbStorage.removeItem(id)
        this.props.update()
    }
}
