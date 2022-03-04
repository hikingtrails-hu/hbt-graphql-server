import { ApolloServer } from 'apollo-server-cloud-functions'
import { createDI } from '../di/dependency-injection'
import { config } from '../config/config'
import { typeDefs } from './typedefs'

const di = createDI(config)

const server = new ApolloServer({
    typeDefs,
    resolvers: di.graphqlResolvers(),
    introspection: true
})

export const handler = server.createHandler()
