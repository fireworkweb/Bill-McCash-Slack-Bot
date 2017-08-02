import _get from 'lodash.get'
import axios from 'axios'
import env from '../env'

const apiUrl = 'https://api.cryptonator.com/api/ticker'

function fetchRate (currency) {
    return axios.get(`${apiUrl}/${currency}-${env.cryptoCurrencies.to}`)
}

function parseResponse (response) {
    return {
        from: _get(response, 'data.ticker.base'),
        to: _get(response, 'data.ticker.target'),
        value: _get(response, 'data.ticker.price'),
    }
}

export default function fetchCryptoCurrency (currencyToFetch) {
    return fetchRate(currencyToFetch)
        .then(parseResponse)
}
