import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip} from '../Chips'
import {Context} from '../../../../Context'

export class GetFileIcon extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.getFileIcon)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.getFileIconDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableGetFileIcon ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableGetFileIconId, !this.localContext.enableGetFileIcon)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
