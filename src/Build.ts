import {SettingUIFeature} from './setting/Setting'
import {argsMapping} from './Applications'


export const build: any = {
    'setting': new SettingUIFeature(),
    ...argsMapping,
}
