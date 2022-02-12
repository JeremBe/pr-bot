import { WebClient } from '@slack/web-api'

import { config } from '@config'

let webClient: WebClient

export function getWebClient() {
  if (!webClient) {
    webClient = new WebClient(config.slack.token)
  }

  return webClient
}
