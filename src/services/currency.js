import _get from 'lodash.get'
import axios from 'axios'
import env from '../env'

const apiURL = 'http://api.fixer.io/latest'
const apiFallbackURL = 'https://economia.awesomeapi.com.br/json/'

let fetch = {
    main: {
        get (currency) {
            return axios.get(apiURL, {
                params: {
                    base: currency,
                    symbols: env.currencies.to,
                },
            })
        },

        parse (response) {
            return _get(response, `data.rates.${env.currencies.to}`)
        },
    },

    fallback: {
        get (currency) {
            return axios.get(`${apiFallbackURL}/${currency}-${env.currencies.to}/1`)
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
    return startFetch(currencyToFetch, fetch.main)
        .catch(() => startFetch(currencyToFetch, fetch.fallback))
        .then(response => parseResponse(response, currencyToFetch))
}
