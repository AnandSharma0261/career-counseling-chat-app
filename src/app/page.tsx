/**
 * Main page component - Career Counseling Chat Application
 * This is the entry point for the chat interface with authentication
 */
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/trpc/client';
import { ChatInterface } from '../components/chat/chat-interface';
import { ChatSessionList } from '../components/chat/chat-session-list';
import { ThemeToggle } from '../components/theme-toggle';
import { Button } from '../components/ui/button';
import { Menu, X, Brain, LogOut, User } from 'lucide-react';
import { type ChatSession, type Message } from '../lib/db/schema';

function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // Refs for click outside handling
  const userMenuRef = useRef<HTMLDivElement>(null);

  // tRPC queries and mutations - must be called before any conditional returns
  const { data: sessions = [], refetch: refetchSessions, isLoading: sessionsLoading } = 
    api.chat.getSessions.useQuery({ limit: 50 });
  
  const createSessionMutation = api.chat.createSession.useMutation();
  const sendMessageMutation = api.chat.sendMessage.useMutation();
  const deleteSessionMutation = api.chat.deleteSession.useMutation();

  // Get current session data
  const { data: sessionData, refetch: refetchSession } = api.chat.getSession.useQuery(
    { sessionId: currentSession?.id || '' },
    { enabled: !!currentSession?.id }
  );

  // All useEffect hooks
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signup');
    }
  }, [status, router]);

  useEffect(() => {
    if (sessionData) {
      setMessages(sessionData.messages);
      setCurrentSession(sessionData.session);
    }
  }, [sessionData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    if (!sessionsLoading && !currentSession && sessions.length > 0) {
      setCurrentSession(sessions[0]);
    }
  }, [sessionsLoading, currentSession, sessions]);

  // All useCallback hooks
  const handleNewSession = useCallback(async () => {
    if (isCreatingSession) return;
    
    setIsCreatingSession(true);
    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: 'New Career Discussion',
      });
      setCurrentSession(newSession);
      setMessages([]);
      await refetchSessions();
      setIsSidebarOpen(false);
    } catch (error) {
      console.error('Failed to create new session:', error);
    } finally {
      setIsCreatingSession(false);
    }
  }, [createSessionMutation, refetchSessions, isCreatingSession]);

  const handleSelectSession = useCallback(async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
      setIsSidebarOpen(false);
    }
  }, [sessions]);

  const handleDeleteSession = useCallback(async (sessionId: string) => {
    try {
      await deleteSessionMutation.mutateAsync({ sessionId });
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      
      await refetchSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }, [deleteSessionMutation, currentSession, refetchSessions]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    if (!currentSession) {
      await handleNewSession();
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    try {
      const isFirstMessage = messages.length === 0;
      
      const result = await sendMessageMutation.mutateAsync({
        sessionId: currentSession.id,
        content: content.trim(),
        isFirstMessage,
      });

      setMessages(prev => [...prev, result.userMessage, result.assistantMessage]);
      await refetchSessions();
      
      if (isFirstMessage) {
        await refetchSession();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [currentSession, messages.length, sendMessageMutation, refetchSessions, refetchSession, handleNewSession]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/auth/signin' });
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }, []);

  // Early returns AFTER all hooks
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-sm animate-pulse">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-50 lg:z-0`}>
        <div className="w-80 h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-gray-200 dark:border-slate-600 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-sm">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Career Chat</h2>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <Button
              onClick={handleNewSession}
              disabled={isCreatingSession}
              className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-sm"
            >
              {isCreatingSession ? 'Creating...' : 'New Chat'}
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatSessionList
              sessions={sessions}
              currentSessionId={currentSession?.id}
              onSelectSession={handleSelectSession}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              isLoading={sessionsLoading}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-slate-600 flex items-center justify-between px-4 relative z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentSession?.title || 'Career Counseling'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="relative z-50" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
              >
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="User" 
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {session.user?.name || 'User'}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-600 py-1 z-[100] backdrop-blur-sm">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-600">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={sendMessageMutation.isPending}
            sessionTitle={currentSession?.title}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
