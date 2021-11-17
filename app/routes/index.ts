import express from 'express'
import { pullRequestController } from '@controllers/webhooks/pull-request'
import { middleWareReviews, reviews } from '@controllers/webhooks/reviews'
import { adminPullRequestControllerIndex } from '@controllers/admin/pull-request'

const router = express.Router()

router.get('/ping', (_, res) => res.status(200).json())
router.post('/webhooks/pull-request', pullRequestController)
router.post('/webhooks/reviews', middleWareReviews, reviews)
router.get('/admin/pull-requests', adminPullRequestControllerIndex)

export default router
