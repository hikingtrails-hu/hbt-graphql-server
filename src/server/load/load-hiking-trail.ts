import {
    LoadHikingTrailRequestData,
    PlaceStampingLocationsRequestMessage
} from '../worker/setup/worker-setup'
import { logger } from '../logging/logger'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'
import { HttpGet } from '../http/http'
import { findByPattern, getLinkUrlsFromHtml } from '../html/html'
import { pointsFromGpx, stampsFromGpx } from '../xml/gpx'
import { Storage } from '../store/storage'
import { filterMapDataConfig } from '../config/filter-map-data'
import { SendMessage } from '../worker/worker/worker'

export const loadHikingTrail = (
    httpGet: HttpGet,
    store: Storage,
    filterConfig: ReturnType<typeof filterMapDataConfig>,
    sendMessage: SendMessage
) =>
    async (data: LoadHikingTrailRequestData): Promise<void> => {
        const { key, loadId } = data
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
        const pathNodes = allPathNodes.points.filter(
            (point, idx) => idx % filterConfig.keepEveryNthPathNode === 0
        )
        const rawStamps = allStampingLocations.filter(
            (stampingLocation, idx) => idx % filterConfig.keepEveryNthStamp === 0
        )
        await store.set(`${loadId}/${key}/loadHikingTrail.json`, {
            pathNodes,
            rawStamps
        })
        await sendMessage<PlaceStampingLocationsRequestMessage>({
            type: 'PlaceStampingLocationsRequest',
            data
        })
    }
