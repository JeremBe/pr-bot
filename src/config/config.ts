import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

export interface Slack {
  token: string | undefined
  signingSecret: string | undefined
}

export interface Config {
  name: string
  slack: Slack
}

export const config: Config = {
  name: 'pr-bot',
  slack: {
    token: process.env.SLACK_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  },
}
