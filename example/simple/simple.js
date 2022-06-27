const mf = require('mineflayer')

const queueSpeed = require('../../index')

const isMojang = !!process.env.MOJANG_PASSWORD

const bot = mf.createBot({
  username: process.env.MINECRAFT_USERNAME,
  password: isMojang ? process.env.MOJANG_PASSWORD : undefined,
  version: '1.12.2',
  host: '2b2t.org',
  auth: isMojang ? 'mojang' : 'microsoft',
  profilesFolder: './nmp-cache'
})

bot.loadPlugin(queueSpeed)
bot.once('login', () => {
  console.info('Login as ' + bot.username)
})
bot.on('kicked', (reason) => {
  console.info('Kicked: ' + reason)
})
bot.on('error', console.error)
bot.on('queueSpeed:position', (pos) => {
  console.info(`Position in queue: ${pos}`)
})
bot.on('queueSpeed:queueEnd', () => {
  setTimeout(() => {
    console.info('Exiting')
    bot.end()
  }, 10000)
})
