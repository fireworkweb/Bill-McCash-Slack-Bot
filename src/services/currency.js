import _get from 'lodash.get'
import axios from 'axios'
import env from '../env'

const apiURL = 'https://economia.awesomeapi.com.br/json'

let fetch = {
    fetchCurrency: {
        get (currency) {
            return axios.get(`${apiURL}/${currency}-${env.currencies.to}/1`)
        },

        parse (response) {
            return _get(response, 'data[0].bid')
        },
    },
}

function startFetch (currency, callbacks) {
    return Promise.resolve(currency)
        .then(callbacks.get)
        .then(callbacks.parse)
}

function parseResponse (response, currency) {
    return {
        from: currency,
        to: env.currencies.to,
        value: response,
    }
}

export default function fetchCurrency (currencyToFetch) {
    return startFetch(currencyToFetch, fetch.fetchCurrency)
        .catch(e => console.log(e))
        .then(response => parseResponse(response, currencyToFetch))
}
