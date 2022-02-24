import express from 'express'

import { authorId } from './authorId'
import { nickname } from './nickname'
import { pr } from './pr'
import { prBot } from './pr-bot'
import { reviews } from './reviews'
import { subscribe } from './subscribe'
import { unsubscribe } from './unsubscribe'

const router = express.Router()

router.post('/pr-bot', prBot)
router.post('/subscribe', subscribe)
router.post('/unsubscribe', unsubscribe)
router.post('/pr', pr)
router.post('/reviews', reviews)
router.post('/author', authorId)
router.post('/nickname', nickname)

export default router
