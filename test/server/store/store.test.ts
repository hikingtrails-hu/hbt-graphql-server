import { getFromStore } from '../../../src/server/store/store'
import { InMemoryStorage } from '../../../src/server/store/in-memory-storage'
import { generateKey, TestData } from '../test-helpers'

describe('Store', () => {
    it('get returns the default value by fallback', async () => {
        const store = getFromStore(new InMemoryStorage())
        const result = await store<TestData>('invalid', () => ({ test: 'test' }))
        expect(result).toStrictEqual({ test: 'test' })
    })

    it('get returns the correct value', async () => {
        const storage = new InMemoryStorage()
        const store = getFromStore(storage)
        const key = generateKey()
        await storage.set<TestData>(key, { test: 'value' })
        const result = await store<TestData>(key, () => ({ test: 'unset' }))
        expect(result).toStrictEqual({ test: 'value' })
    })
})
