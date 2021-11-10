import { keys } from 'lodash'

export const hikingTrailsSetup = {
    okt: {
        name: 'Országos Kéktúra',
        symbol: '⬆️'
    },
    ddk: {
        name: 'Rockenbauer Pál Dél-Dunántúli Kéktúra',
        symbol: '↙️'
    },
    ak: {
        name: 'Alföldi Kéktúra',
        symbol: '↘️'
    }
}

export const hikingTrailKeys = (): HikingTrailKey[] => keys(hikingTrailsSetup) as HikingTrailKey[]

export type HikingTrailKey = 'okt' | 'ddk' | 'ak'
