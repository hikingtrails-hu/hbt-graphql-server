import { loadData } from '../../../../src/server/load/load-data'
import { WorkerMessage } from '../../../../src/server/worker/worker/worker'
import { MessageType } from '../../../../src/server/worker/setup/worker-setup'
import { replaceLoggerWithSpies } from '../test-helpers'

const matchesUuid = () => expect.stringMatching(
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
)

describe('DataLoadRequestHandler', () => {
    replaceLoggerWithSpies()
    it('dispatches the correct jobs', async () => {
        const sent: MessageType[] = []
        const handler = loadData(async (message: WorkerMessage) => {
            sent.push(message as MessageType)
        })
        await handler()
        expect(sent).toEqual([
            { type: 'LoadHikingTrailRequest', data: { key: 'okt', loadId: matchesUuid() } },
            { type: 'LoadHikingTrailRequest', data: { key: 'ddk', loadId: matchesUuid() } },
            { type: 'LoadHikingTrailRequest', data: { key: 'ak', loadId: matchesUuid() } }
        ])
    })
})
