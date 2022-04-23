import { hikingTrailKeys } from '../../hbt/hiking-trails'
import { Storage } from '../store/storage'

export const resolvers = (store: Storage) => ({
    Query: {
        hikes: async () => {
            const hikes: Array<{ name: string }> = []
            for (const key of hikingTrailKeys) {
                const data = await store.get<{ name: string }>(
                    key + '/current.json'
                )
                hikes.push(data)
            }
            return hikes
        },
        hike: async (parent: never, args: {key: string}) => {
            const { key } = args
            return await store.get<{ name: string, key: string }>(key + '/current.json')
        }
    }
})
