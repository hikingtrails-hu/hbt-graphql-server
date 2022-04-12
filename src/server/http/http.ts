import axios from 'axios'
import { fileContent } from '../files/files'
import { resolve } from 'path'
import { logger } from '../logging/logger'

export type HttpGet = typeof httpGet

export const httpGet = async (url: string): Promise<string> => {
    const res = await axios.get(url)
    logger.httpRequestOk(url)
    return res.data.toString()
}

export const fakeHttpGet: HttpGet = async (url: string) => {
    const fileName = url.split('/').pop() as string
    return await fileContent(resolve('src/server/http/fake', fileName))
}
