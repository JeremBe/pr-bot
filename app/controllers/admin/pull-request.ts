import { Request, Response } from 'express'

import { database } from '@core/database'

export async function adminPullRequestControllerIndex(_: Request, res: Response) {
  const pullRequests = await database.pullRequest.findMany()

  res.status(200).json({
    pullRequests,
  })
}
