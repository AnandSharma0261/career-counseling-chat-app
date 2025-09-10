/**
 * Chat session list component
 * Displays list of chat sessions with management actions
 */
import React from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { formatTimestamp, truncateText } from '../../lib/utils';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { type ChatSession } from '../../lib/db/schema';

interface ChatSessionListProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession?: (sessionId: string) => void;
  isLoading?: boolean;
}

export function ChatSessionList({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isLoading = false,
}: ChatSessionListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chat Sessions
          </h2>
          <Button 
            onClick={onNewSession} 
            size="sm" 
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Continue your career conversations or start fresh
        </p>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/40 dark:bg-slate-800/40 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No chat sessions yet.<br />Start your first conversation!
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md hover:scale-[1.01]'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm truncate mb-2 ${
                      currentSessionId === session.id 
                        ? 'text-white' 
                        : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {session.title}
                    </h3>
                    {session.description && (
                      <p className={`text-xs line-clamp-2 mb-2 ${
                        currentSessionId === session.id 
                          ? 'text-white/80' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {truncateText(session.description, 80)}
                      </p>
                    )}
                    <p className={`text-xs ${
                      currentSessionId === session.id 
                        ? 'text-white/60' 
                        : 'text-slate-500 dark:text-slate-500'
                    }`}>
                      {formatTimestamp(session.updatedAt)}
                    </p>
                  </div>
                  
                  {onDeleteSession && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                        currentSessionId === session.id
                          ? 'hover:bg-white/20 text-white hover:text-white'
                          : 'hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
