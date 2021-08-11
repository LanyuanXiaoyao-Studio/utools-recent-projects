import {Component, Fragment, Img} from 'nano-jsx'
import {Platform} from '../../types'
import Nano = require('nano-jsx')

const platformName: (Platform) => string = platform => {
    if (platform == Platform.win32) {
        return 'Windows'
    } else if (platform == Platform.darwin) {
        return 'macOS'
    } else if (platform == Platform.linux) {
        return 'Linux'
    } else {
        return 'Unknown'
    }
}

export interface InformationCardProps {
    platform: Platform
}

export interface InformationCardState {
    avatar: string
    username: string
    version: string
    nativeId: string
}

export class InformationCard extends Component<InformationCardProps, InformationCardState> {
    constructor(props: InformationCardProps) {
        super(props)

        this.state = {
            avatar: utools.getUser()?.avatar ?? '',
            username: utools.getUser()?.nickname ?? 'Unknown',
            version: utools.getAppVersion(),
            nativeId: utools.getNativeId(),
        }
    }

    render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div class="gap"/>
                <div class="form-item information-card card">
                    <div class="card-header">
                        <Img
                            class="icon"
                            src={this.state.avatar}
                        />
                        <span class="title">{this.state.username}</span>
                    </div>
                    <div class="card-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="utools-version"
                                    >
                                        uTools 版本
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="utools-version"
                                        value={this.state.version}
                                        readonly
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="system-version"
                                    >
                                        System 版本
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="system-version"
                                        value={platformName(this.props.platform)}
                                        readonly
                                    />
                                </div>
                            </div>
                            <div
                                class="form-group tooltip tooltip-bottom"
                                data-tooltip="Native ID 用于标识配置文件项的前缀
本机配置文件可以在「账号与数据」中找到"
                            >
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="native-id"
                                    >
                                        Native ID
                                    </label>
                                </div>
                                <div class="col-9 col-sm-12">
                                    <input
                                        class="form-input input-sm"
                                        type="text"
                                        id="native-id"
                                        value={this.state.nativeId}
                                        readonly
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
