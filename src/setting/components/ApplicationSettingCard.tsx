import {Component, Fragment, Img} from 'nano-jsx'
import {Context} from '../../context'
import {i18n, sentenceKey} from '../../i18n'
import Nano = require('nano-jsx')

class CloudSyncChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip="同账号的设备同步生效"
                >
                    <span class="chip c-hand cloud">全局</span>
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
                    data-tooltip="仅当前设备生效"
                >
                    <span class="chip c-hand native">本地</span>
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
                    data-tooltip="完全关闭插件页面并重新打开"
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
                    data-tooltip={'功能仅供预览\n后期可能会移除'}
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
        Context.updateNative(id, value)
        this.localContext = Context.get()
        this.update()
    }

    select(id: string, element: HTMLSelectElement) {
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
                                        {this.localContext.languageSetting === 'auto'
                                            ? <option
                                                value="auto"
                                                selected
                                            >{i18n.t(sentenceKey.auto)}</option>
                                            : <option value="auto">{i18n.t(sentenceKey.auto)}</option>}
                                        {this.localContext.languageSetting === 'zh-CN'
                                            ? <option
                                                value="zh-CN"
                                                selected
                                            >中文</option>
                                            : <option value="zh-CN">中文</option>}
                                        {this.localContext.languageSetting === 'en-US'
                                            ? <option
                                                value="en-US"
                                                selected
                                            >English</option>
                                            : <option value="en-US">English</option>}
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
                                        {this.localContext.enableOpenNotification
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableOpenNotificationId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableOpenNotificationId, true)}
                                            />}
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
                                        {this.localContext.enableEditPathInputDirectly
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableEditPathInputDirectlyId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableEditPathInputDirectlyId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div
                                class="divider text-center"
                                data-content="搜索"
                            />
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
                                        {this.localContext.enableFuzzyMatch
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableFuzzyMatchId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableFuzzyMatchId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div
                                class="divider text-center"
                                data-content="文件"
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
                                        {this.localContext.enableFilterNonExistsFiles
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableFilterNonExistsFilesId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableFilterNonExistsFilesId, true)}
                                            />}
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
                                        {this.localContext.enableGetFileIcon
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableGetFileIconId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableGetFileIconId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div
                                class="divider text-center"
                                data-content="浏览器"
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
                                        {this.localContext.enableGetFaviconFromNet
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableGetFaviconFromNetId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableGetFaviconFromNetId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
