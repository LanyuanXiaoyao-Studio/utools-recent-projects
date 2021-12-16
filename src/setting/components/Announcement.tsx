import Nano, {Component, Fragment} from 'nano-jsx'
import {isNil} from 'licia'

export interface AnnouncementProps {}

export interface AnnouncementState {}

export class Announcement extends Component<AnnouncementProps, AnnouncementState> {
    readonly FIRST = utools.getNativeId() + '/first'
    dialog: boolean = true

    constructor(props: AnnouncementProps) {
        super(props)

        let first = utools.dbStorage.getItem(this.FIRST)
        if (!isNil(first) && first) {
            this.dialog = false
        }
    }

    iKnown() {
        this.dialog = false
        this.update()
        utools.dbStorage.setItem(this.FIRST, true)
    }

    help() {
        utools.shellOpenExternal('https://yuanliao.info/d/3978')
    }

    override render() {
        return (
            <Fragment>
                <div class={'modal ' + (this.dialog ? 'active' : '')}>
                    <a
                        href="#close"
                        class="modal-overlay"
                        aria-label="Close"
                    />
                    <div class="modal-container">
                        <div class="modal-header">
                            <div class="modal-title h5">温馨提示 请务必阅读</div>
                        </div>
                        <div class="modal-body">
                            <div
                                class="content"
                                style={{ fontSize: '0.75rem' }}
                            >
                                <p>你似乎是第一次在本机使用此插件，如果你没有了解过 JetBrains 等软件的配置文件内容，建议先看一下这篇
                                    <a
                                        href="#"
                                        onclick={() => this.help()}
                                    >
                                        <b>教程说明</b>
                                    </a>
                                    。
                                </p>
                                <p>如果遇到页面错乱、无法打开项目等情况，请不要着急，可以尝试一下在「uTools 设置」中的「账号与数据」里清空此插件的数据后再试一下；如果这仍然不能解决问题，请在插件
                                    <b>市场的评论区</b>
                                    向我反馈
                                </p>
                                <p>有些软件并没有提供稳定的获取历史数据的方式，随着软件的升级，原有的适配方式可能失效，这在情理之中，可以向我反馈失效的情况，我将及时修补，请关注每次插件更新的更新说明</p>
                                <p>如果这个插件帮助到了你，希望能给个五星好评哦 :P</p>
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
            </Fragment>
        )
    }
}
