import {Application, ProjectItemImpl} from './types'
import {applications as JetBrainsApplications} from './parser/ide/jetBrains'
import {applications as VscodeApplications} from './parser/editor/vscode'
import {applications as SublimeApplications} from './parser/editor/sublime'
import {applications as WpsApplications} from './parser/office/wps'

export const applications: Array<Application<ProjectItemImpl>> = [
    ...JetBrainsApplications,
    ...VscodeApplications,
    ...SublimeApplications,
    ...WpsApplications,
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]

export const sublimeApplications: Array<Application<ProjectItemImpl>> = [...SublimeApplications]

export const wpsApplications: Array<Application<ProjectItemImpl>> = [...WpsApplications]
