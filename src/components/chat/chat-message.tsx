/**
 * Chat message component
 * Displays individual messages with proper formatting and styling
 */
import React from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { formatTimestamp } from '../../lib/utils';
import { Bot, User } from 'lucide-react';
import { type Message } from '../../lib/db/schema';

interface ChatMessageProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatMessage({ message, isTyping = false }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3 p-4 ${isAssistant ? 'bg-muted/50' : ''}`}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className={isAssistant ? 'bg-blue-100' : 'bg-green-100'}>
          {isAssistant ? (
            <Bot className="h-4 w-4 text-blue-600" />
          ) : (
            <User className="h-4 w-4 text-green-600" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {isAssistant ? 'Career Counselor' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        
        <div className="prose prose-sm max-w-none">
          {isTyping ? (
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
