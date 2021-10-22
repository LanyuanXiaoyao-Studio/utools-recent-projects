const nativeId = 'eee34161-afe0-4fed-894e-92011b04e8c0'

const storeId = id => `${nativeId}/${id}`
const store = {}
store[storeId('setting-filter-non-exists-files')] = false
store[storeId('setting-get-favicon-from-net')] = false
store[storeId('setting-get-file-icon')] = false
store[storeId('setting-edit-path-input-directly')] = false

// @ts-ignore
global.utools = {
    isLinux: () => false,
    isWindows: () => false,
    isMacOs: () => true,
    getNativeId: () => nativeId,
    dbStorage: {
        getItem(key) {
            return store[key]
        },
        setItem(key, value) {
            store[key] = value
        },
        removeItem(key) {
            store[key] = undefined
        },
    },
    getPath: name => {
        switch (name) {
            case 'home':
                return ''
            default:
                return ''
        }
    },
}
