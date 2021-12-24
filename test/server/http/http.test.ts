import { httpGet } from '../../../src/server/http/http'
import { createServer } from 'http'

describe('HTTP Get', () => {
    it('returns response body', async () => {
        const server = createServer((req, res) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('Test')
        }).listen(3000)
        const response = await httpGet('http://localhost:3000')
        expect(response).toBe('Test')
        await server.close()
    })
})
