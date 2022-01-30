import { CloudStorageStore } from '../../../../src/server/store/cloud-storage/cloud-storage'
import { generateKey, TestData } from '../test-helpers'

describe('CloudStorageStore', () => {
    const store = new CloudStorageStore(
        'http://localhost:5100',
        'test',
        'hbt-bucket'
    )

    it('has() returns false for non-existent data', async () => {
        const result = await store.has('invalid')
        expect(result).toBe(false)
    })

    it('has() returns true for existing data', async () => {
        const key = generateKey()
        await store.set<TestData>(key, { test: 'test' })
        const result = await store.has(key)
        expect(result).toBe(true)
    })

    it('get() returns correct data', async () => {
        const key = generateKey()
        await store.set<TestData>(key, { test: 'test' })
        const result = await store.get<TestData>(key)
        expect(result).toStrictEqual({ test: 'test' })
    })
})
