import {Component, Fragment, Img} from 'nano-jsx'
import {Platform} from '../../types'
import {i18n, sentenceKey} from '../../i18n'
import Nano = require('nano-jsx')

const platformName: (Platform) => string = platform => {
    if (platform == Platform.win32) {
        return 'Windows'
    } else if (platform == Platform.darwin) {
        return 'macOS'
    } else if (platform == Platform.linux) {
        return 'Linux'
    } else {
        return 'Unknown Version'
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
            avatar: utools.getUser()?.avatar ?? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAQlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO4fbyAAAAFXRSTlMACOHTj+9DaxMoHXNWTbC8ncY7gTBQQCg8AAACc0lEQVRo3u2Z3XK0IAyGSyAIImjXzf3f6nf27bQbeUGcTjvjcxxD/gwQPm5ubpoJfnKrJRZhsqubfLhQucnOyhvWZXOJ+sfGckTJw8ZPJFVoMiPqEwmE0uklMkkTtJxSPxdppswnzGfpgHudME462boyET6lm8/QEX4rJ7DNiYh0oMH5aEz0zooKxUb7SVfvXyIPPYTU5EPQ7Zu+Sk26EQ15MKpx7L/LeVYzjWvJiYZXmqBoOKR/AfGBUVpAglXHrS6sJovriS44QC+8aJRqAxLkAHZBcqWCCCcOFwQdV1ISHCEcI0mdDkg87CnS58IkOubQItGZDuTpqgUIRPRciHDWNiDeYdKm+suigMpUhw34yTp+NJ0MzDnRKrDTVoALg18EUQDtukLA/uINp4bH9uAts8YEcty96eMsr/ICHlu8FcAKSqL74IXLiGQI3O9YLoXfFpCL+ekFrg/RzyfZyqVY8KMNs4JWMYwDzW6YCbTrYbyy4VTh1aXlOQdjwvxckltBWYeeDZC2Jb7Lx2UjXEQ4yzbFyoU3WZBjcGxhB6++T6cFKzcdvDiZk1MlVj/cKurREqwcHUGhrnPXcOlrI3jg47sbmf9YfAHZP7rZ8QXEUOUqiin4Fpj+i4R+/YHAJRC40OuAThZoBfReMjADDDXgEKW0DkOWc/p5RpJgheGv3ImfLenf4JFaaWt2pTJSA0NB67G8p8pQEI81C/gkbGCsCQezvIeK+p3xYBaPlo+2tejAaLl9OG73+KZ9t2A4Dtq7cm5ZHnE2Zo6PRTm1OPO7HiiGnliufyTKv/WZ67qHOnx00+HN/4XH0sPn3pubm1b+AbmqIcRUyWtIAAAAAElFTkSuQmCC',
            username: utools.getUser()?.nickname ?? 'Unknown User',
            version: utools.getAppVersion(),
            nativeId: utools.getNativeId(),
        }
    }

    override render() {
        return (
            <Fragment>
                <div
                    id="information-card"
                    class="gap"
                />
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
                                        {i18n.t(sentenceKey.utoolsVersion)}
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
                                        {i18n.t(sentenceKey.systemVersion)}
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
                                data-tooltip={i18n.t(sentenceKey.nativeIdDesc)}
                            >
                                <div class="col-3 col-sm-12">
                                    <label
                                        class="form-label label-sm"
                                        for="native-id"
                                    >
                                        {i18n.t(sentenceKey.nativeId)}
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
