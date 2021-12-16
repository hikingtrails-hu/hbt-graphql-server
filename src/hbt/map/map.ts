import { getPreciseDistance } from 'geolib'
import { Point } from '../types'

export const distanceInMeters = (coord1: Point, coord2: Point): number =>
    getPreciseDistance(
        { longitude: coord1.lon, latitude: coord1.lat },
        { longitude: coord2.lon, latitude: coord2.lat },
        0.001
    )
