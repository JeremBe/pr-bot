import express from 'express'

import { slackEvents } from './events'
import CommandsRouter from './commands/router'

const router = express.Router()

// COMMANDS
router.use('/commands', CommandsRouter)

// EVENTS
router.use(
  '/events',
  // (req, res) => { // challenge event request
  //   res.status(200).json({ challenge: req.body.challenge })
  // },
  slackEvents.requestListener(),
)

export default router
