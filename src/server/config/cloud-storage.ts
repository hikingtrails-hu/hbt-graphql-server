import { getenv } from './env'

export const cloudStorageConfig = () => ({
    cloudApiEndpoint: getenv.loose('GCLOUD_STORAGE_API_ENDPOINT'),
    cloudProjectId: getenv.loose('GCLOUD_PROJECT'),
    bucketName: getenv.strict('GCLOUD_BUCKET')
})
