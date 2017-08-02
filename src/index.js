import axios from 'axios'
import schedule from 'node-schedule'
import express from 'express'
import bodyParser from 'body-parser'
import _get from 'lodash.get'
import env from './env'
import fetchCurrency from './currency'
import fetchCryptoCurrency from './cryptocurrency'

const app = express()

// function to replace variables env
function messageReplace (msg, data) {
    Object.keys(data).forEach(key => msg = msg.replace(`{${key}}`, data[key]))

    if (env.emoji && env.emoji.length) {
        let randomNumber = Math.floor(Math.random() * env.emoji.length)
        msg += ` ${env.emoji[randomNumber]}`
    }

    return msg
}

function getAllCurrencies () {
    return Promise.all(env.currencies.from.map(fetchCurrency))
}

function getAllCryptoCurrencies () {
    return Promise.all(env.cryptoCurrencies.from.map(fetchCryptoCurrency))
}

function round (value = 0, decimals = 0) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

function mapCurrency (cur, label) {
    return {
        title: cur.from,
        value: `${label} ${round(cur.value, 4)}`,
        short: true,
    }
}

function postTextToSlack (text, currencies, cryptoCurrencies) {
    currencies = currencies.map(
        cur => mapCurrency(cur, env.currencies.label)
    )

    cryptoCurrencies = cryptoCurrencies.map(
        cur => mapCurrency(cur, env.cryptoCurrencies.label)
    )

    let textToPost = {
        username: env.botName,
        text: text,
        attachments: [
            {
                color: '#06ff00',
                fields: currencies,
            },
            {
                color: '#136ebd',
                fields: cryptoCurrencies,
            },
        ],
    }

    return axios
        .post(env.slackWebhookURL, textToPost)
}

function fetchAndPostMessage (textToPost) {
    Promise.all([ getAllCurrencies(), getAllCryptoCurrencies() ])
        .then(currencies => {
            postTextToSlack(textToPost, currencies[0], currencies[1])
                .catch(() => axios.post(env.slackWebhookURL, { text: env.msg.error }))
        })
}

function startServer () {
    app.use(bodyParser.urlencoded({ extended: true }))

    app.post(`/${env.trigger}`, (req, res, next) => {
        let userId = _get(req, 'body.user_id', '')
        let userName = _get(req, 'body.user_name', '')
        let user = `${userId}|${userName}`

        res.json({
            username: env.botName,
            response_type: "ephemeral",
            text: messageReplace(env.msg.wait, { user: userId }),
        })

        let msg = env.bosses.find(boss => boss === userName)
            ? env.msg.boss
            : env.msg.fellow

        fetchAndPostMessage(messageReplace(msg, { user }))

        next()
    })

    // eslint-disable-next-line
    app.listen(env.port, () => console.log(`Server listening at ${env.port}`))
}

function startCron () {
    // check if cron is enabled
    if (!env.cron.enabled) {
        return
    }

    // Schedule (cron)
    schedule.scheduleJob(env.cron.schedule, () => {
        let currentHours = new Date().getHours()

        let msg = currentHours < 18
            ? (currentHours < 12 ? env.msg.morning : env.msg.afternoon)
            : env.msg.evening

        fetchAndPostMessage(msg)
    })
}

startServer()
startCron()
