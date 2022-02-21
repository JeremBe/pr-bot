import { Request, Response } from 'express'

import { blockError } from '@constants/blockError'
import { CommandsBody } from './command.type'
import { database } from '@core/database'
import { blockAuthorId, blockUserInfo } from '@core/slack-blocks'

export async function authorId(req: Request<unknown, unknown, CommandsBody>, res: Response) {
  const { body } = req

  try {
    const authorId = Number(body.text.trim())

    if (!authorId) {
      return res.status(200).json({ blocks: blockUserInfo() })
    }

    await database.slackUser.upsert({
      where: {
        slackId: body.user_id,
      },
      create: {
        slackId: body.user_id,
        teamId: body.team_id,
        authorId,
      },
      update: {
        authorId,
      },
    })

    await database.review.updateMany({
      where: {
        authorId,
      },
      data: {
        slackUserId: body.user_id,
      },
    })

    await database.pullRequest.updateMany({
      where: {
        authorId,
      },
      data: {
        slackUserId: body.user_id,
      },
    })

    return res.status(200).json({ blocks: blockAuthorId() })
  } catch (error) {
    console.log('[app/controllers/slack/commands/authorId.ts#authorId] Error ', { body, error })

    return res.status(200).json(blockError)
  }
}
