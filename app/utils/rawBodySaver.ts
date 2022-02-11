import express from 'express'

export interface RawBody extends express.Request {
  rawBody?: string
}

export function rawBodySaver(req: RawBody, _: express.Response, buf: Buffer, encoding: BufferEncoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}
