import Nano, {Component, Fragment} from 'nano-jsx'
import {Application, ApplicationConfigState, ProjectItemImpl} from '../../Types'
import {contain, isEmpty, isNil} from 'licia'
import {settingStore} from '../Store'
import {compareChar} from '../../Utils'
import {i18n, sentenceKey} from '../../i18n'
import {iconMap} from '../../Icon'
import {Context} from '../../Context'

export interface BadgeInfo {
    readonly show: boolean
    readonly class: string
    readonly text: string
}

export interface CatalogueProps {
    context: Context
    applications: Array<Application<ProjectItemImpl>>
}

export interface CatalogueState {
    applicationGroupMap: { [key: string]: Array<Application<ProjectItemImpl>> }
    searchText: string
}

export class Catalogue extends Component<CatalogueProps, CatalogueState> {
    private store = settingStore.use()

    private localContext: Context = this.props.context

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
            searchText: '',
        }
    }

    override didMount(): any {
        this.store.subscribe((newState: any, prevState: any) => {
            if (newState.catalogueUpdate !== prevState.catalogueUpdate) this.update()
        })
    }

    override update() {
        this.localContext = Context.get()
        super.update()
    }

    override didUnmount(): any {
        this.store.cancel()
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
                            onclick={() => Catalogue.help()}
                        >
                            <i class="icon icon-message"/>
                            <b>{i18n.t(sentenceKey.settingDocument)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => Catalogue.home()}
                        >
                            <i class="icon icon-link"/>
                            <b>{i18n.t(sentenceKey.sourceCodeRepository)}</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => Catalogue.survey()}
                        >
                            <i class="icon icon-emoji"/>
                            <b>{i18n.t(sentenceKey.requestMoreApplication)}</b>
                        </a>
                    </li>
                    <div class="divider"/>
                    {/*<div class="input-group">*/}
                    {/*    <input*/}
                    {/*        id="catalogue-input"*/}
                    {/*        class="form-input input-sm"*/}
                    {/*        type="text"*/}
                    {/*        placeholder={i18n.t(sentenceKey.catalogueSearchPlaceHolder)}*/}
                    {/*        value={this.state.searchText}*/}
                    {/*        oninput={event => this.setState({ ...this.state, searchText: event.target?.value ?? '' })}*/}
                    {/*    />*/}
                    {/*    <button*/}
                    {/*        class="btn btn-sm btn-primary input-group-btn"*/}
                    {/*        onclick={() => this.search()}*/}
                    {/*    >*/}
                    {/*        <i class="icon icon-search"/>*/}
                    {/*    </button>*/}
                    {/*</div>*/}
                    {Object.keys(this.state.applicationGroupMap)
                        .sort((a, b) => compareChar(a, b))
                        .map(key => (
                            <li class="nav-item">
                                <a>
                                    <b>{key}</b>
                                </a>
                                <ul class="nav">
                                    {this.state.applicationGroupMap[key]
                                        .filter(app => {
                                            if (isEmpty(this.state.searchText)) {
                                                return true
                                            } else {
                                                return contain(app.name.toLowerCase(), this.state.searchText)
                                            }
                                        })
                                        .map(app => (
                                            <li
                                                class={'nav-item ' + Catalogue.badge(this.localContext, app).class}
                                                data-badge={Catalogue.badge(this.localContext, app).text}
                                            >
                                                <a href={'#' + app.id}>
                                                    <img
                                                        class="catalogue-app-icon"
                                                        src={iconMap[app.icon] ?? ''}
                                                        alt={app.name}
                                                    />
                                                    <span class="catalogue-app-name">{app.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                </ul>
            </Fragment>
        )
    }

    private static help() {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    private static survey() {
        utools.ubrowser.goto('https://wj.qq.com/s2/9430048/c591/').run({ width: 1200, height: 800 })
    }

    private static home() {
        utools.shellOpenExternal('https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects')
    }

    private static badge(context: Context, application: Application<ProjectItemImpl>): BadgeInfo {
        switch (application.isFinishConfig(context)) {
            case ApplicationConfigState.empty:
                return { show: false, class: '', text: '' }
            case ApplicationConfigState.undone:
                return { show: true, class: 'badge badge-unready', text: i18n.t(sentenceKey.unready) }
            case ApplicationConfigState.done:
                return { show: true, class: 'badge badge-ready', text: i18n.t(sentenceKey.ready) }
            case ApplicationConfigState.error:
                return { show: true, class: 'badge badge-error', text: i18n.t(sentenceKey.error) }
        }
    }

    private search() {
        this.update()
    }
}
