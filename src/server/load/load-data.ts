import { logger } from '../logging/logger'
import { SendMessage } from '../worker/worker/worker'
import { LoadHikingTrailRequestMessage } from '../worker/setup/worker-setup'
import { hikingTrailKeys } from '../../hbt/hiking-trails'

export const loadData = (sendMessage: SendMessage) =>
    async (): Promise<void> => {
        logger.dataLoadRequested()
        for (const key of hikingTrailKeys()) {
            await sendMessage<LoadHikingTrailRequestMessage>({
                type: 'LoadHikingTrailRequest',
                data: { key: key }
            })
        }
    }
