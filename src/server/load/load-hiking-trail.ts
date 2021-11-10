import { LoadHikingTrailRequestData } from '../worker/setup/worker-setup'
import { logger } from '../logging/logger'
import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { cloudStorageConfig } from '../config/config'
import { hikingTrailsSetup } from '../../hbt/hiking-trails'

export const loadHikingTrail = async (data: LoadHikingTrailRequestData): Promise<void> => {
    logger.hikingTrailLoadRequested(data.key)
    const store = new CloudStorageStore(
        'http://localhost:5100',
        'test',
        cloudStorageConfig().bucketName
    )
    const trail = hikingTrailsSetup[data.key]
    await store.set(data.key + '/current.json', [{ name: trail.name }])
}
