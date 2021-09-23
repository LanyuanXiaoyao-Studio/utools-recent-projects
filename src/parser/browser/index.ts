import {ApplicationConfigAndExecutorImpl, InputSettingItem, Platform, ProjectItemImpl, SettingItem} from '../../types'
import {generateStringByOS, platformFromUtools, StringByOS} from '../../utils'
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
    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            this.enabledSettingItem(context, nativeId),
            this.configSettingItem(context, nativeId),
            new InputSettingItem(
                this.executorId(nativeId),
                `设置 Sqlite3 可执行程序路径`,
                this.executor,
                '读取数据需要使用 Sqlite3 命令行程序, 可以自行前往「https://www.sqlite.org/download.html」下载对应平台的可执行文件',
            ),
        ]
    }

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

    protected parseSqliteDefaultResult(result: string, fieldNames: Array<string>): Array<any> {
        if (isNil(result) || isEmpty(result) || isNil(fieldNames) || isEmpty(fieldNames)) {
            return []
        }
        let length = fieldNames.length
        let lines = result.trim().split(/\n/)
        return lines.map(line => {
            let fields = line.trim().split(/\|/)
            let object = {}
            for (let i = 0; i < length; i++) {
                let fieldName = fieldNames[i]
                let field = fields[i]
                if (fieldName.startsWith('n/')) {
                    fieldName = fieldName.substring(2)
                    object[fieldName] = isEmpty(field) ? 0 : parseInt(field)
                } else if (fieldName.startsWith('b/')) {
                    fieldName = fieldName.substring(2)
                    object[fieldName] = isEmpty(field) ? false : field === 'true'
                } else {
                    object[fieldName] = field
                }
            }
            return object
        })
    }
}

export interface PathDescription {
    win?: string,
    mac?: string,
    linux?: string,
}

export const generatePathDescription: (path: PathDescription, filname: string) => string | undefined = (path, filename) => {
    let prefix = `${filename} 文件通常放在: `
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
    | 'deepin'

export const getPathDescription: (id: BrowserId, filename: string) => string | undefined = (id, filename) => {
    return generatePathDescription(pathDescriptionMap[id], filename)
}

export const getDescription: (id: BrowserId, handler: (text: string) => string) => string | undefined = (id, handler) => {
    return generateStringByOS({
        handler: handler,
        ...pathDescriptionMap[id],
    })
}

const pathDescriptionMap: { [key: string]: StringByOS } = {
    'chrome': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default',
        darwin: '/Users/xxx/Library/Application Support/Google/Chrome/Default',
        linux: '/home/xxx/.config/google-chrome/Default',
    },
    'edge': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default',
        darwin: '/Users/xxx/Library/Application Support/Microsoft Edge/Default',
        linux: '/home/lanyuanxiaoyao/.config/microsoft-edge-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」',
    },
    'qq': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default',
    },
    'maxthon': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\Maxthon\\Application\\User Data\\Default',
    },
    'opera': {
        win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\Opera Software\\Opera Stable',
        darwin: '/Users/xxx/Library/Application Support/com.operasoftware.Opera',
        linux: '/home/xxx/.config/opera',
    },
    'brave': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default',
        darwin: '/Users/xxx/Library/Application Support/BraveSoftware/Brave-Browser/Default',
        linux: '/home/xxx/.config/BraveSoftware/Brave-Browser/Default',
    },
    'cent': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\CentBrowser\\User Data\\Default',
    },
    'yandex': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default',
        darwin: '/Users/xxx/Library/Application Support/Yandex/YandexBrowser/Default',
        linux: '/home/xxx/.config/yandex-browser-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」',
    },
    'liebao': {
        win32: 'C:\\Users\\Administrator\\AppData\\Local\\liebao\\User Data\\Default',
    },
    'firefox': {
        win32: 'C:\\Users\\Administrator\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release',
        darwin: '/Users/xxx/Library/Application Support/Firefox/Profiles/xxx.default-release-xxx',
        linux: '/home/xxx/.mozilla/firefox/xxx.default-release',
    },
    'deepin': {
        linux: '/home/xxx/.config/browser/Default',
    },
}
