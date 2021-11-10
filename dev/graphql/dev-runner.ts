import { handler } from '../../src/server/graphql/serverless-handler'
import express from 'express'

const main = async () => {
    const app = express()
    app.use(handler)
    const port = process.env['PORT'] ?? 5000
    await app.listen(port)
    console.info(`🚀 Listening on http://localhost:${port}`)
}

void main()
