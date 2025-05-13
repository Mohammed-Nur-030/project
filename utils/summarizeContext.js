import { chatCompletion } from "./chatComplete";

// Import the required modules
const SummarizeContext = async (newMsg) => {
  const prompt = {
    role: 'system',
    content:
      'The task is to summarize the context of the conversation in one sentence or you can extend it if necessary. You can use the chat history and the new message as input. Try to get the most relevant details of the main topic and conversation and refine the summary with the current message if necessary',
  }

  let chathistory = [...newMsg, prompt];

  const result = await chatCompletion({
    model:'gpt-3.5-turbo',
    messages: chathistory,
  });

  console.log('result from ai', result)

  return result.content
};

export default SummarizeContext;
