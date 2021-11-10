import { Storage } from './storage'

export class InMemoryStorage implements Storage {
    private readonly map = new Map<string, unknown>()

    public async has(key: string): Promise<boolean> {
        return this.map.has(key)
    }

    public async set<Data>(key: string, data: Data): Promise<void> {
        this.map.set(key, data)
    }

    public async get<Data>(key: string): Promise<Data> {
        return this.map.get(key) as Data
    }
}
