import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {NativeChip, RebootNeededChip} from '../Chips'
import {Context} from '../../../../Context'

export class InputPathDirctly extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">
                        {i18n.t(sentenceKey.inputPathDirectly)}
                    </div>
                    <div class="form-description">{i18n.t(sentenceKey.inputPathDirectlyDesc)}</div>
                    <div class="form-tags">
                        <NativeChip/>
                        <RebootNeededChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableEditPathInputDirectly ? { checked: true } : {})}
                            onchange={() => this.switchNative(Context.enableEditPathInputDirectlyId, !this.localContext.enableEditPathInputDirectly)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
