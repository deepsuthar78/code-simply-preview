
import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="relative flex items-center animate-pulse-subtle">
      <div className="h-8 w-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-md animate-float"></div>
        <div className="absolute inset-0 bg-black/20 glass-morphism rounded-md"></div>
      </div>
      <span className="ml-2 font-semibold text-xl tracking-tight">CodeCanvas</span>
    </div>
  );
};

export default AnimatedLogo;
