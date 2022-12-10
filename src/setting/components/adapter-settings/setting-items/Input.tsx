import fs from 'fs'
import {isEmpty, isNil} from 'licia'
import Nano, {Fragment} from 'nano-jsx'
import {i18n, sentenceKey} from '../../../../i18n'
import {InputSettingItem, SettingProperties} from '../../../../Types'
import {getDescription} from '../../../../Utils'
import {existsCacheSync} from '../../../../utils/files/SettingInputHelper'
import {AdapterSettingItem, AdapterSettingItemProps, AdapterSettingItemState} from '../AdapterSettingItem'
import {toastError, toastWarning} from '../../../../utils/notify/NotifyUtils'

export interface InputProps extends AdapterSettingItemProps {
    item: InputSettingItem
}

export class Input extends AdapterSettingItem<InputProps, AdapterSettingItemState> {
    select(event, id: string, name: string, properties: SettingProperties) {
        let mergeProperties: Array<'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent'> = []
        if (properties.openFile) {
            mergeProperties.push('openFile')
        }
        if (properties.openDirectory) {
            mergeProperties.push('openDirectory')
        }
        if (properties.treatPackageAsDirectory) {
            mergeProperties.push('treatPackageAsDirectory')
        }
        let mergeFilters: { name: string, extensions: string[] }[] = [
            ...properties.filters,
            { name: 'All Files', extensions: ['*'] },
        ]

        let result = utools.showOpenDialog({
            title: name,
            message: name,
            properties: mergeProperties,
            filters: mergeFilters,
        })
        if (isNil(result) || isEmpty(result)) {
            toastWarning(i18n.t(sentenceKey.nonExistsPathOrCancel))
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    toastError(i18n.t(sentenceKey.nonExistsFileOrDeleted))
                    event.target.value = ''
                    return
                }
                utools.dbStorage.setItem(id, path)
                this.props.update()
            }
        }
    }

    input(event, id: string) {
        let inputValue = event.target?.value
        if (isNil(inputValue)) {
            toastWarning(i18n.t(sentenceKey.unknownInputError))
        } else if (isEmpty(inputValue)) {
            return
        } else {
            let path = inputValue
            if (!fs.existsSync(path)) {
                toastError(i18n.t(sentenceKey.nonExistsFileOrDeleted))
                event.target.value = ''
                return
            }
            utools.dbStorage.setItem(id, path)
            this.props.update()
        }
    }

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
                        {this.props.context.enableEditPathInputDirectly
                            ? <Fragment>
                                <input
                                    type="text"
                                    class={`form-input input-sm ${existsCacheSync(this.props.item.value as string) ? '' : 'is-error'}`}
                                    value={this.props.item.value == null ? '' : this.props.item.value}
                                    placeholder={i18n.t(sentenceKey.inputDirectlyPlaceholder)}
                                    onBlur={event => this.input(event, this.props.item.id)}
                                />
                            </Fragment>
                            : <Fragment>
                                <input
                                    type="text"
                                    class={`form-input input-sm ${existsCacheSync(this.props.item.value as string) ? '' : 'is-error'}`}
                                    value={this.props.item.value == null ? '' : this.props.item.value}
                                    placeholder={i18n.t(sentenceKey.fileSelectorPlaceholder)}
                                    onClick={event => this.select(event, this.props.item.id, this.props.item.name, this.props.item.properties)}
                                    readOnly
                                />
                            </Fragment>}
                        <button
                            class="btn btn-error btn-sm input-group-btn"
                            onClick={() => this.clear(this.props.item.id)}
                        >
                            <i class="icon icon-cross"/>
                        </button>
                    </div>
                    <div
                        class="form-input-hint-error"
                        style={`display: ${existsCacheSync(this.props.item.value as string) ? 'none' : 'block'}`}
                    >
                        {i18n.t(sentenceKey.filePathNonExistsTips)}
                    </div>
                </div>
            </Fragment>
        )
    }
}
