import { Request, Response, NextFunction } from 'express'

export function middleWarePullRequest(_req: Request, _res: Response, next: NextFunction) {
  next()
}

export async function pullRequest(req: Request, res: Response) {
  console.log('==================================')
  console.log(req.body)

  res.status(200).json()
}
