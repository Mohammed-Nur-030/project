import { chatCompletion } from "./chatComplete";

// Import the required modules
const SummarizeContext = async (newMsg) => {
  const prompt = {
    role: 'system',
    content:
      'کام ایک جملے میں گفتگو کے سیاق و سباق کا خلاصہ کرنا ہے یا اگر ضروری ہو تو آپ اسے بڑھا سکتے ہیں۔ آپ چیٹ کی سرگزشت اور نئے پیغام کو بطور ان پٹ استعمال کر سکتے ہیں۔ اہم موضوع اور گفتگو کی سب سے متعلقہ تفصیلات کو حاصل کرنے کی کوشش کریں اور اگر ضروری ہو تو موجودہ پیغام کے ساتھ خلاصہ کو بہتر بنائیں ',
  }

  let chathistory = [...newMsg, prompt];

  const result = await chatCompletion({
    model:'gpt-3',
    messages: chathistory,
  });

  console.log('result from ai', result)

  return result.content
};

export default SummarizeContext;
