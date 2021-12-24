export interface Point {
    lat: number
    lon: number
    elevation: number
}

export interface Path {
    points: Point[]
}

export interface HikingTrail {
    path: Path
}

export interface Checkpoint {
    name: string
    sectionEndpoints: SectionEndpoint[]
}

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

export interface StampingLocationOnPath extends StampingLocation {
    pointIdx: number
}

export interface SectionEndpoint {
    name: string
    stampingLocations: StampingLocation[]
}
