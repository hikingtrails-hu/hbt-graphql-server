import { Jobs, WorkerMessage } from '../worker/worker'
import { HikingTrailKey } from '../../../hbt/hiking-trails'
import { DependencyInjection } from '../../di/dependency-injection'

export type DataLoadRequestMessage = WorkerMessage<
'DataLoadRequest',
Record<string, never>
>

export type RequestData = {
    loadId: string
}

export type LoadHikingTrailRequestData = RequestData & {
    key: HikingTrailKey
}

export type LoadHikingTrailRequestMessage = WorkerMessage<
'LoadHikingTrailRequest',
LoadHikingTrailRequestData
>

export type PlaceStampingLocationsRequestMessage = WorkerMessage<
'PlaceStampingLocationsRequest',
LoadHikingTrailRequestData
>

export type CheckStateRequestMessage = WorkerMessage<
'CheckStateRequest',
RequestData
>

export type MessageType = DataLoadRequestMessage
| LoadHikingTrailRequestMessage
| PlaceStampingLocationsRequestMessage
| CheckStateRequestMessage

export const jobs = (di: DependencyInjection): Jobs<MessageType> => ({
    DataLoadRequest: di.loadData(),
    LoadHikingTrailRequest: di.loadHikingTrail(),
    PlaceStampingLocationsRequest: di.placeStampingLocations(),
    CheckStateRequest: di.checkState()
})
