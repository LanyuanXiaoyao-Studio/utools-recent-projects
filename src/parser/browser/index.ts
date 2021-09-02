import {ApplicationImpl, InputSettingItem, ProjectItemImpl, SettingItem} from '../../types'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationImpl<P> {

}

export abstract class SqliteBrowserApplicationImpl<P extends ProjectItemImpl> extends BrowserApplicationImpl<P> {
    generateSettingItems(nativeId: string): Array<SettingItem> {
        return [
            new InputSettingItem(
                this.configId(nativeId),
                `设置 ${this.name} 「${this.configFilename}」文件路径`,
                this.config,
            ),
            new InputSettingItem(
                this.executorId(nativeId),
                `设置 Sqlite3 可执行程序路径`,
                this.executor,
            ),
        ]
    }
}
