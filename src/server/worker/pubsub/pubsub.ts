import { PubSub, Topic } from '@google-cloud/pubsub'
import { Sender, Worker, WorkerMessage } from '../worker/worker'
import { Context } from '@google-cloud/functions-framework'
import { logger } from '../../logging/logger'

export const createTopic = (name: string): Topic => (new PubSub()).topic(name)

export class PubSubServerlessHandler<M extends WorkerMessage> {
    constructor(
        private readonly worker: Worker<M>
    ) {}

    public async handle(message: { data?: string }, context: Context): Promise<void> {
        const body = Buffer.from(message.data ?? '', 'base64').toString('utf-8')
        const data = JSON.parse(body)
        void await this.worker.handle(data)
    }
}

export class PubSubSender implements Sender {
    private readonly topic = createTopic(this.topicName)
    constructor(private readonly topicName: string) {}

    public send = async <M extends WorkerMessage>(message: M): Promise<void> => {
        const id = await this.topic.publish(Buffer.from(JSON.stringify(message)))
        logger.workerMessagePublished(id, message)
    }
}
