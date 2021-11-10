import {
    InvalidMessage,
    Jobs,
    Worker,
    WorkerMessage
} from '../../../src/server/worker/worker/worker'
import { PubSubServerlessHandler } from '../../../src/server/worker/pubsub/pubsub'

type TestMessage = WorkerMessage<'Test', Record<string, never>>

describe('handler', () => {
    const test = { called: false }
    const jobs: Jobs<TestMessage> = {
        Test: async () => {
            test.called = true
        }
    }
    const worker = new PubSubServerlessHandler(new Worker<TestMessage>(jobs))

    const createMessageData = <M extends WorkerMessage>(message: M) => ({
        data: Buffer.from(JSON.stringify(message)).toString('base64')
    })

    it('executes job requests', async () => {
        await worker.handle(createMessageData<TestMessage>({ type: 'Test', data: {} }), {})
        expect(test.called).toBe(true)
    })

    it('throws error on invalid request', async () => {
        try {
            await worker.handle(createMessageData({ type: 'Invalid', data: {} }), {})
            throw new Error('Exception not thrown')
        } catch (err) {
            expect(err).toBeInstanceOf(InvalidMessage)
        }
    })
})
