
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: input, isUser: true }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: "I've processed your request. You can see the updated preview on the right side panel.",
          isUser: false 
        }
      ]);
    }, 1000);
    
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="border-b border-white/5 flex">
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 flex-1 px-4 py-2",
            activeTab === 'chat' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground"
          )}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "rounded-none border-b-2 flex-1 px-4 py-2",
            activeTab === 'history' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground"
          )}
          onClick={() => setActiveTab('history')}
        >
          History
        </Button>
      </div>
      
      {/* Chat content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg max-w-[90%]",
              message.isUser 
                ? "bg-primary/10 ml-auto" 
                : "bg-secondary/30 mr-auto"
            )}
          >
            <p className="text-sm">{message.text}</p>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="bg-secondary/30"
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={input.trim() === ''}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
