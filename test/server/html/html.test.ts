import {
    getLinkUrlsFromHtml,
    findByPattern,
    LinkNotFoundError
} from '../../../src/server/html/html'

describe('Get link urls from HTML', () => {
    it('returns correct links', async () => {
        const html = `
            <html>
                <head></head>
                <body>
                    <h1>Test</h1>
                    <a href="https://github.com">Github</a>                    
                    <a href="https://kektura.hu">Kéktúra</a>
                    <ul>
                        <li>
                            <a href="https://444.hu">444</a>
                        </li>
                    </ul>                    
                </body>
            </html>
        `
        const links = getLinkUrlsFromHtml(html)
        expect(links).toStrictEqual([
            'https://github.com',
            'https://kektura.hu',
            'https://444.hu'
        ])
    })
})

describe('Find by pattern', () => {
    const links = [
        'https://kektura.hu',
        'https://444.hu'
    ]
    it('finds correct links', () => {
        const link1 = findByPattern(links, /kektura/)
        expect(link1).toStrictEqual('https://kektura.hu')
        const link2 = findByPattern(links, /444/)
        expect(link2).toStrictEqual('https://444.hu')
        expect(() => {
            findByPattern(links, /not-found/)
        }).toThrow(LinkNotFoundError)
    })
    it('throws error if link not found', () => {
        expect(() => {
            findByPattern(links, /not-found/)
        }).toThrow(LinkNotFoundError)
    })
})
