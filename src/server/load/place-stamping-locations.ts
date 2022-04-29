import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { Storage } from '../store/storage'
import { SendMessage } from '../worker/worker/worker'
import { Point, StampingLocation } from '../../hbt/types'
import { MeasureStampingLocationDistances, orderStampingLocations } from '../../hbt/map/path'

export const placeStampingLocations = (
    httpGet: HttpGet,
    store: Storage,
    sendMessage: SendMessage,
    measureStampingLocationDistances: MeasureStampingLocationDistances
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
        const stamps = measureStampingLocationDistances(
            orderStampingLocations(stampingLocations, {
                points: pathNodes
            }), {
                points: pathNodes
            }
        )
        await store.set(data.key + '/current.json', {
            name: trailSetup.name,
            key,
            path: {
                points: pathNodes
            },
            stampingLocations: stamps
        })
        await store.set(`${loadId}/${key}/placeStampingLocations.json`, {
            pathNodes,
            stamps
        })
        await sendMessage({
            type: 'PlaceSecionEndpointsRequestMessage',
            data
        })
    }
