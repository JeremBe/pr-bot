import { config } from '@config'

import express from 'express'
import { createEventAdapter } from '@slack/events-api'
import { createMessageAdapter } from '@slack/interactive-messages'
import { WebClient } from '@slack/web-api'

const slackEvents = createEventAdapter(config.slack.signingSecret)
const slackInteractions = createMessageAdapter(config.slack.signingSecret)

const webClient = new WebClient(config.slack.token)

const router = express.Router()

router.use(async (req: any, __, next) => {
  console.log(req.body)
  next()
})

router.use('/events', slackEvents.expressMiddleware())
router.use('/actions', slackInteractions.expressMiddleware())

slackEvents.on('app_mention', async (event) => {
  try {
    const mentionResponseBlock = { ...messageJsonBlock, ...{ channel: event.channel } }
    console.log(mentionResponseBlock)
    const res = await webClient.chat.postMessage(mentionResponseBlock)
    console.log('Message sent: ', res.ts)
  } catch (e) {
    console.log(JSON.stringify(e))
  }
})

slackInteractions.action({ actionId: 'open_modal_button' }, async (payload: any) => {
  try {
    await webClient.views.open({
      trigger_id: payload.trigger_id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      view: modalJsonBlock,
    })
    return
  } catch (e) {
    return {
      text: 'Processing...',
    }
  }
})

slackInteractions.viewSubmission('cute_animal_modal_submit', async (payload) => {
  const blockData = payload.view.state

  const cuteAnimalSelection =
    blockData.values.cute_animal_selection_block.cute_animal_selection_element.selected_option.value
  const nameInput = blockData.values.cute_animal_name_block.cute_animal_name_element.value

  console.log(cuteAnimalSelection, nameInput)

  if (nameInput.length < 2) {
    return {
      response_action: 'errors',
      errors: {
        cute_animal_name_block: 'Cute animal names must have more than one letter.',
      },
    }
  }
  return {
    response_action: 'clear',
  }
})

router.use('/commands', async (req, res) => {
  console.log('commands', req.body)
  res.status(200).json()
  try {
    const mentionResponseBlock = { ...messageJsonBlock, ...{ channel: req.body.channel_id } }
    console.log(mentionResponseBlock)
    const res = await webClient.chat.postMessage(mentionResponseBlock)
    console.log('Message sent: ', res.ts)
  } catch (e) {
    console.log(JSON.stringify(e))
  }
})

export default router

const messageJsonBlock = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Hello, thanks for calling me. Would you like to launch a modal?',
      },
      accessory: {
        type: 'button',
        action_id: 'open_modal_button', // We need to add this
        text: {
          type: 'plain_text',
          text: 'Launch',
          emoji: true,
        },
        value: 'launch_button_click',
      },
    },
  ],
}

const modalJsonBlock = {
  type: 'modal',
  callback_id: 'cute_animal_modal_submit', // We need to add this
  title: {
    type: 'plain_text',
    text: 'My App',
    emoji: true,
  },
  submit: {
    type: 'plain_text',
    text: 'Done',
    emoji: true,
  },
  close: {
    type: 'plain_text',
    text: 'Cancel',
    emoji: true,
  },
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Thanks for openeing this modal!',
      },
    },
    {
      type: 'input',
      block_id: 'cute_animal_selection_block', // put this here to identify the selection block
      element: {
        type: 'static_select',
        action_id: 'cute_animal_selection_element', // put this here to identify the selection element
        placeholder: {
          type: 'plain_text',
          text: 'Select a cute animal',
          emoji: true,
        },
        options: [
          {
            text: {
              type: 'plain_text',
              text: 'Puppy',
              emoji: true,
            },
            value: 'puppy',
          },
          {
            text: {
              type: 'plain_text',
              text: 'Kitten',
              emoji: true,
            },
            value: 'kitten',
          },
          {
            text: {
              type: 'plain_text',
              text: 'Bunny',
              emoji: true,
            },
            value: 'bunny',
          },
        ],
      },
      label: {
        type: 'plain_text',
        text: 'Choose a cute pet:',
        emoji: true,
      },
    },
    {
      type: 'input',
      block_id: 'cute_animal_name_block', // put this here to identify the input.
      element: {
        type: 'plain_text_input',
        action_id: 'cute_animal_name_element', // put this here to identify the selection element
      },
      label: {
        type: 'plain_text',
        text: 'Give it a cute name:',
        emoji: true,
      },
    },
  ],
}
