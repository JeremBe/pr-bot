import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { database } from '@core/database'
import { CommandsBody } from './command.type'

export async function prBot(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  try {
    const { body } = req
    const slackTeam = await database.slackTeam.upsert({
      where: {
        teamId: body.team_id,
      },
      create: {
        teamId: body.team_id,
      },
      update: {},
    })

    const blocks = body.text === 'secret' ? tokenBlock(slackTeam.secret) : initBlocks(slackTeam.secret)

    return res.status(200).json(blocks)
  } catch (error) {
    return res.status(200).json(blockError)
  }
}

const tokenBlock = (secret: string) => ({
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Your github secret webhook is:  *${secret}*`,
      },
    },
  ],
})

const initBlocks = (secret: string) => ({
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '👋 Hi !',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'This organization is successfully added to `PR-BOT` 🥳',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Your secret is:  *${secret}*`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Get your secret* \n\n */pr-bot* `secret` \n Get your secret for github webhooks.',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Subscribe to a repository* \n\n */subscribe* `[url_of_repository]` \n Make this channel listen pull requests and reviews of this repository.',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*List pull requests* \n\n */pr* `list` \n List all pull requests.',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*List your pull requests* \n\n */pr* `me` \n List all your pull requests.',
      },
    },
    {
      type: 'divider',
    },
  ],
})
