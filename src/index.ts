import {Action, Callback, DatetimeProjectItemImpl, NoExecutor, ProjectArgsImpl, ProjectItemImpl} from './types'
import {isEmpty, isNil, max} from 'licia'
import {SettingUIFeature} from './setting/setting'
import {
    browserBookmarkApplications,
    browserHistoryApplications,
    jetBrainsApplications,
    libreOfficeApplications,
    obsidianApplications,
    officeApplications,
    sublimeApplications,
    typoraApplications,
    vscodeApplications,
    vsStudioApplications,
    wpsApplications,
    xcodeApplications,
} from './applications'
import {i18n, sentenceKey} from './i18n'
import {score} from './utils'
import $ = require('licia/$')
import NanoBar = require('nanobar')

const emptyTips: () => ProjectItemImpl = () => {
    return {
        id: 'cc1b114e-5d1a-40df-b117-8c2cd7ddffa4',
        title: i18n.t(sentenceKey.emptyTipsTitle),
        description: i18n.t(sentenceKey.emptyTipsDesc),
        icon: 'info.png',
        searchKey: [],
        exists: true,
        command: new NoExecutor(),
    }
}

const unSupportTips: () => ProjectItemImpl = () => {
    return {
        id: '66ecef84-4bd7-4e06-85df-85035be54a19',
        title: i18n.t(sentenceKey.unSupportTipsTitle),
        description: i18n.t(sentenceKey.unSupportTipsDesc),
        icon: 'info.png',
        searchKey: [],
        exists: true,
        command: new NoExecutor(),
    }
}

let nanoBar

export class AllProjectArgs extends ProjectArgsImpl {
    placeholder = '通过项目名快速查找项目'

    override enter(action: Action, callback: Callback<ProjectItemImpl>): void {
        super.enter(action, callback)
        if (isNil(nanoBar)) {
            nanoBar = new NanoBar()
            $('.nanobar').css('height', '2px')
            $('.nanobar .bar').css('background', '#0b2d64')
            $('.nanobar .bar').css('box-shadow', '0 0 10px #767676')
        }
        $('.container').css('display', 'none')
        $('style.custom').each((index, element) => element.remove())
        this.clearCache()
        nanoBar.go(40)
        this.getProjectItems(utools.getNativeId())
            .then(result => {
                nanoBar.go(100)
                if (isEmpty(result)) {
                    callback([emptyTips()])
                } else {
                    callback(result)
                }
            })
            .catch(error => {
                $('.nanobar .bar').css('background', '#ff2929')
                $('.nanobar .bar').css('box-shadow', '0 0 10px #ff2929')
                nanoBar.go(100)

                console.log(error)
                utools.showNotification(error.message)
                utools.copyText(error.message)
                utools.showNotification('错误信息已复制到剪贴板')
            })
    }

    search = (action: Action, searchText: string, callback: Callback<ProjectItemImpl>) => {
        if (isEmpty(searchText)) {
            if (isEmpty(this.projectItemCache)) {
                callback([emptyTips()])
            } else {
                callback(this.projectItemCache)
            }
        } else {
            let text = searchText.toLocaleLowerCase()
            if (this.context?.enableFuzzyMatch ?? false) {
                callback(this.projectItemCache
                    .map(item => {
                        item.score = max(...item.searchKey.map(k => score(k, text)))
                        return item
                    })
                    .filter(item => item.score !== 0)
                    .sort((a, b) => b.score! - a.score!),
                )
            } else {
                callback(this.projectItemCache.filter(item => {
                    for (let key of item.searchKey) {
                        if (key.toLowerCase().indexOf(text) > -1) {
                            return true
                        }
                    }
                    return false
                }))
            }
        }
    }

    select = (action: Action, item: ProjectItemImpl, callback: Callback<ProjectItemImpl>) => {
        if (item.id === emptyTips().id) {
            utools.redirect('Setting', '')
            return
        }
        if (!item.exists) {
            utools.showNotification('文件不存在')
            return
        }
        if (this.context?.enableOpenNotification ?? false) {
            utools.showNotification(`正在打开项目: ${item.title}`)
        }
        item.command.execute()
    }
}

export class AllProjectSortByTimeArgs extends AllProjectArgs {
    override compare(p1: DatetimeProjectItemImpl, p2: DatetimeProjectItemImpl): number {
        return p2.datetime - p1.datetime
    }
}

export class AllProjectSortByTitleArgs extends AllProjectArgs {
    override compare(p1: ProjectItemImpl, p2: ProjectItemImpl): number {
        if (!isNil(p1?.['title']) && !isNil(p2?.['title'])) {
            let a = p1['title'], b = p2['title']
            if (a === b) return 0
            else if (a > b) return 1
            else if (a < b) return -1
            else return 0
        } else return 0
    }
}

export const build: any = {
    'setting': new SettingUIFeature(),
    'jetbrains-project': {
        args: new AllProjectSortByTimeArgs(jetBrainsApplications),
        mode: 'list',
    },
    'vscode-project': {
        args: new AllProjectArgs(vscodeApplications),
        mode: 'list',
    },
    'typora-project': {
        args: new AllProjectSortByTimeArgs(typoraApplications),
        mode: 'list',
    },
    'sublime-project': {
        args: new AllProjectArgs(sublimeApplications),
        mode: 'list',
    },
    'wps-project': {
        args: new AllProjectArgs(wpsApplications),
        mode: 'list',
    },
    'vs-studio-project': {
        args: new AllProjectArgs(vsStudioApplications),
        mode: 'list',
    },
    'xcode-project': {
        args: new AllProjectArgs(xcodeApplications),
        mode: 'list',
    },
    'office-project': {
        args: new AllProjectSortByTimeArgs(officeApplications),
        mode: 'list',
    },
    'browser-history-project': {
        args: new AllProjectSortByTimeArgs(browserHistoryApplications),
        mode: 'list',
    },
    'browser-bookmark-project': {
        args: new AllProjectSortByTitleArgs(browserBookmarkApplications),
        mode: 'list',
    },
    'libre-project': {
        args: new AllProjectSortByTimeArgs(libreOfficeApplications),
        mode: 'list',
    },
    'obsidian-project': {
        args: new AllProjectSortByTimeArgs(obsidianApplications),
        mode: 'list',
    },
}
