import {Application, ProjectItemImpl} from './Types'
import {applications as JetBrainsApplications} from './parser/ide/JetBrains'
import {applications as VscodeApplications} from './parser/editor/Vscode'
import {applications as TyporaApplications} from './parser/editor/Typora'
import {applications as SublimeApplications} from './parser/editor/Sublime'
import {applications as WpsApplications} from './parser/office/Wps'
import {applications as VsStudioApplications} from './parser/ide/VsStudio'
import {applications as XcodeApplications} from './parser/ide/Xcode'
import {applications as OfficeApplications} from './parser/office/Office'
import {applications as FirefoxHistoryApplications} from './parser/browser/history/Firefox'
import {applications as ChromiumHistoryApplications} from './parser/browser/history/Chromium'
import {applications as SafariHistoryApplications} from './parser/browser/history/Safari'
import {applications as FirefoxBookmarkApplications} from './parser/browser/bookmark/Firefox'
import {applications as ChromiumBookmarkApplications} from './parser/browser/bookmark/Chromium'
import {applications as SafariBookmarkApplications} from './parser/browser/bookmark/Safari'
import {applications as LibreOfficeApplications} from './parser/office/Libre'
import {applications as ObsidianApplications} from './parser/editor/Obsidian'

export const applications: Array<Application<ProjectItemImpl>> = [
    ...JetBrainsApplications,
    ...VscodeApplications,
    ...TyporaApplications,
    ...SublimeApplications,
    ...WpsApplications,
    ...VsStudioApplications,
    ...XcodeApplications,
    ...OfficeApplications,
    ...FirefoxHistoryApplications,
    ...SafariHistoryApplications,
    ...ChromiumHistoryApplications,
    ...FirefoxBookmarkApplications,
    ...SafariBookmarkApplications,
    ...ChromiumBookmarkApplications,
    ...LibreOfficeApplications,
    ...ObsidianApplications,
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]

export const typoraApplications: Array<Application<ProjectItemImpl>> = [...TyporaApplications]

export const obsidianApplications: Array<Application<ProjectItemImpl>> = [...ObsidianApplications]

export const sublimeApplications: Array<Application<ProjectItemImpl>> = [...SublimeApplications]

export const wpsApplications: Array<Application<ProjectItemImpl>> = [...WpsApplications]

export const vsStudioApplications: Array<Application<ProjectItemImpl>> = [...VsStudioApplications]

export const xcodeApplications: Array<Application<ProjectItemImpl>> = [...XcodeApplications]

export const officeApplications: Array<Application<ProjectItemImpl>> = [...OfficeApplications]

export const libreOfficeApplications: Array<Application<ProjectItemImpl>> = [...LibreOfficeApplications]

export const browserHistoryApplications: Array<Application<ProjectItemImpl>> = [
    ...FirefoxHistoryApplications,
    ...SafariHistoryApplications,
    ...ChromiumHistoryApplications,
]

export const browserBookmarkApplications: Array<Application<ProjectItemImpl>> = [
    ...FirefoxBookmarkApplications,
    ...SafariBookmarkApplications,
    ...ChromiumBookmarkApplications,
]
