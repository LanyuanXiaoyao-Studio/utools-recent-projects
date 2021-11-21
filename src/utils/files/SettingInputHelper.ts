import {isEmpty, isNil} from 'licia'
import fs from 'fs'
import {i18n, sentenceKey} from '../../i18n'
import {Component} from 'nano-jsx'
import {Context} from '../../Context'

const pathExistsCache: { [key: string]: boolean } = {}

export const existsCacheSync: (path: string) => boolean = path => {
    if (isEmpty(path)) {
        return true
    }
    let exists = pathExistsCache[path]
    if (isNil(exists)) {
        exists = fs.existsSync(path)
        pathExistsCache[path] = exists
        return exists
    }
    return exists
}

export const inputPath: (component: Component, event: any, id: string, native: boolean) => void = (component, event, id, native) => {
    let inputValue = event.target?.value
    if (isNil(inputValue)) {
        alert(i18n.t(sentenceKey.unknownInputError))
    } else if (isEmpty(inputValue)) {
        return
    } else {
        let path = inputValue
        if (!fs.existsSync(path)) {
            alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
            event.target.value = ''
            return
        }
        pathExistsCache[path] = true
        native
            ? Context.updateNative(id, path)
            : Context.update(id, path)
        component.update()
    }
}

export const selectFile: (component: Component, event: any, id: string, name: string, native: boolean) => void = (component, event, id, name, native) => {
    let result = utools.showOpenDialog({
        title: name,
        message: name,
        properties: [
            'openFile',
            'treatPackageAsDirectory',
            'showHiddenFiles',
        ],
    })
    if (isNil(result) || isEmpty(result)) {
        alert(i18n.t(sentenceKey.nonExistsPathOrCancel))
    } else {
        let path = result![0]
        if (!isEmpty(path)) {
            if (!fs.existsSync(path)) {
                alert(i18n.t(sentenceKey.nonExistsFileOrDeleted))
                event.target.value = ''
                return
            }
            pathExistsCache[path] = true
            native
                ? Context.updateNative(id, path)
                : Context.update(id, path)
            component.update()
        }
    }
}

export const clearField: (component: Component, id: string, native: boolean) => void = (component, id, native) => {
    native
        ? Context.removeNative(id)
        : Context.remove(id)
    component.update()
}
