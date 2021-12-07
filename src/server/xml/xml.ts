import { parseString } from 'xml2js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseXml = async (xml: string): Promise<any> =>
    await new Promise((resolve, reject) => {
        parseString(
            xml,
            (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
