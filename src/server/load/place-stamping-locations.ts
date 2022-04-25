import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { logger } from '../logging/logger'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { Storage } from '../store/storage'
import { placeStampingLocationsOnPath } from '../../hbt/map/map'
import { SendMessage } from '../worker/worker/worker'
import { Point, StampingLocation } from '../../hbt/types'

export const placeStampingLocations = (
    httpGet: HttpGet,
    store: Storage,
    sendMessage: SendMessage
) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key, loadId } = data
        const trailSetup = hikingTrailsSetup[key]
        const {
            pathNodes,
            stampingLocations
        } = await store.get<{
            pathNodes: Point[]
            stampingLocations: StampingLocation[]
        }>(`${loadId}/${key}/loadHikingTrail.json`)
        const stamps = placeStampingLocationsOnPath(stampingLocations, {
            points: pathNodes
        })
        logger.hikingTrailLoaded(key, stampingLocations, {
            points: pathNodes
        })
        await store.set(data.key + '/current.json', {
            name: trailSetup.name,
            key,
            path: {
                points: pathNodes
            },
            stampingLocations: stamps
        })
        console.dir(stamps)
        await store.set(`${loadId}/${key}/finished`, {})
    }
