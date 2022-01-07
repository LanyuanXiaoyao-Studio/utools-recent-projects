import Nano, {Fragment} from 'nano-jsx'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'
import {CloudSyncChip} from '../Chips'
import {Context} from '../../../../Context'
import {i18n, sentenceKey} from '../../../../i18n'

export class ShowBookmarkCatalogue extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.showBookmarkCatalogue)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.showBookmarkCatalogueDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableShowBookmarkCatalogue ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableShowBookmarkCatalogueId, !this.localContext.enableShowBookmarkCatalogue)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
