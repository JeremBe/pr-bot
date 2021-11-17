import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function adminReviewsControllerIndex(_: Request, res: Response) {
  const reviews = await prisma.reviewer.findMany()

  res.status(200).json({
    reviews,
  })
}
