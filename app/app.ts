import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from '@routes/api'
import slack from '@routes/slack'
import { config } from '@config'

const app = express()
const port = config.port

const server = http.createServer(app)

app.use(
  cors({
    origin: '*',
  }),
)

function rawBodySaver(req: any, _: http.ServerResponse, buf: Buffer, encoding: BufferEncoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

app.use(bodyParser.urlencoded({ extended: true, verify: rawBodySaver }))
app.use(bodyParser.json({ verify: rawBodySaver }))

/**
 * ROUTES API
 */
app.use('/slack', slack)
app.use('/api', routes)

server.listen(port)

server.on('listening', () => {
  console.log(`server listening on port ${port}`)
})
