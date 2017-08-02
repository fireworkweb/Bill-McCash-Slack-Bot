import env from './env'
import startRestartJob from './services/restart'
import startCronJob from './services/cron'
import startServerJob from './services/server'

if (env.autoRestart.enabled) {
    startRestartJob(env.autoRestart.time)
}

if (env.cron.enabled) {
    startCronJob()
}

startServerJob()
