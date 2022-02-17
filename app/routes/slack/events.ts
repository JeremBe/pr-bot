import { createEventAdapter } from '@slack/events-api'

import { config } from '@config'
import { getWebClient } from '@services/slack/slack'

const webClient = getWebClient()

export const slackEvents = createEventAdapter(config.slack.signingSecret)

slackEvents.on('app_mention', async (event) => {
  console.log('[app/controllers/slack/events.ts#app_mention] Event', { event })
  try {
    const mentionResponseBlock = { ...messageJsonBlock, channel: event.channel }
    await webClient.chat.postMessage(mentionResponseBlock)
  } catch (error) {
    console.log('[app/controllers/slack/events.ts#app_mention] Error', { error })
  }
})

const messageJsonBlock = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Hello, thanks for calling me 🎉',
      },
    },
  ],
}
