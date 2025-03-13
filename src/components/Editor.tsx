
import React, { useRef, useEffect, useState } from 'react';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';
import { File } from 'lucide-react';

interface EditorProps {
  className?: string;
  onCodeChange?: (code: string) => void;
  initialCode?: string;
}

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

const Editor: React.FC<EditorProps> = ({
  className,
  onCodeChange,
  initialCode
}) => {
  const { code, setCode } = useCodeState({ initialCode });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);
  
  // Demo files for demonstration
  const [files, setFiles] = useState<CodeFile[]>([
    { id: '1', name: 'App.tsx', content: code, language: 'tsx' },
    { id: '2', name: 'styles.css', content: '/* CSS styles here */', language: 'css' },
    { id: '3', name: 'utils.ts', content: '// Utility functions', language: 'ts' },
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('1');
  
  // Update active file when switching tabs
  const handleFileChange = (fileId: string) => {
    // Save current file content before switching
    const updatedFiles = files.map(file => {
      if (file.id === activeFileId) {
        return { ...file, content: code };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    setActiveFileId(fileId);
    
    // Update editor with new file content
    const newActiveFile = updatedFiles.find(file => file.id === fileId);
    if (newActiveFile) {
      setCode(newActiveFile.content);
      if (onCodeChange) {
        onCodeChange(newActiveFile.content);
      }
    }
  };

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
    
    // Update the current file's content
    const updatedFiles = files.map(file => {
      if (file.id === activeFileId) {
        return { ...file, content: newCode };
      }
      return file;
    });
    
    setFiles(updatedFiles);
    
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

  // Format code on double click (simulated formatter)
  const handleDoubleClick = () => {
    // This is a placeholder for a proper code formatter
    const formatted = code.trim();
    setCode(formatted);
    if (onCodeChange) {
      onCodeChange(formatted);
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col glass-morphism bg-black/30", className)}>
      {/* File tabs */}
      <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto scrollbar-none">
        {files.map(file => (
          <button
            key={file.id}
            onClick={() => handleFileChange(file.id)}
            className={cn(
              "px-4 py-2 text-sm flex items-center gap-2 border-r border-white/5 transition-colors",
              activeFileId === file.id 
                ? "bg-black/30 text-white" 
                : "text-white/50 hover:text-white/80 hover:bg-black/10"
            )}
          >
            <File size={14} />
            {file.name}
          </button>
        ))}
      </div>
      
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
            onDoubleClick={handleDoubleClick}
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
