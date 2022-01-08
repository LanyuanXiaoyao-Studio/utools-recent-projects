import Nano, {Fragment} from 'nano-jsx'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip, EnhanceChip} from '../Chips'
import {Context} from '../../../../Context'

export class FullUrlInMatch extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.fullUrlInMatch)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.fullUrlInMatchDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <EnhanceChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableFullUrlInMatch ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableFullUrlInMatchId, !this.localContext.enableFullUrlInMatch)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
