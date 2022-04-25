import {
    distanceInMeters,
    distanceInMetersOnPath,
    placeStampingLocationsOnPath
} from '../../../src/hbt/map/map'
import { StampingLocation, Path } from '../../../src/hbt/types'

describe('Get distance in meters', () => {
    it('calculates distance between Debrecen and Budapest', () => {
        const distance = distanceInMeters(
            { lat: 47.49801, lon: 19.03991, elevation: 0 },
            { lat: 47.53333, lon: 21.63333, elevation: 0 }
        )
        expect(distance).toBeCloseTo(195_369.752, 3)
    })
})

describe('Order stamping locations on path', () => {
    it('return stamping locations with point on path with correct order', () => {
        const path: Path = {
            points: [
                { lat: 0, lon: 0, elevation: 0 },
                { lat: 1, lon: 0, elevation: 0 },
                { lat: 2, lon: 0, elevation: 0 },
                { lat: 3, lon: 0, elevation: 0 },
                { lat: 4, lon: 0, elevation: 0 }
            ]
        }
        const stampingLocations: StampingLocation[] = [
            {
                name: 'test1',
                description: '',
                position: { lat: 0, lon: 1, elevation: 0 }
            },
            {
                name: 'test2',
                description: '',
                position: { lat: 3.1, lon: 0, elevation: 0 }
            },
            {
                name: 'test3',
                description: '',
                position: { lat: 1.1, lon: 0, elevation: 0 }
            }
        ]
        const result = placeStampingLocationsOnPath(stampingLocations, path)
        expect(result).toStrictEqual([
            { ...stampingLocations[0], pointIdx: 0 },
            { ...stampingLocations[2], pointIdx: 1 },
            { ...stampingLocations[1], pointIdx: 3 }
        ])
    })
})

describe('Distance on path', () => {
    const path: Path = {
        points: [
            { lat: 0, lon: 0, elevation: 0 },
            { lat: 1, lon: 0, elevation: 0 },
            { lat: 2, lon: 0, elevation: 0 },
            { lat: 3, lon: 0, elevation: 0 }
        ]
    }
    it('returns correct distance', () => {
        const result = distanceInMetersOnPath(path, 1, 3)
        expect(result).toBeCloseTo(221151.48, 2)
    })
    it('returns 0 for same start and end point', () => {
        const result = distanceInMetersOnPath(path, 0, 0)
        expect(result).toBeCloseTo(0, 2)
    })
    it('Throw error on invalid indexes', () => {
        expect(() => distanceInMetersOnPath(path, -1, 1)).toThrowError()
        expect(() => distanceInMetersOnPath(path, 1, -1)).toThrowError()
        expect(() => distanceInMetersOnPath(path, 5, 1)).toThrowError()
        expect(() => distanceInMetersOnPath(path, 1, 5)).toThrowError()
    })
})
