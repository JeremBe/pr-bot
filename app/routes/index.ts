import express from 'express'

import { pullRequestController } from '@controllers/webhooks/pull-request'
import { reviewsController } from '@controllers/webhooks/reviews'
import { adminPullRequestControllerIndex } from '@controllers/admin/pull-request'
import { adminReviewsControllerIndex } from '@controllers/admin/reviews'
import { githubMiddleware } from '@middlewares/github'

const router = express.Router()

router.get('/ping', (_, res) => res.status(200).json())

// WEBHOOKS
router.post('/webhooks/pull-request', githubMiddleware, pullRequestController)
router.post('/webhooks/reviews', githubMiddleware, reviewsController)

// ADMIN ROUTES
router.get('/admin/pull-requests', adminPullRequestControllerIndex)
router.get('/admin/reviews', adminReviewsControllerIndex)

export default router
