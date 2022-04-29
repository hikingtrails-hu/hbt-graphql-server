import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
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
    
    type SectionEndpoint {
        name: String
        stampingLocations: [StampingLocation]
    }
    
    type Hike {
        name: String
        key: String
        path: Path
        sectionEndpoints: [SectionEndpoint]
    }

    type Query {
        hikes: [Hike]
        hike(key: String): Hike
    }
`
