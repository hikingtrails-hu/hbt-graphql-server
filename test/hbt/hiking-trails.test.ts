import { hikingTrailKeys } from '../../src/hbt/hiking-trails'

describe('DataLoadRequestHandler', () => {
    it('dispatches the correct jobs', () => {
        const keys = hikingTrailKeys()
        expect(keys).toEqual(['okt', 'ddk', 'ak'])
    })
})
