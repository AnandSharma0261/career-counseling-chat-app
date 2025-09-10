/**
 * Chat input component
 * Handles message input with form validation and submission
 */
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Ask me anything about your career..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    setIsLoading(true);
    setMessage('');

    try {
      await onSendMessage(trimmedMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore message on error
      setMessage(trimmedMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="flex-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-xl px-4 py-3 text-sm placeholder:text-slate-400"
        maxLength={1000}
      />
      <Button 
        type="submit" 
        disabled={!message.trim() || disabled || isLoading}
        size="icon"
        className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 w-12 h-12"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
