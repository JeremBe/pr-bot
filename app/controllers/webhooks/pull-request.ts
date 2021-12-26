import { Request, Response } from 'express'

import { database } from '@core/database'
import { WebhookPullRequest } from './pull-request.types'
import { notifyPullRequest, notifyReview } from '@core/notify'

export async function pullRequestController(
  req: Request<unknown, unknown, WebhookPullRequest, unknown>,
  res: Response,
) {
  try {
    const { body: webhook } = req

    if (webhook.pull_request.draft) {
      console.log('[app/controllers/webhooks/pull-request#pullRequestController] exclude draft pull-request')

      return res.status(200).json()
    }

    const pullRequest = {
      url: webhook.pull_request.html_url,
      name: webhook.pull_request.title,
      author: webhook.pull_request.user.login,
      authorId: webhook.pull_request.user.id,
      repo: webhook.repository.name,
      repo_url: webhook.repository.html_url,
      status: webhook.pull_request.state,
    }

    console.log('[app/controllers/webhooks/pull-request#pullRequestController] payload')
    console.log(pullRequest)

    const model = await database.pullRequest.upsert({
      where: {
        url: pullRequest.url,
      },
      update: {
        status: pullRequest.status,
      },
      create: pullRequest,
    })

    if (webhook.action === 'review_requested') {
      console.log('[app/controllers/webhooks/pull-request#pullRequestController] review_requested')

      await database.reviewer.update({
        where: {
          authorId_pull_requestId: {
            authorId: webhook.requested_reviewer.id,
            pull_requestId: model.id,
          },
        },
        data: {
          status: 'review_requested',
        },
      })

      await notifyReview(model)

      return res.status(200).json()
    }

    await notifyPullRequest(model, webhook)

    return res.status(200).json()
  } catch (error) {
    console.log('[app/controllers/webhooks/pull-request#pullRequestController] error')
    console.log(error)

    return res.status(200).json()
  }
}
