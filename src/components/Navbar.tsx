
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import AnimatedLogo from './AnimatedLogo';
import { Code, Download, Settings, Share2, Terminal, ChevronDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const { toast } = useToast();
  
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
              {selectedModel}
              <ChevronDown size={14} className="ml-1.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-secondary/90 backdrop-blur-lg border-white/10 text-white">
            <DropdownMenuItem 
              onClick={() => setSelectedModel('gpt-4o-mini')}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
            >
              gpt-4o-mini
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelectedModel('gpt-4o')}
              className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
            >
              gpt-4o
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-white/10 transition-all duration-200"
            onClick={() => toast({ title: "Settings", description: "Settings panel will open here." })}
          >
            <Settings size={18} className="hover:rotate-90 transition-transform duration-300" />
          </Button>
          
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
          
          <Button variant="outline" size="sm" className="rounded-md ml-2 px-4 bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary transition-all duration-200" onClick={handleDeploy}>
            Deploy
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
