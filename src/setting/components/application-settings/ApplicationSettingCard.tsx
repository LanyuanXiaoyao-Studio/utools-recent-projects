import Nano, {Component, Fragment, Img} from 'nano-jsx'
import {Context} from '../../../Context'
import {i18n, sentenceKey} from '../../../i18n'
import {EnhanceConfig} from './setting-items/EnhanceConfig'
import {FilePathInMatch} from './setting-items/FilePathInMatch'
import {FilterNonExistsFiles} from './setting-items/FilterNonExistsFiles'
import {FullUrlInMatch} from './setting-items/FullUrlInMatch'
import {GetFavicon} from './setting-items/GetFavicon'
import {GetFileIcon} from './setting-items/GetFileIcon'
import {HistoryLimit} from './setting-items/HistoryLimit'
import {InputPathDirectly} from './setting-items/InputPathDirectly'
import {Language} from './setting-items/Language'
import {NotifyFileOpen} from './setting-items/NotifyFileOpen'
import {OutPluginImmediately} from './setting-items/OutPluginImmediately'
import {PinyinIndex} from './setting-items/PinyinIndex'
import {ShowBookmarkCatalogue} from './setting-items/ShowBookmarkCatalogue'

export interface EnhanceSettingItemProps {
    slot: Component
    context: Context
}

export interface EnhanceSettingItemState {}

export class EnhanceSettingItem extends Component<EnhanceSettingItemProps, EnhanceSettingItemState> {
    override render() {
        return (this.props.context.enableEnhanceConfig
            ? this.props.slot
            : <Fragment/>)
    }
}

export interface ApplicationSettingCardProps {
    context: Context
}

export interface ApplicationSettingCardState {}

export class ApplicationSettingCard extends Component<ApplicationSettingCardProps, ApplicationSettingCardState> {
    private icon: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAmVBMVEUAAABceIhgfYtffYxgfYtffYtgfYtgfItgfYtffYxgfItgfItgfotgfotgfotgfYtgfYtgfYtgfYtgfoxgfYtgfYtgfYxgfYtEWmRgfYtgfYtFWmRFWWRgfYtEWmRFWWNgfYtEWmRFWmRFWmNFWmREWmVFWmRFWmRFWmRFWmRFWWRgfYtFWmRJYGtceIVYc4BOZnJRa3dVbnsdBSFyAAAAK3RSTlMADvll57nxOttNn3YsjIFEHMNZJK5tFtHyypdHFjLXtKaTMyR2YePLvoKcxDF7bgAABKlJREFUeNrs1+tyokAQBeDDyEVEEEHWaDQxiVYl6Rm8vP/D7dZuys0qNNNsjb/8HmCmge4zA+7u7u7uevGa4Ta8maJmfoxbGFErleMGhtRugBtQ1C6Dex4xlnBvTIwZ3IuIMYV7BTGGcK8ihoJ7GXE8ODciTgnnAuJEcG5BnBjO+cSp4JwiTgbXPKKbZHFRjZkklmfxYBlDwJsTUTBpWmhILLVpKNxLfGF7pPTbvMC/Ep+6BRcl5Gkova2U6pztlYezgU92RjnOxhvFfB6LrAnT/GulKVlTCf6Igj4hEV+stiwBZIokFiWAYsGclaJL32wSkFA4qK7XSWAjIVt1vf+lru2rytHtR2i19+lg9Jk5nOyq2AiOW0Z9NPqKOTI1CE7LNXXZG93C7KnLHF2mou3lJVTgFcQ76A6H+r/60POJc9LdzIlYI3Ayu8fnHYgV8YcAw2hLhg9JtJtxs2e0NVNTr1/oiWT//hX4HlrM2fcvYvrc2yrZ/v0rUGvxCB612FH8E50y8ad74EKxEP5xGN2DkV6eff4DyB2ZAkQXkVr3VFMLNUGTRIkSuH8mhzGarYeyF/D0st3tti9PwlcwLdEqte+Ah483fHn7eLDvApWBE/uWI/C5wjerT9tBGEbg5YFVBmxxYWeXBSMPnSrV3YKPuPJo0YZhgSZ8Lxru+b/bdn6DIIellJ+BdzR65+dAZbAXh9w18BWNXvW109/uG0PCZ4bwGS2euUGcQYTrwR1a7LgunEOi5HpwhRYrrgtDSERMAT/bNbvdxGEgCk9MnLD5Ify0CSwtLYsErYY0wPs/3K72oqWRfWwTu1KlfrdcMARnzvic2ZOWPXoNyIUKFHAgLQdUAGhByCTBZ9B8Cvmdqa8CXkjLCyqg9nUGNqRl4+0MFKCAJWlZggLEjY5wi5TIrEftrXFSAhrRljRsUSOS5EIdAy1YPmj60BJoASgAz0Xd0foRbPFEMptaH4CMrzhiOcRieOQr4oqsqGLjRLR/UPwBe/NEVDoMI9gX2uyox045nPf9IlmTgXTMfdRD+br3BqoHc+4TpwQphfXF6OnqIPx5sr0a4cHssXG6mx9e17so2q1fD0439DutLOZi2OUcCYHN3yChPeHTohApUGCPj6B1s2hyYNF5tgc4cV3NOHs2SKRzLt/6tYjUNl0hTD6pL680A01YR+fRpEvqW8KCzs/34/BuhMMKBy43rvo0DOj8/H7+hadxD449Tq4kIZ4Zchqe2IgFIaaCIZd2aGZVmvekMCebn4/TEszYnNsaQ8NBK5dzh+jYPTxekZkZW9CdT+DbHTJDLAmYt+5yPv3jfOne2I6MbPitGCAku5JkiUNujCVBpkQjwU6sFhTdx0AEEPf9FRa8RAMs+dEYi4D5VUwmtfsaEcvFx6Q5wyKAPbJ4En3eyEqsnn5F1zxmAogAkoRmTn3qCS5BvYG2+F+CKMie6DmWlfqTFbO71taT2V36JTutXFNoSkYICk6OxY6Cg8WqoeBUjJAUnMKgNsGphwxc4feKcwoPVIQ5hadhQEXhkQwoKDwZ7sThKXEnDk+OO3F40uCN0Dw160hS+hLSkZp5RD/88A35C2SN6arArlV4AAAAAElFTkSuQmCC`

