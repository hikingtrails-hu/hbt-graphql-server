import { distanceInMeters, distanceInMetersOnPath } from '../../../src/hbt/map/distance'
import {
    StampingLocation,
    Path
} from '../../../src/hbt/types'
import { measureStampingLocationDistances, orderStampingLocations } from '../../../src/hbt/map/path'
import { groupSectionEndpoints } from '../../../src/hbt/map/sections'

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
        const result = orderStampingLocations(stampingLocations, path)
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

describe('Measure stamping location distances on path', () => {
    it('measures distances', () => {
        const measure = measureStampingLocationDistances(
            (path, idx1, idx2) => Math.abs(idx1 - idx2)
        )
        const stamps = [
            {
                name: 'test1',
                description: '',
                position: { lat: 0, lon: 0, elevation: 0 },
                pointIdx: 1
            },
            {
                name: 'test2',
                description: '',
                position: { lat: 0, lon: 0, elevation: 0 },
                pointIdx: 3
            },
            {
                name: 'test3',
                description: '',
                position: { lat: 0, lon: 0, elevation: 0 },
                pointIdx: 10
            }
        ]
        const result = measure(stamps, { points: [] })
        expect(result).toStrictEqual([
            { ...stamps[0], distanceInMetersFromNextStampingLocation: 2 },
            { ...stamps[1], distanceInMetersFromNextStampingLocation: 7 },
            { ...stamps[2], distanceInMetersFromNextStampingLocation: null }
        ])
    })
})

describe('Calculate section endpoints', () => {
    it('group endpoints by name', () => {
        const stamps = [
            {
                name: 'test1',
                description: '',
                position: { lat: 1, lon: 0, elevation: 0 },
                pointIdx: 1,
                distanceInMetersFromNextStampingLocation: 10
            },
            {
                name: 'test1',
                description: '',
                position: { lat: 1, lon: 0.1, elevation: 0 },
                pointIdx: 3,
                distanceInMetersFromNextStampingLocation: 12
            },
            {
                name: 'test1',
                description: '',
                position: { lat: 1.5, lon: 0.1, elevation: 0 },
                pointIdx: 4,
                distanceInMetersFromNextStampingLocation: 20
            },
            {
                name: 'test2',
                description: '',
                position: { lat: 1.5, lon: 0.1, elevation: 0 },
                pointIdx: 30,
                distanceInMetersFromNextStampingLocation: 200
            },
            {
                name: 'test3',
                description: '',
                position: { lat: 2, lon: 0.5, elevation: 0 },
                pointIdx: 50,
                distanceInMetersFromNextStampingLocation: 1
            },
            {
                name: 'test3',
                description: '',
                position: { lat: 2.1, lon: 0.5, elevation: 0 },
                pointIdx: 55,
                distanceInMetersFromNextStampingLocation: null
            }
        ]
        const result = groupSectionEndpoints(1000)(stamps)
        expect(result).toStrictEqual([
            {
                name: 'test1',
                stampingLocations: stamps.slice(0, 3)
            },
            {
                name: 'test2',
                stampingLocations: stamps.slice(3, 4)
            },
            {
                name: 'test3',
                stampingLocations: stamps.slice(4)
            }
        ])
    })
    it('group endpoints by distance', () => {
        const stamps = [
            {
                name: 'test1',
                description: '',
                position: { lat: 1, lon: 0, elevation: 0 },
                pointIdx: 1,
                distanceInMetersFromNextStampingLocation: 10
            },
            {
                name: 'test1',
                description: '',
                position: { lat: 1, lon: 0.1, elevation: 0 },
                pointIdx: 3,
                distanceInMetersFromNextStampingLocation: 0
            }
        ]
        const result = groupSectionEndpoints(5)(stamps)
        expect(result).toStrictEqual([
            {
                name: 'test1',
                stampingLocations: stamps.slice(0, 1)
            },
            {
                name: 'test1',
                stampingLocations: stamps.slice(1)
            }
        ])
    })
})
