
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { PanelLeft, PanelRight } from 'lucide-react';
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
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const toggleEditor = () => {
    setEditorCollapsed(!editorCollapsed);
    if (previewCollapsed) setPreviewCollapsed(false);
  };

  const togglePreview = () => {
    setPreviewCollapsed(!previewCollapsed);
    if (editorCollapsed) setEditorCollapsed(false);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-background via-background to-secondary/20">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          editorCollapsed ? "w-12 flex-grow-0" : "flex-1",
          previewCollapsed ? "flex-none" : ""
        )}>
          {editorCollapsed ? (
            <div className="h-full w-12 flex flex-col items-center justify-center border-r border-white/5">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                onClick={toggleEditor}
              >
                <PanelRight size={18} />
              </Button>
            </div>
          ) : (
            <Editor 
              className="animate-fade-in" 
              onCodeChange={handleCodeChange} 
              initialCode={initialCode}
            />
          )}
        </div>
        
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          previewCollapsed ? "w-12 flex-grow-0" : "flex-1",
          editorCollapsed ? "flex-none" : ""
        )}>
          {previewCollapsed ? (
            <div className="h-full w-12 flex flex-col items-center justify-center border-l border-white/5">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/10"
                onClick={togglePreview}
              >
                <PanelLeft size={18} />
              </Button>
            </div>
          ) : (
            <Preview 
              className="animate-fade-in" 
              code={compiledCode} 
              error={error}
            />
          )}
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
