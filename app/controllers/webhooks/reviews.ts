import { Request, Response, NextFunction } from 'express'

export function middleWareReviews(_req: Request, _res: Response, next: NextFunction) {
  next()
}

export async function reviews(req: Request, res: Response) {
  console.log('================================== Reviews')
  console.log(JSON.stringify(req.body))

  res.status(200).json()
}
