import axios from 'axios'
import env from '../env'
import fetchCurrency from './currency'
import fetchCryptoCurrency from './cryptocurrency'
import postTextToSlack from './slack'

function getAllCurrencies () {
    return Promise.all(env.currencies.from.map(fetchCurrency))
}

function getAllCryptoCurrencies () {
    return Promise.all(env.cryptoCurrencies.from.map(fetchCryptoCurrency))
}

export default function fetchAndPostMessage (textToPost) {
    return Promise.all([ getAllCurrencies(), getAllCryptoCurrencies() ])
        .then(currencies => postTextToSlack(textToPost, currencies[0], currencies[1]))
        .catch(() => axios.post(env.slackWebhookURL, { text: env.msg.error }))
}
