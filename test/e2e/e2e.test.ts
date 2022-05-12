import { createDI } from '../../src/server/di/dependency-injection'
import { config } from '../../src/server/config/config'
import { createTopic, handlePubSubMessage } from '../../src/server/worker/pubsub/pubsub'
import { Message } from '@google-cloud/pubsub'
import { setImmediate } from 'timers/promises'
import { Context } from '@google-cloud/functions-framework'
import { handleMessage } from '../../src/server/worker/worker/worker'
import { jobs, MessageType } from '../../src/server/worker/setup/worker-setup'
import express from 'express'
import { handler as graphQlHandler } from '../../src/server/graphql/serverless-handler'
import { replaceLoggerWithSpies } from '../unit/server/test-helpers'
import findFreePorts from 'find-free-ports'
import axios from 'axios'
import { fileContentAbsolute } from '../../src/server/files/files'
import { resolve } from 'path'

jest.setTimeout(20000)

const graphqlRequest = async (url: string, queryFile: string): ReturnType<typeof axios.post> => {
    return await axios.post(
        url,
        JSON.stringify({
            query: await fileContentAbsolute(resolve(__dirname, queryFile))
        }), {
            headers: {
                accept: '*/*',
                'content-type': 'application/json',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site'
            }
        }
    )
}

describe(('End to end test'), () => {
    it('load data and get graphql response', async () => {
        replaceLoggerWithSpies()
        const testConfig: typeof config = {
            ...config,
            httpConfig: () => ({
                useFake: true
            }),
            filterMapDataConfig: () => ({
                keepEveryNthStamp: 5,
                keepEveryNthPathNode: 500
            })
        }
        const di = createDI(testConfig)

        const topic = createTopic(config.pubsubConfig().topicName)
        const [topicExists] = await topic.exists()
        if (!topicExists) {
            await topic.create()
        }
        const subscription = topic.subscription(testConfig.pubsubConfig().subscriptionName, {
            ackDeadline: 540
        })
        const [subscriptionExists] = await subscription.exists()
        if (!subscriptionExists) {
            await subscription.create({ ackDeadlineSeconds: 540 })
        }
        const handler = async (message: { data?: string }, context: Context): Promise<void> => {
            await handlePubSubMessage(
                handleMessage<MessageType>(jobs(di))
            )(message, context)
        }
        subscription.on('message', (message: Message) => {
            void (async () => {
                await handler({ data: message.data.toString('base64') }, {})
                message.ack()
            })()
        })

        di.eventEmitter().on('finished', () => {
            finished = true
        })

        let finished = false

        const send = di.sendMessage()
        await send({ type: 'DataLoadRequest', data: {} })
        while (true) {
            await setImmediate()
            if (finished) {
                break
            }
        }

        const app = express()
        app.use(graphQlHandler)
        const [port] = await findFreePorts()
        const srv = await app.listen(port)
        process.on('uncaughtException', () => {
            srv.close()
        })

        // eslint-disable-next-line
        const data1 = await graphqlRequest(`http://localhost:${port}/`, 'introspection.gql') as any
        expect(data1.data.data.__schema.types).toContainEqual(
            expect.objectContaining({ name: 'HikingTrail' })
        )

        // eslint-disable-next-line
        const data2 = await graphqlRequest(`http://localhost:${port}/`, 'hikes.gql') as any
        expect(data2.data.data.hikingTrails).toContainEqual(
            expect.objectContaining({ name: 'Országos Kéktúra' })
        )

        await subscription.close()
        await srv.close()
    })
})
