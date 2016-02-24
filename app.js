var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var port = process.env.PORT || 1337;
var currency = {
    from: 'USD',
    to: 'BRL',
};

var apiUrl = 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=' + currency.from + currency.to + '=X';

app.use(bodyParser.urlencoded({extended: true}));

// index
app.get('/', function(req, res) {
    res.status(200).send('Bill McCash Slack Bot is running.');
});

app.listen(port, function() {
    console.log('Bill McCash Slack Bot is running on port: ' + port);
});

// call bill
app.post('/bill', function(req, res, next){
    var user = req.body.user_name;
    var difference, text;

    request({
        url: apiUrl,
        json: true
    }, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var values = body.split(',');
            difference = values[1];

            if (user == 'dbpolito' || user == 'hideo') {
                text = 'Hey there, boss! Eager to get your hands on some dollars, eh? Alright, the ' + currency.from + ' exchange rate to ' + currency.to + ' today is ' + difference + '. One day I will be as rich as you are!';
            } else {
                text = 'Hello there, fellow capitalist ' + user + '! As far as my stock trader contact tells me, today the ' + currency.from + ' exchange rate to ' + currency.to + ' is ' + difference + ' !';
            }
        } else {
            text = 'Something went wrong.';
        }

        if (user !== 'slackbot') {
            return res.status(200).json({
                text: text,
            });
        } else {
            return res.status(200).end();
        }
    });
});
