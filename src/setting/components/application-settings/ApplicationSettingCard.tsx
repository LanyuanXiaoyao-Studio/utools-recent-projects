import Nano, {Component, Fragment, Img} from 'nano-jsx'
import {Context} from '../../../Context'
import {i18n, sentenceKey} from '../../../i18n'

class CloudSyncChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.cloudDesc)}
                >
                    <span class="chip c-hand cloud">{i18n.t(sentenceKey.cloud)}</span>
                </span>
            </Fragment>
        )
    }
}

class NativeChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.localDesc)}
                >
                    <span class="chip c-hand native">{i18n.t(sentenceKey.local)}</span>
                </span>
            </Fragment>
        )
    }
}

class RebootNeededChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.needRebootDesc)}
                >
                    <span class="chip c-hand need-reboot">{i18n.t(sentenceKey.needReboot)}</span>
                </span>
            </Fragment>
        )
    }
}

class TestChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.settingBetaDesc)}
                >
                    <span class="chip c-hand test">{i18n.t(sentenceKey.beta)}</span>
                </span>
            </Fragment>
        )
    }
}

export interface ApplicationSettingCardProps {
    context: Context
}

export interface ApplicationSettingCardState {}

export class ApplicationSettingCard extends Component<ApplicationSettingCardProps, ApplicationSettingCardState> {
    private icon: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAmVBMVEUAAABceIhgfYtffYxgfYtffYtgfYtgfItgfYtffYxgfItgfItgfotgfotgfotgfYtgfYtgfYtgfYtgfoxgfYtgfYtgfYxgfYtEWmRgfYtgfYtFWmRFWWRgfYtEWmRFWWNgfYtEWmRFWmRFWmNFWmREWmVFWmRFWmRFWmRFWmRFWWRgfYtFWmRJYGtceIVYc4BOZnJRa3dVbnsdBSFyAAAAK3RSTlMADvll57nxOttNn3YsjIFEHMNZJK5tFtHyypdHFjLXtKaTMyR2YePLvoKcxDF7bgAABKlJREFUeNrs1+tyokAQBeDDyEVEEEHWaDQxiVYl6Rm8vP/D7dZuys0qNNNsjb/8HmCmge4zA+7u7u7uevGa4Ta8maJmfoxbGFErleMGhtRugBtQ1C6Dex4xlnBvTIwZ3IuIMYV7BTGGcK8ihoJ7GXE8ODciTgnnAuJEcG5BnBjO+cSp4JwiTgbXPKKbZHFRjZkklmfxYBlDwJsTUTBpWmhILLVpKNxLfGF7pPTbvMC/Ep+6BRcl5Gkova2U6pztlYezgU92RjnOxhvFfB6LrAnT/GulKVlTCf6Igj4hEV+stiwBZIokFiWAYsGclaJL32wSkFA4qK7XSWAjIVt1vf+lru2rytHtR2i19+lg9Jk5nOyq2AiOW0Z9NPqKOTI1CE7LNXXZG93C7KnLHF2mou3lJVTgFcQ76A6H+r/60POJc9LdzIlYI3Ayu8fnHYgV8YcAw2hLhg9JtJtxs2e0NVNTr1/oiWT//hX4HlrM2fcvYvrc2yrZ/v0rUGvxCB612FH8E50y8ad74EKxEP5xGN2DkV6eff4DyB2ZAkQXkVr3VFMLNUGTRIkSuH8mhzGarYeyF/D0st3tti9PwlcwLdEqte+Ah483fHn7eLDvApWBE/uWI/C5wjerT9tBGEbg5YFVBmxxYWeXBSMPnSrV3YKPuPJo0YZhgSZ8Lxru+b/bdn6DIIellJ+BdzR65+dAZbAXh9w18BWNXvW109/uG0PCZ4bwGS2euUGcQYTrwR1a7LgunEOi5HpwhRYrrgtDSERMAT/bNbvdxGEgCk9MnLD5Ify0CSwtLYsErYY0wPs/3K72oqWRfWwTu1KlfrdcMARnzvic2ZOWPXoNyIUKFHAgLQdUAGhByCTBZ9B8Cvmdqa8CXkjLCyqg9nUGNqRl4+0MFKCAJWlZggLEjY5wi5TIrEftrXFSAhrRljRsUSOS5EIdAy1YPmj60BJoASgAz0Xd0foRbPFEMptaH4CMrzhiOcRieOQr4oqsqGLjRLR/UPwBe/NEVDoMI9gX2uyox045nPf9IlmTgXTMfdRD+br3BqoHc+4TpwQphfXF6OnqIPx5sr0a4cHssXG6mx9e17so2q1fD0439DutLOZi2OUcCYHN3yChPeHTohApUGCPj6B1s2hyYNF5tgc4cV3NOHs2SKRzLt/6tYjUNl0hTD6pL680A01YR+fRpEvqW8KCzs/34/BuhMMKBy43rvo0DOj8/H7+hadxD449Tq4kIZ4Zchqe2IgFIaaCIZd2aGZVmvekMCebn4/TEszYnNsaQ8NBK5dzh+jYPTxekZkZW9CdT+DbHTJDLAmYt+5yPv3jfOne2I6MbPitGCAku5JkiUNujCVBpkQjwU6sFhTdx0AEEPf9FRa8RAMs+dEYi4D5VUwmtfsaEcvFx6Q5wyKAPbJ4En3eyEqsnn5F1zxmAogAkoRmTn3qCS5BvYG2+F+CKMie6DmWlfqTFbO71taT2V36JTutXFNoSkYICk6OxY6Cg8WqoeBUjJAUnMKgNsGphwxc4feKcwoPVIQ5hadhQEXhkQwoKDwZ7sThKXEnDk+OO3F40uCN0Dw160hS+hLSkZp5RD/88A35C2SN6arArlV4AAAAAElFTkSuQmCC`
    private localContext: Context = this.props.context

