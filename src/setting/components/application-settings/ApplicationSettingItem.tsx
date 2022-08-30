import {Component} from 'nano-jsx'
import {Context} from '../../../Context'

export interface ApplicationSettingItemProps {
    context: Context
}

export interface ApplicationSettingItemState {}

export class ApplicationSettingItem<props extends ApplicationSettingItemProps, state extends ApplicationSettingItemState> extends Component<props, state> {
    protected localContext: Context = this.props.context

    switch(id: string, value: boolean) {
        Context.update(id, value)
        this.localContext = Context.get()
        this.update()
    }

    switchNative(id: string, value: boolean) {
        Context.updateNative(id, value)
        this.localContext = Context.get()
        this.update()
    }

    select(id: string, element: HTMLSelectElement) {
        Context.update(id, element[element.selectedIndex]['value'])
        this.localContext = Context.get()
        this.update()
    }

    selectNative(id: string, element: HTMLSelectElement) {
        Context.updateNative(id, element[element.selectedIndex]['value'])
        this.localContext = Context.get()
        this.update()
    }
}
