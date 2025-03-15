
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIMessage, generateAIResponse } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

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
  isApiConfigured: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string>('gemini');
  const [model, setModel] = useState<string>('gemini-2.0-flash');
  const [systemPrompt, setSystemPrompt] = useState<string>(`You are Lovable, an AI editor that creates and modifies web applications. You assist users by making changes to their code in real-time. You understand that users can see a live preview of their application.

You should create complete, well-structured files instead of code snippets. When asked to create a feature or component, generate all necessary files to implement it properly.

When creating code, always use React with TypeScript, Tailwind CSS for styling, and follow modern best practices. Break down complex components into smaller, reusable parts.

When fixing issues, explain the problem clearly and provide the complete corrected files.

Make sure your response is structured with a clear explanation followed by the complete files needed.`);
  
  // Check localStorage first, then use default
  const [apiKey, setApiKey] = useState<string>(() => {
    const savedKey = localStorage.getItem('ai_api_key');
    return savedKey || "AIzaSyBJkYmMMmw21eECt9eM4_ePHyUI_9TDUFM";
  });
  
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(true);
  const [showApiDialog, setShowApiDialog] = useState<boolean>(false);
  const { toast } = useToast();

  // Save API key to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ai_api_key', apiKey);
    setIsApiConfigured(!!apiKey && apiKey.length > 10);
  }, [apiKey]);

  // Check if API is configured on initial load
  useEffect(() => {
    const hasApiKey = !!apiKey && apiKey.length > 10;
    setIsApiConfigured(hasApiKey);
    
    // Show dialog if API key is not configured
    if (!hasApiKey) {
      setShowApiDialog(true);
    }
  }, []);

  const sendMessage = async (content: string): Promise<string> => {
    try {
      // Check if API key is configured
      if (!apiKey || apiKey.length < 10) {
        setShowApiDialog(true);
        throw new Error("API key is not configured. Please add your API key in the settings.");
      }

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
        isApiConfigured,
      }}
    >
      {children}
      
      {/* API Configuration Dialog */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Key Required
            </DialogTitle>
            <DialogDescription>
              Please configure your AI provider API key to use the chat functionality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-sm text-muted-foreground">
            <p>You can get your Gemini API key from the Google AI Studio website.</p>
            <p className="mt-2">Once you have your API key, go to Settings and add it in the API Key tab.</p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApiDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                // Simulate clicking the settings button
                const settingsButton = document.querySelector('[data-settings-trigger="true"]') as HTMLButtonElement;
                if (settingsButton) {
                  settingsButton.click();
                }
                setShowApiDialog(false);
              }}
            >
              Open Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
