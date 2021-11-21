import Nano, {Fragment} from 'nano-jsx'
import {ApplicationSettingItem} from '../ApplicationSettingItem'
import {i18n, sentenceKey} from '../../../../i18n'
import {CloudSyncChip, RebootNeededChip} from '../Chips'
import {Context} from '../../../../Context'

export class Language extends ApplicationSettingItem {
    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="col-10 col-mr-auto">
                    <div class="form-label">
                        {i18n.t(sentenceKey.languageSetting)}
                    </div>
                    <div class="form-description">{i18n.t(sentenceKey.languageSettingDesc)}</div>
                    <div class="form-tags">
                        <CloudSyncChip/>
                        <RebootNeededChip/>
                    </div>
                </div>
                <div class="col-2 flex-column-center">
                    <select
                        class="form-select select-sm"
                        onchange={event => this.select(Context.languageSettingId, event.target)}
                    >
                        <option
                            value="auto"
                            {...(this.localContext.languageSetting === 'auto' ? { selected: true } : {})}
                        >{i18n.t(sentenceKey.auto)}</option>
                        <option
                            value="zh-CN"
                            {...(this.localContext.languageSetting === 'zh-CN' ? { selected: true } : {})}
                        >中文
                        </option>
                        <option
                            value="en-US"
                            {...(this.localContext.languageSetting === 'en-US' ? { selected: true } : {})}
                        >English
                        </option>
                    </select>
                </div>
            </div>
        </Fragment>)
    }
}
