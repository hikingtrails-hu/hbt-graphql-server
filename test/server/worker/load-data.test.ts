import { DataLoadRequestHandler } from '../../../src/server/load/load-data'
import { WorkerMessage } from '../../../src/server/worker/worker/worker'
import { MessageType } from '../../../src/server/worker/setup/worker-setup'
import { replaceLoggerWithSpies } from '../test-helpers'

describe('DataLoadRequestHandler', () => {
    replaceLoggerWithSpies()
    it('dispatches the correct jobs', async () => {
        const sent: MessageType[] = []
        const handler = new DataLoadRequestHandler({
            send: async (message: WorkerMessage) => {
                sent.push(message as MessageType)
            }
        })
        await handler.run()
        expect(sent).toEqual([
            { type: 'LoadHikingTrailRequest', data: { key: 'okt' } },
            { type: 'LoadHikingTrailRequest', data: { key: 'ddk' } },
            { type: 'LoadHikingTrailRequest', data: { key: 'ak' } }
        ])
    })
})
