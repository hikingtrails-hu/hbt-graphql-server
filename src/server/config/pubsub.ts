import { getenv } from './env'

export const pubsubConfig = () => ({
    topicName: getenv.strict('PUBSUB_TOPIC'),
    subscriptionName: 'default-subscription'
})
