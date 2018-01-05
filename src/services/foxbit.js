import { BlinkTradeRest } from 'blinktrade'
import env from '../env'

const blinktrade = new BlinkTradeRest({
    prod: true,
    currency: env.foxbit.currency,
})

export default function fetch () {
    return blinktrade.ticker()
}
