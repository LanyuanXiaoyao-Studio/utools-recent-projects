import {
    ApplicationCacheConfigAndExecutorImpl,
    ApplicationConfigState,
    InputSettingItem,
    ProjectItemImpl,
    SettingItem,
} from '../../Types'
import {generateStringByOS, StringByOS, systemHome} from '../../Utils'
import {isEmpty, randomId} from 'licia'
import {Context} from '../../Context'
import {copyFile, rm} from 'fs/promises'
import {join} from 'path'
import {i18n, sentenceKey} from '../../i18n'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationCacheConfigAndExecutorImpl<P> {
    override defaultExecutorPath(): string {
        // 只是读取书签用不上这个配置
        return ''
    }

    protected ifGetFavicon: (url: string, context: Context) => string = (url, context) => {
        // return context.enableGetFaviconFromNet ? `https://api.clowntool.cn/getico/?url=${url}` : this.icon
        return context.enableGetFaviconFromNet ? `https://f1.allesedv.com/${url}` : this.icon
    }
}

export abstract class SqliteBrowserApplicationImpl<P extends ProjectItemImpl> extends BrowserApplicationImpl<P> {
    override defaultExecutorPath(): string {
        // sqlite3 的设置没有默认值
        return ''
    }

    override generateSettingItems(context: Context, nativeId: string): Array<SettingItem> {
        return [
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


    override isFinishConfig(context: Context): ApplicationConfigState {
        if (this.disEnable())
            return ApplicationConfigState.empty
        if (isEmpty(this.config)) {
            return ApplicationConfigState.undone
        } else if (this.nonExistsPath(this.config)) {
            return ApplicationConfigState.error
        } else {
            if (isEmpty(this.executor)) {
                if (isEmpty(context.sqliteExecutorPath)) {
                    return ApplicationConfigState.undone
                } else if (this.nonExistsPath(context.sqliteExecutorPath)) {
                    return ApplicationConfigState.error
                } else {
                    return ApplicationConfigState.done
                }
            } else if (this.nonExistsPath(this.executor)) {
                return ApplicationConfigState.error
            } else {
                return ApplicationConfigState.done
            }
        }
    }
}

export interface PathDescription {
    win?: string,
    mac?: string,
    linux?: string,
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

export const getDefaultConfigPath: (id: BrowserId) => string = id => {
    return generateStringByOS({
        ...(pathDescriptionMap[id]()),
    })
}

const pathDescriptionMap: { [key: string]: () => StringByOS } = {
    'chromium': () => {
        return {}
    },
    'chrome': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\`,
            darwin: `${systemHome()}/Library/Application Support/Google/Chrome/Default/`,
            linux: `${systemHome()}/.config/google-chrome/Default/`,
        }
    },
    'edge': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\`,
            darwin: `${systemHome()}/Library/Application Support/Microsoft Edge/Default/`,
            linux: `${systemHome()}/.config/microsoft-edge-beta/Default/`,
        }
    },
    'qq': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Tencent\\QQBrowser\\User Data\\Default\\`,
        }
    },
    'maxthon': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Maxthon\\Application\\User Data\\Default\\`,
        }
    },
    'opera': () => {
        return {
            win32: `${systemHome()}\\AppData\\Roaming\\Opera Software\\Opera Stable\\`,
            darwin: `${systemHome()}/Library/Application Support/com.operasoftware.Opera/`,
            linux: `${systemHome()}/.config/opera/`,
        }
    },
    'brave': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default\\`,
            darwin: `${systemHome()}/Library/Application Support/BraveSoftware/Brave-Browser/Default/`,
            linux: `${systemHome()}/.config/BraveSoftware/Brave-Browser/Default/`,
        }
    },
    'vivaldi': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Vivaldi\\User Data\\Default\\`,
            darwin: `${systemHome()}/Library/Application Support/Vivaldi/Default/`,
            linux: `${systemHome()}/.config/Vivaldi/Default/`,
        }
    },
    'cent': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\CentBrowser\\User Data\\Default\\`,
        }
    },
    'yandex': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\Default\\`,
            darwin: `${systemHome()}/Library/Application Support/Yandex/YandexBrowser/Default/`,
            linux: `${systemHome()}/.config/yandex-browser-beta/Default/`,
        }
    },
    'liebao': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\liebao\\User Data\\Default\\`,
        }
    },
    'firefox': () => {
        return {
            win32: `${systemHome()}\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\`,
            darwin: `${systemHome()}/Library/Application Support/Firefox/Profiles/xxx.default-release-xxx/`,
            linux: `${systemHome()}/.mozilla/firefox/xxx.default-release/`,
        }
    },
    'deepin': () => {
        return {
            linux: `${systemHome()}/.config/browser/Default/`,
        }
    },
    'safari': () => {
        return {
            darwin: `${systemHome()}/Library/Safari/`,
        }
    },
}
