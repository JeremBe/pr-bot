import express from 'express'

import { authorId } from './authorId'
import { nickname } from './nickname'
import { pr } from './pr'
import { prBot } from './pr-bot'
import { subscribe } from './subscribe'

const router = express.Router()

router.post('/pr-bot', prBot)
router.post('/subscribe', subscribe)
router.post('/pr', pr)
router.post('/author', authorId)
router.post('/nickname', nickname)

export default router