import { RequestData } from '../worker/setup/worker-setup'
import { hikingTrailKeys } from '../../hbt/hiking-trails'
import { Storage } from '../store/storage'
import { setImmediate } from 'timers/promises'
import { EventEmitter } from 'events'

export const checkState = (store: Storage, emitter: EventEmitter) =>
    async (data: RequestData): Promise<void> => {
        const { loadId } = data
        let finish = true
        do {
            await setImmediate()
            finish = true
            for (const hikingTrailKey of hikingTrailKeys()) {
                if (!(await store.has(`${loadId}/${hikingTrailKey}/finished`))) {
                    finish = false
                }
            }
        } while (!finish)
        emitter.emit('finished')
    }
