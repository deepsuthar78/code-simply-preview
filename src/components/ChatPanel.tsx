import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, History, Trash, AlertCircle, FileCode, Code, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI } from '@/contexts/AIContext';
import { useToast } from '@/hooks/use-toast';
import { useCodeState } from '@/hooks/useCodeState';
import { 
  extractCodeFromAIResponse, 
  extractFilesFromAIResponse, 
  GeneratedFile 
} from '@/services/aiService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ChatPanel: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages, isApiConfigured } = useAI();
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setCode, addFile, setActiveFile } = useCodeState();
  const { toast } = useToast();
  const [showApiDialog, setShowApiDialog] = useState(!isApiConfigured);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [showFilesDialog, setShowFilesDialog] = useState(false);
  
  // Check if API is configured
  useEffect(() => {
    setShowApiDialog(!isApiConfigured);
  }, [isApiConfigured]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    if (!isApiConfigured) {
      setShowApiDialog(true);
      return;
    }
    
    const userInput = input;
    setInput('');
    
    try {
      // Send message to AI and get response
      const response = await sendMessage(userInput);
      
      // Process the response for files
      const { files, message } = extractFilesFromAIResponse(response);
      
      if (files.length > 0) {
        // Save generated files
        setGeneratedFiles(files);
        setShowFilesDialog(true);
        
        // Apply files automatically
        handleUseFiles();
        
        toast({
          title: "Files Generated",
          description: `${files.length} file(s) have been created and applied.`,
          duration: 3000,
        });
      } else {
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
  
  const handleUseFiles = () => {
    // Apply the first file to the main editor
    if (generatedFiles.length > 0) {
      setCode(generatedFiles[0].content);
      
      // Add all files to the file system
      generatedFiles.forEach((file, index) => {
        addFile({
          id: `generated-${Date.now()}-${index}`,
          name: file.name,
          content: file.content,
          language: file.language
        });
      });
      
      setShowFilesDialog(false);
      
      // Set active file to the first one
      setActiveFile(`generated-${Date.now()}-0`);
    }
  };

  // Render collapsible code panel if the message contains code markers
  const renderMessage = (content: string, index: number) => {
    // Check if the content contains a code block
    if (content.includes('```')) {
      const hasFix = content.toLowerCase().includes('fix:') || 
                    content.toLowerCase().includes('fixed') || 
                    content.toLowerCase().includes('fixing');
      
      // Separate message into parts before code block, code block, and after code block
      const parts = content.split(/(```[a-z]*\n[\s\S]*?```)/g);
      
      return (
        <div className="space-y-2">
          {parts.map((part, partIndex) => {
            if (part.match(/```[a-z]*\n[\s\S]*?```/)) {
              // This is a code block
              const codeContent = part.replace(/```[a-z]*\n|```$/g, '');
              const language = (part.match(/```([a-z]*)\n/) || [])[1] || 'text';
              
              return (
                <Collapsible key={`${index}-${partIndex}`} className="border border-white/10 rounded-md overflow-hidden">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 bg-white/5 hover:bg-white/10 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <Code size={14} className="text-muted-foreground" />
                      <span>{hasFix ? `Fix: TypeScript error in ${language} component` : `Generated ${language} code`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        View code
                      </Button>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-black/30 p-3 overflow-x-auto">
                      <pre className="text-xs text-white/90 font-mono">
                        {codeContent}
                      </pre>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            } else if (part.trim()) {
              // This is regular text
              return <p key={`${index}-${partIndex}`} className="text-sm leading-relaxed whitespace-pre-line">{part}</p>;
            }
            return null;
          })}
        </div>
      );
    } else {
      // Regular message without code blocks
      return <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden">
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
          {/* API not configured warning */}
          {!isApiConfigured && (
            <div className="m-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-yellow-300 text-sm flex items-center gap-2 animate-pulse-subtle">
              <AlertCircle size={16} />
              <span>API key not configured. Please check settings.</span>
            </div>
          )}
          
          {/* Chat content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-black/20">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Bot size={32} className="mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-white/80 mb-2">How can I help you today?</h3>
                <p className="text-sm text-white/50 mb-6">Ask me to write code or create components for your project</p>
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
                  {message.role === 'user' 
                    ? <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    : renderMessage(message.content, index)}
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
                placeholder={isApiConfigured 
                  ? "Ask me to create components, pages, or features..." 
                  : "Configure API key in settings first"}
                className="bg-secondary/30 border-white/10 focus-visible:ring-black/20 placeholder:text-white/30 transition-all duration-200"
                disabled={!isApiConfigured || isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSend}
                disabled={input.trim() === '' || isLoading || !isApiConfigured}
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
      
      {/* API Configuration Dialog */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              API Key Required
            </DialogTitle>
            <DialogDescription>
              Please configure your AI provider API key to use the chat functionality.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-sm text-muted-foreground">
            <p>You need to add your Gemini API key to use the AI features.</p>
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
      
      {/* Generated Files Dialog */}
      <Dialog open={showFilesDialog} onOpenChange={setShowFilesDialog}>
        <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileCode className="h-5 w-5 text-blue-500" />
              Generated Files
            </DialogTitle>
            <DialogDescription>
              The AI has generated the following files for your project.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] mt-4 rounded-md border border-white/10 bg-black/20">
            <div className="p-4 space-y-4">
              {generatedFiles.map((file, index) => (
                <div key={index} className="glass-morphism p-3 rounded-lg">
                  <h4 className="font-medium text-white mb-2 flex items-center">
                    <FileCode size={16} className="mr-2 text-blue-400" />
                    {file.name}
                  </h4>
                  <div className="bg-black/30 p-2 rounded-md font-mono text-xs text-white/70 overflow-x-auto">
                    <pre>{file.content.substring(0, 100)}{file.content.length > 100 ? '...' : ''}</pre>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilesDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={handleUseFiles}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Files
            </Button>
            <Button
              className="flex items-center gap-2"
              variant="outline"
              onClick={() => {
                setActiveTab('code');
                setShowFilesDialog(false);
              }}
            >
              <Code size={14} />
              <span>View in editor</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatPanel;
