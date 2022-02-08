import { getenv } from './getenv'

export const cloudStorageConfig = () => ({
    cloudApiEndpoint: getenv('GCLOUD_STORAGE_API_ENDPOINT', ''),
    cloudProjectId: getenv('GCLOUD_PROJECT', ''),
    bucketName: getenv('GCLOUD_BUCKET')
})
