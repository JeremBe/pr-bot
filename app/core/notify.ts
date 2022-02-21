import { PullRequest, PrismaClient } from '@prisma/client'

import { notifyPullRequestCreated, notifyPullRequestMerged, notifyReviews } from '@services/slack/slack-notify'
import { WebhookPullRequest } from '@routes/webhooks/pull-request.types'

const prisma = new PrismaClient()

export async function notifyReview(pullRequest: PullRequest) {
  const user = await prisma.slackUser.findUnique({
    where: {
      teamId_authorId: {
        authorId: pullRequest.authorId,
        teamId: pullRequest.teamId,
      },
    },
  })

  const reviews = await prisma.review.findMany({
    where: { pull_requestId: pullRequest.id },
    include: { slackUser: true },
  })

  const channels = await prisma.slackChannelSubscription.findMany({
    where: {
      repo_url: pullRequest.repo_url,
    },
  })

  await notifyReviews(pullRequest, user, reviews, channels)
}

export async function notifyPullRequest(pullRequest: PullRequest, webhook: WebhookPullRequest) {
  const user = await prisma.slackUser.findUnique({
    where: {
      teamId_authorId: {
        authorId: pullRequest.authorId,
        teamId: pullRequest.teamId,
      },
    },
  })

  const channels = await prisma.slackChannelSubscription.findMany({
    where: {
      repo_url: pullRequest.repo_url,
    },
  })

  switch (pullRequest.status) {
    case 'closed':
      if (webhook.pull_request.merged_at) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request merged')
        await notifyPullRequestMerged(pullRequest, user, channels)
      }

      break
    case 'open':
      const isCreated = pullRequest.updatedAt.getTime() - pullRequest.createdAt.getTime() < 5
      console.log('[app/core/notify#notifyPullRequest] isCreated', isCreated)

      if (isCreated) {
        console.log('[app/core/notify#notifyPullRequest] notify pull request created')
        await notifyPullRequestCreated(pullRequest, user, channels)
      }

      break
  }
}
