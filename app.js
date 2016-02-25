// Requires
var Express = require('express');
var bodyParser = require('body-parser');
var Request = require('request');
var CronJob = require('cron').CronJob;

// Variables
var app = Express();
var port = process.env.PORT || 3000;
var currency = {
    from: 'USD',
    to: 'BRL',
};

// Urls
var apiUrl = 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=' + currency.from + currency.to + '=X';
var hookUrl = 'https://hooks.slack.com/services/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';

// Functions
function slackSend(text) {
    if (!text) return;

    var body = {
        text: text,
    };

    Request.post({
        proxy: process.env.https_proxy || process.env.http_proxy,
        url: hookUrl,
        body: JSON.stringify(body)
    });
}

// CronJob
var job = new CronJob({
    cronTime: '00 00 10,14 * * *',
    onTick: function() {
        var currentHours = new Date().getHours();
        var text;

        Request(apiUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var values = body.split(',');
                value = values[1];

                if (currentHours == '10') {
                    text = "Greetings! What a lovely morning to enrich yourself, isn't it? My currency-o-matic watch is showing that the " + currency.from + " exchange rate to " + currency.to + " is *R$ " + value + "*!";
                } else {
                    text = 'Salutations, fellow investors! Did you know that the ' + currency.from + ' exchange rate to ' + currency.to + ' is currently *R$ ' + value + '*? Keep that in mind if you plan on buying useless stuff from China today!';
                }
            }
        });

        slackSend(text);
    },
    start: false,
    timeZone: 'America/Sao_Paulo'
});

// Use
app.use(bodyParser.urlencoded({extended: true}));

// listen
app.listen(port, function() {
    console.log('Starting CronJob...');
    job.start();
    console.log('Bill McCash Slack Bot is running on port: ' + port);
});

// index
app.get('/', function(req, res) {
    res.send('Bill McCash Slack Bot is running.');
});

// call bill
app.post('/bill', function(req, res){
    var user = req.body.user_name;
    var value, text;

    Request(apiUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var values = body.split(',');
            value = values[1];

            if (user == 'dbpolito' || user == 'hideo') {
                text = 'Hey there, boss! Eager to get your hands on some dollars, eh? Alright, the ' + currency.from + ' exchange rate to ' + currency.to + ' today is *R$ ' + value + '*. One day I will be as rich as you are!';
            } else {
                text = 'Hello there, fellow capitalist ' + user + '! As far as my stock trader contact tells me, today the ' + currency.from + ' exchange rate to ' + currency.to + ' is *R$ ' + value + '* !';
            }
        } else {
            text = 'Something went wrong.';
        }

        // response to slack
        if (user !== 'slackbot') {
            return res.json({
                text: text,
            });
        } else {
            return res.end();
        }
    });
});
