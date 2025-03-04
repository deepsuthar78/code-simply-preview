
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import ChatPanel from '@/components/ChatPanel';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const initialCode = `
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          UI
        </div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Create UI with Code</div>
        <p className="text-gray-500">Write code and see instant preview</p>
        <button className="mt-3 px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-600 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default MyComponent;
`;

const Index = () => {
  const { code, setCode, compiledCode, error } = useCodeState({ initialCode });
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat Panel */}
        <div className="w-[400px] border-r border-white/5 flex flex-col bg-background/95">
          <ChatPanel />
        </div>
        
        {/* Right Side - Preview/Code */}
        <div className="flex-1 flex flex-col">
          {/* Tabs for Preview/Code */}
          <div className="border-b border-white/5 flex">
            <Button
              variant="ghost"
              className={cn(
                "rounded-none border-b-2 px-4 py-2",
                activeTab === 'preview' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground"
              )}
              onClick={() => setActiveTab('preview')}
            >
              Preview
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "rounded-none border-b-2 px-4 py-2",
                activeTab === 'code' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground"
              )}
              onClick={() => setActiveTab('code')}
            >
              Code
            </Button>
          </div>
          
          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'preview' ? (
              <Preview code={compiledCode} error={error} className="h-full" />
            ) : (
              <Editor onCodeChange={handleCodeChange} initialCode={code} className="h-full" />
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-morphism border-t border-white/5 py-2 px-4 text-xs text-white/50 flex justify-between items-center">
        <div>
          <span>React • TypeScript • Tailwind CSS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse-subtle"></span>
            Live Preview
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
