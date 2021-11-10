import { Storage } from '../storage'
import { Bucket, Storage as CloudStorage } from '@google-cloud/storage'
import { tmpdir } from 'os'
import { resolve } from 'path'
import { writeFileSync, rmSync } from 'fs'
import { v1 as uuid } from 'uuid'

export class CloudStorageStore implements Storage {
    private readonly bucket: Bucket

    constructor(
        readonly cloudApiEndpoint: string | undefined,
        readonly cloudProjectId: string | undefined,
        readonly bucketName: string
    ) {
        const storage = new CloudStorage({
            apiEndpoint: cloudApiEndpoint,
            projectId: cloudProjectId
        })
        this.bucket = storage.bucket(bucketName)
    }

    public async has(key: string): Promise<boolean> {
        const [exists] = await this.bucket.file(key).exists()
        return exists
    }

    public async set<Data>(key: string, data: Data): Promise<void> {
        const filePath = resolve(tmpdir(), uuid())
        writeFileSync(filePath, JSON.stringify(data))
        await this.bucket.upload(filePath, { destination: key })
        rmSync(filePath)
    }

    public async get<Data>(key: string): Promise<Data> {
        const [file] = await this.bucket.file(key).get()
        const content = await file.download()
        return JSON.parse(content.toString()) as Data
    }
}
