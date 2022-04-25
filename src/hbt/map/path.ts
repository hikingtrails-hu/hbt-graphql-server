import { MeasuredStampingLocation, OrderedStampingLocation, Path, StampingLocation } from '../types'
import { distanceInMeters, DistanceInMetersOnPath } from './distance'

export const orderStampingLocations = (
    stampingLocations: StampingLocation[],
    path: Path
): OrderedStampingLocation[] =>
    stampingLocations.map(stampingLocation => {
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
    }).sort(
        (stamp1, stamp2) => stamp1.pointIdx - stamp2.pointIdx
    )

export type MeasureStampingLocationDistances = ReturnType<typeof measureStampingLocationDistances>

export const measureStampingLocationDistances = (
    distanceInMetersOnPath: DistanceInMetersOnPath
) => (
    stampingLocations: OrderedStampingLocation[],
    path: Path
): MeasuredStampingLocation[] => {
    return stampingLocations.map((stampingLocation, idx) => ({
        ...stampingLocation,
        distanceInMetersFromNextStampingLocation: idx === stampingLocations.length - 1
            ? null
            : distanceInMetersOnPath(
                path,
                stampingLocation.pointIdx,
                (stampingLocations[idx + 1] as OrderedStampingLocation).pointIdx
            )
    }))
}
