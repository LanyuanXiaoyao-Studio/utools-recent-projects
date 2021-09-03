import {Application, ProjectItemImpl} from './types'
import {applications as JetBrainsApplications} from './parser/ide/jetBrains'
import {applications as VscodeApplications} from './parser/editor/vscode'
import {applications as SublimeApplications} from './parser/editor/sublime'
import {applications as WpsApplications} from './parser/office/wps'
import {applications as VsStudioApplications} from './parser/ide/vsStudio'
import {applications as XcodeApplications} from './parser/ide/xcode'
import {applications as OfficeApplications} from './parser/office/office'
import {applications as FirefoxApplications} from './parser/browser/history/firefox'
import {applications as ChromiumApplications} from './parser/browser/history/chromium'
import {applications as SafariApplications} from './parser/browser/history/safari'

export const applications: Array<Application<ProjectItemImpl>> = [
    ...JetBrainsApplications,
    ...VscodeApplications,
    ...SublimeApplications,
    ...WpsApplications,
    ...VsStudioApplications,
    ...XcodeApplications,
    ...OfficeApplications,
    ...FirefoxApplications,
    ...ChromiumApplications,
    ...SafariApplications,
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]

export const sublimeApplications: Array<Application<ProjectItemImpl>> = [...SublimeApplications]

export const wpsApplications: Array<Application<ProjectItemImpl>> = [...WpsApplications]

export const vsStudioApplications: Array<Application<ProjectItemImpl>> = [...VsStudioApplications]

export const xcodeApplications: Array<Application<ProjectItemImpl>> = [...XcodeApplications]

export const officeApplications: Array<Application<ProjectItemImpl>> = [...OfficeApplications]

export const browserApplications: Array<Application<ProjectItemImpl>> = [
    ...FirefoxApplications,
    ...ChromiumApplications,
    ...SafariApplications,
]
