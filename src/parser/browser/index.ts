import {Context} from '../../Context'
import {ApplicationCacheConfigImpl, ProjectItemImpl} from '../../Types'
import {generateStringByOS, StringByOS, systemHome} from '../../Utils'

export abstract class BrowserApplicationImpl<P extends ProjectItemImpl> extends ApplicationCacheConfigImpl<P> {
    protected ifGetFavicon: (url: string, context: Context) => string = (url, context) => {
        // return context.enableGetFaviconFromNet ? `https://api.clowntool.cn/getico/?url=${url}` : this.icon
        return context.enableGetFaviconFromNet ? `https://f1.allesedv.com/${url}` : this.icon
    }

    protected limitCondition: (context: Context) => string = context => {
        if (context.browserHistoryLimit == 0) {
            return ''
        } else {
            return `limit ${context.browserHistoryLimit}`
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
    | 'xiaobai'
    | 'twinkstar'
    | 'huawei'
    | 'catsxp'

export const getDefaultConfigPath: (id: BrowserId) => string = id => {
    return generateStringByOS({
        ...(pathDescriptionMap[id]()),
    })
}

export const getHomepage: (id: BrowserId) => string = id => {
    return homepageMap[id]
}

const homepageMap: { [key: string]: string } = {
    'chromium': 'https://www.chromium.org/chromium-projects/',
    'firefox': 'https://www.mozilla.org/en-US/firefox/products/',
    'chrome': 'https://www.google.com/chrome/',
    'edge': 'https://www.microsoft.com/en-us/edge',
    'qq': 'https://browser.qq.com/',
    'maxthon': 'https://www.maxthon.com/',
    'opera': 'https://www.opera.com/',
    'brave': 'https://brave.com/',
    'vivaldi': 'https://vivaldi.com/',
    'cent': 'http://www.centbrowser.com/',
    'yandex': 'https://yandex.com/',
    'liebao': 'https://www.liebao.cn/',
    'deepin': '',
    'xiaobai': 'https://www.minibai.com/',
    'twinkstar': 'https://www.twinkstar.com/',
    'huawei': '',
    'catsxp': 'https://www.catsxp.com/',
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
    'xiaobai': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\xbbrowser\\User Data\\Default\\`,
        }
    },
    'safari': () => {
        return {
            darwin: `${systemHome()}/Library/Safari/`,
        }
    },
    'huawei': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\CatsxpSoftware\\Catsxp-Browser\\User Data\\Default`,
        }
    },
    'catsxp': () => {
        return {
            win32: `${systemHome()}\\AppData\\Local\\Huawei\\HuaweiBrowser\\User Data\\Default`,
        }
    },
}
