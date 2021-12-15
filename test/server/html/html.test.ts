import { getLinkUrlsFromHtml } from '../../../src/server/html/html'

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
