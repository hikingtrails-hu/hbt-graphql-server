import { Storage } from './storage'

export class Store {
    constructor(
        private readonly storage: Storage
    ) {
    }

    public async get<Data>(key: string, fallback: () => Data): Promise<Data> {
        if (!await this.storage.has(key)) {
            return fallback()
        }
        return await this.storage.get<Data>(key)
    }
}
