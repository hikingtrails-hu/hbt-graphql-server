import { PubSub, Topic } from '@google-cloud/pubsub'
import { SendMessage, WorkerMessage, HandleMessage } from '../worker/worker'
import { Context } from '@google-cloud/functions-framework'
import { logger } from '../../logging/logger'

export const createTopic = (name: string): Topic => (new PubSub()).topic(name)

export const handlePubSubMessage = <M extends WorkerMessage>(handleMessage: HandleMessage<M>) =>
    async (message: { data?: string }, context: Context): Promise<void> => {
        const body = Buffer.from(message.data ?? '', 'base64').toString('utf-8')
        const data = JSON.parse(body)
        void await handleMessage(data)
    }

export const sendPubSubMessage = (topicName: string): SendMessage => {
    const topic = createTopic(topicName)
    return async <M extends WorkerMessage>(message: M): Promise<void> => {
        const id = await topic.publish(Buffer.from(JSON.stringify(message)))
        logger.workerMessagePublished(id, message)
    }
}
