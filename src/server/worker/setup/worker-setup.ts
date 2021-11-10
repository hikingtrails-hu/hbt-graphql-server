import { Jobs, Sender, WorkerMessage } from '../worker/worker'
import { loadData } from '../../load/load-data'
import { HikingTrailKey } from '../../../hbt/hiking-trails'
import { loadHikingTrail } from '../../load/load-hiking-trail'

export interface LoadHikingTrailRequestData { key: HikingTrailKey }

export type DataLoadRequestMessage = WorkerMessage<'DataLoadRequest', Record<string, never>>
export type LoadHikingTrailRequestMessage = WorkerMessage<
'LoadHikingTrailRequest',
{ key: HikingTrailKey }
>

export type MessageType = DataLoadRequestMessage | LoadHikingTrailRequestMessage

export const jobs = (sender: Sender): Jobs<MessageType> => ({
    DataLoadRequest: async () => await loadData(sender)(),
    LoadHikingTrailRequest: async (data: LoadHikingTrailRequestData) => await loadHikingTrail(data)
})
