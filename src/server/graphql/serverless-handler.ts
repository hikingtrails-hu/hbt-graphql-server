import { ApolloServer, gql } from 'apollo-server-cloud-functions'
import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { cloudStorageConfig } from '../config/cloud-storage'
import { hikingTrailKeys } from '../../hbt/hiking-trails'
import { Store } from '../store/store'

const typeDefs = gql`
    type Hike {
        name: String
    }
  
    type Query {
        hikes: [Hike]
    }
`

const resolvers = {
    Query: {
        hikes: async () => {
            const hikes: Array<{ name: string }> = []
            for (const key of hikingTrailKeys()) {
                const data = await store.get<Array<{ name: string }>>(
                    key + '/current.json',
                    () => []
                )
                data.forEach(d => hikes.push(d))
            }
            return hikes
        }
    }
}

const store = new Store(
    new CloudStorageStore(
        cloudStorageConfig().cloudApiEndpoint,
        cloudStorageConfig().cloudProjectId,
        cloudStorageConfig().bucketName
    )
)

export const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
})

export const handler = server.createHandler()
