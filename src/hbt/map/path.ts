import { OrderedStampingLocation, Path, StampingLocation } from '../types'
import { distanceInMeters } from './distance'

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
