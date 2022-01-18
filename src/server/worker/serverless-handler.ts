import { handleMessage } from './worker/worker'
import { handlePubSubMessage } from './pubsub/pubsub'
import { jobs, MessageType } from './setup/worker-setup'
import { Context } from '@google-cloud/functions-framework'
import { createDI } from '../di/dependency-injection'
import { config } from '../config/config'

export const handler = async (message: { data?: string }, context: Context): Promise<void> => {
    await handlePubSubMessage(
        handleMessage<MessageType>(jobs(createDI(config)))
    )(message, context)
}
