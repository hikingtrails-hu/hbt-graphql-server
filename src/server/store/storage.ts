export interface Storage {
    has: (key: string) => Promise<boolean>
    set: <Data>(key: string, data: Data) => Promise<void>
    get: <Data>(key: string) => Promise<Data>
}
