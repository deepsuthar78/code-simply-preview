
import React, { useRef, useEffect, useState } from 'react';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { File, X, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface EditorProps {
  className?: string;
  onCodeChange?: (code: string) => void;
  initialCode?: string;
}

const Editor: React.FC<EditorProps> = ({
  className,
  onCodeChange,
  initialCode
}) => {
  const { 
    code, 
    setCode, 
    files, 
    addFile, 
    removeFile, 
    activeFileId, 
    setActiveFile 
  } = useCodeState({ initialCode });
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  
  // Update line numbers when code changes
  useEffect(() => {
    if (!lineNumbersRef.current) return;
    
    const lineCount = (code.match(/\n/g) || []).length + 1;
    
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)
      .map(num => {
        const isActive = num === activeLineNumber;
        return `<div class="${isActive ? 'text-primary font-medium' : 'text-gray-500'} text-right pr-4 select-none transition-colors hover:text-white/80">${num}</div>`;
      })
      .join('');
    
    lineNumbersRef.current.innerHTML = lineNumbers;
  }, [code, activeLineNumber]);
  
  // Track cursor position to highlight active line
  const handleCursorMove = () => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    // Calculate line number based on cursor position
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPosition);
    const lineNumber = (textBeforeCursor.match(/\n/g) || []).length + 1;
    
    setActiveLineNumber(lineNumber);
  };

  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  // Indent with tabs
  const handleTabKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = editorRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.value = newValue;
      
      // Move cursor position after the inserted tab
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      
      handleCodeChange({ target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  };
  
  // Create a new file
  const handleCreateNewFile = () => {
    if (newFileName.trim() === '') return;
    
    // Determine language from file extension
    const extension = newFileName.split('.').pop()?.toLowerCase() || 'txt';
    let language = 'text';
    
    switch (extension) {
      case 'js':
        language = 'javascript';
        break;
      case 'ts':
        language = 'typescript';
        break;
      case 'jsx':
      case 'tsx':
        language = 'tsx';
        break;
      case 'css':
        language = 'css';
        break;
      case 'html':
        language = 'html';
        break;
      case 'json':
        language = 'json';
        break;
    }
    
    const newFileContent = extension === 'tsx' || extension === 'jsx' 
      ? `import React from 'react';\n\nconst ${newFileName.split('.')[0]} = () => {\n  return (\n    <div>\n      New Component\n    </div>\n  );\n};\n\nexport default ${newFileName.split('.')[0]};`
      : '';
    
    const newFileId = addFile({
      name: newFileName,
      content: newFileContent,
      language
    });
    
    setActiveFile(newFileId);
    setNewFileName('');
    setShowNewFileInput(false);
  };
  
  // Handle new file input key press
  const handleNewFileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateNewFile();
    } else if (e.key === 'Escape') {
      setShowNewFileInput(false);
      setNewFileName('');
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col glass-morphism bg-black/30", className)}>
      {/* File tabs */}
      <ScrollArea className="border-b border-white/10 bg-black/20 scrollbar-none">
        <div className="flex min-w-full">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id)}
              className={cn(
                "px-4 py-2 text-sm flex items-center gap-2 border-r border-white/5 transition-colors group",
                activeFileId === file.id 
                  ? "bg-black/30 text-white" 
                  : "text-white/50 hover:text-white/80 hover:bg-black/10"
              )}
            >
              <File size={14} />
              <span>{file.name}</span>
              {files.length > 1 && (
                <button
                  className="ml-1 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white/80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </button>
          ))}
          
          {showNewFileInput ? (
            <div className="flex items-center bg-black/20 px-3 py-1 border-r border-white/5">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={handleNewFileKeyDown}
                placeholder="filename.tsx"
                className="bg-transparent border-none outline-none text-sm text-white w-32 px-2 py-1"
                autoFocus
              />
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-xs"
                onClick={handleCreateNewFile}
              >
                Add
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowNewFileInput(true)}
              className="px-4 py-2 text-sm flex items-center gap-1 text-white/50 hover:text-white/80 hover:bg-black/10 transition-colors"
            >
              <Plus size={14} />
              <span>New File</span>
            </button>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex-1 overflow-hidden flex">
        <div 
          ref={lineNumbersRef} 
          className="py-4 pr-0 pl-2 bg-secondary/10 text-sm font-mono flex flex-col border-r border-white/5"
        ></div>
        
        <div className="flex-1 relative overflow-hidden">
          <textarea
            ref={editorRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleTabKey}
            onClick={handleCursorMove}
            onKeyUp={handleCursorMove}
            className="absolute inset-0 bg-transparent text-sm font-mono p-4 outline-none resize-none editor-scrollbar code-editor text-white/90"
            spellCheck="false"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
