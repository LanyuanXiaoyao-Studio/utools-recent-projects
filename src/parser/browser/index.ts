import {ApplicationImpl, InputSettingItem, ProjectItemImpl, SettingItem} from '../../types'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationImpl<P> {}

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
                '读取数据需要使用 Sqlite3 命令行程序, 可以自行前往「https://www.sqlite.org/download.html」下载对应平台的可执行文件',
            ),
        ]
    }
}
