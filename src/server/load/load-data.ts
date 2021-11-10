import { logger } from '../logging/logger'
import { Sender } from '../worker/worker/worker'
import { LoadHikingTrailRequestMessage } from '../worker/setup/worker-setup'
import { hikingTrailKeys } from '../../hbt/hiking-trails'

export class DataLoadRequestHandler {
    constructor(
        private readonly sender: Sender
    ) {
    }

    public async run(): Promise<void> {
        logger.dataLoadRequested()
        for (const key of hikingTrailKeys()) {
            await this.sender.send<LoadHikingTrailRequestMessage>({
                type: 'LoadHikingTrailRequest',
                data: { key: key }
            })
        }
    }
}

export const loadData = (sender: Sender): () => Promise<void> => {
    const handler = new DataLoadRequestHandler(sender)
    return handler.run.bind(handler)
}
