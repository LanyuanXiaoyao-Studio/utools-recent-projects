import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip, TestChip} from '../Chips'
import {Context} from '../../../../Context'

export class FuzzyMatch extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">
                        {i18n.t(sentenceKey.fuzzyMatch)}
                    </div>
                    <div class="form-description">{i18n.t(sentenceKey.fuzzyMatchDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <TestChip/>
                    </div>
                </div>
                <div class="col-1 flex-column-center">
                    <label class="form-switch">
                        <input
                            type="checkbox"
                            {...(this.localContext.enableFuzzyMatch ? { checked: true } : {})}
                            onchange={() => this.switch(Context.enableFuzzyMatchId, !this.localContext.enableFuzzyMatch)}
                        />
                        <i class="form-icon"/>
                    </label>
                </div>
            </div>
        </Fragment>)
    }
}
