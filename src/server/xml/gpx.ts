import { Path, Loading } from '@hikingtrails-hu/hikingtrails-lib'
import { parseXml } from './xml'

export async function pointsFromGpx(gpx: string): Promise<Path> {
    const data = await parseXml(gpx)
    const points = data
        .gpx
        .trk[0]
        .trkseg[0]
        .trkpt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((node: any) => ({
            lat: Number(node.$.lat),
            lon: Number(node.$.lon),
            elevation: Number(node.ele ?? 0)
        }))
    return {
        points
    }
}

export const stampsFromGpx = async (gpx: string): Promise<Loading.RawStampData[]> => {
    const data = await parseXml(gpx)
    return data.gpx
        .wpt
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((node: any) => ({
            position: {
                lat: Number(node.$.lat),
                lon: Number(node.$.lon),
                elevation: 0
            },
            description: String(node.desc[0]),
            name: String(node.name[0])
        }))
}
