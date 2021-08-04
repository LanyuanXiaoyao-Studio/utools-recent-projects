import Nano, {Component, Img} from 'nano-jsx'
import {Fragment} from 'nano-jsx/lib'
import {CustomCss, CustomDarkCss, SpectreCss, SpectreIconCss} from './css'
import {applications} from '../applications'
import {Application, ProjectItemImpl} from '../types'
import {isEmpty, isNil} from 'licia'
import {iconMap} from '../icon'
import fs from 'fs'

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
        this.updateApplication()
        console.log(window.outerHeight)
    }

    updateApplication() {
        this.state.applications.forEach(app => app.update(utools.getNativeId()))
    }

    select(event: Event, id: string) {
        let result = utools.showOpenDialog({})
        if (isNil(result) || isEmpty(result)) {
            alert('路径不存在或是您主动取消选择')
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    alert('路径指示的文件不存在或已被删除')
                }
                utools.dbStorage.setItem(id, path)
                this.updateApplication()
                this.update()
            }
        }
    }

    clear(event: Event, id: string) {
        utools.dbStorage.removeItem(id)
        this.updateApplication()
        this.update()
    }

    jump(event: Event) {
        utools.redirect('Projects', '')
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
                                    {applications.map(app => (
                                        <li
                                            class={'nav-item ' + ((isEmpty(app.config) || isEmpty(app.executor)) ? '' : 'badge')}
                                            data-badge="已配置"
                                        >
                                            <a href={'#' + app.id}>{app.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div
                                class="column col-9"
                                style={{ padding: '10px' }}
                            >
                                {applications.map(app => (
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
                        {/*<div class="form-button-group">*/}
                        {/*    <button*/}
                        {/*        class="btn btn-primary"*/}
                        {/*        onclick={(event: Event) => this.jump(event)}*/}
                        {/*    >*/}
                        {/*        前往项目搜索 →*/}
                        {/*    </button>*/}
                        {/*</div>*/}
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
