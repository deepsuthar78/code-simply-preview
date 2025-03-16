import { useState, useCallback, useEffect } from 'react';

interface UseCodeStateProps {
  initialCode?: string;
}

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

export const useCodeState = ({ initialCode = '' }: UseCodeStateProps = {}) => {
  const [code, setCode] = useState(initialCode);
  const [compiledCode, setCompiledCode] = useState<string>(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    
    // Also update the active file's content
    if (activeFileId) {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === activeFileId ? { ...file, content: newCode } : file
        )
      );
    }
    
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
      
      // Add new file - ensuring the name is normalized
      setFiles(prevFiles => {
        // Normalize the file name by removing any leading/trailing spaces
        newFile.name = newFile.name.trim();
        
        const newFiles = [...prevFiles, newFile];
        console.log(`Added new file: ${newFile.name} with ID: ${fileId}`);
        console.log(`Total files after adding: ${newFiles.length}`);
        return newFiles;
      });
      
      // If this is the first file or there's no active file, set it as active
      if (files.length === 0 || !activeFileId) {
        setActiveFileId(fileId);
        setCode(file.content);
        setCompiledCode(file.content);
      }
      
      return fileId;
    }
  }, [files, activeFileId]);
  
  const removeFile = useCallback((fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    
    // If removing the active file, set the first remaining file as active
    if (fileId === activeFileId) {
      setFiles(prevFiles => {
        const remainingFiles = prevFiles.filter(file => file.id !== fileId);
        if (remainingFiles.length > 0) {
          setActiveFileId(remainingFiles[0].id);
          setCode(remainingFiles[0].content);
          setCompiledCode(remainingFiles[0].content);
        } else {
          setActiveFileId('');
          setCode('');
          setCompiledCode('');
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
    console.log("getAllFiles called, returning", files.length, "files");
    return [...files];
  }, [files]);

  // Debug: Log files when they change
  useEffect(() => {
    console.log("Files state updated:", files.map(f => f.name));
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
