import {Component} from 'nano-jsx'
import {Fragment} from 'nano-jsx/lib'
import {CustomCss, CustomDarkCss, SpectreCss, SpectreIconCss} from './css'
import {applications} from '../applications'
import {Application, ProjectItemImpl} from '../types'
import {SettingCard} from './components/SettingCard'
import {Catalogue} from './components/Catalogue'
import {Announcement} from './components/Announcement'
import Nano = require('nano-jsx')

interface RootProps {}

interface RootState {
    applications: Array<Application<ProjectItemImpl>>
}

class Root extends Component<RootProps, RootState> {
    constructor(props: RootProps) {
        super(props)

        this.state = {
            applications: applications,
        }
        this.state.applications.forEach(app => app.update(utools.getNativeId()))
    }

    render() {
        return (
            <Fragment>
                <head>
                    <title/>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <style>{SpectreCss}</style>
                    <style>{SpectreIconCss}</style>
                    <style>{CustomCss}</style>
                    <style>{CustomDarkCss}</style>
                    <script src="index.js"/>
                </head>
                <body
                    class={utools.isDarkColors() ? 'dark' : ''}
                    style={{ padding: '10px' }}
                >
                    <div id="root"/>
                    <div class="container">
                        <div class="columns">
                            <div
                                class="column col-3"
                                style={{ paddingTop: '10px' }}
                            >
                                <Catalogue applications={this.state.applications}/>
                            </div>
                            <div
                                class="column col-9"
                                style={{ padding: '10px' }}
                            >
                                {this.state.applications.map(app => <SettingCard application={app}/>)}
                            </div>
                        </div>
                    </div>
                    <Announcement/>
                </body>
            </Fragment>
        )
    }
}

export class ApplicationUI {
    render(root: HTMLElement) {
        Nano.render(<Root/>, root)
    }
}
