import React from 'react';

export const Alert = ({ children, className }) => (
  <div className={`p-4 rounded-lg border flex flex-col space-y-2 ${className || 'bg-blue-50 border-blue-200'}`}>
    {children}
  </div>
);

export const AlertTitle = ({ children }) => (
  <h5 className="font-medium text-blue-800">
    {children}
  </h5>
);

export const AlertDescription = ({ children }) => (
  <div className="text-sm text-blue-700">
    {children}
  </div>
);
