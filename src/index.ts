import {Action, Callback, DatetimeProjectItemImpl, NoExecutor, ProjectArgsImpl, ProjectItemImpl} from './types'
import {isEmpty} from 'licia'
import {SettingUIFeature} from './setting/setting'
import {
    browserBookmarkApplications,
    browserHistoryApplications,
    jetBrainsApplications,
    officeApplications,
    sublimeApplications,
    vscodeApplications,
    vsStudioApplications,
    wpsApplications,
    xcodeApplications,
} from './applications'
import $ = require('licia/$')

const emptyTips: ProjectItemImpl = {
    id: 'cc1b114e-5d1a-40df-b117-8c2cd7ddffa4',
    title: `似乎什么都找不到`,
    description: '如果你还没有设置改软件的相关配置，请先在 Setting 关键字中设置相关配置内容，点击可跳转设置界面',
    icon: 'info.png',
    searchKey: '',
    exists: true,
    command: new NoExecutor(),
}

const unSupportTips: ProjectItemImpl = {
    id: '66ecef84-4bd7-4e06-85df-85035be54a19',
    title: `该关键字不支持当前平台`,
    description: '当然关键字对应的历史项目索引不支持当前平台，如果影响了你的日常操作，可以在插件详情中禁用',
    icon: 'info.png',
    searchKey: '',
    exists: true,
    command: new NoExecutor(),
}

export class AllProjectArgs extends ProjectArgsImpl {
    placeholder = '通过项目名快速查找项目'

    enter = (action: Action, callback: Callback<ProjectItemImpl>) => {
        $('.container').css('display', 'none')
        this.clearCache()
        this.getProjectItems(utools.getNativeId())
            .then(result => {
                if (isEmpty(result)) {
                    callback([emptyTips])
                } else {
                    callback(result)
                }
            })
            .catch(error => {
                console.log(error)
                utools.showNotification(error.message)
                utools.copyText(error.message)
                utools.showNotification('错误信息已复制到剪贴板')
            })
    }

    search = (action: Action, searchText: string, callback: Callback<ProjectItemImpl>) => {
        if (isEmpty(searchText)) {
            if (isEmpty(this.projectItemCache)) {
                callback([emptyTips])
            } else {
                callback(this.projectItemCache)
            }
        } else {
            let text = searchText.toLocaleLowerCase()
            callback(this.projectItemCache.filter(item => item.searchKey.toLocaleLowerCase().indexOf(text) > -1))
        }
    }

    select = (action: Action, item: ProjectItemImpl, callback: Callback<ProjectItemImpl>) => {
        if (item.id === emptyTips.id) {
            utools.redirect('Setting', '')
            return
        }
        if (!item.exists) {
            utools.showNotification('文件不存在')
            return
        }
        item.command.execute()
    }
}

export class AllProjectSortByTimeArgs extends AllProjectArgs {
    override compare(p1: DatetimeProjectItemImpl, p2: DatetimeProjectItemImpl): number {
        return p2.datetime - p1.datetime
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
        args: new AllProjectSortByTimeArgs(browserBookmarkApplications),
        mode: 'list',
    },
}
