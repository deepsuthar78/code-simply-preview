
import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="relative flex items-center group">
      <div className="h-9 w-9 relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-400 rounded-md animate-float"></div>
        <div className="absolute inset-0 bg-black/20 glass-morphism rounded-md group-hover:bg-black/10 transition-colors duration-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gradient font-bold text-lg">AI</span>
        </div>
      </div>
      <div className="ml-2 flex flex-col">
        <span className="font-semibold text-xl tracking-tight text-gradient-primary group-hover:translate-x-0.5 transition-transform duration-300">CodeCanvas</span>
        <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300 -mt-1">AI-powered code editor</span>
      </div>
    </div>
  );
};

export default AnimatedLogo;
