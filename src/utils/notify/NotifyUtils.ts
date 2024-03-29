import Toastify from 'toastify-js'
import StartToastifyInstance from 'toastify-js'

const style = {
    'border-radius': '5px',
    'border': '1px solid',
    'font-size': 'smaller',
}

const commonOption: StartToastifyInstance.Options = {
    duration: 2000,
    close: true,
    style: {
        'border-radius': '5px',
        'border': '1px solid',
        'font-size': 'smaller',
    },
}

export const toastInfo: (text: string) => void = text => {
    Toastify({
        text: text,
        ...commonOption,
        style: {
            ...commonOption.style,
            'background': '#5755d9',
            'border-color': '#2e2bd9',
        },
    }).showToast()
}

export const toastSuccess: (text: string) => void = text => {
    Toastify({
        text: text,
        ...commonOption,
        style: {
            ...commonOption.style,
            'background': '#32b643',
            'border-color': '#2ca137',
        },
    }).showToast()
}

export const toastWarning: (text: string) => void = text => {
    Toastify({
        text: text,
        ...commonOption,
        style: {
            ...commonOption.style,
            'background': '#ffb700',
            'border-color': '#e39e00',
        },
    }).showToast()
}

export const toastError: (text: string) => void = text => {
    Toastify({
        text: text,
        ...commonOption,
        style: {
            ...commonOption.style,
            'background': '#e85600',
            'border-color': '#cb4d00',
        },
    }).showToast()
}
