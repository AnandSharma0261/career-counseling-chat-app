/**
 * AI Service - Handles communication with different AI providers
 * Supports both OpenAI and Google Gemini
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  tokensUsed?: number;
}

class AIService {
  private geminiAI: GoogleGenerativeAI | null = null;
  private provider: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize Google Gemini
    if (process.env.GOOGLE_AI_API_KEY) {
      this.geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    }
  }

  async generateResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    try {
      if (this.provider === 'gemini' && this.geminiAI) {
        return await this.generateGeminiResponse(messages, systemPrompt);
      } else if (this.provider === 'openai') {
        return await this.generateOpenAIResponse(messages, systemPrompt);
      } else {
        throw new Error(`AI provider '${this.provider}' not configured`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private async generateGeminiResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    if (!this.geminiAI) {
      throw new Error('Google Gemini not initialized');
    }

    const model = this.geminiAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create the conversation context
    let conversationContext = '';
    
    if (systemPrompt) {
      conversationContext += `System: ${systemPrompt}\n\n`;
    }

    // Add conversation history
    messages.forEach((message) => {
      const role = message.role === 'user' ? 'User' : 'Assistant';
      conversationContext += `${role}: ${message.content}\n\n`;
    });

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'user') {
      throw new Error('No user message found');
    }

    // Generate response
    const prompt = `${conversationContext}Please respond as a professional career counselor to the latest user message.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      content: text.trim(),
      tokensUsed: response.usageMetadata?.totalTokenCount || 0,
    };
  }

  private async generateOpenAIResponse(
    messages: AIMessage[],
    systemPrompt?: string
  ): Promise<AIResponse> {
    // OpenAI implementation (for future use)
    throw new Error('OpenAI implementation not yet available');
  }

  // Career counselor system prompt
  static getCareerCounselorPrompt(): string {
    return `You are a professional career counselor with expertise in:
- Career planning and development
- Job search strategies
- Resume and interview preparation
- Skills development and training
- Industry insights and trends
- Professional networking
- Work-life balance
- Career transitions

Guidelines for responses:
1. Be supportive, encouraging, and professional
2. Provide actionable, practical advice
3. Ask follow-up questions when needed for better guidance
4. Share relevant examples or case studies when helpful
5. Keep responses concise but comprehensive
6. Focus on the user's specific situation and goals
7. Maintain confidentiality and professionalism

Always aim to empower users to make informed career decisions and take meaningful steps toward their professional goals.`;
  }
}

export const aiService = new AIService();
