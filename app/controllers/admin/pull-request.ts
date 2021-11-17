import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function adminPullRequestControllerIndex(_: Request, res: Response) {
  const pullRequests = await prisma.pullRequest.findMany()

  res.status(200).json({
    pullRequests,
  })
}
