import { fileContent } from '../../../src/server/files/files'
import { parseXml } from '../../../src/server/xml/xml'
import { pointsFromGpx } from '../../../src/server/xml/gpx'
import { Point } from '../../../src/hbt/types'

describe('XML', () => {
    it('parses XML', async () => {
        const xml = await fileContent('test/server/xml/sample.xml')
        const result = await parseXml(xml)
        expect(result.gpx.$.xmlns).toBe('http://www.topografix.com/GPX/1/1')
        expect(result.gpx.wpt[10].name[0]).toBe('Badacsonytördemic')
    })

    it('throws exception on XML error', async () => {
        const xml = '<xml>Invalid XML'
        try {
            await parseXml(xml)
            fail('Exception not thrown')
        } catch (e) {
            expect(e).toBeDefined()
        }
    })
})

describe('GPX', () => {
    it('Parses GPX', async () => {
        const gpx = await fileContent('test/server/xml/sample.gpx')
        const result = await pointsFromGpx(gpx)
        expect(result.points.length).toEqual(409)
        const { elevation, lon, lat } = result.points[2] as Point
        expect(lat).toBeCloseTo(47.76365)
        expect(lon).toBeCloseTo(18.912189)
        expect(elevation).toBeCloseTo(109.8)
    })
})
