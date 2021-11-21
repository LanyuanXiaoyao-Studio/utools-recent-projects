import Nano, {Component, Fragment} from 'nano-jsx'
import {i18n, sentenceKey} from '../../../i18n'

export class CloudSyncChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.cloudDesc)}
                >
                    <span class="chip c-hand cloud">{i18n.t(sentenceKey.cloud)}</span>
                </span>
            </Fragment>
        )
    }
}

export class NativeChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.localDesc)}
                >
                    <span class="chip c-hand native">{i18n.t(sentenceKey.local)}</span>
                </span>
            </Fragment>
        )
    }
}

export class RebootNeededChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.needRebootDesc)}
                >
                    <span class="chip c-hand need-reboot">{i18n.t(sentenceKey.needReboot)}</span>
                </span>
            </Fragment>
        )
    }
}

export class TestChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.settingBetaDesc)}
                >
                    <span class="chip c-hand test">{i18n.t(sentenceKey.beta)}</span>
                </span>
            </Fragment>
        )
    }
}
