# Bill McCash Slack Bot :moneybag:

Bill is a bot that reports you the current money exchange rate via [Slack](https://slack.com/). Now supports cryptocurrencies :smiley:.

## Dependencies

- Node
- Yarn

**Slack Integrations**
- [Incoming WebHooks](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks)
- [Outgoing WebHooks](https://slack.com/apps/A0F7VRG6Q-outgoing-webhooks)

## Installation

```sh
# install dependencies
yarn install

# build
yarn build
# or
npm run build
```

## Configuration

All of the environment variables are stored in the `src/env-example.js` file. Rename this file to `src/env.js`.

### Cron-style Scheduling

If you wish to schedule automated posts, then you can use the integrated cron scheduler. Add the configuration to the `env.js` file. The cron format consists of:
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

Run build and start `dist/index.js` file

```sh
# start server
npm start
```

**Enjoy** :smiley:

## Collaborate!

Do you have a question? Found an issue? [Tell us](https://github.com/firework/Bill-McCash-Slack-Bot/issues)!
