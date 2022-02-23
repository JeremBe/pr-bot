import { blockError } from '@constants/blockError'
import { database } from '@core/database'
import { Request, Response } from 'express'

import { CommandsBody } from './command.type'

export async function unsubscribe(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const githubRepositoryPattern = /^https:\/\/github.com\/[\w,\-,\_]+\/([\w,\-,\_]+)$/

    const matchGithubUrl = body.text.match(githubRepositoryPattern)

    if (matchGithubUrl) {
      const slackChannelSubscription = await database.slackChannelSubscription.findUnique({
        where: {
          channelId_repo_url: {
            channelId: body.channel_id,
            repo_url: body.text,
          },
        },
      })

      if (!slackChannelSubscription) {
        return res.status(200).json(subscriptionNotFoundBlock(matchGithubUrl[1] as string))
      }

      await database.slackChannelSubscription.delete({
        where: {
          channelId_repo_url: {
            channelId: body.channel_id,
            repo_url: body.text,
          },
        },
      })

      return res.status(200).json(unsubscribeBlock(matchGithubUrl[1] as string))
    }

    return res.status(200).json(patternNotMatchBlock)
  } catch (error) {
    console.log('[app/controllers/slack/commands/unsubscribe.ts#unsubscribe] Error ', { body, error })

    return res.status(200).json(blockError)
  }
}

const patternNotMatchBlock = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Url provided is not a github repository.',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Url must be: `https://github.com/organisation/repository`',
      },
    },
  ],
}

const unsubscribeBlock = (repository: string) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `👋 This channel is unsubscribed to *${repository}*`,
      },
    },
  ],
})

const subscriptionNotFoundBlock = (repository: string) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `👋 This channel is already unsubscribed to *${repository}*`,
      },
    },
  ],
})
