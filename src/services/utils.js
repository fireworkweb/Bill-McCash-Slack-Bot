export function messageReplace (msg, data) {
    Object.keys(data).forEach(key => msg = msg.replace(`{${key}}`, data[key]))

    return msg
}

export function round (value = 0, decimals = 0) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}
