import { Jobs, WorkerMessage } from '../worker/worker'
import { HikingTrailKey } from '../../../hbt/hiking-trails'
import { DependencyInjection } from '../../di/dependency-injection'

export interface LoadHikingTrailRequestData { key: HikingTrailKey }

export type DataLoadRequestMessage = WorkerMessage<'DataLoadRequest', Record<string, never>>
export type LoadHikingTrailRequestMessage = WorkerMessage<
'LoadHikingTrailRequest',
{ key: HikingTrailKey }
>

export type MessageType = DataLoadRequestMessage | LoadHikingTrailRequestMessage

export const jobs = (di: DependencyInjection): Jobs<MessageType> => ({
    DataLoadRequest: di.loadData(),
    LoadHikingTrailRequest: di.loadHikingTrail()
})
