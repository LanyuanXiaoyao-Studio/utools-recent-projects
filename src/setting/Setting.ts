import {Action, Args, Callback, Feature} from '../Types'
import {ApplicationUI} from './Root'
import {initLanguage} from '../Utils'
import {Context} from '../Context'

export class SettingUIArgsImpl implements Args<any> {
    enter(action: Action, callback: Callback<any>): void {
        utools.setExpendHeight(544)

        let context = Context.get()
        // 语言设置
        initLanguage(context)

        let applicationUI = new ApplicationUI()
        applicationUI.render(context, document.documentElement)
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
