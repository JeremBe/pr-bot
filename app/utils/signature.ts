import crypto from 'crypto'

const sigHashAlg = 'sha256'

export function getSignature(secret: string, rawBody: string) {
  const hmac = crypto.createHmac(sigHashAlg, secret)
  const signature = Buffer.from(sigHashAlg + '=' + hmac.update(rawBody).digest('hex'), 'utf8')

  return signature
}
