const mf = require('mineflayer')

const { queueSpeed } = require('../../index')

const bot = mf.createBot({
  username: process.env.MINECRAFT_USERNAME,
  version: '1.12.2',
  host: '2b2t.org',
  auth: 'microsoft',
  profilesFolder: './nmp-cache'
})

bot.loadPlugin(queueSpeed)
bot.on('login', () => {
  console.info('Login as ' + bot.username)
})
bot.on('kicked', (reason) => {
  console.info('Kicked: ' + reason)
})
bot.on('error', console.error)
bot.on('queueSpeed:position', (pos) => {
  console.info(`Position in queue: ${pos}`)
})
