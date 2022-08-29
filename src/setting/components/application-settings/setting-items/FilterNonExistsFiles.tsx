import Nano, {Fragment} from 'nano-jsx'
import {Context} from '../../../../Context'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip, EnhanceChip} from '../../Chips'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'

export class FilterNonExistsFiles extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.filterNonExistsFiles)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.filterNonExistsFilesDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <EnhanceChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableFilterNonExistsFiles ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableFilterNonExistsFilesId, !this.localContext.enableFilterNonExistsFiles)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
