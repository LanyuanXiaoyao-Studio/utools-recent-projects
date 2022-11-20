import {contain} from 'licia'
import {AllProjectArgs, AllProjectSortByTimeArgs, AllProjectSortByTitleArgs} from './Entrance'
import {applications as ChromiumBookmarkApplications} from './parser/browser/bookmark/Chromium'
import {applications as FirefoxBookmarkApplications} from './parser/browser/bookmark/Firefox'
import {applications as SafariBookmarkApplications} from './parser/browser/bookmark/Safari'
import {applications as ChromiumHistoryApplications} from './parser/browser/history/Chromium'
import {applications as FirefoxHistoryApplications} from './parser/browser/history/Firefox'
import {applications as SafariHistoryApplications} from './parser/browser/history/Safari'
import {applications as geanyApplications} from './parser/editor/Geany'
import {applications as sublimeApplications} from './parser/editor/Sublime'
import {applications as typoraApplications} from './parser/editor/Typora'
import {applications as vscodeApplications} from './parser/editor/Vscode'
import {
    androidApplications as androidStudioApplications,
    applications as jetBrainsApplications,
} from './parser/ide/JetBrains'
import {applications as vsStudioApplications} from './parser/ide/VsStudio'
import {applications as xcodeApplications} from './parser/ide/Xcode'
import {applications as evernoteApplication} from './parser/notes/Evernote'
import {applications as obsidianApplications} from './parser/notes/Obsidian'
import {applications as libreOfficeApplications} from './parser/office/Libre'
import {applications as officeApplications} from './parser/office/Office'
import {applications as wpsApplications} from './parser/office/Wps'
import {applications as defaultFolderXApplications} from './parser/system/DefaultFolderX'
import {applications as shortcutsApplication} from './parser/system/Shortcuts'
import {ApplicationImpl, Feature, ProjectArgsImpl, ProjectItemImpl} from './Types'

export class ProjectFeature implements Feature<ProjectArgsImpl> {
    args: ProjectArgsImpl
    mode: 'list' | 'none'

    constructor(args: ProjectArgsImpl) {
        this.args = args
        this.mode = 'list'
    }
}

export const argsMapping: { [keys: string]: ProjectFeature } = {
    'jetbrains-project': new ProjectFeature(new AllProjectSortByTimeArgs(jetBrainsApplications)),
    'android-studio-project': new ProjectFeature(new AllProjectSortByTimeArgs(androidStudioApplications)),
    'vscode-project': new ProjectFeature(new AllProjectSortByTimeArgs(vscodeApplications)),
    'typora-project': new ProjectFeature(new AllProjectSortByTimeArgs(typoraApplications)),
    'sublime-project': new ProjectFeature(new AllProjectArgs(sublimeApplications)),
    'wps-project': new ProjectFeature(new AllProjectArgs(wpsApplications)),
    'vs-studio-project': new ProjectFeature(new AllProjectArgs(vsStudioApplications)),
    'xcode-project': new ProjectFeature(new AllProjectArgs(xcodeApplications)),
    'office-project': new ProjectFeature(new AllProjectSortByTimeArgs(officeApplications)),
    'browser-history-project': new ProjectFeature(new AllProjectSortByTimeArgs([
        ...FirefoxHistoryApplications,
        ...SafariHistoryApplications,
        ...ChromiumHistoryApplications,
    ])),
    'browser-bookmark-project': new ProjectFeature(new AllProjectSortByTitleArgs([
        ...FirefoxBookmarkApplications,
        ...SafariBookmarkApplications,
        ...ChromiumBookmarkApplications,
    ])),
    'libre-project': new ProjectFeature(new AllProjectSortByTimeArgs(libreOfficeApplications)),
    'obsidian-project': new ProjectFeature(new AllProjectSortByTimeArgs(obsidianApplications)),
    'geany-project': new ProjectFeature(new AllProjectArgs(geanyApplications)),
    'default-folder-x-project': new ProjectFeature(new AllProjectSortByTimeArgs(defaultFolderXApplications)),
    'evernote-project': new ProjectFeature(new AllProjectSortByTimeArgs(evernoteApplication)),
    'shortcuts-project': new ProjectFeature(new AllProjectSortByTimeArgs(shortcutsApplication)),
}

export const applications: Array<ApplicationImpl<ProjectItemImpl>> = []
const keys = Object.keys(argsMapping),
    length = keys.length,
    skipKeys = [
        'android-studio-project',
    ]
for (let i = 0; i < length; i++) {
    if (contain(skipKeys, keys[i])) {
        continue
    }
    applications.push(...(argsMapping[keys[i]].args.getApplications()))
}
