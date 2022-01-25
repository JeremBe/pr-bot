import { WebClient } from '@slack/web-api'

import { PullRequest, Reviewer } from '@prisma/client'
import { blockPullRequestCreated, blockPullRequestMerged, blockReview } from './blocks'
import { config } from '@config'

const webClient = new WebClient(config.slack.token)

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

export async function notifyReviews(pullRequest: PullRequest, reviewers: Reviewer[]) {
  console.log('[app/services/slack/slack-notify#notifyReviews]')
  console.log(pullRequest)

  const block = blockReview(pullRequest, reviewers)

  await webClient.chat.postMessage({ blocks: block, text: 'message', channel: 'C02N7GB1JUX' })
}
