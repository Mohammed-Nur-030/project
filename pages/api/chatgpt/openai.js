import Message from '../../../models/Message'
import Conversation from '../../../models/Conversation'
import db from '../../../utils/db'
import { chatCompletion } from '../../../utils/chatComplete'
import SummarizeContext from '../../../utils/summarizeContext'
import fetchBabyProducts from '../../../utils/fetch_shopify'
import { functionsList } from '../../../utils/functionsList'

let system = `you are an intelligent chatbot`

let model = ''

export const config = {
  maxDuration: 300,
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(200).end()
    return
  }
  const { conversationId, textInput } = req.body.input

  await db.connect()
  let conversation
  let UpdatedConvo
  let inputMessages = []

  try {
    if (conversationId.length < 5) {
      conversation = new Conversation({
        title: 'New Chat',
      })
      await conversation.save()

      inputMessages.push({ role: 'system', content: system })
    } else {
      inputMessages.push({ role: 'system', content: system })
      conversation = await Conversation.findOne({ _id: conversationId })
      if (conversation) {
        console.log('Inside if')
        const messages = await Message.find({
          conversationId: conversation._id,
        })

        UpdatedConvo = await Conversation.findByIdAndUpdate(
          { _id: conversationId },
          {
            $addToSet: {
              messages: { $each: messages },
            },
          },
          { new: true }
        ).populate('messages')
      }

      const prevMessages = UpdatedConvo?.messages?.map((message) => ({
        role: message.isCreatedByUser ? 'user' : 'system',
        content: message.text,
      }))
      inputMessages = [...inputMessages, ...prevMessages]
    }

    let result = {}
    inputMessages?.push({ role: 'user', content: textInput })
    const currentMessage = [
      {
        role: 'user',
        content: textInput,
      },
    ]
    console.log("****************************************************")
    console.log("InputMessages:", inputMessages)
    console.log("****************************************************")
    try {
      result = await chatCompletion({
        messages: inputMessages,
        temperature: 0.7,
        tools: functionsList,
        model,
        tool_choice: 'auto',
      });
      console.log("result --:", result); // This should execute after chatCompletion finishes
    } catch (error) {
      console.log(error);
    }
    
  
  

 
    const userMessage = {
      conversationId: conversation._id,
      model,
      text: textInput,
      isCreatedByUser: true,
    }

    await new Message(userMessage).save()

    const systemMessage = {
      conversationId: conversation._id,
      model,
      text: result.content?.length > 0 ? result.content : 'fetchBabyProducts',
      isCreatedByUser: false,
    }

    const summary = await SummarizeContext(currentMessage)

    await new Message(systemMessage).save()

    await db.disconnect()
    return res.status(200).json({
      result: result,
      summary: summary,
      convoId: conversation?._id,
      currentMsg: currentMessage,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
