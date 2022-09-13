import Nano, {Component, Fragment} from 'nano-jsx'
import {i18n, sentenceKey} from '../../i18n'

export interface CategoryChipProps {
    category: string
}

export class CategoryChip extends Component<CategoryChipProps> {
    override render() {
        return (
            <Fragment>
                <span class="chip-wrapper">
                    <span class="chip c-hand category">{this.props.category}</span>
                </span>
            </Fragment>
        )
    }
}

export interface HomepageChipProps {
    homepage: string
}

export class HomepageChip extends Component<HomepageChipProps> {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={`${i18n.t(sentenceKey.clickToOpen)} ${this.props.homepage}`}
                    onclick={() => utools.shellOpenExternal(this.props.homepage)}
                >
                    <span class="chip c-hand homepage">{i18n.t(sentenceKey.homepage)}</span>
                </span>
            </Fragment>
        )
    }
}

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

export class EnhanceChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.enhanceConfigChipDesc)}
                >
                    <span class="chip c-hand enhance-config">{i18n.t(sentenceKey.enhanceConfig)}</span>
                </span>
            </Fragment>
        )
    }
}

export class DecreasePerformanceChip extends Component {
    override render() {
        return (
            <Fragment>
                <span
                    class="chip-wrapper tooltip tooltip-right"
                    data-tooltip={i18n.t(sentenceKey.decreasePerformanceDesc)}
                >
                    <span class="chip c-hand decrease-performance">{i18n.t(sentenceKey.decreasePerformance)}</span>
                </span>
            </Fragment>
        )
    }
}
