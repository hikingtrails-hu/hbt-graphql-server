import { getenv } from './env'

export const httpConfig = () => ({
    useFake: getenv.loose('USE_FAKE_HTTP') === 'true' ?? false
})
