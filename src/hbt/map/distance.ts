import { getPreciseDistance } from 'geolib'
import { DistanceInMeters } from '@hikingtrails-hu/hikingtrails-lib'

export const distanceInMeters: DistanceInMeters = (point1, point2) =>
    getPreciseDistance(
        { longitude: point1.lon, latitude: point1.lat },
        { longitude: point2.lon, latitude: point2.lat },
        0.001
    )
