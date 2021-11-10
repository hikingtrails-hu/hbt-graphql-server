import { Store } from '../../../src/server/store/store'
import { InMemoryStorage } from '../../../src/server/store/in-memory-storage'
import { generateKey, TestData } from '../test-helpers'

describe('Store', () => {
    it('get returns the default value by fallback', async () => {
        const store = new Store(new InMemoryStorage())
        const result = await store.get<TestData>('invalid', () => ({ test: 'test' }))
        expect(result).toStrictEqual({ test: 'test' })
    })

    it('get returns the default value by fallback', async () => {
        const storage = new InMemoryStorage()
        const store = new Store(storage)
        const key = generateKey()
        await storage.set<TestData>(key, { test: 'value' })
        const result = await store.get<TestData>(key, () => ({ test: 'unset' }))
        expect(result).toStrictEqual({ test: 'value' })
    })
})