    constructor(props: ApplicationSettingCardProps) {
        super(props)
    }

    switch(id: string, value: boolean) {
        Context.update(id, value)
        this.localContext = Context.get()
        this.update()
    }

    switchNative(id: string, value: boolean) {
        Context.updateNative(id, value)
        this.localContext = Context.get()
        this.update()
    }

    select(id: string, element: HTMLSelectElement) {
        Context.update(id, element[element.selectedIndex]['value'])
        this.localContext = Context.get()
        this.update()
    }

    selectNative(id: string, element: HTMLSelectElement) {
        Context.updateNative(id, element[element.selectedIndex]['value'])
        this.localContext = Context.get()
        this.update()
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    id="application-setting-card"
                    class="gap"
                />
                <div class="form-item application-setting-card card">
                    <div class="card-header">
                        <Img
                            class="icon"
                            src={this.icon}
                        />
                        <span class="title">{i18n.t(sentenceKey.pluginSetting)}</span>
                    </div>
                    <div class="card-body">
                        <form class="form-horizontal">
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
                            <div class="divider"/>
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
                            <div class="divider"/>
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">
                                        {i18n.t(sentenceKey.inputPathDirectly)}
                                    </div>
                                    <div class="form-description">{i18n.t(sentenceKey.inputPathDirectlyDesc)}</div>
                                    <div class="form-tags">
                                        <NativeChip/>
                                        <RebootNeededChip/>
                                    </div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        <input
                                            type="checkbox"
                                            {...(this.localContext.enableEditPathInputDirectly ? { checked: true } : {})}
                                            onchange={() => this.switch(Context.enableEditPathInputDirectlyId, !this.localContext.enableEditPathInputDirectly)}
                                        />
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.search)}
                            />
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">
                                        {i18n.t(sentenceKey.pinyinIndex)}
                                    </div>
                                    <div class="form-description">{i18n.t(sentenceKey.pinyinIndexDesc)}</div>
                                    <div class="form-tags">
                                        <CloudSyncChip/>
                                    </div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        <input
                                            type="checkbox"
                                            {...(this.localContext.enablePinyinIndex ? { checked: true } : {})}
                                            onchange={() => this.switch(Context.enablePinyinIndexId, !this.localContext.enablePinyinIndex)}
                                        />
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
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
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.file)}
                            />
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">{i18n.t(sentenceKey.filterNonExistsFiles)}</div>
                                    <div class="form-description">{i18n.t(sentenceKey.filterNonExistsFilesDesc)}</div>
                                    <div class="form-tags">
                                        <CloudSyncChip/>
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
                            <div class="divider"/>
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
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.browser)}
                            />
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
                            <div class="divider"/>
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">
                                        {i18n.t(sentenceKey.historyLimit)}
                                    </div>
                                    <div class="form-description">{i18n.t(sentenceKey.historyLimitDesc)}</div>
                                    <div class="form-tags">
                                        <CloudSyncChip/>
                                    </div>
                                </div>
                                <div class="col-2 flex-column-center">
                                    <select
                                        class="form-select select-sm"
                                        onchange={event => this.select(Context.browserHistoryLimitId, event.target)}
                                    >
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
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
