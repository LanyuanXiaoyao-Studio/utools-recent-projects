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

    jump() {
        utools.redirect('Projects', '')
    }

    help() {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    home() {
        utools.shellOpenExternal('https://github.com/LanyuanXiaoyao-Studio/utools-recent-projects')
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
                            onclick={() => this.jump()}
                        >
                            <i class="icon icon-search"/>
                            <b>开始搜索</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => this.help()}
                        >
                            <i class="icon icon-message"/>
                            <b>配置文档</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            onclick={() => this.home()}
                        >
                            <i class="icon icon-link"/>
                            <b>源码主页</b>
                        </a>
                    </li>
                    <div class="divider"/>
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
