/**
 * Test endpoint to verify Gemini API integration
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing Gemini API...');
    
    // Check if API key exists
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GOOGLE_AI_API_KEY not found in environment variables'
      });
    }

    // Initialize Gemini
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('✅ Gemini model initialized');

    // Simple test prompt
    const testPrompt = 'Say "Hello! Gemini API is working correctly." in a friendly tone.';
    
    console.log('🔄 Sending test request...');
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Received response:', text);

    return NextResponse.json({
      success: true,
      response: text,
      provider: 'gemini'
    });

  } catch (error: any) {
    console.error('❌ Gemini test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: error.toString()
    });
  }
}
