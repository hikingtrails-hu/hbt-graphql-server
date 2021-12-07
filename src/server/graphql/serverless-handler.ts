import { ApolloServer, gql } from 'apollo-server-cloud-functions'
import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { cloudStorageConfig } from '../config/cloud-storage'
import { hikingTrailKeys } from '../../hbt/hiking-trails'
import { getFromStore } from '../store/store'

const typeDefs = gql`
    type Point {
        lat: Float
        lon: Float
        elevation: Float
    }
    
    type Path {
        points: [Point]
    }
    
    type StampingLocation {
        description: String
        position: Point
    }
    
    type Hike {
        name: String
        key: String
        path: Path
        stampingLocations: [StampingLocation]
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
                const data = await store<Array<{ name: string }>>(
                    key + '/current.json',
                    () => []
                )
                data.forEach(d => hikes.push(d))
            }
            return hikes
        }
    }
}

const store = getFromStore(
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
