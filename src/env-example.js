export default {
    botName: 'Bill McCash',
    trigger: 'bill',
    slackWebhookURL: 'incoming-webhook-url',
    port: 3000,

    cryptoCurrencies: {
        from: [ 'BTC', 'XMR', 'ETH', 'DCR' ],

        to: 'USD',

        label: 'US$',
    },

    currencies: {
        from: [ 'USD', 'EUR' ],

        to: 'BRL',

        label: 'R$',
    },

    bosses: [ 'user1', 'user2' ],

    msg: {
        wait: 'Just a second, I\'ll get in touch with some people and get you the exchange rate. :bar_chart:',
        morning: 'Greetings! What a lovely morning to enrich yourself, isn\'t it? My currency-o-matic watch is showing this exchange rate!',
        afternoon: 'Salutations, fellow investors! Here you have the exchange rate. Keep that in mind if you plan on buying useless stuff from China today!',
        evening: 'Hey ho, fellow investors! Here you have the exchange rate before you leave. Have a good evening!',
        boss: 'Hey there, boss! Eager to get your hands on some dollars, eh? Alright, the exchange rate is this. One day I will be as rich as you are!',
        fellow: 'Hello there, fellow capitalist <@{user}>! As far as my stock trader contact tells me, this is exchange rate for now.',
        error: 'Hey ho! I\'m facing issues retrieving the exchange rate from my contacts. Let me try again later.',
    },

    // Emojis to randomly add to the end of message
    // If you don't want it, just remove :)
    emoji: [ ':money_with_wings:', ':dollar:', ':moneybag:' ],

    cron: {
        enabled: false,
        schedule: '0 8,12,18 * * 1,2,3,4,5',
    },
}
