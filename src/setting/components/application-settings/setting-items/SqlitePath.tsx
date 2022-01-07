import Nano, {Fragment} from 'nano-jsx'
import {
    ApplicationSettingItem,
    ApplicationSettingItemProps,
    ApplicationSettingItemState,
} from '../ApplicationSettingItem'
import {NativeChip, TestChip} from '../Chips'
import {existsCacheSync} from '../../../../utils/files/SettingInputHelper'
import {i18n, sentenceKey} from '../../../../i18n'
import {isEmpty, isNil} from 'licia'
import fs from 'fs'
import {Context} from '../../../../Context'
import {settingStore} from '../../../Store'

export class SqlitePath extends ApplicationSettingItem<ApplicationSettingItemProps, ApplicationSettingItemState> {
    store = settingStore.use()

    constructor(props: ApplicationSettingItemProps) {
        super(props)
    }

    override didUnmount(): any {
        this.store.cancel()
    }

    private selectFile(event) {
        let result = utools.showOpenDialog({
            title: 'sqlite',
            message: 'sqlite',
            properties: [
                'openFile',
                'treatPackageAsDirectory',
                'showHiddenFiles',
            ],
        })
        if (isNil(result) || isEmpty(result)) {
            alert(i18n.t(sentenceKey.nonExistsPathOrCancel))
        } else {
            let path = result![0]
            if (!isEmpty(path)) {
                if (!fs.existsSync(path)) {
                    alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
                    event.target.value = ''
                    return
                }
                Context.updateNative(Context.sqliteExecutorPathId, path)
                this.localContext = Context.get()
                this.update()
            }
        }
    }

    private inputFile(event) {
        let inputValue = event.target?.value
        if (isNil(inputValue)) {
            alert(i18n.t(sentenceKey.unknownInputError))
        } else if (isEmpty(inputValue)) {
            return
        } else {
            let path = inputValue
            if (!fs.existsSync(path)) {
                alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
                event.target.value = ''
                return
            }
            Context.updateNative(Context.sqliteExecutorPathId, path)
            this.localContext = Context.get()
            this.update()
        }
    }

    private clear() {
        Context.updateNative(Context.sqliteExecutorPathId, '')
        this.localContext = Context.get()
        this.update()
    }

    override update() {
        super.update()
        this.store.setState({ catalogueUpdate: !this.store.state.catalogueUpdate })
    }

    override render() {
        return (<Fragment>
            <div class="form-group">
                <div class="form-label">{i18n.t(sentenceKey.sqliteGlobal)}</div>
                <div
                    class="form-description"
                    style="padding-bottom: 5px"
                >
                    {i18n.t(sentenceKey.sqliteGlobalDesc)}
                </div>
                <div style={{ width: '100%' }}>
                    <div class="input-group">
                        {this.props.context.enableEditPathInputDirectly
                            ? <Fragment>
                                <input
                                    type="text"
                                    class={`form-input input-sm ${existsCacheSync(this.localContext.sqliteExecutorPath as string) ? '' : 'is-error'}`}
                                    value={this.localContext.sqliteExecutorPath == null ? '' : this.localContext.sqliteExecutorPath}
                                    placeholder={i18n.t(sentenceKey.inputDirectlyPlaceholder)}
                                    onBlur={event => this.inputFile(event)}
                                />
                            </Fragment>
                            : <Fragment>
                                <input
                                    type="text"
                                    class={`form-input input-sm ${existsCacheSync(this.localContext.sqliteExecutorPath as string) ? '' : 'is-error'}`}
                                    value={this.localContext.sqliteExecutorPath == null ? '' : this.localContext.sqliteExecutorPath}
                                    placeholder={i18n.t(sentenceKey.fileSelectorPlaceholder)}
                                    onClick={event => this.selectFile(event)}
                                    readOnly
                                />
                            </Fragment>}
                        <button
                            class="btn btn-error btn-sm input-group-btn"
                            onClick={() => this.clear()}
                        >
                            <i class="icon icon-cross"/>
                        </button>
                    </div>
                    <div
                        class="form-input-hint-error"
                        style={`display: ${existsCacheSync(this.localContext.sqliteExecutorPath as string) ? 'none' : 'block'}`}
                    >
                        {i18n.t(sentenceKey.filePathNonExistsTips)}
                    </div>
                </div>
                <div class="form-tags">
                    <NativeChip/>
                    <TestChip/>
                </div>
            </div>
        </Fragment>)
    }
}
