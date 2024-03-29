import {contain} from 'licia'
import Nano, {Component, Fragment} from 'nano-jsx'
import {applications} from '../Applications'
import {Context} from '../Context'
import {i18n, sentenceKey} from '../i18n'
import {ApplicationImpl, Platform, ProjectItemImpl} from '../Types'
import {compareChar, isDevelopment, platformFromUtools} from '../Utils'
import {Announcement} from './components/Announcement'
import {ApplicationSettingCard} from './components/application-settings/ApplicationSettingCard'
import {Catalogue} from './components/Catalogue'
import {InformationCard} from './components/InformationCard'
import {SettingCard} from './components/SettingCard'
import {CustomCss, SpectreCss, SpectreIconCss, ToastifyCss} from './css'

interface RootProps {
    context: Context
}

interface RootState {
    applications: Array<ApplicationImpl<ProjectItemImpl>>
    platform: Platform
}

class Root extends Component<RootProps, RootState> {
    constructor(props: RootProps) {
        super(props)

        let platform = platformFromUtools()
        this.state = {
            applications: applications.filter(app => contain(app.platform, platform)),
            platform: platform,
        }
        this.state.applications.forEach(app => app.update(utools.getNativeId()))
    }

    override render() {
        return (
            <Fragment>
                <head>
                    <title/>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    {/*引入样式文件*/}
                    <style class="custom">{SpectreCss}</style>
                    <style class="custom">{SpectreIconCss}</style>
                    <style class="custom">{ToastifyCss}</style>
                    <style class="custom">{CustomCss}</style>
                    {/*保留 uTools 模板插件原本的 js 文件*/}
                    <script src="index.js"/>
                </head>
                <body>
                    {/*保留 uTools 模板插件原本的布局*/}
                    <div id="root"/>
                    <div class={utools.isDarkColors() ? 'container dark' : 'container'}>
                        <div class="columns">
                            <div class="column col-3">
                                {/*左侧导航栏*/}
                                <Catalogue
                                    applications={this.state.applications}
                                    context={this.props.context}
                                />
                            </div>
                            <div class="column col-9">
                                {isDevelopment()
                                    ? <Fragment>
                                        <div class="text-error text-center">
                                            <b>{i18n.t(sentenceKey.devTip)}</b>
                                        </div>
                                    </Fragment>
                                    : <Fragment/>}
                                {/*右侧配置信息*/}
                                {/*用户和系统信息*/}
                                <InformationCard
                                    context={this.props.context}
                                    platform={this.state.platform}
                                />
                                <ApplicationSettingCard context={this.props.context}/>
                                {/*具体应用配置信息*/}
                                {this.state.applications
                                    .sort((a1, a2) => compareChar(a1.group, a2.group))
                                    .map(app => (
                                        <SettingCard
                                            context={this.props.context}
                                            application={app}
                                        />
                                    ))}
                                <div class="gap"/>
                                <div class="gap"/>
                            </div>
                        </div>
                        <Announcement/>
                    </div>
                </body>
            </Fragment>
        )
    }
}

export class ApplicationUI {
    render(context: Context, root: HTMLElement) {
        Nano.render(<Root context={context}/>, root)
    }
}
