const restify = require('restify');
const schedule = require('node-schedule');
const env = require('./env');
const port = process.env.PORT || 3000;

// function to replace variables env
const messageReplace = (msg, data) => {
    for (let key in data) {
        msg = msg.replace(`{${key}}`, data[key]);
    }

    if(env.emoji && env.emoji.length) {
        let randomNumber = Math.floor(Math.random() * env.emoji.length);
        msg += ` ${env.emoji[randomNumber]}`;
    }

    return msg;
};

// JSON clients
const slackHook = restify.createJsonClient({url: env.slackWebhookURL});
const dolarAPI = restify.createJsonClient({
    url: `https://economia.awesomeapi.com.br/json/${env.currency.from}-${env.currency.to}/1`
});

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

    dolarAPI.get('', (dolarErr, dolarReq, dolarRes, obj) => {
        let text = messageReplace(msg, {
            'user': user,
            'from': env.currency.from,
            'to': env.currency.to,
            'value': obj[0].bid
        });

        // send the message to slack
        res.send({text});
    });

    next();
});

// start server
server.listen(port, () => console.log(`${server.name} listening at ${server.url}`));

// check if cron is enabled
if (! env.cron.enabled) {
    return;
}

// Schedule (cron)
schedule.scheduleJob(env.cron.schedule, () => {
    let currentHours = new Date().getHours();
    let msg = currentHours < 12 ? env.msg.morning : env.msg.afternoon;

    dolarAPI.get('', (err, req, res, obj) => {
        let text = messageReplace(msg, {
            'from': env.currency.from,
            'to': env.currency.to,
            'value': obj[0].bid
        });

        slackHook.post('', {text}, (err, req, res, obj) => {
            console.log(`Message sent. Status code -> ${res.statusCode}`);
        });
    });
});
