import { getPreciseDistance } from 'geolib'
import { Path, Point } from '../types'
import { strict as assert } from 'assert'

export const distanceInMeters = (coord1: Point, coord2: Point): number =>
    getPreciseDistance(
        { longitude: coord1.lon, latitude: coord1.lat },
        { longitude: coord2.lon, latitude: coord2.lat },
        0.001
    )

export type DistanceInMetersOnPath = typeof distanceInMetersOnPath

export const distanceInMetersOnPath = (
    path: Path,
    idx1: number,
    idx2: number
): number => {
    assert(idx1 >= 0)
    assert(idx2 >= 0)
    assert(idx1 < path.points.length)
    assert(idx2 < path.points.length)
    const startIdx = Math.min(idx1, idx2)
    const endIdx = Math.max(idx1, idx2)
    let result = 0
    for (let i = startIdx; i < endIdx; ++i) {
        assert(i < path.points.length)
        assert(i >= 0)
        result += distanceInMeters(path.points[i] as Point, path.points[i + 1] as Point)
    }
    return result
}
