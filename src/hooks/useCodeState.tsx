
import { useState, useCallback } from 'react';

interface UseCodeStateProps {
  initialCode?: string;
}

const defaultCode = `
import React from 'react';

const MyComponent = () => {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <p className="mt-2">This is a live preview of your code!</p>
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
  const [compiledCode, setCompiledCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    
    // In a real implementation, this would compile JSX/TSX to JS
    // For our demo, we'll just set it directly
    try {
      setCompiledCode(newCode);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  return {
    code,
    setCode: updateCode,
    compiledCode,
    error
  };
};
