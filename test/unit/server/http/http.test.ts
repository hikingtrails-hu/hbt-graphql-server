import { httpGet } from '../../../../src/server/http/http'
import { createServer } from 'http'
import { replaceLoggerWithSpies } from '../test-helpers'
import { findFreePorts } from 'find-free-ports'

describe('HTTP Get', () => {
    replaceLoggerWithSpies()
    it('returns response body', async () => {
        const port = (await findFreePorts(1))[0] as number
        const server = createServer((req, res) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('Test')
        }).listen(port)
        const response = await httpGet(`http://localhost:${port}`)
        expect(response).toBe('Test')
        await server.close()
    })
})
