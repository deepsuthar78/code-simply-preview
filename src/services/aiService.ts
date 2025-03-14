
import { useToast } from "@/hooks/use-toast";

// API key is used for Gemini API
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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
    
    // Format messages for Gemini API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));
    
    // Add system prompt if provided
    if (systemPrompt) {
      formattedMessages.unshift({
        role: 'user',
        parts: [{ text: `System: ${systemPrompt}` }]
      });
    }

    console.log("Sending request to Gemini API with key:", apiKey.substring(0, 5) + "...");
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("AI API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get AI response");
    }

    const data = await response.json();
    console.log("Gemini API Response:", data);
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    return aiResponse;
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
