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

    type Stamp {
        name: String!
        description: String!
        position: Point!
        pointIdx: Int!
        distanceFromNext: Float
    }

    type HikingTrail {
        name: String!
        key: String!
        path: Path!
        stamps: [Stamp!]!
    }

    type Query {
        hikingTrails: [HikingTrail!]!
        hikingTrail(key: String!): HikingTrail!
    }
`
