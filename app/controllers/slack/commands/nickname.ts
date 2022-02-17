import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { CommandsBody } from './command.type'
import { database } from '@core/database'
import { blockAuthorId, blockUserInfo } from '@services/slack/blocks'

export async function nickname(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const nickname = body.text.trim()

    if (!nickname) {
      return res.status(200).json({ blocks: blockUserInfo() })
    }

    await database.slackUser.upsert({
      where: {
        slackId: body.user_id,
      },
      create: {
        slackId: body.user_id,
        teamId: body.team_id,
        nickname,
      },
      update: {
        nickname,
      },
    })

    return res.status(200).json({ blocks: blockAuthorId() })
  } catch (error) {
    console.log('[app/controllers/slack/commands/nickname.ts#nickname] Error ', { body, error })

    return res.status(200).json(blockError)
  }
}
