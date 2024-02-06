import OpenAI from 'openai'
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
})

export async function chatCompletion({
  model = 'gpt-3.5-turbo-0125',
  max_tokens = 2048,
  temperature = 0,
  messages,
  tools,
  tool_choice, // auto is default, but we'll be explicit
}) {
  try {
    const result = await openai.chat.completions.create({
      messages,
      model: model,
      max_tokens,
      temperature,
      tools: tools,
      tool_choice: tool_choice,
    })

    if (!result.choices[0].message) {
      throw new Error('No return error from chat')
    }

    console.log('result from ai', result.choices[0].message)
    return result.choices[0].message.content
      ? {
          content: result.choices[0].message.content,
          functionsContent: null,
        }
      : {
          content: '',
          functionsContent: result.choices[0].message.tool_calls,
        }
  } catch (error) {
    console.log('error from ai', error)
    throw error
  }
}
