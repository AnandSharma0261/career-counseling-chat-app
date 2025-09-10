# 🎯 Career Counseling Chat Application

A modern, AI-powered career counseling chat application built with Next.js, TypeScript, and cutting-edge web technologies.

![Application Preview](https://img.shields.io/badge/status-ready%20for%20deployment-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?logo=typescript)
![tRPC](https://img.shields.io/badge/tRPC-11.0.0-blue?logo=trpc)

## ✨ Features

- 🤖 **AI-Powered Career Guidance** - Intelligent career counseling with OpenAI integration
- � **Authentication System** - Secure user registration and login with NextAuth.js
- �💬 **Real-time Chat Interface** - Smooth, responsive chat experience with typing indicators
- 📊 **Message Status Indicators** - Visual feedback for message delivery status
- 📱 **Mobile-First Design** - Fully responsive across all devices
- 🎨 **Modern UI/UX** - Glass morphism design with gradient themes
- 🌓 **Dark/Light Theme Toggle** - System-aware theme switching
- 🔒 **Protected Routes** - Middleware-based route protection
- 🔒 **Type-Safe API** - End-to-end type safety with tRPC
- 💾 **Persistent Sessions** - SQLite database with Drizzle ORM
- ⚡ **High Performance** - Optimized with TanStack Query
- 📊 **Session Management** - Create, manage, and delete chat sessions
- 👤 **User Profiles** - Google OAuth and credentials-based authentication
- 🔄 **Real-time Updates** - Live typing indicators and message status

## 🏗️ Architecture

### Frontend
- **Next.js 15** with App Router for server-side rendering and routing
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible, unstyled UI components
- **Lucide React** for consistent iconography

### Backend
- **tRPC** for type-safe API routes and real-time communication
- **Drizzle ORM** with SQLite for data persistence
- **OpenAI API** integration for AI-powered responses
- **Zod** for runtime type validation

### Database Schema
```sql
-- Users table (for future authentication)
users: id, email, name, createdAt, updatedAt

-- Chat sessions for organizing conversations
chat_sessions: id, userId, title, description, createdAt, updatedAt

-- Messages for storing all chat content
messages: id, sessionId, content, role, timestamp, metadata
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- NPM or Yarn package manager
- OpenAI API key (get from [OpenAI Platform](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd orien-career-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXTAUTH_SECRET=your_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:setup` - Generate and run migrations

## 🎯 Usage Guide

### Starting a New Conversation
1. Click "New Chat" or "Start Your First Chat"
2. Type your career-related question or concern
3. The AI will provide personalized guidance and ask follow-up questions

### Managing Sessions
- **View All Sessions**: Use the sidebar to see all your chat sessions
- **Continue Conversation**: Click on any previous session to continue
- **Delete Sessions**: Hover over a session and click the delete button
- **Session Titles**: AI automatically generates meaningful titles based on conversation content

### Example Conversations
- "I'm considering a career change from marketing to software development"
- "How can I improve my interview skills?"
- "What skills should I develop for a data science career?"
- "I'm feeling stuck in my current role, what are my options?"

## 🛠️ Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── chat/           # Chat-specific components
│   ├── ui/             # Reusable UI components
│   └── providers/      # Context providers
├── lib/                # Utility libraries
│   ├── ai/             # AI service integration
│   ├── db/             # Database schema and connection
│   ├── trpc/           # tRPC configuration
│   └── utils/          # Helper functions
└── server/             # tRPC server routes
    └── api/            # API route handlers
```

### Key Components
- **ChatInterface**: Main chat UI with message display and input
- **ChatSessionList**: Sidebar for session management
- **ChatMessage**: Individual message component with formatting
- **ChatInput**: Message input with form validation

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Environment Variables for Production**
   ```env
   OPENAI_API_KEY=your_production_api_key
   NEXTAUTH_SECRET=your_production_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

## 📝 Assignment Completion Checklist

### ✅ Completed Requirements

#### Step 1: Project Setup
- [x] Next.js application with TypeScript
- [x] Public GitHub repository ready
- [x] All required dependencies installed
- [x] Proper development environment setup

#### Step 2: Application Architecture
- [x] Chat interface with message history
- [x] Chat session management system
- [x] Responsive design for mobile and desktop
- [x] tRPC routers for all operations
- [x] Database operations with proper schema
- [x] AI integration with OpenAI API

#### Step 3: Core Features
- [x] AI Career Counselor chat functionality
- [x] Message persistence in database
- [x] Chat history with pagination
- [x] Session continuation capability
- [x] Proper conversation flow and context

#### Step 4: Advanced Features (Bonus)
- [x] Enhanced UI/UX with loading states
- [x] Real-time typing indicators
- [x] Dark/light theme support
- [x] Proper error handling throughout

#### Step 5: Code Quality
- [x] TypeScript best practices followed
- [x] Comprehensive error handling
- [x] Consistent code formatting
- [x] Meaningful comments throughout codebase

#### Step 6: Documentation
- [x] Comprehensive README.md
- [x] Setup instructions included
- [x] Technology documentation links
- [x] Development workflow documented

## 🔧 Customization

### AI Behavior
Edit `src/lib/ai/career-counselor.ts` to modify:
- System prompt and personality
- Response length and style
- Conversation flow logic
- Model parameters (temperature, max tokens)

### UI Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.ts` for design system changes
- Customize components in `src/components/ui/`

### Database Schema
- Edit `src/lib/db/schema.ts` for schema changes
- Run `npm run db:generate` to create migrations
- Apply changes with `npm run db:migrate`

## 📚 Technology Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the documentation links
3. Check existing GitHub issues
4. Create a new issue with detailed information

## 📄 License

This project is created for the Oration AI Software Engineer assignment and is not intended for commercial use.

---

**Built with ❤️ for Oration AI Assignment**

*Demonstrating modern web development skills with React, TypeScript, tRPC, and AI integration*
