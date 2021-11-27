import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

export const config = {
  port: process.env.PORT || 5000,
  slack: {
    port: 3000,
    token: process.env.SLACK_TOKEN || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
} as const
