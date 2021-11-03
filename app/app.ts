import express from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import routes from '@routes/index'

const app = express()
const port = process.env.PORT || 5000

const server = http.createServer(app)

server.listen(port)

server.on('listening', () => {
  console.log(`Server listening on port ${port}`)
})

app.use(
  cors({
    origin: '*',
  }),
)

app.use(bodyParser.json())

/**
 * ROUTES API
 */
app.use('/api', routes)
