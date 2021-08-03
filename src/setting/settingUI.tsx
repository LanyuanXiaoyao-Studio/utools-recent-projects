import Nano, {Component, Img} from 'nano-jsx'
import {Fragment} from 'nano-jsx/lib'
import {CustomCss, CustomDarkCss, PureCss} from './css'
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
                    <style>{PureCss}</style>
                    <style>{CustomCss}</style>
                    <style>{CustomDarkCss}</style>
                </head>
                <body
                    class={utools.isDarkColors() ? 'dark' : ''}
                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                    <form class="setting-form pure-form pure-form-stacked">
                        <fieldset>
                            {applications.map(app => (
                                <Fragment>
                                    <div
                                        id={app.id}
                                        class="form-item"
                                    >
                                        <legend class="form-legend">
                                            <Img
                                                height="32"
                                                width="32"
                                                src={iconMap[app.icon]}
                                            />
                                            {app.name}
                                        </legend>
                                        {app.generateSettingItems(utools.getNativeId()).map(item => (
                                            <Fragment>
                                                <label>{item.name}</label>
                                                <input
                                                    type="text"
                                                    class="path-input pure-u-11-12"
                                                    value={item.value == null ? '' : item.value}
                                                    placeholder="点击输入框选择路径"
                                                    onclick={(event: Event) => this.select(event, item.id)}
                                                    readonly
                                                    style={{ display: 'inline', backgroundColor: 'white' }}
                                                />
                                                <button
                                                    class="form-button path-clear-button button-warning button-small pure-button"
                                                    onclick={(event: Event) => this.clear(event, item.id)}
                                                >
                                                    清空
                                                </button>
                                                {/*<span class="form-description pure-form-message">hello</span>*/}
                                            </Fragment>
                                        ))}
                                    </div>
                                </Fragment>
                            ))}
                            <div class="form-button-group">
                                <button
                                    class="form-button button-secondary pure-button"
                                    onclick={(event: Event) => this.jump(event)}
                                >
                                    前往项目搜索 →
                                </button>
                            </div>
                        </fieldset>
                    </form>
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
