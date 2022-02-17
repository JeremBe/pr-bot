import { blockError } from '@constants/blockError'
import { RANDOM_SUCCESS_EMOJI } from '@constants/emojis'
import { database } from '@core/database'
import { Request, Response } from 'express'

import { CommandsBody } from './command.type'

export async function subscribe(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const githubRepositoryPattern = /^https:\/\/github.com\/[\w,\-,\_]+\/([\w,\-,\_]+)$/

    const matchGithubUrl = body.text.match(githubRepositoryPattern)

    if (matchGithubUrl) {
      await database.slackChannelSubscription.upsert({
        where: {
          channelId_repo_url: {
            channelId: body.channel_id,
            repo_url: body.text,
          },
        },
        create: {
          channelId: body.channel_id,
          repo_url: body.text,
          teamId: body.team_id,
        },
        update: {},
      })

      return res.status(200).json(subscriptionBlock(matchGithubUrl[1] as string))
    }

    return res.status(200).json(patternNotMatchBlock)
  } catch (error) {
    console.log('[app/controllers/slack/commands/subscribe.ts#subscribe] Error ', body)

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

const subscriptionBlock = (repository: string) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${RANDOM_SUCCESS_EMOJI()} This channel is subscribed to *${repository}*`,
      },
    },
  ],
})
