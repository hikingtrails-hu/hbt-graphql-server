import { distanceInMeters } from '../../../src/hbt/map/distance'

describe('Get distance in meters', () => {
    it('calculates distance between Debrecen and Budapest', () => {
        const distance = distanceInMeters(
            { lat: 47.49801, lon: 19.03991, elevation: 0 },
            { lat: 47.53333, lon: 21.63333, elevation: 0 }
        )
        expect(distance).toBeCloseTo(195_369.752, 3)
    })
})
