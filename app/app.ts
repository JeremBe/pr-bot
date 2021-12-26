import http from 'node:http'

import express from 'express'
import cors from 'cors'

import routes from '@routes/index'

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: '*',
  }),
)

app.use(express.json())

/**
 * ROUTES API
 */
app.use('/api', routes)

const server = http.createServer(app)

server.listen(port)

server.on('listening', () => {
  console.log(`server listening on port ${port}`)
})
