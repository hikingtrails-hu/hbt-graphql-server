import { distanceInMeters, placeStampingLocationsOnPath } from '../../../src/hbt/map/map'
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

describe('Place stamping locations on path', () => {
    it('return stamping locations with point on path', () => {
        const path: Path = {
            points: [
                { lat: 0, lon: 0, elevation: 0 },
                { lat: 1, lon: 0, elevation: 0 },
                { lat: 2, lon: 0, elevation: 0 },
                { lat: 3, lon: 0, elevation: 0 }
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
                position: { lat: 2.1, lon: 0, elevation: 0 }
            }
        ]
        const result = placeStampingLocationsOnPath(stampingLocations, path)
        expect(result).toStrictEqual([
            {
                name: 'test1',
                description: '',
                position: { lat: 0, lon: 1, elevation: 0 },
                pointIdx: 0
            },
            {
                name: 'test2',
                description: '',
                position: { lat: 2.1, lon: 0, elevation: 0 },
                pointIdx: 2
            }
        ])
    })
})
