/**
 * Temporary in-memory data store for Vercel deployment
 * This is a workaround until proper cloud database is set up
 */

interface ChatSession {
  id: string;
  title: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface Message {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Global in-memory stores (will reset on server restart, but works for demo)
const users: Map<string, User> = new Map();
const chatSessions: Map<string, ChatSession> = new Map();
const messages: Map<string, Message> = new Map();

// Helper function to generate UUID
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const tempDataStore = {
  // User operations
  users: {
    create: (userData: Omit<User, 'id' | 'createdAt'>) => {
      const id = generateId();
      const user: User = {
        id,
        ...userData,
        createdAt: new Date(),
      };
      users.set(id, user);
      return user;
    },
    
    findByEmail: (email: string) => {
      for (const user of users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return null;
    },
    
    findById: (id: string) => {
      return users.get(id) || null;
    }
  },

  // Chat session operations
  chatSessions: {
    create: (sessionData: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = generateId();
      const session: ChatSession = {
        id,
        ...sessionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      chatSessions.set(id, session);
      return session;
    },
    
    findByUserId: (userId: string) => {
      const sessions = Array.from(chatSessions.values())
        .filter(session => session.userId === userId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      return sessions;
    },
    
    findById: (id: string) => {
      return chatSessions.get(id) || null;
    },
    
    delete: (id: string) => {
      return chatSessions.delete(id);
    },
    
    update: (id: string, updates: Partial<ChatSession>) => {
      const session = chatSessions.get(id);
      if (!session) return null;
      
      const updated = { ...session, ...updates, updatedAt: new Date() };
      chatSessions.set(id, updated);
      return updated;
    }
  },

  // Message operations
  messages: {
    create: (messageData: Omit<Message, 'id' | 'createdAt'>) => {
      const id = generateId();
      const message: Message = {
        id,
        ...messageData,
        createdAt: new Date(),
      };
      messages.set(id, message);
      return message;
    },
    
    findBySessionId: (sessionId: string) => {
      const sessionMessages = Array.from(messages.values())
        .filter(message => message.sessionId === sessionId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return sessionMessages;
    }
  }
};

export default tempDataStore;
