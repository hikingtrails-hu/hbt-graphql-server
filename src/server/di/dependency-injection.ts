import { Store } from '../store/store'
import { CloudStorageStore } from '../store/cloud-storage/cloud-storage'
import { cloudStorageConfig, pubsubConfig } from '../config/config'
import { Storage } from '../store/storage'
import { Sender } from '../worker/worker/worker'
import { PubSubSender } from '../worker/pubsub/pubsub'

export class DependencyInjection {
    public store = (): Store => new Store(this.storage())

    public storage = (): Storage => new CloudStorageStore(
        cloudStorageConfig().cloudApiEndpoint,
        cloudStorageConfig().cloudProjectId,
        cloudStorageConfig().bucketName
    )

    public sender = (): Sender => new PubSubSender(pubsubConfig().topicName)
}
