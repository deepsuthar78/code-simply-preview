
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import ChatPanel from '@/components/ChatPanel';
import FileTreeSidebar, { FileItem } from '@/components/FileTreeSidebar';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, FolderTree } from 'lucide-react';
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
  const { code, setCode, compiledCode, error, files, activeFileId, setActiveFile } = useCodeState({ initialCode });
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [showFileSidebar, setShowFileSidebar] = useState(true);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      // First, try to match by ID if it's one of our generated files
      const matchingFileById = files.find(f => f.id === file.id);
      if (matchingFileById) {
        setActiveFile(matchingFileById.id);
        return;
      }
      
      // If not found by ID, try to match by name (for compatibility)
      const matchingFileByName = files.find(f => f.name === file.name);
      if (matchingFileByName) {
        setActiveFile(matchingFileByName.id);
      }
      console.log(`Selected file: ${file.name} (id: ${file.id})`);
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
          
          {/* Right Side - Code/Preview with File Explorer - FULL WIDTH */}
          <ResizablePanel defaultSize={70} className="flex flex-col w-full">
            {/* Tabs for Preview/Code */}
            <div className="border-b border-white/10 flex glass-morphism backdrop-blur-lg justify-between">
              <div className="flex">
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-none border-b-2 px-4 py-2 transition-all duration-200",
                    activeView === 'preview' 
                      ? "border-black text-white" 
                      : "border-transparent text-muted-foreground"
                  )}
                  onClick={() => setActiveView('preview')}
                >
                  <Eye size={16} className="mr-2" />
                  Preview
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-none border-b-2 px-4 py-2 transition-all duration-200",
                    activeView === 'code' 
                      ? "border-black text-white" 
                      : "border-transparent text-muted-foreground"
                  )}
                  onClick={() => setActiveView('code')}
                >
                  <FolderTree size={16} className="mr-2" />
                  Code
                </Button>
              </div>
              {activeView === 'code' && (
                <Button
                  variant="ghost"
                  className="rounded-none px-4 py-2"
                  onClick={toggleFileSidebar}
                >
                  <FolderTree size={16} />
                </Button>
              )}
            </div>
            
            {/* Content area with code editor or preview - MAKE THIS FILL ALL AVAILABLE SPACE */}
            <div className="flex-1 overflow-hidden backdrop-blur-sm">
              {/* Show preview tab content */}
              {activeView === 'preview' && (
                <div className="w-full h-full">
                  <Preview code={compiledCode} error={error} className="h-full" />
                </div>
              )}
              
              {/* Show code editor tab content with optional file explorer */}
              {activeView === 'code' && (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  {showFileSidebar && (
                    <ResizablePanel 
                      defaultSize={20} 
                      minSize={15}
                      maxSize={30}
                    >
                      <FileTreeSidebar 
                        onFileSelect={handleFileSelect}
                        selectedFileId={activeFileId}
                        className="h-full"
                      />
                    </ResizablePanel>
                  )}
                  
                  {showFileSidebar && <ResizableHandle />}
                  
                  <ResizablePanel defaultSize={80}>
                    <Editor onCodeChange={handleCodeChange} initialCode={code} className="h-full" />
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
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
