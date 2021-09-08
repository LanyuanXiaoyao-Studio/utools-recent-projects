import {Application, ProjectItemImpl} from './types'
import {applications as JetBrainsApplications} from './parser/ide/jetBrains'
import {applications as VscodeApplications} from './parser/editor/vscode'
import {applications as TyporaApplications} from './parser/editor/typora'
import {applications as SublimeApplications} from './parser/editor/sublime'
import {applications as WpsApplications} from './parser/office/wps'
import {applications as VsStudioApplications} from './parser/ide/vsStudio'
import {applications as XcodeApplications} from './parser/ide/xcode'
import {applications as OfficeApplications} from './parser/office/office'
import {applications as FirefoxHistoryApplications} from './parser/browser/history/firefox'
import {applications as ChromiumHistoryApplications} from './parser/browser/history/chromium'
import {applications as SafariHistoryApplications} from './parser/browser/history/safari'
import {applications as FirefoxBookmarkApplications} from './parser/browser/bookmark/firefox'
import {applications as ChromiumBookmarkApplications} from './parser/browser/bookmark/chromium'
import {applications as SafariBookmarkApplications} from './parser/browser/bookmark/safari'

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
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]

export const typoraApplications: Array<Application<ProjectItemImpl>> = [...TyporaApplications]

export const sublimeApplications: Array<Application<ProjectItemImpl>> = [...SublimeApplications]

export const wpsApplications: Array<Application<ProjectItemImpl>> = [...WpsApplications]

export const vsStudioApplications: Array<Application<ProjectItemImpl>> = [...VsStudioApplications]

export const xcodeApplications: Array<Application<ProjectItemImpl>> = [...XcodeApplications]

export const officeApplications: Array<Application<ProjectItemImpl>> = [...OfficeApplications]

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
