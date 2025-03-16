
import { useState, useCallback } from 'react';

interface UseCodeStateProps {
  initialCode?: string;
}

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

const defaultCode = `
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <p className="mt-2">Ask the AI to create a component or feature!</p>
      <button className="mt-4 px-4 py-2 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition-colors">
        Click me
      </button>
    </div>
  );
};

export default MyComponent;
`;

export const useCodeState = ({ initialCode = defaultCode }: UseCodeStateProps = {}) => {
  const [code, setCode] = useState(initialCode);
  const [compiledCode, setCompiledCode] = useState<string>(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<CodeFile[]>([
    { id: 'default', name: 'App.tsx', content: initialCode, language: 'tsx' },
  ]);
  const [activeFileId, setActiveFileId] = useState<string>('default');

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Also update the active file's content
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId ? { ...file, content: newCode } : file
      )
    );
    
    // In a real implementation, this would compile JSX/TSX to JS
    // For our demo, we'll just set it directly
    try {
      setCompiledCode(newCode);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [activeFileId]);
  
  const addFile = useCallback((file: Omit<CodeFile, 'id'> & { id?: string }) => {
    const fileId = file.id || `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Check if the file with the same name already exists
    const existingFileIndex = files.findIndex(f => f.name === file.name);
    
    if (existingFileIndex !== -1) {
      // Update the existing file
      setFiles(prevFiles => 
        prevFiles.map((f, index) => 
          index === existingFileIndex 
            ? { ...f, content: file.content, language: file.language } 
            : f
        )
      );
      console.log(`Updated existing file: ${file.name}`);
      return files[existingFileIndex].id;
    } else {
      // Add a new file
      const newFile: CodeFile = {
        id: fileId,
        name: file.name,
        content: file.content,
        language: file.language
      };
      
      // Add new file with forceUpdate to ensure state changes are detected
      setFiles(prevFiles => {
        const newFiles = [...prevFiles, newFile];
        console.log(`Added new file: ${file.name} with ID: ${fileId}`);
        console.log(`Total files after adding: ${newFiles.length}`);
        return newFiles;
      });
      
      return fileId;
    }
  }, [files]);
  
  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    
    // If removing the active file, set the first remaining file as active
    if (fileId === activeFileId) {
      setFiles(prevFiles => {
        const remainingFiles = prevFiles.filter(file => file.id !== fileId);
        if (remainingFiles.length > 0) {
          setActiveFileId(remainingFiles[0].id);
          setCode(remainingFiles[0].content);
        }
        return remainingFiles;
      });
    }
  }, [activeFileId]);
  
  const setActiveFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      console.log(`Setting active file: ${file.name} (id: ${fileId})`);
      setActiveFileId(fileId);
      setCode(file.content);
      
      // Also update the compiled code to match the active file
      try {
        setCompiledCode(file.content);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } else {
      console.log(`File not found: ${fileId}`);
    }
  }, [files]);
  
  const getFileById = useCallback((fileId: string) => {
    return files.find(file => file.id === fileId);
  }, [files]);

  const getAllFiles = useCallback(() => {
    return [...files];
  }, [files]);

  return {
    code,
    setCode: updateCode,
    compiledCode,
    error,
    files,
    addFile,
    removeFile,
    activeFileId,
    setActiveFile,
    getFileById,
    getAllFiles
  };
};
