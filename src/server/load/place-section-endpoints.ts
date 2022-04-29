import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { Storage } from '../store/storage'
import { SendMessage } from '../worker/worker/worker'
import { MeasuredStampingLocation, Point } from '../../hbt/types'
import { GroupSectionEndpoints } from '../../hbt/map/sections'

export const placeSecionEndpoints = (
    store: Storage,
    sendMessage: SendMessage,
    groupSectionEndpoints: GroupSectionEndpoints
) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key, loadId } = data
        const trailSetup = hikingTrailsSetup[key]
        const {
            pathNodes,
            stamps
        } = await store.get<{
            pathNodes: Point[]
            stamps: MeasuredStampingLocation[]
        }>(`${loadId}/${key}/placeStampingLocations.json`)
        const sectionEndpoints = groupSectionEndpoints(stamps)
        await store.set(data.key + '/current.json', {
            name: trailSetup.name,
            key,
            path: {
                points: pathNodes
            },
            sectionEndpoints
        })

        await store.set(`${loadId}/${key}/finished`, {})
    }
