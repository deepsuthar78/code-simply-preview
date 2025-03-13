
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import ChatPanel from '@/components/ChatPanel';
import FileTreeSidebar, { FileItem } from '@/components/FileTreeSidebar';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Code, Eye, FolderTree } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const initialCode = `
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
          UI
        </div>
      </div>
      <div>
        <div className="text-xl font-medium">Create UI with Code</div>
        <p className="text-gray-400">Write code and see instant preview</p>
        <button className="mt-3 px-4 py-1 text-sm text-white font-semibold rounded-full border border-white hover:bg-white hover:text-black hover:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors">
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
  const [showFileSidebar, setShowFileSidebar] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>(undefined);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFileId(file.id);
      // In a real app, we would load the file content here
      console.log(`Selected file: ${file.name}`);
    }
  };

  const toggleFileSidebar = () => {
    setShowFileSidebar(!showFileSidebar);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-background/90 overflow-hidden">
      <Navbar />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Side - Chat Panel */}
          <ResizablePanel 
            defaultSize={30} 
            minSize={20} 
            maxSize={50}
            className="border-r border-white/10 glass-morphism bg-background/95"
          >
            <ChatPanel />
          </ResizablePanel>
          
          {/* Resize handle with permanent arrow */}
          <ResizableHandle 
            className="resize-handle"
          />
          
          {/* Middle - Code/Preview with File Explorer */}
          <ResizablePanel defaultSize={70} className="flex flex-col">
            {/* Tabs for Preview/Code */}
            <div className="border-b border-white/10 flex glass-morphism backdrop-blur-lg justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-none border-b-2 px-4 py-2 transition-all duration-200",
                    activeTab === 'preview' 
                      ? "border-black text-white" 
                      : "border-transparent text-muted-foreground"
                  )}
                  onClick={() => setActiveTab('preview')}
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-none border-b-2 px-4 py-2 transition-all duration-200",
                    activeTab === 'code' 
                      ? "border-black text-white" 
                      : "border-transparent text-muted-foreground"
                  )}
                  onClick={() => setActiveTab('code')}
                >
                  <Code size={16} className="mr-2" />
                  Code
                </Button>
              </div>
              {activeTab === 'code' && (
                <Button
                  variant="ghost"
                  className="rounded-none px-4 py-2"
                  onClick={toggleFileSidebar}
                >
                  <FolderTree size={16} />
                </Button>
              )}
            </div>
            
            {/* Content area with file explorer */}
            <div className="flex-1 overflow-hidden backdrop-blur-sm flex">
              {/* File Tree Sidebar - Only show when activeTab is 'code' */}
              {activeTab === 'code' && showFileSidebar && (
                <ResizablePanel 
                  defaultSize={20} 
                  minSize={15}
                  maxSize={30}
                  className="h-full"
                >
                  <FileTreeSidebar 
                    onFileSelect={handleFileSelect}
                    selectedFileId={selectedFileId}
                    className="h-full"
                  />
                </ResizablePanel>
              )}
              
              {activeTab === 'code' && showFileSidebar && <ResizableHandle />}
              
              <ResizablePanel defaultSize={activeTab === 'code' && showFileSidebar ? 80 : 100} className="h-full">
                <div className={cn(
                  "w-full h-full transition-all duration-300 ease-in-out",
                  activeTab === 'preview' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'
                )}>
                  {activeTab === 'preview' && (
                    <Preview code={compiledCode} error={error} className="h-full" />
                  )}
                </div>
                
                <div className={cn(
                  "w-full h-full transition-all duration-300 ease-in-out",
                  activeTab === 'code' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'
                )}>
                  {activeTab === 'code' && (
                    <Editor onCodeChange={handleCodeChange} initialCode={code} className="h-full" />
                  )}
                </div>
              </ResizablePanel>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      <div className="glass-morphism border-t border-white/10 py-2 px-4 text-xs text-white/50 flex justify-between items-center backdrop-blur-md">
        <div>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-black/50"></span>
            React • TypeScript • Tailwind CSS
          </span>
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
