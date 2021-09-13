import {Action, Args, Callback, Feature} from '../types'
import {ApplicationUI} from './Root'
import {platformFromUtools} from '../utils'

export class SettingUIArgsImpl implements Args<any> {
    enter(action: Action, callback: Callback<any>): void {
        import('../reports')
            .then(reports => {
                reports.report(utools.getUser()?.nickname, action.code, utools.getNativeId(), platformFromUtools().toString())
            })
            .catch(error => console.log(error?.message ?? ''))
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
