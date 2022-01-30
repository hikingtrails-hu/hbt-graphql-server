import { ApolloServer, gql } from 'apollo-server-cloud-functions'
import { hikingTrailKeys } from '../../hbt/hiking-trails'
import { createDI } from '../di/dependency-injection'
import { config } from '../config/config'

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
        name: String
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
        hike(key: String): Hike
    }
`

const resolvers = {
    Query: {
        hikes: async () => {
            const hikes: Array<{ name: string }> = []
            for (const key of hikingTrailKeys()) {
                const data = await store.get<{ name: string }>(
                    key + '/current.json'
                )
                hikes.push(data)
            }
            return hikes
        },
        hike: async (parent: never, args: {key: string}) => {
            const { key } = args
            return await store.get<{ name: string, key: string }>(key + '/current.json')
        }
    }
}

const di = createDI(config)

const store = di.storage()

export const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
})

export const handler = server.createHandler()
