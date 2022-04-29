import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
    type Point {
        lat: Float!
        lon: Float!
        elevation: Float!
    }

    type Path {
        points: [Point!]!
    }

    type StampingLocation {
        name: String!
        description: String!
        position: Point!
        pointIdx: Int!
        distanceInMetersFromNextStampingLocation: Float
    }

    type Hike {
        name: String!
        key: String!
        path: Path!
        stampingLocations: [StampingLocation!]!
    }

    type Query {
        hikes: [Hike!]!
        hike(key: String!): Hike!
    }
`
