import {isEmpty, isNil} from 'licia'
import Nano, {Component, Fragment} from 'nano-jsx'
import {Context} from '../../Context'
import {i18n, sentenceKey} from '../../i18n'
import {iconMap} from '../../Icon'
import {
    ApplicationImpl,
    InputSettingItem,
    PlainSettingItem,
    ProjectItemImpl,
    SettingType,
    SwitchSettingItem,
} from '../../Types'
import {getDescriptionByTemplate, getName} from '../../Utils'
import {settingStore} from '../Store'
import {Input} from './adapter-settings/setting-items/Input'
import {Plain} from './adapter-settings/setting-items/Plain'
import {EnableSwitch, Switch} from './adapter-settings/setting-items/Switch'
import {CategoryChip, HomepageChip} from './Chips'

export interface SettingCardProps {
    context: Context
    application: ApplicationImpl<ProjectItemImpl>
}

export interface SettingCardState {}

export class SettingCard extends Component<SettingCardProps, SettingCardState> {
    store = settingStore.use()
    private previewDialog: boolean = false
    private previewLoading: boolean = false
    private previewItems: Array<ProjectItemImpl> = []
    private previewError: string = ''

    constructor(props: SettingCardProps) {
        super(props)
    }

    override didUnmount(): any {
        this.store.cancel()
    }

    updateApplication() {
        this.props.application.update(utools.getNativeId())
    }

    updateApplicationUI() {
        this.updateApplication()
        this.update()
        this.store.setState({ catalogueUpdate: !this.store.state.catalogueUpdate })
    }

    /**
     * 测试当前应用配置能否正常解析记录。
     * 用在设置页测试按钮, 只读取并预览记录, 不执行记录里的打开命令。
     */
    async previewApplicationRecords() {
        this.updateApplication()
        this.previewDialog = true
        this.previewLoading = true
        this.previewItems = []
        this.previewError = ''
        this.update()

        try {
            this.previewItems = await this.props.application.generateProjectItems(this.props.context)
        } catch (error: any) {
            let appName = getName(this.props.application.name)
            console.error('[Record Preview]', appName, error)
            this.previewError = error?.stack || error?.message || String(error)
        } finally {
            this.previewLoading = false
            this.update()
        }
    }

