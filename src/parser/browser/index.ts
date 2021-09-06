import {ApplicationConfigAndExecutorImpl, InputSettingItem, Platform, ProjectItemImpl, SettingItem} from '../../types'
import {platformFromUtools} from '../../utils'
import {isEmpty, isNil, randomId} from 'licia'
import {Context} from '../../context'
import {copyFile, rm} from 'fs/promises'
import {join} from 'path'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationConfigAndExecutorImpl<P> {
    protected ifGetFavicon: (url: string, context: Context) => string = (url, context) => {
        return context.enableGetFaviconFromNet ? `https://api.clowntool.cn/getico/?url=${url}` : this.icon
    }
}

export abstract class SqliteBrowserApplicationImpl<P extends ProjectItemImpl> extends BrowserApplicationImpl<P> {
    protected copyAndReadFile: (path: string, handle: (tmpPath: string) => void) => void = async (path, handle) => {
        let tmpPath = utools.getPath('temp')
        let tmpDatabasePath = join(tmpPath, randomId())
        await copyFile(path, tmpDatabasePath)
        try {
            handle(tmpDatabasePath)
        } finally {
            await rm(tmpDatabasePath, { force: true })
        }
    }

    override generateSettingItems(nativeId: string): Array<SettingItem> {
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

export const generatePathDescription: (path: PathDescription, filname: string) => string | undefined = (path, filname) => {
    let prefix = `${filname} 文件通常放在: `
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

export type BrowserId =
    'chromium'
    | 'firefox'
    | 'chrome'
    | 'edge'
    | 'qq'
    | 'maxthon'
    | 'opera'
    | 'brave'
    | 'cent'
    | 'yandex'
    | 'liebao'

export const generatePathDescriptionById: (id: BrowserId, filename: string) => string | undefined = (id, filename) => {
    return generatePathDescription(pathDescriptionMap[id], filename)
}

const pathDescriptionMap: { [key: string]: PathDescription } = {
    'chrome': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
        mac: '/Users/xxx/Library/Application Support/Google/Chrome/Default',
        linux: '/home/xxx/.config/google-chrome/Default',
    },
    'edge': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
        mac: '/Users/xxx/Library/Application Support/Microsoft Edge/Default',
        linux: '/home/lanyuanxiaoyao/.config/microsoft-edge-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」',
    },
    'qq': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default',
    },
    'maxthon': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Maxthon\\Application\\User Data\\Default',
    },
    'opera': {
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Opera Software\\Opera Stable',
        mac: '/Users/xxx/Library/Application Support/com.operasoftware.Opera',
        linux: '/home/xxx/.config/opera',
    },
    'brave': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default',
        mac: '/Users/xxx/Library/Application Support/BraveSoftware/Brave-Browser/Default',
        linux: '/home/xxx/.config/BraveSoftware/Brave-Browser/Default',
    },
    'cent': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\User Data\\Default',
    },
    'yandex': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default',
        mac: '/Users/xxx/Library/Application Support/Yandex/YandexBrowser/Default',
        linux: '/home/xxx/.config/yandex-browser-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」',
    },
    'liebao': {
        win: 'C:\\Users\\Administrator\\AppData\\Local\\liebao\\User Data\\Default',
    },
    'firefox': {
        win: 'C:\\Users\\Administrator\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release',
        mac: '/Users/xxx/Library/Application Support/Firefox/Profiles/xxx.default-release-xxx',
        linux: '/home/xxx/.mozilla/firefox/xxx.default-release',
    },
}
