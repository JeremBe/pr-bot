import { PullRequest, Review, SlackChannelSubscription, SlackUser } from '@prisma/client'

import { getWebClient } from '@services/slack/slack'
import { blockPullRequestCreated, blockPullRequestMerged, blockReview, blockReviewRequested } from '@core/slack-blocks'

const webClient = getWebClient()

export async function notifyPullRequestCreated(
  pullRequest: PullRequest,
  user: SlackUser | null,
  channels: SlackChannelSubscription[],
) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestCreated]')
  console.log(pullRequest)

  const block = blockPullRequestCreated(pullRequest, user)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}

export async function notifyPullRequestMerged(
  pullRequest: PullRequest,
  user: SlackUser | null,
  channels: SlackChannelSubscription[],
) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestMerged]')
  console.log(pullRequest)

  const block = blockPullRequestMerged(pullRequest, user)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}

export async function notifyReviews(
  pullRequest: PullRequest,
  user: SlackUser | null,
  reviews: (Review & {
    slackUser: SlackUser | null
  })[],
  channels: SlackChannelSubscription[],
) {
  console.log('[app/services/slack/slack-notify#notifyReviews]')
  console.log(pullRequest)

  const block = blockReview(pullRequest, user, reviews)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: user?.slackId ?? channel.channelId }),
    ),
  )
}

export async function notifyReviewRequested(
  pullRequest: PullRequest & {
    slackUser: SlackUser | null
  },
  review: Review & {
    slackUser: SlackUser | null
  },
  channels: SlackChannelSubscription[],
) {
  console.log('[app/services/slack/slack-notify#notifyReviews]')
  console.log(pullRequest)

  const block = blockReviewRequested(pullRequest, review)

  if (review.slackUser?.slackId) {
    await webClient.chat.postMessage({ blocks: block, text: 'message', channel: review.slackUser.slackId })

    return
  }

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}
