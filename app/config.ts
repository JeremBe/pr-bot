export const config = {
  port: process.env.PORT || 5000,
  slack: {
    token: process.env.SLACK_TOKEN || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
} as const
