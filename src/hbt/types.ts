export interface Point {
    lat: number
    lon: number
    elevation: number
}

export interface Path {
    points: Point[]
}

export interface HikingTrail {
    name: string
    path: Path
    sectionEndpoints: SectionEndpoint[]
}

// export interface Checkpoint {
//     name: string
//     sectionEndpoints: SectionEndpoint[]
// }

// export interface Section {
//     path: Path
//     from: Checkpoint
//     to: Checkpoint
// }

export interface StampingLocation {
    name: string
    description: string
    position: Point
}

export interface OrderedStampingLocation extends StampingLocation {
    pointIdx: number
}

export interface MeasuredStampingLocation extends OrderedStampingLocation {
    distanceInMetersFromNextStampingLocation: number | null
}

export interface SectionEndpoint {
    name: string
    stampingLocations: MeasuredStampingLocation[]
}
