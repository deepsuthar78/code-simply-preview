
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import AnimatedLogo from './AnimatedLogo';
import { Code, Download, Settings, Share2, Github, Moon, Sun, Terminal } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const [framework, setFramework] = useState<'react' | 'vue' | 'angular'>('react');
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
        <div className="flex bg-secondary/70 rounded-lg p-1 backdrop-blur-sm border border-white/5">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs rounded-md flex items-center gap-1 transition-all duration-200 ${framework === 'react' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setFramework('react')}
          >
            <Code size={14} />
            <span>React</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs rounded-md flex items-center gap-1 transition-all duration-200 ${framework === 'vue' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setFramework('vue')}
          >
            <Code size={14} />
            <span>Vue</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-xs rounded-md flex items-center gap-1 transition-all duration-200 ${framework === 'angular' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            onClick={() => setFramework('angular')}
          >
            <Code size={14} />
            <span>Angular</span>
          </Button>
        </div>

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
