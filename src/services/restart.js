import fs from 'fs'
import { resolve } from 'path'

const RESTART_FILE = resolve(__dirname, '../..', '.restart')

function checkJob () {
    if (!fs.existsSync(RESTART_FILE)) {
        return
    }

    fs.unlinkSync(RESTART_FILE)
    process.exit()
}

export default function startRestartJob (checkInterval) {
    if (process.argv.indexOf('--restart') !== -1) {
        fs.closeSync(fs.openSync(RESTART_FILE, 'w'))
        process.exit()
    }

    setInterval(checkJob, checkInterval)
}
