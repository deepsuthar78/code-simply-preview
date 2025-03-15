
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

export interface FileGenerationResult {
  files: GeneratedFile[];
  message: string;
}

export interface GeneratedFile {
  name: string;
  content: string;
  language: string;
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

    // Start a chat session - convert our message format to the one expected by the Gemini API
    // TypeScript needs explicit typing to ensure 'role' is one of "function", "user", or "model"
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }]
    }));
    
    const chat = model.startChat({
      history: history,
    });

    // If there's a system prompt, prepend it to the user message
    let userMessage = messages[messages.length - 1].content;
    if (systemPrompt && messages.length === 1) {
      const enhancedSystemPrompt = `${systemPrompt}
      
When I ask you to create code, please respond with a message followed by a clear list of files to create.
For each file, use the following format:

FILE: [filename].[extension]
\`\`\`[language]
// code content here
\`\`\`

For example, if I ask you to create a button component, respond with something like:
"I've created a button component for you. Here are the files:"

FILE: Button.tsx
\`\`\`tsx
import React from 'react';
// ... button component code
\`\`\`

FILE: Button.css
\`\`\`css
.button {
  // ... styles
}
\`\`\`

This will help me generate the files automatically.`;
      
      userMessage = `${enhancedSystemPrompt}\n\n${userMessage}`;
      console.log("Adding enhanced system prompt to first message");
    }

    console.log("Sending message to Gemini:", userMessage.substring(0, 100) + "...");

    // Send the message and get the response
    const result = await chat.sendMessage(userMessage);
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
  // First, try matching triple backtick code blocks with language specifier
  const codeBlockRegex = /```(?:jsx|tsx|javascript|js|typescript|ts)?\s*([\s\S]*?)```/g;
  const matches = [...response.matchAll(codeBlockRegex)];
  
  if (matches.length > 0) {
    // If multiple code blocks, concatenate them
    return matches.map(match => match[1].trim()).join('\n\n');
  }
  
  // If no matches with language specifier, try without language specifier
  const simpleCodeBlockRegex = /```([\s\S]*?)```/g;
  const simpleMatches = [...response.matchAll(simpleCodeBlockRegex)];
  
  if (simpleMatches.length > 0) {
    return simpleMatches.map(match => match[1].trim()).join('\n\n');
  }
  
  return null;
}

// Function to extract generated files from AI response
export function extractFilesFromAIResponse(response: string): FileGenerationResult {
  const files: GeneratedFile[] = [];
  let message = response;
  
  // Extract files with format: FILE: filename.ext
  const fileRegex = /FILE:\s*([^\n]+)\s*```([a-z]*)\s*([\s\S]*?)```/g;
  const matches = [...response.matchAll(fileRegex)];
  
  if (matches.length > 0) {
    // Extract message part (text before the first FILE: marker)
    const firstFileIndex = response.indexOf("FILE:");
    if (firstFileIndex > 0) {
      message = response.substring(0, firstFileIndex).trim();
    }
    
    // Process each file
    for (const match of matches) {
      const fileName = match[1].trim();
      const language = match[2] || getLanguageFromFileName(fileName);
      let content = match[3].trim();
      
      files.push({
        name: fileName,
        content,
        language
      });
    }
  }
  
  return {
    files,
    message
  };
}

// Helper function to determine language from file extension
function getLanguageFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'jsx':
    case 'tsx':
      return 'tsx';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return '';
  }
}
