import { PullRequest, Review } from '@prisma/client'

import { EMOJI } from '@constants/emojis'

export function blockSection(message: string) {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: message,
      },
    },
  ]
}

export function blockPullRequestCreated(pullRequest: PullRequest) {
  const message = `• <${pullRequest.url}| *[${pullRequest.repo}] ${pullRequest.name}*> ${EMOJI.PLEASE}`

  return blockSection(message)
}

export function blockPullRequestMerged(pullRequest: PullRequest) {
  const message = `• <${pullRequest.url}| *[${pullRequest.repo}] ${pullRequest.name}*> ${EMOJI.MERGE}`

  return blockSection(message)
}

const statusReview = {
  approved: EMOJI.APPROVE,
  changes_requested: EMOJI.CHANGE,
  commented: EMOJI.COMMENT,
  review_requested: EMOJI.REVIEW,
}

function getReviewsStates(reviews: Review[]) {
  return reviews.reduce((acc, cur) => {
    const state = statusReview[cur.status]

    return `${acc}(${cur.author}: ${state}) `
  }, '')
}

export function blockReview(pullRequest: PullRequest, reviews: Review[]) {
  const message = `• <${pullRequest.url}| *[${pullRequest.repo}] ${pullRequest.name}*> ${getReviewsStates(reviews)}`

  return blockSection(message)
}

type PullRequestWithReviews = PullRequest & {
  reviews: Review[]
}
export function blockPullRequestList(pullRequests: PullRequestWithReviews[]) {
  const blocks = pullRequests.map((pullRequest) => blockReview(pullRequest, pullRequest.reviews)).flat()

  return [...blockSection(`🚀 *${pullRequests.length} PR(s) in queue*`), ...blocks]
}
