import { getenv } from './env'

export const filterMapDataConfig = () => ({
    keepEveryNthStamp: Number.parseInt(getenv.loose('KEEP_EVERY_NTH_STAMP') ?? '1'),
    keepEveryNthPathNode: Number.parseInt(getenv.loose('KEEP_EVERY_NTH_PATH_NODE') ?? '1')
})
