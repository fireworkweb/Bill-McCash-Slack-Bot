import axios from 'axios'
import env from '../env'
import { round } from './utils'

function mapCurrency (cur, label) {
    return {
        title: cur.from,
        value: `${label} ${round(cur.value, 4)}`,
        short: true,
    }
}

export default function postTextToSlack (text, currencies, cryptoCurrencies) {
    currencies = currencies.map(
        cur => mapCurrency(cur, env.currencies.label)
    )

    cryptoCurrencies = cryptoCurrencies.map(
        cur => mapCurrency(cur, env.cryptoCurrencies.label)
    )

    if (env.emoji && env.emoji.length) {
        let randomNumber = Math.floor(Math.random() * env.emoji.length)
        text += ` ${env.emoji[randomNumber]}`
    }

    let textToPost = {
        username: env.botName,
        text,
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

    return axios.post(env.slackWebhookURL, textToPost)
}
