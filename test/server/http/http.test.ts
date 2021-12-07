import { httpGet } from '../../../src/server/http/http'

describe('HTTP Get', () => {
    it('returns response body', async () => {
        const html = await httpGet('https://github.com/Lencse')
        expect(html).toMatch(/Lencse/)
    })
})
