import Nano, {Fragment} from 'nano-jsx'
import {PlainSettingItem} from '../../../../Types'
import {AdapterSettingItem, AdapterSettingItemProps, AdapterSettingItemState} from '../AdapterSettingItem'
import {isNil} from 'licia'
import {i18n, sentenceKey} from '../../../../i18n'
import {getDescription} from '../../../../Utils'

export interface PlainProps extends AdapterSettingItemProps {
    item: PlainSettingItem
}

export class Plain extends AdapterSettingItem<PlainProps, AdapterSettingItemState> {
    override render() {
        return (
            <Fragment>
                <div class="form-group">
                    <div class="form-label">{this.props.item.name}</div>
                    {isNil(this.props.item.description)
                        ? <Fragment/>
                        :
                        <div class="setting-item-description">
                            {getDescription(this.props.item.description!)}
                        </div>}
                    <div class="input-group">
                        <Fragment>
                            <input
                                type="text"
                                class={`form-input input-sm`}
                                value={this.props.item.value == null ? '' : this.props.item.value}
                                placeholder={isNil(this.props.item.placeholder)
                                    ? ''
                                    : getDescription(this.props.item.placeholder!)}
                                onblur={event => this.plain(event, this.props.item.id)}
                            />
                        </Fragment>
                        <button
                            class="btn btn-error btn-sm input-group-btn"
                            onclick={() => this.clear(this.props.item.id)}
                        >
                            <i class="icon icon-cross"/>
                        </button>
                    </div>
                </div>
            </Fragment>
        )
    }

    private plain(event, id: string) {
        let inputValue = event.target?.value
        if (isNil(inputValue)) {
            alert(i18n.t(sentenceKey.unknownInputError))
        } else {
            utools.dbStorage.setItem(id, inputValue)
            this.props.update()
        }
    }
}
