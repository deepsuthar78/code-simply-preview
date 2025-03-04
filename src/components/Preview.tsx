
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
              transition: all 0.3s ease;
            }
            
            .preview-root {
              transition: all 0.3s ease;
            }
            
            * {
              transition: background-color 0.3s ease, transform 0.3s ease, opacity 0.3s ease;
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
              '<div class="text-center p-8 bg-white rounded-xl shadow-xl transform transition hover:scale-105">' +
              '<h2 class="text-2xl font-bold text-blue-600 mb-4">Interactive Preview</h2>' +
              '<p class="text-gray-700">Your code would be rendered here in a real implementation</p>' +
              '<div class="mt-6 flex justify-center gap-4">' +
              '<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Button 1</button>' +
              '<button class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">Button 2</button>' +
              '</div>' +
              '<p class="text-xs text-gray-500 mt-6">Using live JSX/TSX compilation</p>' +
              '</div>' +
              '</div>';
              
            // Add some interactivity to the preview
            setTimeout(() => {
              const buttons = document.querySelectorAll('button');
              buttons.forEach(button => {
                button.addEventListener('click', () => {
                  button.textContent = 'Clicked!';
                  setTimeout(() => {
                    button.textContent = button.textContent.replace('Clicked!', button.textContent.includes('1') ? 'Button 1' : 'Button 2');
                  }, 1000);
                });
              });
            }, 500);
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
            "transition-all duration-300 h-full glass-morphism bg-white shadow-lg overflow-hidden",
            viewportSize === 'desktop' ? "w-full" : 
            viewportSize === 'tablet' ? "w-[768px]" : 
            "w-[375px]",
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
