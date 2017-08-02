import schedule from 'node-schedule'
import env from '../env'
import fetchAndPostMessage from './bill'

function cronJob () {
    let currentHours = new Date().getHours()

    let msg = currentHours < 18
        ? (currentHours < 12 ? env.msg.morning : env.msg.afternoon)
        : env.msg.evening

    fetchAndPostMessage(msg)
}

export default function startCronJob () {
    schedule.scheduleJob(env.cron.schedule, cronJob)
}
