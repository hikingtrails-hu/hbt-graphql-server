import { createTopic } from '../../src/server/worker/pubsub/pubsub'
import { config } from '../../src/server/config/config'
import { Message } from '@google-cloud/pubsub'

const main = async () => {
    const topic = createTopic(config.pubsubConfig().topicName)
    const subscription = topic.subscription('test-subscription')
    subscription.on('message', (message: Message) => {
        void (async () => {
            message.ack()
            const data = message.data.toString('utf-8')
            console.info(`1 message purged: ${data}`)
        })()
    })
}

void main()
