import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { Storage } from '../store/storage'
import { SendMessage } from '../worker/worker/worker'
import {
    Point, Loading, orderAndMeasureStamps,
    DistanceInMeters
} from '@hikingtrails-hu/hikingtrails-lib'

export const placeStampingLocations = (
    httpGet: HttpGet,
    store: Storage,
    sendMessage: SendMessage,
    distanceInMeters: DistanceInMeters
) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key, loadId } = data
        const trailSetup = hikingTrailsSetup[key]
        const {
            pathNodes,
            rawStamps
        } = await store.get<{
            pathNodes: Point[]
            rawStamps: Loading.RawStampData[]
        }>(`${loadId}/${key}/loadHikingTrail.json`)
        const stampData = orderAndMeasureStamps(distanceInMeters)({
            path: { points: pathNodes },
            rawStampData: rawStamps
        })
        await store.set(data.key + '/current.json', {
            name: trailSetup.name,
            key,
            ...stampData
        })
        await store.set(`${loadId}/${key}/finished`, {})
    }
