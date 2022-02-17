import express from 'express'

import { githubMiddleware } from '@middlewares/github'
import { pullRequestController } from './pull-request'
import { reviewsController } from './reviews'

const router = express.Router()

router.post('/pull-request', githubMiddleware, pullRequestController)
router.post('/reviews', githubMiddleware, reviewsController)

export default router
