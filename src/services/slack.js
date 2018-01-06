import axios from 'axios'
import env from '../env'
import { currencyFormat } from './utils'

function mapCurrency (cur, label, decimals = 4) {
    return {
        title: cur.from,
        value: `${label} ${currencyFormat(cur.value, decimals)}`,
        short: true,
    }
}

function mapFoxbit (data) {
    return [
        {
            title: 'Compra',
            value: `R$ ${currencyFormat(data.buy, 2)}`,
            short: true,
        }, {
            title: 'Venda',
            value: `R$ ${currencyFormat(data.sell, 2)}`,
            short: true,
        }, {
            title: 'Baixa',
            value: `R$ ${currencyFormat(data.low, 2)}`,
            short: true,
        }, {
            title: 'Alta',
            value: `R$ ${currencyFormat(data.high, 2)}`,
            short: true,
        },
    ]
}

export default function postTextToSlack (text, currencies, cryptoCurrencies, foxbit) {
    currencies = currencies.map(
        cur => mapCurrency(cur, env.currencies.label)
    )

    cryptoCurrencies = cryptoCurrencies.map(
        cur => mapCurrency(cur, env.cryptoCurrencies.label, 2)
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
