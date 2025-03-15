
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Play, RefreshCw, Laptop, Tablet, Smartphone, Maximize, Clipboard, Check, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Function to refresh the preview
  const refreshPreview = () => {
    if (!iframeRef.current) return;
    
    setIsLoading(true);
    
    // Create a basic HTML document with React and render the component
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              transition: all 0.3s ease;
              margin: 0;
              padding: 0;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: rgba(20, 20, 20, 0.1);
            }
            
            #root {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          
          <script type="text/babel">
            try {
              ${code}
              
              // Get the exported component
              const Component = typeof MyComponent !== 'undefined' 
                ? MyComponent 
                : (typeof App !== 'undefined' ? App : null);
                
              if (Component) {
                ReactDOM.render(
                  <Component />,
                  document.getElementById('root')
                );
              } else {
                document.getElementById('root').innerHTML = 
                  '<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">' +
                  '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">' +
                  '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />' +
                  '</svg>' +
                  '<p class="text-center">Could not find a React component to render.<br>Export your component as default or name it "MyComponent" or "App".</p>' +
                  '</div>';
              }
            } catch (error) {
              document.getElementById('root').innerHTML = 
                '<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">' +
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">' +
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />' +
                '</svg>' +
                '<p class="text-center font-medium text-red-500">Error:</p>' +
                '<pre class="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded overflow-auto max-w-full">' + error.message + '</pre>' +
                '</div>';
              console.error(error);
            }
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
  
  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code Copied",
      description: "The code has been copied to your clipboard.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Toggle fullscreen preview
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Initial render and when code changes
  useEffect(() => {
    refreshPreview();
  }, [code]);

  return (
    <div className={cn("w-full h-full flex flex-col neo-blur", className)}>
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between glass-morphism backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/90">Preview</span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Device size selector - improved spacing and styling */}
          <div className="flex bg-black/40 rounded-full p-1 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 px-3 text-xs rounded-full flex items-center gap-1.5 transition-all duration-200", 
                viewportSize === 'desktop' ? "bg-white/10 text-white" : "text-white/70 hover:text-white/90 hover:bg-white/5"
              )}
              onClick={() => setViewportSize('desktop')}
            >
              <Laptop size={14} />
              <span>Desktop</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 px-3 text-xs rounded-full flex items-center gap-1.5 transition-all duration-200", 
                viewportSize === 'tablet' ? "bg-white/10 text-white" : "text-white/70 hover:text-white/90 hover:bg-white/5"
              )}
              onClick={() => setViewportSize('tablet')}
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 px-3 text-xs rounded-full flex items-center gap-1.5 transition-all duration-200", 
                viewportSize === 'mobile' ? "bg-white/10 text-white" : "text-white/70 hover:text-white/90 hover:bg-white/5"
              )}
              onClick={() => setViewportSize('mobile')}
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </Button>
          </div>
          
          {/* Action buttons with improved spacing */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-200"
              onClick={copyCode}
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-200"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <EyeOff size={16} /> : <Maximize size={16} />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10 transition-all duration-200"
              onClick={refreshPreview}
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Play size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 flex items-center justify-center overflow-hidden bg-black/20 backdrop-blur-sm transition-all duration-300",
        isFullscreen ? "p-0" : "p-4"
      )}>
        <div 
          className={cn(
            "transition-all duration-300 h-full w-full glass-morphism bg-white shadow-lg overflow-hidden",
            viewportSize === 'desktop' ? "max-w-full" : 
            viewportSize === 'tablet' ? "max-w-[768px]" : 
            "max-w-[375px]",
            isFullscreen ? "rounded-none" : "rounded-lg"
          )}
        >
          {error ? (
            <div className="p-4 bg-red-500/10 text-red-300 rounded-md m-4 font-mono text-sm overflow-auto border border-red-500/20 animate-pulse-subtle">
              <p className="font-bold">Error:</p>
              <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
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
