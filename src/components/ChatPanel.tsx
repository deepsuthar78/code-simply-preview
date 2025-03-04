
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, History, PlusCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      isUser: false,
      text: "I've created a modern dark UI code editor with a live preview panel, inspired by Lovable's interface but with its own identity. The design features a sleek dark theme with glass-morphism effects and smooth animations."
    }
  ]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: input, isUser: true }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { 
          text: "I've processed your request. You can see the updated preview on the right side panel.",
          isUser: false 
        }
      ]);
      
      // Show toast notification
      toast({
        title: "Code Updated",
        description: "Your changes have been applied to the preview.",
        duration: 3000,
      });
    }, 1500);
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleNewChat = () => {
    setMessages([{
      isUser: false,
      text: "Started a new conversation. How can I help with your code today?"
    }]);
    toast({
      title: "New Chat Started",
      description: "Previous conversation has been saved to history.",
    });
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
              ? "border-primary text-primary" 
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
              ? "border-primary text-primary" 
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
          {/* New chat button */}
          <div className="p-2 border-b border-white/5">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs justify-start bg-white/5 hover:bg-white/10 border-white/10"
              onClick={handleNewChat}
            >
              <PlusCircle size={14} className="mr-2" />
              New Chat
            </Button>
          </div>
      
          {/* Chat content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-black/20">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 transition-all duration-200 animate-fade-in",
                  message.isUser ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex-none h-8 w-8 rounded-full flex items-center justify-center",
                  message.isUser ? "order-2 bg-primary/20" : "bg-secondary/50"
                )}>
                  {message.isUser ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-lg max-w-[85%] glass-morphism shadow-md",
                    message.isUser 
                      ? "bg-primary/10 text-primary border-primary/20" 
                      : "bg-secondary/30 text-secondary-foreground border-secondary/30"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
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
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="bg-secondary/30 border-white/10 focus-visible:ring-primary/20 placeholder:text-white/30 transition-all duration-200"
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={input.trim() === ''}
                className="bg-primary/20 hover:bg-primary/30 text-primary transition-all duration-200"
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
          <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/10">
            Start New Chat <ArrowRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
