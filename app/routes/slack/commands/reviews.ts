import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { database } from '@core/database'
import { CommandsBody } from './command.type'
import { blockPullRequestsUser, blockUserInfo } from '@core/slack-blocks'

async function getBlocksReviewsUser(teamId: string, authorId: number) {
  const reviews = await database.review.findMany({
    where: {
      authorId,
      teamId,
    },
    select: {
      pull_requestId: true,
    },
  })

  const pullRequestIds = reviews.map((review) => review.pull_requestId)

  const pullRequests = await database.pullRequest.findMany({
    where: {
      id: {
        in: pullRequestIds,
      },
      teamId,
      status: 'open',
    },
    include: {
      slackUser: true,
      reviews: {
        include: {
          slackUser: true,
        },
      },
    },
    orderBy: [
      {
        repo: 'asc',
      },
    ],
  })

  return blockPullRequestsUser(pullRequests)
}

export async function reviews(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const user = await database.slackUser.findUnique({ where: { slackId: body.user_id } })

    console.log('[app/controllers/slack/commands/reviews.ts#reviews] reviews commands', { body })

    if (!user?.authorId) return blockUserInfo()

    const blocks = await getBlocksReviewsUser(body.team_id, user.authorId)

    return res.status(200).json({ blocks: blocks })
  } catch (error) {
    console.log('[app/controllers/slack/commands/reviews.ts#reviews] Error ', { body, error })

    return res.status(200).json(blockError)
  }
}