    /**
     * 渲染测试记录预览弹窗。
     * 仅由当前卡片的测试按钮触发, 用于查看解析结果或错误日志。
     */
    renderPreviewDialog() {
        let appName = getName(this.props.application.name)
        return (
            <div class={'modal ' + (this.previewDialog ? 'active' : '')}>
                <div
                    class="modal-overlay"
                    onclick={() => {
                        this.previewDialog = false
                        this.update()
                    }}
                />
                <div class="modal-container record-preview-modal">
                    <div class="modal-header">
                        <button
                            class="btn btn-clear float-right"
                            onclick={() => {
                                this.previewDialog = false
                                this.update()
                            }}
                        />
                        <div class="modal-title h5">
                            {appName} {i18n.t(sentenceKey.recordPreviewTitle)}
                            {!this.previewLoading && isEmpty(this.previewError)
                                ? <span class="record-preview-count">{this.previewItems.length}</span>
                                : <Fragment/>}
                        </div>
                    </div>
                    <div class="modal-body">
                        {this.previewLoading
                            ? <div class="record-preview-loading loading loading-lg"/>
                            : !isEmpty(this.previewError)
                                ? <pre class="record-preview-error">{`${i18n.t(sentenceKey.recordPreviewFailure)}\n${this.previewError}`}</pre>
                                : isEmpty(this.previewItems)
                                    ? <div class="empty record-preview-empty">
                                        <div class="empty-title h6">{i18n.t(sentenceKey.recordPreviewEmpty)}</div>
                                    </div>
                                    : <div class="record-preview-list">
                                        {this.previewItems.map((item, index) => (
                                            <div class="record-preview-item">
                                                <div class="record-preview-item-header">
                                                    <span class="record-preview-index">{index + 1}</span>
                                                    <span class="record-preview-title">{item.title}</span>
                                                    <span class={`record-preview-status ${item.exists ? 'exists' : 'missing'}`}>
                                                        {item.exists
                                                            ? i18n.t(sentenceKey.recordPreviewExists)
                                                            : i18n.t(sentenceKey.recordPreviewMissing)}
                                                    </span>
                                                </div>
                                                <div class="record-preview-description">{item.description}</div>
                                                {isNil(item.command) || isEmpty(item.command.command)
                                                    ? <Fragment/>
                                                    : <div class="record-preview-command">
                                                        <span>{i18n.t(sentenceKey.recordPreviewCommand)}</span>
                                                        <code>{item.command.command}</code>
                                                    </div>}
                                            </div>
                                        ))}
                                    </div>}
                    </div>
                    <div class="modal-footer">
                        <button
                            class="btn btn-primary"
                            onclick={() => {
                                this.previewDialog = false
                                this.update()
                            }}
                        >
                            {i18n.t(sentenceKey.recordPreviewClose)}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    class="gap"
                    id={this.props.application.id}
                />
                <div class="form-item setting-card card">
                    {/*<div class="card-mark">{this.props.application.group}</div>*/}
                    <div
                        class={this.props.application.beta ? 'form-legend card-header tooltip tooltip-top' : 'form-legend card-header'}
                        data-tooltip={i18n.t(sentenceKey.betaDesc)}
                    >
                        <img
                            class={`icon ${this.props.context.enableRoundRound ? 'round-round' : ''}`}
                            src={iconMap[this.props.application.icon] ?? ''}
                            alt={getName(this.props.application.name)}
                        />
                        <div
                            class={'title' + (this.props.application.beta ? ' badge badge-unready' : '')}
                            data-badge={i18n.t(sentenceKey.beta)}
                        >
                            <span>{getName(this.props.application.name)}</span>
                        </div>
                    </div>
                    <div
                        class="form-group card-body"
                        style="padding-top: 0"
                    >
                        <div class="form-tags py-2">
                            <HomepageChip homepage={this.props.application.homepage}/>
                            <CategoryChip category={this.props.application.group}/>
                        </div>

                        {this.props.application.enabled
                            ? isNil(this.props.application.description)
                                ? <Fragment/>
                                : getDescriptionByTemplate(
                                    this.props.application.description,
                                    text => isEmpty(text)
                                        ? <Fragment/>
                                        : <blockquote class="card-description">
                                            <cite>{text}</cite>
                                        </blockquote>,
                                )
                            : <Fragment/>}

                        <EnableSwitch
                            application={this.props.application}
                            context={this.props.context}
                            update={() => this.updateApplicationUI()}
                        />

                        {this.props.application.enabled
                            ? this
                                .props.application.generateSettingItems(this.props.context, utools.getNativeId()).map(item => {
                                    switch (item.type) {
                                        case SettingType.plain:
                                            return <Plain
                                                item={item as PlainSettingItem}
                                                context={this.props.context}
                                                update={() => this.updateApplicationUI()}
                                            />
                                        case SettingType.path:
                                            return <Input
                                                item={item as InputSettingItem}
                                                context={this.props.context}
                                                update={() => this.updateApplicationUI()}
                                            />
                                        case SettingType.switch:
                                            return <Switch
                                                item={item as SwitchSettingItem}
                                                context={this.props.context}
                                                update={() => this.updateApplicationUI()}
                                            />
                                    }
                                })
                            : <Fragment/>}

                        {this.props.application.enabled
                            ? <div class="form-group record-preview-action">
                                <button
                                    class={`btn btn-sm btn-primary ${this.previewLoading ? 'loading' : ''}`}
                                    {...(this.previewLoading ? { disabled: true } : {})}
                                    onclick={() => this.previewApplicationRecords()}
                                >
                                    {i18n.t(sentenceKey.recordPreviewTest)}
                                </button>
                            </div>
                            : <Fragment/>}
                    </div>
                </div>
                {this.renderPreviewDialog()}
            </Fragment>
        )
    }
}
