import { Request, Response } from 'express'

import { database } from '@core/database'

export async function adminReviewsControllerIndex(_: Request, res: Response) {
  const reviews = await database.reviewer.findMany()

  res.status(200).json({
    reviews,
  })
}
