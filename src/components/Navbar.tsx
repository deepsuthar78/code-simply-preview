
import React from 'react';
import { Button } from "@/components/ui/button";
import AnimatedLogo from './AnimatedLogo';
import { Code, Download, Settings, Share2 } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full px-6 py-3 glass-morphism border-b border-white/5 flex items-center justify-between">
      <div className="flex items-center">
        <AnimatedLogo />
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex bg-secondary/70 rounded-lg p-1 backdrop-blur-sm">
          <Button variant="ghost" size="sm" className="text-xs rounded-md flex items-center gap-1 hover:bg-white/10">
            <Code size={14} />
            <span>React</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Settings size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Download size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
            <Share2 size={18} />
          </Button>
          <Button variant="secondary" size="sm" className="rounded-md ml-2 px-4 bg-white/10 hover:bg-white/20">
            Deploy
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
