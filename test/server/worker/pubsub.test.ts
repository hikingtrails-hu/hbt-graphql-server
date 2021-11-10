import { createTopic } from '../../../src/server/worker/pubsub/pubsub'

describe('createTopic', () => {
    it('creates valid Pub/Sub topic object', () => {
        const topic = createTopic('testTopic')
        expect(topic.name).toMatch(/testTopic$/)
    })
})
