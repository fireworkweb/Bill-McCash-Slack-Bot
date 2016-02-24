var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
var port = process.env.PORT || 1337;
// var apiUrl = 'http://developers.agenciaideias.com.br/cotacoes/json';
var apiUrl = 'http://finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=USDBRL=X';

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.status(200).send('Hello World');
});

app.listen(port, function() {
    console.log('Listening on port ' + port);
});

app.post('/hello', function(req, res, next){
    var userName = req.body.user_name;
    var dolar = '0.0';
    var text = '';

    request({
        url: apiUrl,
        json: true
    }, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var value = body.split(',');
            dolar = value[1];

            if (userName == 'dbpolito') {
                text = 'Hey there, boss! Eager to get your hands on some dollars, eh? Alright, the USD exchange rate to BRL today is ' + dolar + '. One day I will be as rich as you are!';
            } else {
                text = 'Hello there, fellow capitalist ' + userName + '! As far as my stock trader contact tells me, today the USD exchange rate to BRL is ' + dolar + ' !';
            }

            var botPayload = {
                text: text,
            };

            if (userName !== 'slackbot') {
                return res.status(200).json(botPayload);
            } else {
                return res.status(200).end();
            }
        }
    });
});
