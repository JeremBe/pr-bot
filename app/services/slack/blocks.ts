import { PullRequest, Review } from '@prisma/client'

import { EMOJI, RANDOM_SUCCESS_EMOJI } from '@constants/emojis'

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

export function blockDivider() {
  return { type: 'divider' }
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

export function blockPullRequestsUser(pullRequests: PullRequestWithReviews[]) {
  const blocks = pullRequests.map((pullRequest) => blockReview(pullRequest, pullRequest.reviews)).flat()

  return [...blockSection(`${RANDOM_SUCCESS_EMOJI()} *You have ${pullRequests.length} PR(s) in queue*`), ...blocks]
}

export function blockNickname() {
  const message = `Your nickname is successfully added !`

  return blockSection(message)
}

export function blockAuthorId() {
  const message = `Your author id is successfully added !`

  return blockSection(message)
}

export function blockUserInfo() {
  const blocks = [
    blockSection(`Hey! \nFor list your pull requests you need to give me your github user id 🤗`),
    blockSection(`You can find it here 👉 https://api.github.com/users/githubUserName`),
    blockSection('Just replace `githubUserName` with yours.'),
    blockSection('Then type command `/authorId your_user_id`'),
    blockDivider(),
    blockSection('You can also add nickname 😎 !! \nType command `/authorId your_user_id`'),
  ]

  return blocks.flat()
}
