import {Action, Callback, ProjectArgsImpl, ProjectItemImpl} from './types'
import {isEmpty} from 'licia'
import {exec} from 'child_process'
import {SettingUIFeature} from './setting/setting'
import {applications, jetBrainsApplications, vscodeApplications} from './applications'
import {JetBrainsProjectItemImpl} from './parser/jetBrains'

class AllProjectArgs extends ProjectArgsImpl {
    placeholder = '通过项目名快速查找项目'

    enter = (action: Action, callback: Callback<ProjectItemImpl>) => {
        this.getProjectItems(utools.getNativeId())
            .then(result => callback(result))
            .catch(error => utools.showNotification(error.message))
    }

    search = (action: Action, searchText: string, callback: Callback<ProjectItemImpl>) => {
        if (isEmpty(searchText)) {
            callback(this.projectItemCache)
        } else {
            let text = searchText.toLocaleLowerCase()
            callback(this.projectItemCache.filter(item => item.searchKey.indexOf(text) > -1))
        }
    }

    select = (action: Action, item: ProjectItemImpl, callback: Callback<ProjectItemImpl>) => {
        exec(item.command, error => {
            console.log(error)
            if (isEmpty(error)) {
                utools.hideMainWindow()
                utools.outPlugin()
            } else {
                utools.showNotification(error?.message ?? 'Unknown Error')
            }
        })
    }
}

class JetBrainsArgs extends AllProjectArgs {
    compare(p1: JetBrainsProjectItemImpl, p2: JetBrainsProjectItemImpl): number {
        return p2.datetime - p1.datetime
    }
}

// @ts-ignore
window.exports = {
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
}
