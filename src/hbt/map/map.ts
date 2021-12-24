import { getPreciseDistance } from 'geolib'
import { Path, Point, StampingLocation, StampingLocationOnPath } from '../types'

export const distanceInMeters = (coord1: Point, coord2: Point): number =>
    getPreciseDistance(
        { longitude: coord1.lon, latitude: coord1.lat },
        { longitude: coord2.lon, latitude: coord2.lat },
        0.001
    )

export const placeStampingLocationsOnPath = (
    stampingLocations: StampingLocation[],
    path: Path
): StampingLocationOnPath[] => {
    return stampingLocations.map(stampingLocation => {
        let minDistance = Infinity
        let nearestIdx = -1
        path.points.forEach((point, idx) => {
            const distance = distanceInMeters(point, stampingLocation.position)
            if (distance < minDistance) {
                minDistance = distance
                nearestIdx = idx
            }
        })
        return {
            ...stampingLocation,
            pointIdx: nearestIdx
        }
    })
}
