import express from 'express'

import { pullRequestController } from '@controllers/webhooks/pull-request'
import { reviewsController } from '@controllers/webhooks/reviews'
import { adminPullRequestControllerIndex } from '@controllers/admin/pull-request'
import { adminReviewsControllerIndex } from '@controllers/admin/reviews'
import { githubMiddleware } from '@middlewares/github'
import { slackEvents } from '@controllers/slack/events'
import { prBot } from '@controllers/slack/commands/pr-bot'
import { subscribe } from '@controllers/slack/commands/subscribe'
import { pr } from '@controllers/slack/commands/pr'
import { nickname } from '@controllers/slack/commands/nickname'
import { authorId } from '@controllers/slack/commands/authorId'

const router = express.Router()

router.get('/ping', (_, res) => res.status(200).json())

// SLACK ROUTES
router.use(
  '/slack/events',
  // (req, res) => { // challenge event request
  //   res.status(200).json({ challenge: req.body.challenge })
  // },
  slackEvents.requestListener(),
)
router.post('/slack/commands/pr-bot', prBot)
router.post('/slack/commands/subscribe', subscribe)
router.post('/slack/commands/pr', pr)
router.post('/slack/commands/author', authorId)
router.post('/slack/commands/nickname', nickname)

// WEBHOOKS
router.post('/webhooks/pull-request', githubMiddleware, pullRequestController)
router.post('/webhooks/reviews', githubMiddleware, reviewsController)

// ADMIN ROUTES
router.get('/admin/pull-requests', adminPullRequestControllerIndex)
router.get('/admin/reviews', adminReviewsControllerIndex)

export default router
