import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { database } from '@core/database'
import { CommandsBody } from './command.type'
import { blockPullRequestList } from '@services/slack/blocks'

export async function pr(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  try {
    const { body } = req
    const subscriptions = await database.slackChannelSubscription.findMany({
      where: {
        teamId: body.team_id,
        channelId: body.channel_id,
      },
    })

    const repositoriesUrl = subscriptions.map((subscription) => subscription.repo_url)

    const pullRequests = await database.pullRequest.findMany({
      where: {
        repo_url: {
          in: repositoriesUrl,
        },
      },
      include: {
        reviews: true,
      },
    })

    return res.status(200).json({ blocks: blockPullRequestList(pullRequests) })
  } catch (error) {
    return res.status(200).json(blockError)
  }
}
