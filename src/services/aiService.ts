
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequestOptions {
  messages: AIMessage[];
  systemPrompt?: string;
  apiKey: string;
}

export async function generateAIResponse(options: AIRequestOptions): Promise<string> {
  try {
    const { messages, systemPrompt, apiKey } = options;
    
    if (!apiKey) {
      throw new Error("API key is required. Please add your API key in the settings.");
    }

    console.log("Initializing Gemini API with key:", apiKey.substring(0, 5) + "...");
    
    // Initialize the Google Generative AI with the provided API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model (gemini-2.0-flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    // Start a chat session
    const chat = model.startChat();

    // Format the history from previous messages
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg.role === 'user') {
        await chat.sendMessage(msg.content);
      }
    }

    // If there's a system prompt, send it first
    if (systemPrompt) {
      console.log("Sending system prompt:", systemPrompt);
      const systemResult = await model.generateContent(`System: ${systemPrompt}`);
      console.log("System prompt response:", systemResult.response.text());
    }

    // Get the current user message (last one in the array)
    const currentMessage = messages[messages.length - 1];
    console.log("Sending message to Gemini:", currentMessage.content);

    // Send the message and get the response
    const result = await chat.sendMessage(currentMessage.content);
    const responseText = result.response.text();
    
    console.log("Received response from Gemini:", responseText.substring(0, 100) + "...");
    
    if (!responseText) {
      throw new Error("No response from AI");
    }

    return responseText;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

// Function to extract code from AI response
export function extractCodeFromAIResponse(response: string): string | null {
  // Look for code blocks with triple backticks
  const codeBlockRegex = /```(?:jsx|tsx|javascript|js|typescript|ts)?\s*([\s\S]*?)```/;
  const match = response.match(codeBlockRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return null;
}
