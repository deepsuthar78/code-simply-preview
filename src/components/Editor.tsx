
import React, { useRef, useEffect, useState } from 'react';
import { useCodeState } from '@/hooks/useCodeState';
import { cn } from '@/lib/utils';

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
  const { code, setCode } = useCodeState({ initialCode });
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [activeLineNumber, setActiveLineNumber] = useState<number>(1);

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
