import { Request, Response } from 'express'

export interface RawBody extends Request {
  rawBody?: string
}

export function rawBodySaver(req: RawBody, _: Response, buf: Buffer, encoding: BufferEncoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}
