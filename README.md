# Bill McCash Slack Bot :moneybag:

Bill is a bot that reports you the current money exchange rate via [Slack](https://slack.com/).

## Dependencies

- Node v6.x.x

**Slack Integrations**
- [Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)
- [Outgoing WebHooks](https://slack.com/apps/A0F7VRG6Q-outgoing-webhooks)

## Installation

```sh
# install node_modules
npm install
```

## Configuration

All of the environment variables are stored in the `env-example.json` file. Rename this file to `env.json`

### Cron-style Scheduling

The cron format consists of:
```
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
```

## Initializing

```sh
# start server -> node bill.js
npm start
```

**Enjoy** :smiley:

## Collaborate!

Do you have a question? Found an issue? [Tell us](https://github.com/firework/Bill-McCash-Slack-Bot/issues)!
