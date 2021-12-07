import { handler } from '../../src/server/worker/serverless-handler'
import { Message } from '@google-cloud/pubsub'
import { createTopic } from '../../src/server/worker/pubsub/pubsub'
import { config } from '../../src/server/config/config'

const main = async () => {
    const topic = createTopic(config.pubsubConfig().topicName)
    const [topicExists] = await topic.exists()
    if (!topicExists) {
        const [created] = await topic.create()
        console.info(`✨ Topic created: ${created?.metadata?.name}`)
    }
    const subscription = topic.subscription('test-subscription')
    const [subscriptionExists] = await subscription.exists()
    if (!subscriptionExists) {
        const [created] = await subscription.create()
        console.info(`✨ Subscription created: ${created?.metadata?.name}`)
    }
    subscription.on('message', (message: Message) => {
        void (async () => {
            await handler({ data: message.data.toString('base64') }, {})
            message.ack()
        })()
    })
    console.info('🌈 Development worker started')
}

void main()