    private roundRound() {
        if (this.props.context.enableRoundRound) {
            utools.showNotification(i18n.t(sentenceKey.roundCloseTips))
            Context.update(Context.enableRoundRoundId, false)
        } else {
            utools.showNotification(i18n.t(sentenceKey.roundTips))
            Context.update(Context.enableRoundRoundId, true)
        }
        utools.outPlugin()
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
                            class={`icon card-icon ${this.props.context.enableRoundRound ? 'round-round' : ''}`}
                            src={this.icon}
                            onclick={() => this.roundRound()}
                        />
                        <span class="title">{i18n.t(sentenceKey.pluginSetting)}</span>
                    </div>
                    <div class="card-body">
                        <form class="form-horizontal">
                            <Language context={this.props.context}/>
                            <div class="divider"/>
                            <NotifyFileOpen context={this.props.context}/>
                            <div class="divider"/>
                            <OutPluginImmediately context={this.props.context}/>
                            <div class="divider"/>
                            <InputPathDirectly context={this.props.context}/>
                            <div class="divider"/>
                            <EnhanceConfig context={this.props.context}/>
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.search)}
                            />
                            <PinyinIndex context={this.props.context}/>
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.file)}
                            />
                            <GetFileIcon context={this.props.context}/>
                            <EnhanceSettingItem
                                slot={<Fragment>
                                    <div class="divider"/>
                                    <FilterNonExistsFiles context={this.props.context}/>
                                    <div class="divider"/>
                                    <FilePathInMatch context={this.props.context}/>
                                </Fragment>}
                                context={this.props.context}
                            />
                            <div
                                class="divider text-center"
                                data-content={i18n.t(sentenceKey.browser)}
                            />
                            <GetFavicon context={this.props.context}/>
                            <div class="divider"/>
                            <ShowBookmarkCatalogue context={this.props.context}/>
                            <EnhanceSettingItem
                                slot={<Fragment>
                                    <div class="divider"/>
                                    <FullUrlInMatch context={this.props.context}/>
                                </Fragment>}
                                context={this.props.context}
                            />
                            <EnhanceSettingItem
                                slot={<Fragment>
                                    <div class="divider"/>
                                    <HistoryLimit context={this.props.context}/>
                                </Fragment>}
                                context={this.props.context}
                            />
                            {/*<EnhanceSettingItem*/}
                            {/*    slot={<Fragment>*/}
                            {/*        <div*/}
                            {/*            class="divider text-center"*/}
                            {/*            data-content="其他"*/}
                            {/*        />*/}
                            {/*    </Fragment>}*/}
                            {/*    context={this.props.context}*/}
                            {/*/>*/}
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
