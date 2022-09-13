import Nano, {Fragment} from 'nano-jsx'
import {Context} from '../../../../Context'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip, DecreasePerformanceChip, EnhanceChip} from '../../Chips'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'

export class HistoryLimit extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">
                        {i18n.t(sentenceKey.historyLimit)}
                    </div>
                    <div class="form-description">{i18n.t(sentenceKey.historyLimitDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <EnhanceChip/>
                        <DecreasePerformanceChip/>
                    </div>
                </div>
                <div class="col-2 flex-column-center">
                    <select
                        class="form-select select-sm"
                        onchange={event => this.select(Context.browserHistoryLimitId, event.target)}
                    >
                        <option
                            value="0"
                            {...(this.localContext.browserHistoryLimit === 0 ? { selected: true } : {})}
                        >{i18n.t(sentenceKey.unlimited)}
                        </option>
                        <option
                            value="100"
                            {...(this.localContext.browserHistoryLimit === 100 ? { selected: true } : {})}
                        >100
                        </option>
                        <option
                            value="200"
                            {...(this.localContext.browserHistoryLimit === 200 ? { selected: true } : {})}
                        >200
                        </option>
                        <option
                            value="500"
                            {...(this.localContext.browserHistoryLimit === 500 ? { selected: true } : {})}
                        >500
                        </option>
                        <option
                            value="1000"
                            {...(this.localContext.browserHistoryLimit === 1000 ? { selected: true } : {})}
                        >1000
                        </option>
                    </select>
                </div>
            </div>
        </Fragment>)
    }
}
