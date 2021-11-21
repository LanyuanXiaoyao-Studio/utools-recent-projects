import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip} from '../Chips'
import {Context} from '../../../../Context'

export class GetFavicon extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">{i18n.t(sentenceKey.getFavicon)}</div>
                    <div class="form-description">{i18n.t(sentenceKey.getFaviconDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableGetFaviconFromNet ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableGetFaviconFromNetId, !this.localContext.enableGetFaviconFromNet)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
