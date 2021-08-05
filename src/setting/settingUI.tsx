import {Component, Img} from 'nano-jsx'
import {Fragment} from 'nano-jsx/lib'
import {CustomCss, CustomDarkCss, SpectreCss, SpectreIconCss} from './css'
import {applications} from '../applications'
import {Application, ProjectItemImpl} from '../types'
import {isEmpty, isNil} from 'licia'
import {iconMap} from '../icon'
import Nano = require('nano-jsx')
import fs = require('fs')

interface RootProps {}

interface RootState {
    applications: Array<Application<ProjectItemImpl>>
    applicationGroupMap: { [key: string]: Array<Application<ProjectItemImpl>> }
}

class Root extends Component<RootProps, RootState> {
    readonly FIRST = utools.getNativeId() + '/first'
    dialog: boolean = true

    constructor(props: RootProps) {
        super(props)

        let map: { [key: string]: Array<Application<ProjectItemImpl>> } = {}
        for (let app of applications) {
            let group = app.group
            if (isNil(map[group])) {
                map[group] = []
            }
            map[group].push(app)
        }
        this.state = {
            applications: applications,
            applicationGroupMap: map,
        }
        let first = utools.dbStorage.getItem(this.FIRST)
        if (!isNil(first) && first) {
            this.dialog = false
        }
        this.updateApplication()
    }

    updateApplication() {
        this.state.applications.forEach(app => app.update(utools.getNativeId()))
    }

    updateApplicationUI() {
        this.updateApplication()
        this.update()
    }

    iKnown() {
        this.dialog = false
        this.update()
        utools.dbStorage.setItem(this.FIRST, true)
    }

    select(event: Event, id: string) {
        let result = utools.showOpenDialog({
            properties: [
                'openFile',
                'treatPackageAsDirectory',
            ],
        })
        if (isNil(result) || isEmpty(result)) {
            alert('路径不存在或是您主动取消选择')
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    alert('路径指示的文件不存在或已被删除')
                }
                utools.dbStorage.setItem(id, path)
                this.updateApplicationUI()
            }
        }
    }

    clear(event: Event, id: string) {
        utools.dbStorage.removeItem(id)
        this.updateApplicationUI()
    }

    jump(event: Event) {
        utools.redirect('Projects', '')
    }

    help(event: Event) {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    render() {
        return (
            <Fragment>
                <head>
                    <title>Setting</title>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <style>{SpectreCss}</style>
                    <style>{SpectreIconCss}</style>
                    <style>{CustomCss}</style>
                    <style>{CustomDarkCss}</style>
                </head>
                <body
                    class={utools.isDarkColors() ? 'dark' : ''}
                    style={{ padding: '10px' }}
                >
                    <div class="container">
                        <div class="columns">
                            <div
                                class="column col-3"
                                style={{ paddingTop: '10px' }}
                            >
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
                                                        class={'nav-item ' + ((isEmpty(app.config) || isEmpty(app.executor)) ? '' : 'badge')}
                                                        data-badge="已配置"
                                                    >
                                                        <a href={'#' + app.id}>{app.name}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div
                                class="column col-9"
                                style={{ padding: '10px' }}
                            >
                                {this.state.applications.map(app => (
                                    <Fragment>
                                        <div class="gap"/>
                                        <div
                                            class="gap"
                                            id={app.id}
                                        />
                                        <div class="form-item card">
                                            <div class="form-legend card-header">
                                                <Img
                                                    class="form-legend-icon"
                                                    src={iconMap[app.icon]}
                                                />
                                                <span class="form-legend-title">{app.name}</span>
                                            </div>
                                            <div class="form-group card-body">
                                                {app.generateSettingItems(utools.getNativeId()).map(item => (
                                                    <Fragment>
                                                        <div class="form-label">{item.name}</div>
                                                        <div class="input-group">
                                                            <input
                                                                type="text"
                                                                class="form-input input-sm"
                                                                value={item.value == null ? '' : item.value}
                                                                placeholder="点击输入框选择路径"
                                                                onclick={(event: Event) => this.select(event, item.id)}
                                                                readonly
                                                            />
                                                            <button
                                                                class="btn btn-error btn-sm input-group-btn"
                                                                onclick={(event: Event) => this.clear(event, item.id)}
                                                            >
                                                                <i class="icon icon-cross"/>
                                                            </button>
                                                        </div>
                                                    </Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div class={'modal ' + (this.dialog ? 'active' : '')}>
                        <a
                            href="#close"
                            class="modal-overlay"
                            aria-label="Close"
                            onclick={() => {
                                this.dialog = false
                                this.update()
                            }}
                        />
                        <div class="modal-container">
                            <div class="modal-header">
                                <a
                                    href="#close"
                                    class="btn btn-clear float-right"
                                    aria-label="Close"
                                    onclick={() => {
                                        this.dialog = false
                                        this.update()
                                    }}
                                />
                                <div class="modal-title h5">温馨提示, 请务必阅读</div>
                            </div>
                            <div class="modal-body">
                                <div class="content">
                                    看起来你是第一次使用本插件, 由于 uTools 平台的原因, 请务必在右上角插件选项中将插件设置为「隐藏插件后完全退出」方能正常使用, 否则将出现错误.
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button
                                    class="btn btn-primary"
                                    onclick={() => this.iKnown()}
                                >
                                    我已了解
                                </button>
                            </div>
                        </div>
                    </div>
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
