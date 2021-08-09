import {Action, Callback, ProjectArgsImpl, ProjectItemImpl} from './types'
import {isEmpty, isNil} from 'licia'
import {exec} from 'child_process'
import {SettingUIFeature} from './setting/setting'
import {applications, jetBrainsApplications, sublimeApplications, vscodeApplications} from './applications'
import {JetBrainsProjectItemImpl} from './parser/jetBrains'
import $ = require('licia/$')

const emptyTips: ProjectItemImpl = {
    id: 'cc1b114e-5d1a-40df-b117-8c2cd7ddffa4',
    title: `似乎什么都找不到`,
    description: '如果你还没有设置改软件的相关配置，请先在 Setting 关键字中设置相关配置内容，点击可跳转设置界面',
    icon: 'info.png',
    searchKey: '',
    command: '',
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
            callback(this.projectItemCache.filter(item => item.searchKey.indexOf(text) > -1))
        }
    }

    select = (action: Action, item: ProjectItemImpl, callback: Callback<ProjectItemImpl>) => {
        if (item.id === emptyTips.id) {
            utools.redirect('Setting', '')
            return
        }
        if (isEmpty(item.command)) {
            utools.showNotification('参数错误，请向作者反馈')
            return
        }
        exec(item.command, error => {
            console.log(error)
            if (isNil(error)) {
                utools.hideMainWindow()
                utools.outPlugin()
            } else {
                utools.showNotification(error?.message ?? '未知错误，请向作者反馈')
            }
        })
    }
}

export class JetBrainsArgs extends AllProjectArgs {
    compare(p1: JetBrainsProjectItemImpl, p2: JetBrainsProjectItemImpl): number {
        return p2.datetime - p1.datetime
    }
}

export const build: any = {
    'setting': new SettingUIFeature(),
    'all-project': {
        args: new AllProjectArgs(applications),
        mode: 'list',
    },
    'jetbrains-project': {
        args: new JetBrainsArgs(jetBrainsApplications),
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
}
