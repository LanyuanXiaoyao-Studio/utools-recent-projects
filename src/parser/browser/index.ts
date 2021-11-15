import {
    ApplicationCacheConfigAndExecutorImpl,
    InputSettingItem,
    Platform,
    ProjectItemImpl,
    SettingItem,
} from '../../Types'
import {generateStringByOS, platformFromUtools, StringByOS, systemUser} from '../../Utils'
import {isEmpty, isNil, randomId} from 'licia'
import {Context} from '../../Context'
import {copyFile, rm} from 'fs/promises'
import {join} from 'path'
import {i18n, sentenceKey} from '../../i18n'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationCacheConfigAndExecutorImpl<P> {
    protected ifGetFavicon: (url: string, context: Context) => string = (url, context) => {
        // return context.enableGetFaviconFromNet ? `https://api.clowntool.cn/getico/?url=${url}` : this.icon
        return context.enableGetFaviconFromNet ? `https://f1.allesedv.com/${url}` : this.icon
    }
}

export abstract class SqliteBrowserApplicationImpl<P extends ProjectItemImpl> extends BrowserApplicationImpl<P> {
    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
            this.enabledSettingItem(context, nativeId),
            this.configSettingItem(context, nativeId),
            new InputSettingItem(
                this.executorId(nativeId),
                i18n.t(sentenceKey.sqlite3),
                this.executor,
                i18n.t(sentenceKey.sqlite3Desc),
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
    let prefix = `${filename} ${i18n.t(sentenceKey.browserPathDescPrefix)}: `
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
    | 'vivaldi'
    | 'cent'
    | 'yandex'
    | 'liebao'
    | 'deepin'

export const getPathDescription: (id: BrowserId, filename: string) => string | undefined = (id, filename) => {
    return generatePathDescription(pathDescriptionMap[id](), filename)
}

export const getDescription: (id: BrowserId, handler: (text: string) => string) => string | undefined = (id, handler) => {
    return generateStringByOS({
        handler: handler,
        ...(pathDescriptionMap[id]()),
    })
}

const pathDescriptionMap: { [key: string]: () => StringByOS } = {
    'chrome': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Google/Chrome/Default`,
            linux: `/home/${systemUser()}/.config/google-chrome/Default`,
        }
    },
    'edge': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Microsoft Edge/Default`,
            linux: `/home/${systemUser()}/.config/microsoft-edge-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」`,
        }
    },
    'qq': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default`,
        }
    },
    'maxthon': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Maxthon\\Application\\User Data\\Default`,
        }
    },
    'opera': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Opera Software\\Opera Stable`,
            darwin: `/Users/${systemUser()}/Library/Application Support/com.operasoftware.Opera`,
            linux: `/home/${systemUser()}/.config/opera`,
        }
    },
    'brave': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default`,
            darwin: `/Users/${systemUser()}/Library/Application Support/BraveSoftware/Brave-Browser/Default`,
            linux: `/home/${systemUser()}/.config/BraveSoftware/Brave-Browser/Default`,
        }
    },
    'vivaldi': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Vivaldi\\User Data\\Default`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Vivaldi/Default`,
            linux: `/home/${systemUser()}/.config/Vivaldi/Default`,
        }
    },
    'cent': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\CentBrowser\\User Data\\Default`,
        }
    },
    'yandex': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Yandex/YandexBrowser/Default`,
            linux: `/home/${systemUser()}/.config/yandex-browser-beta/Default. Linux 为 beta 版本, 正式版需要去掉路径中的「beta」`,
        }
    },
    'liebao': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Local\\liebao\\User Data\\Default`,
        }
    },
    'firefox': () => {
        return {
            win32: `C:\\Users\\${systemUser()}\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release`,
            darwin: `/Users/${systemUser()}/Library/Application Support/Firefox/Profiles/xxx.default-release-xxx`,
            linux: `/home/${systemUser()}/.mozilla/firefox/xxx.default-release`,
        }
    },
    'deepin': () => {
        return {
            linux: `/home/${systemUser()}/.config/browser/Default`,
        }
    },
}
