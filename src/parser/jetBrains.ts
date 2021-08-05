import {Application, ApplicationImpl, Platform, ProjectItemImpl} from '../types'
import {readFile} from 'fs/promises'
import {isEmpty, isNil} from 'licia'
import {parse} from 'path'
import $ = require('licia/$')

export class JetBrainsProjectItemImpl extends ProjectItemImpl {
    datetime: number

    constructor(id: string, title: string, description: string, icon: string, searchKey: string, command: string, datetime: number) {
        super(id, title, description, icon, searchKey, command)
        this.datetime = datetime
    }
}

/**
 * JetBrains 系列应用实现
 */
export class JetBrainsApplicationImpl extends ApplicationImpl<JetBrainsProjectItemImpl> {
    constructor(id: string, name: string, icon: string, platform: Array<Platform> = [Platform.win32, Platform.darwin, Platform.linux], configFilename: string = 'recentProject.xml') {
        super(id, name, icon, ApplicationImpl.JETBRAINS, platform, 'JetBrains', configFilename)
    }

    async generateProjectItems(): Promise<Array<JetBrainsProjectItemImpl>> {
        let items: Array<JetBrainsProjectItemImpl> = []
        let buffer = await readFile(this.config)
        if (!isNil(buffer)) {
            let content = buffer.toString()
            $('#root').append(`<div id=${this.id} style="display: none">${content}</div>`)
            $(`#${this.id} application option[name=additionalInfo] entry`).each((index, element) => {
                let path = $(element).attr('key')
                let datetime = $(element).find('option[name=projectOpenTimestamp]').attr('value')
                if (!isEmpty(path)) {
                    let home = utools.getPath('home')
                    path = path!.replace('$USER_HOME$', home)
                    let parseObj = parse(path)
                    items.push({
                        id: '',
                        title: parseObj.name,
                        description: path,
                        icon: this.icon,
                        searchKey: parseObj.name,
                        command: `"${this.executor}" "${path}"`,
                        datetime: parseInt(`${datetime}`),
                    })
                }
            })
        }
        return items
    }
}

export const applications: Array<Application<JetBrainsProjectItemImpl>> = [
    new JetBrainsApplicationImpl('android', 'Android Studio', 'icon/android.png'),
    new JetBrainsApplicationImpl('appcode', 'AppCode', 'icon/appcode.png', [Platform.darwin]),
    new JetBrainsApplicationImpl('clion', 'CLion', 'icon/clion.png'),
    new JetBrainsApplicationImpl('datagrip', 'DataGrip', 'icon/datagrip.png'),
    new JetBrainsApplicationImpl('goland', 'GoLand', 'icon/goland.png'),
    new JetBrainsApplicationImpl('idea', 'Intellij IDEA Ultimate', 'icon/idea.png'),
    new JetBrainsApplicationImpl('idea-ce', 'Intellij IDEA Community Edition', 'icon/idea-ce.png'),
    new JetBrainsApplicationImpl('idea-edu', 'Intellij IDEA Edu', 'icon/idea-edu.png'),
    new JetBrainsApplicationImpl('mps', 'MPS', 'icon/mps.png'),
    new JetBrainsApplicationImpl('phpstorm', 'PhpStorm', 'icon/phpstorm.png'),
    new JetBrainsApplicationImpl('pycharm', 'PyCharm Professional', 'icon/pycharm.png'),
    new JetBrainsApplicationImpl('pycharm-ce', 'PyCharm Community', 'icon/pycharm-ce.png'),
    new JetBrainsApplicationImpl('pycharm-edu', 'PyCharm Edu', 'icon/pycharm-edu.png'),
    new JetBrainsApplicationImpl('rider', 'Rider', 'icon/rider.png', undefined, 'recentSolution.xml'),
    new JetBrainsApplicationImpl('rubymine', 'RubyMine', 'icon/rubymine.png'),
    new JetBrainsApplicationImpl('webstorm', 'WebStorm', 'icon/webstorm.png'),
]
