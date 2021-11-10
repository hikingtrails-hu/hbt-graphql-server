import { WorkerMessage } from '../worker/worker/worker'
import { HikingTrailKey, hikingTrailsSetup } from '../../hbt/hiking-trails'

const log = (...args: unknown[]): void => {
    console.info(...args)
}

export const logger = {
    dataLoadRequested: () => log('🌳 Data load requested'),
    workerMessagePublished: (id: string, message: WorkerMessage) => log(
        `🔥 Message with id #${id} published`, message
    ),
    hikingTrailLoadRequested: (key: HikingTrailKey) => {
        const trail = hikingTrailsSetup[key]
        log(`${trail.symbol} data load for '${key}' requested`)
    }
}
