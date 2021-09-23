import {Action, Args, Callback, Feature} from '../types'
import {ApplicationUI} from './Root'
import {platformFromUtools} from '../utils'
import {Context} from '../context'
import {i18n} from '../i18n'
import {isEmpty, isNil} from 'licia'

export class SettingUIArgsImpl implements Args<any> {
    enter(action: Action, callback: Callback<any>): void {
        import('../inits')
            .then(reports => {
                reports.report(utools.getUser()?.nickname, action.code, utools.getNativeId(), platformFromUtools().toString())
            })
            .catch(error => console.log(error?.message ?? ''))
        utools.setExpendHeight(520)

        // 语言设置
        let context = Context.get()
        if (context.languageSetting === 'auto') {
            if (!isNil(navigator.language) && !isEmpty(navigator.language)) {
                i18n.locale(navigator.language)
            }
        } else {
            i18n.locale(context.languageSetting)
        }

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
