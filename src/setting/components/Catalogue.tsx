import {Component, Fragment} from 'nano-jsx'
import {Application, ApplicationConfigState, ProjectItemImpl} from '../../types'
import {isNil} from 'licia'
import {settingStore} from '../store'
import {compareChar} from '../../utils'
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

    help() {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
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

    render() {
        return (
            <Fragment>
                <ul class="nav">
                    <li class="nav-item">
                        <a href="#information-card">
                            <i class="icon icon-people"/>
                            <b>系统信息</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="#application-setting-card">
                            <i class="icon icon-edit"/>
                            <b>插件配置</b>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            href="#"
                            oncl
                            ick={() => this.help()}
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
