import OpenAI from 'openai';
import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key. Set it in your .env file.");
}

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: "AIzaSyC1s3W9XHZip5cbIQWGh3PoKn2lbz0vMDc" });
console.log("Going inside Gemini...");

// Function to handle chat completion
export async function chatCompletion({
  model = 'gpt-3.5-turbo',
  max_tokens = 2048,
  temperature = 0,
  messages,
}) {
  try {
    console.log("Entering chatCompletion...");
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid 'messages' format.");
    }

    const msg = messages.at(-1).content;
    console.log("Message content:", msg);

    let resultText = null;
    let attempts = 3; // Retry up to 3 times if an error occurs

    try {
        console.log("Sending request to Gemini...");
        const result = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: JSON.stringify(msg),
        });

        console.log("Gemini response:", result.text);
        resultText = result.text;
      } catch (error) {
        console.error("Gemini API Error:", error);
        attempts--;
        if (attempts === 0) throw error; // If all attempts fail, throw error
      }
    

    console.log("Returning from chatCompletion...");
    return { content: resultText };  // ✅ Return an object, not a string
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    throw error;  // Ensure the error propagates to the parent function
  }
}
