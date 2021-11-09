import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import { PullRequest } from './pull-request.types'

const prisma = new PrismaClient()

export async function pullRequestController(req: Request<unknown, unknown, PullRequest, unknown>, res: Response) {
  try {
    const { body: webhook } = req

    if (webhook.pull_request.draft) {
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

    await prisma.pullRequest.upsert({
      where: {
        url: webhook.pull_request.html_url,
      },
      update: {
        status: webhook.pull_request.state,
      },
      create: pullRequest,
    })

    res.status(200).json()
  } catch (error) {
    console.log('[app/controllers/webhooks/pull-request#pullRequestController] error')
    console.log(error)

    res.status(200).json()
  }
}
