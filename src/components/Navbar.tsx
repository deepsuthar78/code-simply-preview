
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import AnimatedLogo from './AnimatedLogo';
import { Download, Share2, Terminal, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SettingsDialog from './SettingsDialog';
import { useAI } from '@/contexts/AIContext';

// Define provider models
const PROVIDER_MODELS = {
  openai: ['gpt-4', 'gpt-4o', 'gpt-4o-mini'],
  anthropic: ['claude-3.5-sonnet', 'claude-3.7-sonnet', 'claude-3.7-thinking'],
  gemini: ['gemini-2.0-flash', 'gemini-2.0-thinking']
};

const Navbar: React.FC = () => {
  const [availableModels, setAvailableModels] = useState<string[]>(PROVIDER_MODELS.gemini);
  const { toast } = useToast();
  const { provider, model, setModel } = useAI();
  
  // Update available models when provider changes
  useEffect(() => {
    if (provider && PROVIDER_MODELS[provider]) {
      setAvailableModels(PROVIDER_MODELS[provider]);
    }
  }, [provider]);
  
  // Listen for provider changes from the settings dialog
  useEffect(() => {
    const handleProviderChange = (event: CustomEvent) => {
      const { provider, models } = event.detail;
      setAvailableModels(models);
    };

    window.addEventListener('providerChanged', handleProviderChange as EventListener);
    
    return () => {
      window.removeEventListener('providerChanged', handleProviderChange as EventListener);
    };
  }, []);
  
  const handleDownload = () => {
    toast({
      title: "Downloading Project",
      description: "Your code is being prepared for download.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Project Link Copied",
      description: "A shareable link has been copied to your clipboard.",
    });
  };
  
  const handleDeploy = () => {
    toast({
      title: "Deploying Project",
      description: "Your project is being prepared for deployment.",
    });
  };

  // Get provider name for display
  const getProviderDisplay = () => {
    switch(provider) {
      case 'openai': return 'OpenAI';
      case 'anthropic': return 'Anthropic';
      case 'gemini': return 'Gemini';
      default: return 'AI';
    }
  };

  return (
    <nav className="w-full px-6 py-3 glass-morphism border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        <AnimatedLogo />
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-md bg-secondary/70 border-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Terminal size={14} className="mr-1.5" />
              {getProviderDisplay()}: {model}
              <ChevronDown size={14} className="ml-1.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-secondary/90 backdrop-blur-lg border-white/10 text-white">
            {availableModels.map(modelOption => (
              <DropdownMenuItem 
                key={modelOption}
                onClick={() => setModel(modelOption)}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
              >
                {modelOption}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2">
          <SettingsDialog />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10 transition-all duration-200"
            onClick={handleDownload}
          >
            <Download size={18} className="hover:translate-y-0.5 transition-transform duration-300" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10 transition-all duration-200"
            onClick={handleShare}
          >
            <Share2 size={18} className="hover:scale-110 transition-transform duration-300" />
          </Button>
          
          <Button variant="outline" size="sm" className="rounded-md ml-2 px-4 bg-black/10 hover:bg-black/20 border-black/20 text-white transition-all duration-200" onClick={handleDeploy}>
            Deploy
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
