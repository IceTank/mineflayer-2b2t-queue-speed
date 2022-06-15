const fs = require('fs')
const path = require('path')

/**
 * 
 * @param {import('mineflayer').Bot} bot 
 */
function inject(bot, options = {}) {
  bot.queueSpeed = {}
  bot.queueSpeed.startTime = null
  bot.queueSpeed.endTime = null
  bot.queueSpeed.currentPosition = null
  bot.queueSpeed.lastPosition = null
  bot.queueSpeed.positionHistory = []
  bot.queueSpeed.outFolder = './queue-speed'
  bot.queueSpeed.sawQueuePosition = false
  bot.once('login', () => {
    bot.queueSpeed.sawQueuePosition = false
    bot.once('login', () => {
      bot.emit('queueSpeed:queueEnd')
      summarize()
      bot.queueSpeed.endTime = new Date()
    })
  })
  bot.on('message', (chatMessage) => {
    const chatString = chatMessage.toString()
    const strings = chatString.split('\n')
    for (const string of strings) {
      if (string.replace(/\n/g, '').trim() === '') continue
      try {
        if (string.startsWith('Connecting to the server...')) {
          summarize()
          bot.emit('queueSpeed:queueEnd')
          bot.queueSpeed.endTime = new Date()
        } else if (string.startsWith('You can purchase priority queue')) {
          return
        } else if (string.startsWith('Position in queue')) {
          const pos = parseMessageToPosition(string)
          if (pos === null) return
          if (bot.queueSpeed.lastPosition) {
            if (bot.queueSpeed.lastPosition < pos) {
              // We are moving backwoods in the queue (? why hause why???)
              bot.queueSpeed.endTime = null
              bot.queueSpeed.startTime = new Date()
              console.info('[Queue speed] Position moved backwards, resetting start time')
              if (bot.queueSpeed.positionHistory.length > 0) {
                // summarize()
                bot.queueSpeed.positionHistory = []
              }
            } else if (bot.queueSpeed.lastPosition > pos) {
              // We are moving forwards in the queue
              bot.queueSpeed.positionHistory.push({
                time: new Date(),
                position: pos
              })
            }
          } else if (!bot.queueSpeed.sawQueuePosition) {
            bot.queueSpeed.sawQueuePosition = true
            bot.queueSpeed.startTime = new Date()
            console.info('[Queue speed] Detected queue. Starting to record queue speed')
          }
          if (bot.queueSpeed.currentPosition !== pos) {
            bot.queueSpeed.lastPosition = bot.queueSpeed.currentPosition
            bot.queueSpeed.currentPosition = pos
            bot.emit('queueSpeed:position', pos)
          }
        } 
      } catch (err) {
        
      }
    }
  })

  async function writeQueueHistoryToFile() {
    const now = Date.now()
    let str = ''
    for (const entry of bot.queueSpeed.positionHistory) {
      str += `${entry.time.getTime()},${entry.position}\n`
    }
    await fs.promises.mkdir(bot.queueSpeed.outFolder, { recursive: true })
    await fs.promises.writeFile(path.join(bot.queueSpeed.outFolder, `${now}.csv`), str, 'utf-8')
    return
  }

  function millisecondsToStringTime(mili) {
    const date = new Date(mili)
    return `${date.getDate() - 1}d ${date.getHours() - 1}h ${date.getMinutes()}min ${date.getSeconds()}sec`
  }

  function summarize() {
    writeQueueHistoryToFile().then(() => {
      const startingPosition = bot.queueSpeed.positionHistory[0]
      const queueStartTime = startingPosition.time
      const now = new Date()
      const timeDelta = now.getTime() - startingPosition.time.getTime()
      console.info(`[Qeueue speed Summary]
Started recording at: ${queueStartTime}
Starting position: ${startingPosition.position}
End time: ${now}
Total time: ${millisecondsToStringTime(timeDelta)}
Average positions per minute: ${startingPosition.position / (timeDelta / 1000 / 60)}
Average minutes per position: ${(timeDelta / 1000 / 60) / startingPosition.position}
      `)
    })
    .catch(console.error)
  }
}

function parseMessageToPosition(message) {
  if (!message.includes('Position in queue:')) {
    // console.warn('No position in message', message)
    return null
  }
  const match = message.match(/(\d+)/)
  if (!match) {
    console.warn('Could not find position in message', message)
    return null
  }
  const num = Number(match[0])
  if (isNaN(num)) {
    console.warn('Parsing match failed', match[0])
    return null
  }
  return num
}

module.exports = { queueSpeed: inject }