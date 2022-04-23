import { WorkerMessage } from '../worker/worker/worker'
import { HikingTrailKey, hikingTrailsSetup } from '../../hbt/hiking-trails'
import { Path, StampingLocation } from '../../hbt/types'

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
    },
    hikingTrailLoaded: (key: HikingTrailKey, stampingLocations: StampingLocation[], path: Path) => {
        const trail = hikingTrailsSetup[key]
        log(`${trail.symbol} ${stampingLocations.length} stamps` +
            ` and ${path.points.length} path nodes loaded for ${key}`
        )
        log(`${trail.symbol} Memory usage: ${Math.round(process.memoryUsage().heapUsed /
            1024 / 1024)} MB`
        )
    },
    httpRequestOk: (url: string) => {
        log(`HTTP request successful: ${url}`)
    }
}
