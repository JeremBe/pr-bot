import { PullRequest, Review, SlackChannelSubscription } from '@prisma/client'

import { getWebClient } from '@services/slack/slack'
import { blockPullRequestCreated, blockPullRequestMerged, blockReview } from '@core/slack-blocks'

const webClient = getWebClient()

export async function notifyPullRequestCreated(pullRequest: PullRequest, channels: SlackChannelSubscription[]) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestCreated]')
  console.log(pullRequest)

  const block = blockPullRequestCreated(pullRequest)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}

export async function notifyPullRequestMerged(pullRequest: PullRequest, channels: SlackChannelSubscription[]) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestMerged]')
  console.log(pullRequest)

  const block = blockPullRequestMerged(pullRequest)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}

export async function notifyReviews(pullRequest: PullRequest, reviews: Review[], channels: SlackChannelSubscription[]) {
  console.log('[app/services/slack/slack-notify#notifyReviews]')
  console.log(pullRequest)

  const block = blockReview(pullRequest, reviews)

  await Promise.all(
    channels.map((channel) =>
      webClient.chat.postMessage({ blocks: block, text: 'message', channel: channel.channelId }),
    ),
  )
}
