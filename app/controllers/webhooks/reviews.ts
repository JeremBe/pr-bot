import { Request, Response } from 'express'

import { database } from '@core/database'
import { notifyReview } from '@core/notify'

import { PullRequestReview } from './reviews.types'

export async function reviewsController(req: Request<unknown, unknown, PullRequestReview, unknown>, res: Response) {
  try {
    const { body: webhook } = req

    const pullRequest = await database.pullRequest.findUnique({
      where: {
        url: webhook.pull_request.html_url,
      },
    })

    if (!pullRequest) {
      console.log(
        `[app/controllers/webhooks/reviews#reviewsController] pull request not found: url ${webhook.pull_request.html_url}`,
      )

      return res.status(200).json()
    }

    if (pullRequest.authorId === Number(webhook.review.user.id)) {
      console.log('[app/controllers/webhooks/reviews#reviewsController] author of review is the owner of pull request')

      return res.status(200).json()
    }

    const review = {
      author: webhook.review.user.login,
      authorId: webhook.review.user.id,
      status: webhook.review.state,
      pull_requestId: pullRequest.id,
    }

    console.log('[app/controllers/webhooks/reviews#reviewsController] payload')
    console.log(review)

    const currentReview = await database.reviewer.findUnique({
      where: {
        authorId_pull_requestId: {
          pull_requestId: review.pull_requestId,
          authorId: review.authorId,
        },
      },
    })

    if (review.status === 'commented' && currentReview) {
      console.log('[app/controllers/webhooks/reviews#reviewsController] not erase last review')

      return res.status(200).json()
    }

    await database.reviewer.upsert({
      where: {
        authorId_pull_requestId: {
          pull_requestId: review.pull_requestId,
          authorId: review.authorId,
        },
      },
      update: {
        status: review.status,
      },
      create: review,
    })

    await notifyReview(pullRequest)

    return res.status(200).json()
  } catch (error) {
    console.log('[app/controllers/webhooks/reviews#reviewsController] error')
    console.log(error)

    return res.status(200).json()
  }
}
