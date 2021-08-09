import {Application, ProjectItemImpl} from './types'
import {applications as JetBrainsApplications} from './parser/jetBrains'
import {applications as VscodeApplications} from './parser/vscode'
import {applications as SublimeApplications} from './parser/sublime'

export const applications: Array<Application<ProjectItemImpl>> = [
    ...JetBrainsApplications,
    ...VscodeApplications,
    ...SublimeApplications,
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]

export const sublimeApplications: Array<Application<ProjectItemImpl>> = [...SublimeApplications]
