
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, History, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';
import { useToast } from '@/hooks/use-toast';
import { useCodeState } from '@/hooks/useCodeState';
import { extractCodeFromAIResponse } from '@/services/aiService';

const ChatPanel: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useAI();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setCode } = useCodeState();
  const { toast } = useToast();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userInput = input;
    setInput('');
    
    try {
      // Send message to AI and get response
      const response = await sendMessage(userInput);
      
      // Check if response contains code and update the editor if it does
      const extractedCode = extractCodeFromAIResponse(response);
      if (extractedCode) {
        setCode(extractedCode);
        
        toast({
          title: "Code Generated",
          description: "The generated code has been applied to the editor.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Tabs */}
      <div className="border-b border-white/10 flex backdrop-blur-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 flex-1 px-4 py-2 transition-all duration-200",
            activeTab === 'chat' 
              ? "border-black text-white" 
              : "border-transparent text-muted-foreground"
          )}
          onClick={() => setActiveTab('chat')}
        >
          <Bot size={16} className="mr-2" />
          Chat
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 flex-1 px-4 py-2 transition-all duration-200",
            activeTab === 'history' 
              ? "border-black text-white" 
              : "border-transparent text-muted-foreground"
          )}
          onClick={() => setActiveTab('history')}
        >
          <History size={16} className="mr-2" />
          History
        </Button>
      </div>
      
      {activeTab === 'chat' ? (
        <>
          {/* Chat content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-black/20">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bot size={32} className="mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white/80 mb-2">How can I help you today?</h3>
                <p className="text-sm text-white/50 mb-6">Ask me to write code or help with your project</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 transition-all duration-200 animate-fade-in",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex-none h-8 w-8 rounded-full flex items-center justify-center",
                  message.role === 'user' ? "order-2 bg-black/20" : "bg-secondary/50"
                )}>
                  {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[85%] glass-morphism shadow-md",
                    message.role === 'user' 
                      ? "bg-black/10 text-white border-black/20" 
                      : "bg-secondary/30 text-secondary-foreground border-secondary/30"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="flex-none h-8 w-8 rounded-full flex items-center justify-center bg-secondary/50">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-lg glass-morphism bg-secondary/30 border-secondary/30 shadow-md">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-white/50 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t border-white/10 backdrop-blur-sm">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={clearMessages}
                title="Clear conversation"
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                <Trash size={16} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Generate code or ask for help..."
                className="bg-secondary/30 border-white/10 focus-visible:ring-black/20 placeholder:text-white/30 transition-all duration-200"
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={input.trim() === '' || isLoading}
                className="bg-black/20 hover:bg-black/30 text-white transition-all duration-200"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 p-4 flex flex-col items-center justify-center text-muted-foreground">
          <History size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white/80 mb-2">Chat History</h3>
          <p className="text-sm text-white/50 text-center max-w-xs mb-4">
            Your previous conversations will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
