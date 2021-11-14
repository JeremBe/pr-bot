import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { PullRequestReview } from './reviews.types'

const prisma = new PrismaClient()

export async function reviewsController(req: Request<unknown, unknown, PullRequestReview, unknown>, res: Response) {
  try {
    const { body: webhook } = req

    const pullRequest = await prisma.pullRequest.findUnique({
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

    const review = {
      author: webhook.review.user.login,
      authorId: webhook.review.user.id,
      status: webhook.review.state,
      pull_requestId: pullRequest.id,
    }

    console.log('[app/controllers/webhooks/reviews#reviewsController] payload')
    console.log(review)

    await prisma.reviewer.upsert({
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

    return res.status(200).json()
  } catch (error) {
    console.log('[app/controllers/webhooks/reviews#reviewsController] error')
    console.log(error)

    return res.status(200).json()
  }
}
