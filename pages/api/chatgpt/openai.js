import Message from '../../../models/Message'
import Conversation from '../../../models/Conversation'
import db from '../../../utils/db'
import { chatCompletion } from '../../../utils/chatComplete'
import SummarizeContext from '../../../utils/summarizeContext'
import fetchBabyProducts from '../../../utils/fetch_shopify'
import { functionsList } from '../../../utils/functionsList'

let system = `آپ کی کردار نانی کے طور پر عمل کرنا ہے اور آپ مندرجہ ذیل کام کر سکتی ہیں 
--------
زرویات کی دیکھ بھال: بچے کی زرویات کا خیال رکھنے میں میری مدد کر سکتی ہوں
کرامد مشورے: آپ کو مختلف مسائل کے حل کے لئے مشورے دے سکتی ہوں۔
مسائل کا حل: آپ کے مسائل کا حل دے سکتی ہوں اور تما م آشیاء کی مدد بھی کر سکتی ہوں۔
طبی معلومات: بچوں کے صحتی مسائل کے بارے میں آپ کو راہنمائی دے سکتی ہوں۔
کھانے کی ترتیبات: بچے کی عمر کے مطابق غذائیں منتخب کرنے میں مدد کر سکتی ہوں۔
بچے کے کھیلونے: بچے کے لئے مناسب کھیلونے کی مدد کر سکتی ہوں۔
نیند کی راحت: بچے کی بہتر نیند کے لئے مدد کر سکتی ہوں۔
تندرستی کا خیال: بچے کے لئے صحت مند ماحول کی رہنمائی کر سکتی ہوں۔
تعلیمی کہانیاں: بچوں کے لئے اخلاقی کہانیاں فراہم کر سکتی ہوں۔
دینی رہنمائی: بچوں کو اخلاقی اور دینی تعلیم دینے میں مدد کر سکتی ہوں۔
ویکسینیشن کی یاد دلائی: بچے کی ویکسینیشن کی تاریخ کی یاد دلانے میں مدد کر سکتی ہوں۔
حفاظتی تدابیر: بچے کی حفاظت کے لئے اہم تدابیر کی رہنمائی کر سکتی ہوں۔
لباس کی مدد: بچے کے لباسوں کی ترتیبات کی رہنمائی کر سکتی ہوں۔ 

"اہم نوٹ" : جواب دیتے وقت محتاط رہیں اگر ضرورت ہو تو بچے کی عمر یا دیگر خصوصیات بھی پوچھیں

-------

"" نوٹ: آپ کو صرف مختصر جوابات فراہم کرنا چاہ that جو 20 الفاظ سے کم ہو ، سختی سے اس سے بالاتر نہ ہوں ""

`

let model = 'gpt-4-0613'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle preflight request
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
      // let addMsg = ``
      // convoSummary += addMsg
    } else {
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

      inputMessages = UpdatedConvo?.messages?.map((message) => ({
        role: message.isCreatedByUser ? 'user' : 'assistant',
        content: message.text.length ? message.text : '',
      }))
    }

    let result = {}
    inputMessages?.push({ role: 'user', content: textInput })
    const currentMessage = [
      {
        role: 'user',
        content: textInput,
      },
    ]

    try {
      result = await chatCompletion({
        messages: inputMessages,
        temperature: 0.7,
        tools: functionsList,
        model,
        tool_choice: 'auto',
      })
    } catch (error) {
      console.log(error)
    }

    let finalMessage = {
      role: 'system',
      content: result?.content,
    }

    if (result.functionsContent) {
      console.log('functions calls')
      console.log('finalMessage', result.functionsContent[0])

      for (let tool of result.functionsContent) {
        if (tool.function.name === 'fetchBabyProducts') {
          console.log('result funcs', tool)
          let funcName = tool.function.name
          console.log('tool', funcName)
          let funcarguments = JSON.parse(tool.function.arguments)
          let productType = funcarguments.productType
          console.log('productType 1', productType)
          if (funcName === 'fetchBabyProducts') {
            try {
              console.log('productType', productType)
              let funcResult = await fetchBabyProducts(productType)
              funcResult = funcarguments.limit
                ? funcResult.slice(0, funcarguments.limit)
                : funcResult.slice(0, 3)
              finalMessage = {
                role: 'system',
                funcResult: funcResult,
                content: '',
              }
            } catch (error) {
              console.log('error from fetchProducts', error)
              finalMessage = {
                role: 'system',
                funcResult: [
                  {
                    title: '',
                    image: '',
                  },
                ],
                content: '',
              }
            }
          }
        }
      }
    }

    currentMessage.push(finalMessage)

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

    // const summary = await SummarizeContext(currentMessage)
    const summary = ''

    // Save the systemMessage as a document in the Message schema
    await new Message(systemMessage).save()

    // Send the result as the response
    await db.disconnect()
    return res.status(200).json({
      result: finalMessage,
      summary: summary,
      convoId: conversation?._id,
      currentMsg: currentMessage,
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error })
  }
}
