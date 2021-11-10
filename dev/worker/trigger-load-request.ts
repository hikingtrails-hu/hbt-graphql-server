import { PubSubSender } from '../../src/server/worker/pubsub/pubsub'
import { pubsubConfig } from '../../src/server/config/config'
import { MessageType } from '../../src/server/worker/setup/worker-setup'

const sender = new PubSubSender(pubsubConfig().topicName)

void sender.send<MessageType>({ type: 'DataLoadRequest', data: {} })
