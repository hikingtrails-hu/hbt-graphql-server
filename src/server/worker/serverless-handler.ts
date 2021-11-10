import { Worker } from './worker/worker'
import { PubSubSender, PubSubServerlessHandler } from './pubsub/pubsub'
import { jobs, MessageType } from './setup/worker-setup'
import { pubsubConfig } from '../config/config'
import { Context } from '@google-cloud/functions-framework'

export const handler = async (message: { data?: string }, context: Context): Promise<void> => {
    const worker = new PubSubServerlessHandler(
        new Worker<MessageType>(jobs(new PubSubSender(pubsubConfig().topicName)))
    )
    await worker.handle(message, context)
}
