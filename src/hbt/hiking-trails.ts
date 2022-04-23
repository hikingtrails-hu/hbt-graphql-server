import { keys } from 'lodash'

export const hikingTrailsSetup = {
    okt: {
        name: 'Országos Kéktúra',
        symbol: '⬆️',
        dataHomepageUrl: 'https://www.kektura.hu/okt-szakaszok',
        pathGpxUrlPattern: /okt_teljes_[0-9_]+\.gpx/,
        stampGpxUrlPattern: /okt_bh_[0-9_]+\.gpx/
    },
    ddk: {
        name: 'Rockenbauer Pál Dél-Dunántúli Kéktúra',
        symbol: '↙️',
        dataHomepageUrl: 'https://www.kektura.hu/rpddk-szakaszok',
        pathGpxUrlPattern: /rpddk_teljes_[0-9_]+\.gpx/,
        stampGpxUrlPattern: /rpddk_bh_[0-9_]+\.gpx/
    },
    ak: {
        name: 'Alföldi Kéktúra',
        symbol: '↘️',
        dataHomepageUrl: 'https://www.kektura.hu/ak-szakaszok',
        pathGpxUrlPattern: /ak_teljes_[0-9_]+\.gpx/,
        stampGpxUrlPattern: /ak_bh_[0-9_]+\.gpx/
    }
}

export const hikingTrailKeys = keys(hikingTrailsSetup) as HikingTrailKey[]

export type HikingTrailKey = 'okt' | 'ddk' | 'ak'
