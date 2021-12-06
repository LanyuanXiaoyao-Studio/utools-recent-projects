import {Action, Callback, DatetimeProjectItemImpl, NoExecutor, ProjectArgsImpl, ProjectItemImpl} from './Types'
import {isEmpty, isNil} from 'licia'
import {i18n, sentenceKey} from './i18n'
import S from 'licia/$'
import NanoBar from 'nanobar'

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
    placeholder = i18n.t(sentenceKey.placeholder)

    override enter(action: Action, callback: Callback<ProjectItemImpl>): void {
        super.enter(action, callback)
        if (isNil(nanoBar)) {
            nanoBar = new NanoBar()
            S('.nanobar').css('height', '2px')
            S('.nanobar .bar').css('background', '#0b2d64')
            S('.nanobar .bar').css('box-shadow', '0 0 10px #767676')
        }
        S('.container').css('display', 'none')
        S('style.custom').each((index, element) => element.remove())
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
                S('.nanobar .bar').css('background', '#ff2929')
                S('.nanobar .bar').css('box-shadow', '0 0 10px #ff2929')
                nanoBar.go(100)

                console.log(error)
                utools.showNotification(error.message)
                utools.copyText(error.message)
                utools.showNotification(i18n.t(sentenceKey.errorInfoToClipboard))
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
            let text = searchText.toLocaleLowerCase().trim()
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

    select = (action: Action, item: ProjectItemImpl, callback: Callback<ProjectItemImpl>) => {
        if (item.id === emptyTips().id) {
            utools.redirect('Setting', '')
            return
        }
        if (!item.exists) {
            utools.showNotification(i18n.t(sentenceKey.filePathNonExistsTips))
            return
        }
        if (this.context?.enableOpenNotification ?? false) {
            utools.showNotification(`${i18n.t(sentenceKey.fileOpening)}: ${item.title}`)
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
