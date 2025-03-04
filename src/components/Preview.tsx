
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewProps {
  className?: string;
  code: string;
  error: string | null;
}

const Preview: React.FC<PreviewProps> = ({
  className,
  code,
  error
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Function to refresh the preview
  const refreshPreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    
    // In a real implementation, this would properly compile and inject the code
    // For our demo, we'll create a basic HTML document with the React code
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              padding: 1rem;
            }
          </style>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        </head>
        <body>
          <div id="root" class="preview-root"></div>
          <script>
            // This is a simplified preview, in a real implementation
            // we would properly compile JSX and run it
            document.getElementById('root').innerHTML = 
              '<div class="flex items-center justify-center min-h-screen">' +
              '<div class="text-center">' +
              '<p>Preview content would appear here</p>' +
              '<p class="text-xs text-gray-500 mt-2">Using live JSX/TSX compilation</p>' +
              '</div>' +
              '</div>';
          </script>
        </body>
      </html>
    `;
    
    const iframe = iframeRef.current;
    iframe.srcdoc = previewContent;
    
    iframe.onload = () => {
      setIsLoading(false);
    };
  };

  // Initial render and when code changes
  useEffect(() => {
    refreshPreview();
  }, [code]);

  return (
    <div className={cn("w-full h-full flex flex-col bg-white/5", className)}>
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium">Preview</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-secondary/70 rounded-lg p-1 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs rounded-md flex items-center px-2", 
                viewportSize === 'desktop' ? "bg-white/10" : "hover:bg-white/5"
              )}
              onClick={() => setViewportSize('desktop')}
            >
              Desktop
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs rounded-md flex items-center px-2", 
                viewportSize === 'tablet' ? "bg-white/10" : "hover:bg-white/5"
              )}
              onClick={() => setViewportSize('tablet')}
            >
              Tablet
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "text-xs rounded-md flex items-center px-2", 
                viewportSize === 'mobile' ? "bg-white/10" : "hover:bg-white/5"
              )}
              onClick={() => setViewportSize('mobile')}
            >
              Mobile
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10"
            onClick={refreshPreview}
          >
            {isLoading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Play size={18} />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm">
        <div 
          className={cn(
            "transition-all duration-300 h-full bg-white overflow-hidden",
            viewportSize === 'desktop' ? "w-full" : 
            viewportSize === 'tablet' ? "w-[768px] shadow-lg" : 
            "w-[375px] shadow-lg"
          )}
        >
          {error ? (
            <div className="p-4 bg-red-500/10 text-red-300 rounded-md m-4 font-mono text-sm overflow-auto">
              <p className="font-bold">Error:</p>
              <pre>{error}</pre>
            </div>
          ) : (
            <iframe 
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
