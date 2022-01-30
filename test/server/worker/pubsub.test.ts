import { createTopic, sendPubSubMessage } from '../../../src/server/worker/pubsub/pubsub'
import { v1 as uuid } from 'uuid'

describe('createTopic', () => {
    it('creates valid Pub/Sub topic object', () => {
        const topic = createTopic('testTopic')
        expect(topic.name).toMatch(/testTopic$/)
    })
})

describe('sendPubSubMessage', () => {
    it('sends the message to a topic', async () => {
        const topicName = `topic-${uuid()}`
        await expect(async () => {
            await sendPubSubMessage(topicName)({ type: 'test', data: {} })
        }).rejects.toThrow(/NOT_FOUND/)
    })
})
