import express from 'express'
import { middleWarePullRequest, pullRequest } from '@controllers/webhooks/pull-request'
import { middleWareReviews, reviews } from '@controllers/webhooks/reviews'

const router = express.Router()

router.post('/webhooks/pull-request', middleWarePullRequest, pullRequest)
router.post('/webhooks/reviews', middleWareReviews, reviews)

export default router
