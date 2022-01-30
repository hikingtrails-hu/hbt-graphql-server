import { fileContent } from '../../../../src/server/files/files'
import { parseXml } from '../../../../src/server/xml/xml'
import { pointsFromGpx, stampsFromGpx } from '../../../../src/server/xml/gpx'
import { Point } from '../../../../src/hbt/types'

describe('XML', () => {
    it('parses XML', async () => {
        const xml = await fileContent('test/unit/server/xml/sample.xml')
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

describe('Points from GPX', () => {
    it('Parses GPX', async () => {
        const gpx = await fileContent('test/unit/server/xml/sample-path.gpx')
        const result = await pointsFromGpx(gpx)
        expect(result.points.length).toEqual(409)
        const { elevation, lon, lat } = result.points[2] as Point
        expect(lat).toBeCloseTo(47.76365)
        expect(lon).toBeCloseTo(18.912189)
        expect(elevation).toBeCloseTo(109.8)
    })
})

describe('Stamps from GPX', () => {
    it('Parses GPX', async () => {
        const gpx = `
            <?xml version="1.0" ?>
            <gpx creator="Esri" version="1.1"
                    xalan="http://xml.apache.org/xalan"
                    xmlns="http://www.topografix.com/GPX/1/1"
                    xsi="http://www.w3.org/2001/XMLSchema-instance">
                <wpt lat="1" lon="0">
                    <name>Sátoraljaújhely</name>
                    <desc>Sátoraljaújhely vasútállomás - A pénztár melletti falon.</desc>
                </wpt>
                <wpt lat="2" lon="1">
                    <name>Vekeri-tó</name>
                    <desc>Dorcas kemping - A kemping kerítésén.</desc>
                </wpt>
            </gpx>
        `
        const result = await stampsFromGpx(gpx)
        expect(result).toStrictEqual([
            {
                description: 'Sátoraljaújhely vasútállomás - A pénztár melletti falon.',
                name: 'Sátoraljaújhely',
                position: {
                    lat: 1,
                    lon: 0,
                    elevation: 0
                }
            },
            {
                description: 'Dorcas kemping - A kemping kerítésén.',
                name: 'Vekeri-tó',
                position: {
                    lat: 2,
                    lon: 1,
                    elevation: 0
                }
            }
        ])
    })
})
