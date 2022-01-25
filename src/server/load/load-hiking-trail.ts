import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { logger } from '../logging/logger'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { findByPattern, getLinkUrlsFromHtml } from '../html/html'
import { pointsFromGpx, stampsFromGpx } from '../xml/gpx'
import { Storage } from '../store/storage'
import { placeStampingLocationsOnPath } from '../../hbt/map/map'
import { filterMapDataConfig } from '../config/filter-map-data'

export const loadHikingTrail = (
    httpGet: HttpGet,
    store: Storage,
    filterConfig: ReturnType<typeof filterMapDataConfig>
) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key } = data
        logger.hikingTrailLoadRequested(key)
        const trailSetup = hikingTrailsSetup[key]
        const trailPageBody = await httpGet(trailSetup.dataHomepageUrl)
        const links = getLinkUrlsFromHtml(trailPageBody)
        const pathGpxUrl = findByPattern(links, trailSetup.pathGpxUrlPattern)
        const stampGpxUrl = findByPattern(links, trailSetup.stampGpxUrlPattern)
        const [allPathNodes, allStampingLocations] = await Promise.all([
            httpGet(pathGpxUrl).then(pointsFromGpx),
            httpGet(stampGpxUrl).then(stampsFromGpx)
        ])
        const path = {
            points: allPathNodes.points.filter(
                (point, idx) => idx % filterConfig.keepEveryNthPathNode === 0
            )
        }
        const stampingLocations = allStampingLocations.filter(
            (stampingLocation, idx) => idx % filterConfig.keepEveryNthStamp === 0
        )
        const stamps = placeStampingLocationsOnPath(stampingLocations, path)
        logger.hikingTrailLoaded(key, stampingLocations, path)
        await store.set(data.key + '/current.json', {
            name: trailSetup.name,
            key,
            path,
            stampingLocations: stamps
        })
    }
