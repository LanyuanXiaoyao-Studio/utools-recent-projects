import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip} from '../Chips'
import {Context} from '../../../../Context'

export class NotifyFileOpen extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.notifyFileOpen)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.notifyFileOpenDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableOpenNotification ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableOpenNotificationId, !this.localContext.enableOpenNotification)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
