import { parseXml } from '../../../../src/server/xml/xml'
import { pointsFromGpx, stampsFromGpx } from '../../../../src/server/xml/gpx'

describe('XML', () => {
    it('parses XML', async () => {
        const xml = '<foo value="1"><bar>test</bar></foo>'
        const result = await parseXml(xml)
        expect(result.foo.$.value).toBe('1')
        expect(result.foo.bar).toEqual(['test'])
    })

    it('throws exception on XML error', async () => {
        const xml = '<xml>Invalid XML'
        await expect(async () => {
            await parseXml(xml)
        }).rejects.toThrow()
    })
})

describe('Points from GPX', () => {
    it('Parses GPX', async () => {
        const gpx = `<?xml version="1.0" encoding="UTF-8"?>
            <gpx>
                <metadata>
                    <name>test</name>
                </metadata>
                <trk>
                    <name>test</name>
                    <desc></desc>
                    <trkseg>
                        <trkpt lat="1" lon="0"><ele>1</ele></trkpt>
                        <trkpt lat="1" lon="1"><ele>2</ele></trkpt>
                        <trkpt lat="2" lon="2"><ele>3</ele></trkpt>
                    </trkseg>
                </trk>
            </gpx>
        `
        const result = await pointsFromGpx(gpx)
        expect(result.points).toEqual([
            { lat: 1, lon: 0, elevation: 1 },
            { lat: 1, lon: 1, elevation: 2 },
            { lat: 2, lon: 2, elevation: 3 }
        ])
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
