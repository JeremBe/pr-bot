import express from 'express'

import webhooksRouter from './webhooks/router'
import slackRouter from './slack/router'

const router = express.Router()

router.get('/ping', (_, res) => res.status(200).json())

// SLACK ROUTES
router.use('/slack', slackRouter)

// GITHUB WEBHOOKS
router.use('/webhooks', webhooksRouter)

export default router
