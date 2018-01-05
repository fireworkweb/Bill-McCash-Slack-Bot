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

function mapFoxbit (data) {
    return [
        {
            title: 'Compra',
            value: `R$ ${round(data.buy, 2)}`,
            short: true,
        }, {
            title: 'Venda',
            value: `R$ ${round(data.sell, 2)}`,
            short: true,
        }, {
            title: 'Baixa',
            value: `R$ ${round(data.low, 2)}`,
            short: true,
        }, {
            title: 'Alta',
            value: `R$ ${round(data.high, 2)}`,
            short: true,
        },
    ]
}

export default function postTextToSlack (text, currencies, cryptoCurrencies, foxbit) {
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

    let attachments = [
        {
            color: '#06ff00',
            fields: currencies,
        }, {
            color: '#136ebd',
            fields: cryptoCurrencies,
        },
    ]

    if (foxbit) {
        attachments.push({
            color: '#e8683e',
            fields: mapFoxbit(foxbit),
        })
    }

    let textToPost = {
        username: env.botName,
        text,
        attachments: attachments,
    }

    return axios.post(env.slackWebhookURL, textToPost)
}
