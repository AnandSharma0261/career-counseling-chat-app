'use client';

import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  className?: string;
}

export function TypingIndicator({ isVisible, className = '' }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className={`flex justify-start ${className}`}>
      <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 p-4 rounded-xl max-w-[200px]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
            <div 
              className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" 
              style={{animationDelay: '0.1s'}}
            ></div>
            <div 
              className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" 
              style={{animationDelay: '0.2s'}}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            AI is typing...
          </span>
        </div>
      </div>
    </div>
  );
}
