import { PullRequest, PrismaClient } from '@prisma/client'

import { notifyPullRequestCreated, notifyPullRequestMerged, notifyReviews } from '@services/slack/slack-notify'
import { WebhookPullRequest } from '@controllers/webhooks/pull-request.types'

const prisma = new PrismaClient()

export async function notifyReview(pullRequest: PullRequest) {
  const reviewers = await prisma.reviewer.findMany({ where: { pull_requestId: pullRequest.id } })

  await notifyReviews(pullRequest, reviewers)
}

export async function notifyPullRequest(pullRequest: PullRequest, webhook: WebhookPullRequest) {
  switch (pullRequest.status) {
    case 'closed':
      if (webhook.pull_request.merged_at) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request merged')
        await notifyPullRequestMerged(pullRequest)
      }

      break
    case 'open':
      const isCreated = pullRequest.updatedAt.getTime() - pullRequest.createdAt.getTime() < 5
      console.log('[app/core/notify#notifyPullRequest] isCreated', isCreated)

      if (isCreated) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request created')
        await notifyPullRequestCreated(pullRequest)
      }

      break
  }
}