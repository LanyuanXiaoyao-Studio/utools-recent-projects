import {ApplicationImpl, InputSettingItem, Platform, ProjectItemImpl, SettingItem} from '../../../types'
import {platformFromUtools} from '../../../utils'
import {isEmpty, isNil} from 'licia'
import {Context} from '../../../context'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationImpl<P> {
    protected ifGetFavicon: (url: string, context: Context) => string = (url, context) => {
        return context.enableGetFaviconFromNet ? `https://api.clowntool.cn/getico/?url=${url}` : this.icon
    }
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
                '读取数据需要使用 Sqlite3 命令行程序, 可以自行前往「https://www.sqlite.org/download.html」下载对应平台的可执行文件',
            ),
        ]
    }
}

export interface PathDescription {
    win?: string,
    mac?: string,
    linux?: string,
}

export const generatePathDescription: (path: PathDescription) => string | undefined = path => {
    let prefix = 'History 文件通常放在: '
    let platform = platformFromUtools()
    let emptyAndUndefined = (p) => (isNil(p) || isEmpty(p)) ? undefined : prefix + p
    switch (platform) {
        case Platform.win32:
            return emptyAndUndefined(path.win)
        case Platform.darwin:
            return emptyAndUndefined(path.mac)
        case Platform.linux:
            return emptyAndUndefined(path.linux)
        case Platform.unknown:
            return undefined
    }
}
