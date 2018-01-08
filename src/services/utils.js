import { locale } from '../env'

export function messageReplace (msg, data) {
    Object.keys(data).forEach(key => msg = msg.replace(`{${key}}`, data[key]))

    return msg
}

export function currencyFormat (value = 0, decimals = 2) {
    return Number(value).toLocaleString(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
    })
}
