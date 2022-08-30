import {argsMapping} from './Applications'
import {SettingUIFeature} from './setting/Setting'


export const build: any = {
    'setting': new SettingUIFeature(),
    ...argsMapping,
}
