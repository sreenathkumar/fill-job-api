import Groq from "groq-sdk";
import dbDataMap from "@utils/dbDataMap.json";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//=======================================================
// Chatbot AI
//=======================================================
export async function getGroqChatCompletion(
  aiCommand: string
) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "JSON",
      },
      {
        role: "user",
        content: aiCommand,
      },
    ],
    model: "llama3-70b-8192",
    temperature: 1,
    max_tokens: 8192,
    top_p: 1,
    stream: false,
    response_format: {
      type: "json_object",
    },
    stop: null,
  });
}
