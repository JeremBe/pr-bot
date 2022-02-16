import { PullRequest, Review } from '@prisma/client'

import { getWebClient } from '@core/slack'
import { blockPullRequestCreated, blockPullRequestMerged, blockReview } from './blocks'

const webClient = getWebClient()

export async function notifyPullRequestCreated(pullRequest: PullRequest) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestCreated]')
  console.log(pullRequest)

  const block = blockPullRequestCreated(pullRequest)

  await webClient.chat.postMessage({ blocks: block, text: 'message', channel: 'C02N7GB1JUX' })
}

export async function notifyPullRequestMerged(pullRequest: PullRequest) {
  console.log('[app/services/slack/slack-notify#notifyPullRequestMerged]')
  console.log(pullRequest)

  const block = blockPullRequestMerged(pullRequest)

  await webClient.chat.postMessage({ blocks: block, text: 'message', channel: 'C02N7GB1JUX' })
}

export async function notifyReviews(pullRequest: PullRequest, reviews: Review[]) {
  console.log('[app/services/slack/slack-notify#notifyReviews]')
  console.log(pullRequest)

  const block = blockReview(pullRequest, reviews)

  await webClient.chat.postMessage({ blocks: block, text: 'message', channel: 'C02N7GB1JUX' })
}
