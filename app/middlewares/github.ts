import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'

import { RawBody } from '@utils/rawBodySaver'
import { getSignature } from '@utils/signature'
import { WebhookPullRequest } from '@controllers/webhooks/pull-request.types'
import { PullRequestReview } from '@controllers/webhooks/reviews.types'
import { database } from '@core/database'

const sigHeaderName = 'X-Hub-Signature-256'

export interface TeamIdVerified extends Request {
  teamId: string
}

export interface TeamIdProcessing extends Request {
  teamId?: string
}

type GithubMiddlewareRequest = RawBody &
  TeamIdProcessing &
  Request<unknown, unknown, WebhookPullRequest | PullRequestReview>

export async function githubMiddleware(req: GithubMiddlewareRequest, res: Response, next: NextFunction) {
  if (!req.rawBody) {
    console.log('[app/middlewares/github.ts#githubMiddleware] rawBody not provided')

    return res.status(200).json()
  }

  const channel = await database.slackChannelSubscription.findFirst({
    where: {
      repo_url: req.body.repository.html_url,
    },
    include: {
      slackTeam: true,
    },
  })

  if (!channel) {
    console.log('[app/middlewares/github.ts#githubMiddleware] team not found', {
      repo_url: req.body.repository.html_url,
    })

    return res.status(200).json()
  }

  const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
  const signature = getSignature(channel.slackTeam.secret, req.rawBody)

  delete req.rawBody

  if (sig.length !== signature.length || !crypto.timingSafeEqual(signature, sig)) {
    console.log('[app/middlewares/github.ts#githubMiddleware] signature not match', {
      githubSignature: sig.toString(),
      teamSignature: signature.toString(),
    })

    return res.status(200).json()
  }

  console.log('[app/middlewares/github.ts#githubMiddleware] signature match', {
    teamId: channel.teamId,
  })

  req.teamId = channel.teamId

  return next()
}
