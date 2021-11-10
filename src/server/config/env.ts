import { strict as assert } from 'assert'

type EnvKey = keyof typeof process.env

export const getenv = {
    strict: (key: EnvKey): string => {
        const value = process.env[key]
        assert(typeof value === 'string', `${key} env var not set`)
        return value
    },
    loose: (key: EnvKey): string | undefined => process.env[key]
}
