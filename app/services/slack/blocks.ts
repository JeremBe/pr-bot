import { PullRequest, Reviewer } from '@prisma/client'

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

function getReviewsStates(reviewers: Reviewer[]) {
  return reviewers.reduce((acc, cur) => {
    const state = statusReview[cur.status]

    return `${acc}(${cur.author}: ${state}) `
  }, '')
}

export function blockReview(pullRequest: PullRequest, reviewers: Reviewer[]) {
  const message = `• <${pullRequest.url}| *[${pullRequest.repo}] ${pullRequest.name}*> ${getReviewsStates(reviewers)}`

  return blockSection(message)
}
