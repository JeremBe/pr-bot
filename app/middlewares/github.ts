import express from 'express'
import crypto from 'crypto'

import { RawBody } from '@utils/rawBodySaver'
import { getSignature } from '@utils/signature'
import { WebhookPullRequest } from '@controllers/webhooks/pull-request.types'
import { PullRequestReview } from '@controllers/webhooks/reviews.types'

const sigHeaderName = 'X-Hub-Signature-256'

export async function githubMiddleware(
  req: RawBody & (WebhookPullRequest | PullRequestReview),
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.rawBody) {
    console.log('[app/middlewares/github.ts#githubMiddleware] rawBody not provided')

    return res.status(200).json()
  }

  const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')

  // TODO: use secret from SlackTeam - match with req.body.repository.html_url on channel subscription
  const signature = getSignature('d5a25fe9-6b59-4043-99b0-20535381734f', req.rawBody)

  if (sig.length !== signature.length || !crypto.timingSafeEqual(signature, sig)) {
    console.log('[app/middlewares/github.ts#githubMiddleware] signature not match', {
      githubSignature: sig.toString(),
      teamSignature: signature.toString(),
    })

    return res.status(200).json()
  }

  console.log('[app/middlewares/github.ts#githubMiddleware] signature match', {
    teamId: 'TODO',
  })

  return next()
}
