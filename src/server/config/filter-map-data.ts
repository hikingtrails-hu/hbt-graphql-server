import { getenv } from './getenv'

export const filterMapDataConfig = () => ({
    keepEveryNthStamp: Number.parseInt(getenv('KEEP_EVERY_NTH_STAMP', '1')),
    keepEveryNthPathNode: Number.parseInt(getenv('KEEP_EVERY_NTH_PATH_NODE', '1'))
})
