import React, { useState, useRef, useEffect } from 'react';

// Define the Message type locally if not available from schema
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
  sessionTitle?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  sessionTitle = 'Career Chat',
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when not loading
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    try {
      await onSendMessage(message.trim());
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSendMessage(inputValue);
      }
    }
  };

  const handleSendClick = () => {
    if (inputValue.trim() && !isLoading) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-sm">
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 className="font-semibold text-base bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            {sessionTitle}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Career Counselor • Always here to help</p>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="relative mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center mx-auto shadow-sm">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" aria-hidden="true"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome to Career Counseling
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                I'm here to help you navigate your career journey. Ask me about job searching, 
                career transitions, skill development, or any professional challenges you're facing.
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700">
                  <span className="text-lg" role="img" aria-label="Briefcase">💼</span>
                  <span className="text-sky-700 dark:text-sky-300">Career exploration and planning</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700">
                  <span className="text-lg" role="img" aria-label="Document">📝</span>
                  <span className="text-emerald-700 dark:text-emerald-300">Resume and interview guidance</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <span className="text-lg" role="img" aria-label="Target">🎯</span>
                  <span className="text-indigo-700 dark:text-indigo-300">Professional development</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white'
                      : 'bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-gray-100'
                  }`}
                  role={message.role === 'user' ? 'user' : 'assistant'}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 p-4 rounded-xl">
                  <div className="flex items-center gap-2" role="status" aria-label="AI is typing">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-600 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={messages.length === 0 ? "Start by telling me about your career goals..." : "Continue the conversation..."}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-500 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
            aria-label="Type your message"
          />
          <button
            onClick={handleSendClick}
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
