import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { database } from '@core/database'
import { CommandsBody } from './command.type'
import { blockPullRequestList, blockPullRequestsUser, blockUserInfo } from '@core/slack-blocks'

async function getBlocksUser(teamId: string, slackId: string) {
  const user = await database.slackUser.findUnique({ where: { slackId } })

  if (user?.authorId) {
    const pullRequests = await database.pullRequest.findMany({
      where: {
        teamId,
        authorId: user.authorId,
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

  return blockUserInfo()
}

async function getBlocksPullRequestsList(teamId: string, repositoriesUrl: string[]) {
  const pullRequests = await database.pullRequest.findMany({
    where: {
      repo_url: {
        in: repositoriesUrl,
      },
      status: 'open',
      teamId,
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
      {
        authorId: 'asc',
      },
    ],
  })

  return blockPullRequestList(pullRequests)
}

export async function pr(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const subscriptions = await database.slackChannelSubscription.findMany({
      where: {
        teamId: body.team_id,
        channelId: body.channel_id,
      },
    })

    const repositoriesUrl = subscriptions.map((subscription) => subscription.repo_url)

    console.log('[app/controllers/slack/commands/pr.ts#pr] pr commands', { body, repositoriesUrl })

    const blocks =
      body.text === 'me'
        ? await getBlocksUser(body.team_id, body.user_id)
        : await getBlocksPullRequestsList(body.team_id, repositoriesUrl)

    return res.status(200).json({ blocks: blocks })
  } catch (error) {
    console.log('[app/controllers/slack/commands/pr.ts#pr] Error ', { body, error })

    return res.status(200).json(blockError)
  }
}
