import _get from 'lodash.get'
import _includes from 'lodash.includes'
import express from 'express'
import bodyParser from 'body-parser'
import env from '../env'
import { messageReplace } from './utils'
import fetchAndPostMessage from './bill'

const app = express()

function parseRequest (req, res, next) {
    let userId = _get(req, 'body.user_id', '')
    let userName = _get(req, 'body.user_name', '')
    let user = `${userId}|${userName}`

    res.json({
        username: env.botName,
        text: messageReplace(env.msg.wait, { user }),
    })

    let msg = _includes(env.bosses, userName)
        ? env.msg.boss
        : env.msg.fellow

    fetchAndPostMessage(messageReplace(msg, { user }))

    next()
}

export default function startServerJob () {
    app.use(bodyParser.urlencoded({ extended: true }))

    app.post(`/${env.trigger}`, parseRequest)

    app.listen(env.port, () => console.log(`Server listening at ${env.port}`))
}
