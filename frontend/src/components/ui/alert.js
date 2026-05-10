import React from 'react';

export const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-xl border border-white/20 bg-ocean-800/50 backdrop-blur-md flex flex-col space-y-2 shadow-neon ${className || ''}`}>
    {children}
  </div>
);

export const AlertTitle = ({ children }) => (
  <h5 className="font-semibold text-neon-teal text-lg flex items-center gap-2 mb-1">
    {children}
  </h5>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm text-ocean-100 leading-relaxed">
    {children}
  </div>
);
