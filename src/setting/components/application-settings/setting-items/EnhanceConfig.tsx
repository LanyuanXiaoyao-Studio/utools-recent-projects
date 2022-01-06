import Nano, {Fragment} from 'nano-jsx'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'
import {CloudSyncChip, RebootNeededChip} from '../Chips'
import {Context} from '../../../../Context'
import {i18n, sentenceKey} from '../../../../i18n'

export class EnhanceConfig extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.enhanceConfig)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.enhanceConfigDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <RebootNeededChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableEnhanceConfig ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableEnhanceConfigId, !this.localContext.enableEnhanceConfig)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
