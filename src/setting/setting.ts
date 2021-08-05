import {Action, Args, Callback, Feature} from '../types'
import {ApplicationUI} from './settingUI'

export class SettingUIArgsImpl implements Args<any> {
    enter(action: Action, callback: Callback<any>): void {
        utools.setExpendHeight(480)
        let applicationUI = new ApplicationUI()
        applicationUI.render(document.documentElement)
        utools.onPluginOut(() => utools.outPlugin())
    }
}

export class SettingUIFeature implements Feature<any> {
    args: Args<any>
    mode: 'list' | 'none'

    constructor() {
        this.args = new SettingUIArgsImpl()
        this.mode = 'none'
    }
}
