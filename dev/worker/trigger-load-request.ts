import { sendPubSubMessage } from '../../src/server/worker/pubsub/pubsub'
import { config } from '../../src/server/config/config'
import { MessageType } from '../../src/server/worker/setup/worker-setup'

const sender = sendPubSubMessage(config.pubsubConfig().topicName)

void sender<MessageType>({ type: 'DataLoadRequest', data: {} })
