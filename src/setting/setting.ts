import {Action, Args, Callback, Feature} from '../types'
import {ApplicationUI} from './Root'

export class SettingUIArgsImpl implements Args<any> {
    enter(action: Action, callback: Callback<any>): void {
        utools.setExpendHeight(520)
        let applicationUI = new ApplicationUI()
        applicationUI.render(document.documentElement)
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
