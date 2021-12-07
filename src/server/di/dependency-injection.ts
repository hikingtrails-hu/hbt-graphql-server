import { getFromStore } from '../store/store'
import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { config } from '../config/config'
import { Storage } from '../store/storage'
import { SendMessage } from '../worker/worker/worker'
import { sendPubSubMessage } from '../worker/pubsub/pubsub'
import { loadHikingTrail } from '../load/load-hiking-trail'
import { fakeHttpGet, httpGet } from '../http/http'
import { loadData } from '../load/load-data'

export class DependencyInjection {
    constructor(
        private readonly conf: typeof config
    ) {}

    public getFromStore = () => getFromStore(this.storage())

    public httpGet = () => this.conf.httpConfig().useFake ? fakeHttpGet : httpGet

    public storage = (): Storage => new CloudStorageStore(
        this.conf.cloudStorageConfig().cloudApiEndpoint,
        this.conf.cloudStorageConfig().cloudProjectId,
        this.conf.cloudStorageConfig().bucketName
    )

    public sendMessage = (): SendMessage => sendPubSubMessage(this.conf.pubsubConfig().topicName)

    public loadHikingTrail = () => loadHikingTrail(
        this.httpGet(),
        this.storage()
    )

    public loadData = () => loadData(this.sendMessage())
}
