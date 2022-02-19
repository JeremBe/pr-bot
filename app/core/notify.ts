import { PullRequest, PrismaClient } from '@prisma/client'

import { notifyPullRequestCreated, notifyPullRequestMerged, notifyReviews } from '@services/slack/slack-notify'
import { WebhookPullRequest } from '@routes/webhooks/pull-request.types'

const prisma = new PrismaClient()

export async function notifyReview(pullRequest: PullRequest) {
  const reviews = await prisma.review.findMany({ where: { pull_requestId: pullRequest.id } })
  const channels = await prisma.slackChannelSubscription.findMany({
    where: {
      repo_url: pullRequest.repo_url,
    },
  })

  await notifyReviews(pullRequest, reviews, channels)
}

export async function notifyPullRequest(pullRequest: PullRequest, webhook: WebhookPullRequest) {
  const channels = await prisma.slackChannelSubscription.findMany({
    where: {
      repo_url: pullRequest.repo_url,
    },
  })

  switch (pullRequest.status) {
    case 'closed':
      if (webhook.pull_request.merged_at) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request merged')
        await notifyPullRequestMerged(pullRequest, channels)
      }

      break
    case 'open':
      const isCreated = pullRequest.updatedAt.getTime() - pullRequest.createdAt.getTime() < 5
      console.log('[app/core/notify#notifyPullRequest] isCreated', isCreated)

      if (isCreated) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request created')
        await notifyPullRequestCreated(pullRequest, channels)
      }

      break
  }
}
