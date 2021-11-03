import Nano, {Component, Fragment} from 'nano-jsx'
import {CustomCss, SpectreCss, SpectreIconCss} from './css'
import {Application, Platform, ProjectItemImpl} from '../Types'
import {SettingCard} from './components/SettingCard'
import {Catalogue} from './components/Catalogue'
import {Announcement} from './components/Announcement'
import {contain} from 'licia'
import {InformationCard} from './components/InformationCard'
import {compareChar, platformFromUtools} from '../Utils'
import {ApplicationSettingCard} from './components/ApplicationSettingCard'
import {Context} from '../Context'
import {applications} from '../Applications'

interface RootProps {
    context: Context
}

interface RootState {
    applications: Array<Application<ProjectItemImpl>>
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
                    <style class="custom">{CustomCss}</style>
                    {/*保留 uTools 模板插件原本的 js 文件*/}
                    <script src="index.js"/>
                </head>
                <body style={{ padding: '5px' }}>
                    {/*保留 uTools 模板插件原本的布局*/}
                    <div id="root"/>
                    <div class={utools.isDarkColors() ? 'container dark' : 'container'}>
                        <div class="columns">
                            <div class="column col-3">
                                {/*左侧导航栏*/}
                                <Catalogue applications={this.state.applications}/>
                            </div>
                            <div class="column col-9">
                                {/*右侧配置信息*/}
                                {/*用户和系统信息*/}
                                <InformationCard platform={this.state.platform}/>
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
