import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { config } from '../config/config'
import { Storage } from '../store/storage'
import { SendMessage } from '../worker/worker/worker'
import { sendPubSubMessage } from '../worker/pubsub/pubsub'
import { loadHikingTrail } from '../load/load-hiking-trail'
import { fakeHttpGet, httpGet } from '../http/http'
import { loadData } from '../load/load-data'
import { singleton } from './singleton'
import { placeStampingLocations } from '../load/place-stamping-locations'
import { checkState } from '../load/check-state'
import { EventEmitter } from 'events'
import { resolvers } from '../graphql/resolvers'
import { distanceInMeters } from '../../hbt/map/distance'

export class DependencyInjection {
    constructor(
        private readonly conf: typeof config
    ) {}

    public httpGet = () => this.conf.httpConfig().useFake ? fakeHttpGet : httpGet

    public storage = (): Storage => new CloudStorageStore(
        this.conf.cloudStorageConfig().cloudApiEndpoint,
        this.conf.cloudStorageConfig().cloudProjectId,
        this.conf.cloudStorageConfig().bucketName
    )

    public sendMessage = (): SendMessage => sendPubSubMessage(this.conf.pubsubConfig().topicName)

    public loadHikingTrail = () => loadHikingTrail(
        this.httpGet(),
        this.storage(),
        this.conf.filterMapDataConfig(),
        this.sendMessage()
    )

    public distanceInMeters = () => distanceInMeters

    public placeStampingLocations = () => placeStampingLocations(
        this.httpGet(),
        this.storage(),
        this.sendMessage(),
        this.distanceInMeters()
    )

    public eventEmitter = () => new EventEmitter()

    public checkState = () => checkState(this.storage(), this.eventEmitter())

    public loadData = () => loadData(this.sendMessage())

    public graphqlResolvers = () => resolvers(this.storage())
}

export const createDI = (conf: typeof config) => {
    const result = new DependencyInjection(conf)
    singleton(result)
    return result
}
