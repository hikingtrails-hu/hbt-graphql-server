import { getenv } from './getenv'

export const pubsubConfig = () => ({
    topicName: getenv('PUBSUB_TOPIC'),
    subscriptionName: 'default-subscription'
})
