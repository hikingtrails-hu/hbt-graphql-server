import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { logger } from '../logging/logger'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { findByPattern, getLinkUrlsFromHtml } from '../html/html'
import { pointsFromGpx, stampsFromGpx } from '../xml/gpx'
import { Storage } from '../store/storage'

export const loadHikingTrail = (httpGet: HttpGet, store: Storage) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key } = data
        logger.hikingTrailLoadRequested(key)
        const trailSetup = hikingTrailsSetup[key]
        const trailPageBody = await httpGet(trailSetup.dataHomepageUrl)
        const links = getLinkUrlsFromHtml(trailPageBody)
        const pathGpxUrl = findByPattern(links, trailSetup.pathGpxUrlPattern)
        const stampGpxUrl = findByPattern(links, trailSetup.stampGpxUrlPattern)
        const [path, stampingLocations] = await Promise.all([
            httpGet(pathGpxUrl).then(pointsFromGpx),
            httpGet(stampGpxUrl).then(stampsFromGpx)
        ])

        await store.set(data.key + '/current.json', [{
            name: trailSetup.name,
            key,
            path,
            stampingLocations
        }])
    }
