import {Application, ProjectItemImpl} from './types'
import {applications as JetBrainsApplications} from './parser/jetBrains'
import {applications as VscodeApplications} from './parser/vscode'

export const applications: Array<Application<ProjectItemImpl>> = [
    ...JetBrainsApplications,
    ...VscodeApplications,
]

export const jetBrainsApplications: Array<Application<ProjectItemImpl>> = [...JetBrainsApplications]

export const vscodeApplications: Array<Application<ProjectItemImpl>> = [...VscodeApplications]
