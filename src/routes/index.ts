import express from "express";
import { middleWarePullRequest, pullRequest } from '@controllers/webhooks/pull-request'

const router = express.Router();

router.post("/webhooks/pull-request", middleWarePullRequest, pullRequest);

export default router;
