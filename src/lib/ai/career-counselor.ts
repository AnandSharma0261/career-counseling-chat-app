/**
 * AI service for career counseling chat functionality
 * Supports both OpenAI and Google Gemini APIs
 */
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const gemini = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;

// Get AI provider from environment
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';

/**
 * System prompt for the career counselor AI
 * Defines the AI's role and personality for consistent responses
 */
const CAREER_COUNSELOR_PROMPT = `You are an experienced and empathetic career counselor with over 15 years of experience helping people navigate their professional journeys. Your expertise includes:

- Career exploration and assessment
- Job search strategies and techniques
- Resume and interview preparation
- Professional development planning
- Work-life balance and career transitions
- Industry insights and market trends
- Skill development recommendations

Your communication style is:
- Warm, supportive, and encouraging
- Professional yet approachable
- Ask thoughtful follow-up questions
- Provide actionable, practical advice
- Tailor responses to individual circumstances
- Maintain confidentiality and trust

Always respond in a helpful, encouraging manner while providing concrete steps and resources when possible. If you don't know something specific about an industry or role, acknowledge this and suggest ways the person can research further.`;

/**
 * Interface for chat message
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate AI response for career counseling
 * @param messages - Array of chat messages for context
 * @returns Promise<string> - AI-generated response
 */
export async function generateCareerAdvice(messages: ChatMessage[]): Promise<string> {
  try {
    console.log('🤖 AI Provider:', AI_PROVIDER);
    console.log('🔑 Gemini available:', !!gemini);
    console.log('🔑 OpenAI available:', !!openai);
    
    if (AI_PROVIDER === 'gemini' && gemini) {
      console.log('Using Gemini for response generation...');
      return await generateGeminiResponse(messages);
    } else if (AI_PROVIDER === 'openai' && openai) {
      console.log('Using OpenAI for response generation...');
      return await generateOpenAIResponse(messages);
    } else {
      console.error(`❌ AI provider '${AI_PROVIDER}' not configured or unavailable`);
      throw new Error(`AI provider '${AI_PROVIDER}' not configured or unavailable`);
    }
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    
    // Fallback response if API fails
    return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or feel free to rephrase your question. In the meantime, I'd encourage you to think about what specific aspects of your career you'd like to explore or improve.";
  }
}

/**
 * Generate response using Google Gemini
 */
async function generateGeminiResponse(messages: ChatMessage[]): Promise<string> {
  console.log('🚀 Starting Gemini response generation...');
  
  if (!gemini) {
    console.error('❌ Google Gemini not initialized');
    throw new Error('Google Gemini not initialized');
  }

  try {
    const model = gemini.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    console.log('✅ Gemini model initialized');

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'user') {
      console.error('❌ No user message found');
      throw new Error('No user message found');
    }

    console.log('📝 User message:', latestMessage.content);

    // Simple, direct prompt that works well with Gemini
    const prompt = `You are a professional career counselor. A user has asked: "${latestMessage.content}"

Please provide helpful, supportive career advice. Be practical and encouraging in your response.`;

    console.log('🔄 Sending request to Gemini...');
    
    const result = await model.generateContent(prompt);
    console.log('✅ Received result from Gemini');
    
    const response = await result.response;
    console.log('✅ Got response object');
    
    const text = response.text();
    console.log('📄 Response text:', text.substring(0, 100) + '...');
    console.log('📄 Response length:', text.length);

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Gemini');
    }

    return text.trim();
  } catch (error: any) {
    console.error('❌ Gemini API Error Details:', {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Unknown',
      stack: error?.stack || 'No stack trace'
    });
    // Re-throw the error to be caught by the main function
    throw error;
  }
}

/**
 * Generate response using OpenAI
 */
async function generateOpenAIResponse(messages: ChatMessage[]): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI not initialized');
  }

  // Prepare messages with system prompt
  const chatMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: CAREER_COUNSELOR_PROMPT,
    },
    ...messages.map((msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  // Generate response using OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: chatMessages,
    max_tokens: 500,
    temperature: 0.7,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  });

  const response = completion.choices[0]?.message?.content;
  
  if (!response) {
    throw new Error('No response generated from OpenAI');
  }

  return response;
}

/**
 * Generate a session title based on the first user message
 * @param firstMessage - The initial user message
 * @returns Promise<string> - Generated session title
 */
export async function generateSessionTitle(firstMessage: string): Promise<string> {
  try {
    if (AI_PROVIDER === 'gemini' && gemini) {
      return await generateGeminiTitle(firstMessage);
    } else if (AI_PROVIDER === 'openai' && openai) {
      return await generateOpenAITitle(firstMessage);
    } else {
      // Fallback: Generate simple title from first few words
      const words = firstMessage.split(' ').slice(0, 4);
      return words.join(' ') + '...';
    }
  } catch (error) {
    console.error('Error generating session title:', error);
    return 'Career Discussion';
  }
}

/**
 * Generate title using Google Gemini
 */
async function generateGeminiTitle(firstMessage: string): Promise<string> {
  if (!gemini) {
    throw new Error('Google Gemini not initialized');
  }

  const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Generate a short, descriptive title (3-6 words) for a career counseling session based on this user message: "${firstMessage}". Focus on the main topic or concern. Only return the title, nothing else.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const title = response.text().trim();

  return title || 'Career Discussion';
}

/**
 * Generate title using OpenAI
 */
async function generateOpenAITitle(firstMessage: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI not initialized');
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Generate a short, descriptive title (3-6 words) for a career counseling session based on the user\'s first message. Focus on the main topic or concern.',
      },
      {
        role: 'user',
        content: firstMessage,
      },
    ],
    max_tokens: 20,
    temperature: 0.5,
  });

  return completion.choices[0]?.message?.content || 'Career Discussion';
}
