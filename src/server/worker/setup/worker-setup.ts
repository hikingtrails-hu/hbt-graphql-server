import { Jobs, WorkerMessage } from '../worker/worker'
import { HikingTrailKey } from '../../../hbt/hiking-trails'
import { DependencyInjection } from '../../di/dependency-injection'

export type DataLoadRequestMessage = WorkerMessage<
'DataLoadRequest',
Record<string, never>
>

export type LoadHikingTrailRequestData = {
    key: HikingTrailKey
    loadId: string
}

export type LoadHikingTrailRequestMessage = WorkerMessage<
'LoadHikingTrailRequest',
LoadHikingTrailRequestData
>

export type PlaceStampingLocationsRequestMessage = WorkerMessage<
'PlaceStampingLocationsRequest',
LoadHikingTrailRequestData
>

export type MessageType = DataLoadRequestMessage
| LoadHikingTrailRequestMessage
| PlaceStampingLocationsRequestMessage

export const jobs = (di: DependencyInjection): Jobs<MessageType> => ({
    DataLoadRequest: di.loadData(),
    LoadHikingTrailRequest: di.loadHikingTrail(),
    PlaceStampingLocationsRequest: di.placeStampingLocations()
})
