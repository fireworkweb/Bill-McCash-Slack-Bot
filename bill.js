const restify = require('restify');
const schedule = require('node-schedule');
const env = require('./env');
const port = process.env.PORT || 3000;

// function to replace variables env
const messageReplace = (msg, data) => {
    for (let key in data) {
        msg = msg.replace(`{${key}}`, data[key]);
    }

    return msg;
};

// JSON clients
const slackHook = restify.createJsonClient({url: env.slackWebhookURL});
const dolarAPI = restify.createJsonClient({
    url: `https://economia.awesomeapi.com.br/json/${env.currency.from}-${env.currency.to}/1`
});
const fallbackDolarAPI = restify.createJsonClient({
    url: `http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=${env.currency.from}${env.currency.to}=X`
});

const getExchangeRate = () =>{
    return new Promise((resolve, reject) => {
        dolarAPI.get('', (dolarErr, dolarReq, dolarRes, obj) => {
            if(obj && obj[0] && obj[0].bid) {
                resolve(obj[0].bid);
            } else {
                getExchangeRateFallback().then(resolve, reject);
            }
        });
    });
};

const getExchangeRateFallback = () => {
    return new Promise((resolve, reject) => {
        fallbackDolarAPI.get('', (fallbackErr, fallbackReq, fallbackRes) => {
            if(fallbackRes && fallbackRes.body) {
                let arr = fallbackRes.body.split(',');
                if(arr.length > 1) {
                    resolve(arr[1]);
                } else {
                    reject('Object invalid');
                }
            } else {
                reject('No object received');
            }
        });
    });
};

// Server
const server = restify.createServer({
    name: `${env.botName} Slack Bot`
});

// make easy to get user_name
server.use(restify.bodyParser());

// call the trigger to send the response to slack
server.post(`/${env.trigger}`, (req, res, next) => {
    let user = req.params.user_name;
    let msg = env.bosses.indexOf(user) != -1 ? env.msg.boss : env.msg.fellow;

    getExchangeRate().then(
        (exchangeRate) =>
            res.send({text: messageReplace(msg, {
                    'user': user,
                    'from': env.currency.from,
                    'to': env.currency.to,
                    'value': exchangeRate
                })
            }),
        (error) => res.send({text: env.msg.error})
    );

    next();
});

// start server
server.listen(port, () => console.log(`${server.name} listening at ${server.url}`));

// check if cron is enabled
if (!env.cron.enabled) {
    return;
}

// Schedule (cron)
schedule.scheduleJob(env.cron.schedule, () => {
    let currentHours = new Date().getHours();
    let msg = currentHours < 12 ? env.msg.morning : env.msg.afternoon;

    getExchangeRate().then(
        (exchangeRate) => {
            let text = messageReplace(msg, {
                'from': env.currency.from,
                'to': env.currency.to,
                'value': exchangeRate
            });

            slackHook.post('', {text}, (err, req, res, obj) => {
                console.log(`Message sent. Status code -> ${res.statusCode}`);
            });
        },
        (error) => res.send({text: env.msg.error})
    );
});
