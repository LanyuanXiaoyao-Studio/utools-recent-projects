import {Component, Fragment} from 'nano-jsx'
import {Application, ProjectItemImpl} from '../../types'
import {isEmpty, isNil} from 'licia'
import {settingStore} from '../store'
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

    didMount(): any {
        this.store.subscribe((newState: any, prevState: any) => {
            if (newState.catalogueUpdate !== prevState.catalogueUpdate) this.update()
        })
    }

    didUnmount(): any {
        this.store.cancel()
    }

    jump(event: Event) {
        utools.redirect('Projects', '')
    }

    help(event: Event) {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    badge(application: Application<ProjectItemImpl>): BadgeInfo {
        if (isEmpty(application.config) && isEmpty(application.executor)) {
            return { show: false, class: '', text: '' }
        } else if (isEmpty(application.config) || isEmpty(application.executor)) {
            return { show: true, class: 'badge badge-unready', text: '待完善' }
        } else {
            return { show: true, class: 'badge badge-ready', text: '已配置' }
        }
    }

    render() {
        return (
            <Fragment>
                <ul class="nav">
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={(event: Event) => this.jump(event)}
                        >
                            前往项目搜索 →
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={(event: Event) => this.help(event)}
                        >
                            不懂配置? 查看帮助 →
                        </a>
                    </li>
                    {Object.keys(this.state.applicationGroupMap).map(key => (
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
