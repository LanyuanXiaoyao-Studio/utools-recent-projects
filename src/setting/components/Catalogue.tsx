import {Component, Fragment} from 'nano-jsx'
import {Application, ApplicationConfigState, ProjectItemImpl} from '../../types'
import {isNil} from 'licia'
import {settingStore} from '../store'
import {compareChar} from '../../utils'
import {i18n, sentenceKey} from '../../i18n'
import Nano = require('nano-jsx')

export interface BadgeInfo {
    readonly show: boolean
    readonly class: string
    readonly text: string
}

export interface CatalogueProps {
    applications: Array<Application<ProjectItemImpl>>
}

export interface CatalogueState {
    applicationGroupMap: { [key: string]: Array<Application<ProjectItemImpl>> }
}

export class Catalogue extends Component<CatalogueProps, CatalogueState> {
    store = settingStore.use()

    constructor(props: any) {
        super(props)

        let map: { [key: string]: Array<Application<ProjectItemImpl>> } = {}
        for (let app of this.props.applications) {
            let group = app.group
            if (isNil(map[group])) {
                map[group] = []
            }
            map[group].push(app)
        }
        this.state = {
            applicationGroupMap: map,
        }
    }

    override didMount(): any {
        this.store.subscribe((newState: any, prevState: any) => {
            if (newState.catalogueUpdate !== prevState.catalogueUpdate) this.update()
        })
    }

    override didUnmount(): any {
        this.store.cancel()
    }

    help() {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    survey() {
        utools.shellOpenExternal('https://docs.qq.com/form/page/DZFhlZXRSendzc3dR')
    }

    home() {
        utools.shellOpenExternal('https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects')
    }

    badge(application: Application<ProjectItemImpl>): BadgeInfo {
        switch (application.isFinishConfig()) {
            case ApplicationConfigState.empty:
                return { show: false, class: '', text: '' }
            case ApplicationConfigState.undone:
                return { show: true, class: 'badge badge-unready', text: '待完善' }
            case ApplicationConfigState.done:
                return { show: true, class: 'badge badge-ready', text: '已配置' }
            case ApplicationConfigState.error:
                return { show: true, class: 'badge badge-error', text: '有错误' }
        }
    }

    override render() {
        return (
            <Fragment>
                <ul class="nav">
                    <li class="nav-item">
                        <a href="#information-card">
                            <i class="icon icon-people"/>
                            <b>{i18n.t(sentenceKey.systemInformation)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#application-setting-card">
                            <i class="icon icon-edit"/>
                            <b>{i18n.t(sentenceKey.pluginSetting)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => this.help()}
                        >
                            <i class="icon icon-message"/>
                            <b>{i18n.t(sentenceKey.settingDocument)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => this.home()}
                        >
                            <i class="icon icon-link"/>
                            <b>{i18n.t(sentenceKey.sourceCodeRepository)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => this.survey()}
                        >
                            <i class="icon icon-emoji"/>
                            <b>{i18n.t(sentenceKey.requestMoreApplication)}</b>
                        </a>
                    </li>
                    <div class="divider"/>
                    {Object.keys(this.state.applicationGroupMap)
                        .sort((a, b) => compareChar(a, b))
                        .map(key => (
                            <li class="nav-item">
                                <a>
                                    <b>{key}</b>
                                </a>
                                <ul class="nav">
                                    {this.state.applicationGroupMap[key].map(app => (
                                        <li
                                            class={'nav-item ' + this.badge(app).class}
                                            data-badge={this.badge(app).text}
                                        >
                                            <a href={'#' + app.id}>{app.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                </ul>
            </Fragment>
        )
    }
}
