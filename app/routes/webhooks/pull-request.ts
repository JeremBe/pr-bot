import { Request, Response } from 'express'

import { database } from '@core/database'
import { WebhookPullRequest } from './pull-request.types'
import { notifyPullRequest, notifyReview, notifyReviewRequested, reviewRequested } from '@core/notify'
import { TeamIdVerified } from '@middlewares/github'

export async function pullRequestController(
  req: TeamIdVerified & Request<unknown, unknown, WebhookPullRequest, unknown>,
  res: Response,
) {
  try {
    const { body: webhook } = req

    if (webhook.pull_request.draft) {
      console.log('[app/controllers/webhooks/pull-request#pullRequestController] exclude draft pull-request')

      return res.status(200).json()
    }

    const slackUser = await database.slackUser.findUnique({
      where: {
        teamId_authorId: {
          authorId: webhook.pull_request.user.id,
          teamId: req.teamId,
        },
      },
    })

    const pullRequest = {
      url: webhook.pull_request.html_url,
      name: webhook.pull_request.title,
      author: webhook.pull_request.user.login,
      authorId: webhook.pull_request.user.id,
      repo: webhook.repository.name,
      repo_url: webhook.repository.html_url,
      status: webhook.pull_request.state,
      teamId: req.teamId,
      slackUserId: slackUser?.slackId,
    }

    console.log('[app/controllers/webhooks/pull-request#pullRequestController] payload')
    console.log(pullRequest)

    const model = await database.pullRequest.upsert({
      where: {
        url: pullRequest.url,
      },
      update: {
        status: pullRequest.status,
        slackUserId: slackUser?.slackId,
      },
      create: pullRequest,
      include: {
        slackUser: true,
      },
    })

    if (webhook.action === 'review_requested') {
      console.log('[app/controllers/webhooks/pull-request#pullRequestController] review_requested')

      const review = await database.review.update({
        where: {
          authorId_pull_requestId: {
            authorId: webhook.requested_reviewer.id,
            pull_requestId: model.id,
          },
        },
        data: {
          status: 'review_requested',
          slackUserId: slackUser?.slackId,
        },
        include: {
          slackUser: true,
        },
      })

      await reviewRequested(model, review)

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
