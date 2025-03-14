
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIMessage, generateAIResponse } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface AIContextType {
  messages: AIMessage[];
  isLoading: boolean;
  provider: string;
  model: string;
  systemPrompt: string;
  apiKey: string;
  sendMessage: (content: string) => Promise<string>;
  setProvider: (provider: string) => void;
  setModel: (model: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setApiKey: (key: string) => void;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string>('gemini');
  const [model, setModel] = useState<string>('gemini-2.0-flash');
  const [systemPrompt, setSystemPrompt] = useState<string>('You are a helpful AI assistant that helps users write code. Focus on providing clean, working solutions.');
  const [apiKey, setApiKey] = useState<string>("AIzaSyBJkYmMMmw21eECt9eM4_ePHyUI_9TDUFM");
  const { toast } = useToast();

  const sendMessage = async (content: string): Promise<string> => {
    try {
      // Add user message to the state
      const userMessage: AIMessage = { role: 'user', content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      console.log("Using API key:", apiKey.substring(0, 5) + "...");
      console.log("Using model:", model);
      
      // Call AI API with the API key from settings
      const aiResponse = await generateAIResponse({
        messages: updatedMessages,
        systemPrompt,
        apiKey
      });

      // Add AI response to the state
      const assistantMessage: AIMessage = { role: 'assistant', content: aiResponse };
      setMessages([...updatedMessages, assistantMessage]);
      
      return aiResponse;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get AI response';
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("AI Error:", error);
      return errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AIContext.Provider
      value={{
        messages,
        isLoading,
        provider,
        model,
        systemPrompt,
        apiKey,
        sendMessage,
        setProvider,
        setModel,
        setSystemPrompt,
        setApiKey,
        clearMessages,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
