import { Bot, BotEvents } from 'mineflayer';

interface QueueSpeed {
  startTime: Date | null
  endTime: Date | null
  currentPosition: number | null
  lastPosition: number | null
  positionHistory: Array<{time: Date, position: number, currentQueueLength: number}>
  outFolder: string
  sawQueuePosition: boolean
}

declare module 'mineflayer-2b2t-queue-speed' {
  export default function queueSpeed(bot: Bot): void;
}

declare module 'mineflayer' {
  interface Bot {
    queueSpeed: QueueSpeed
  }

  interface BotEvents {
    'queueSpeed:position': (position: number) => void
    'queueSpeed:queueEnd': () => void
  }
}