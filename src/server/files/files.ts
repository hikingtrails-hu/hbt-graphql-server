import { resolve } from 'path'
import { promises } from 'fs'

export async function fileContent(relativePath: string): Promise<string> {
    return await promises.readFile(resolve(process.cwd(), relativePath), 'utf-8')
}
