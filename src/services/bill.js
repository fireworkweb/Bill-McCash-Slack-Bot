import axios from 'axios'
import env from '../env'
import fetchCurrency from './currency'
import fetchCryptoCurrency from './cryptocurrency'
import fetchFoxbit from './foxbit'
import postTextToSlack from './slack'

function getAllCurrencies () {
    return Promise.all(env.currencies.from.map(fetchCurrency))
}

function getAllCryptoCurrencies () {
    return Promise.all(env.cryptoCurrencies.from.map(fetchCryptoCurrency))
}

function getFoxbit () {
    return fetchFoxbit()
}

export default function fetchAndPostMessage (textToPost) {
    let getFrom = [ getAllCurrencies(), getAllCryptoCurrencies() ]

    if (env.foxbit.enabled) {
        getFrom.push(getFoxbit())
    }

    return Promise.all(getFrom)
        .then(currencies => {
            currencies.unshift(textToPost)
            postTextToSlack.apply(this, currencies)
        })
        .catch(error => axios.post(env.slackWebhookURL, { text: `${env.msg.error} ${error}` }))
}
