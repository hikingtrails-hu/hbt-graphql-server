import { generate as randomstring } from 'randomstring'
import { logger } from '../../src/server/logging/logger'
import { spy, SinonSpy, replace } from 'sinon'

export interface TestData {
    test: string
}

export const generateKey = () => randomstring({ length: 32, charset: 'alphanumeric' })

type LoggerKey = keyof typeof logger

type LoggerSpies = {
    [key in LoggerKey]: SinonSpy<Parameters<typeof logger[key]>, void>
}

export const replaceLoggerWithSpies = (): LoggerSpies => {
    for (const key in logger) {
        replace(logger, key as LoggerKey, spy())
    }
    return logger as LoggerSpies
}
