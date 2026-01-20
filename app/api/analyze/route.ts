import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { upsertEntry, getEntryByDate } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, psychology_response, writing_response, physical_response } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Get the entry to access the prompts
    const entry = getEntryByDate(date);
    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Prepare the content for analysis
    const analysisContent = `
Please analyze the following daily reflection responses and provide constructive, encouraging feedback:

PSYCHOLOGY REFLECTION:
Prompt: ${entry.psychology_prompt || 'N/A'}
Response: ${psychology_response || 'No response provided'}

WRITING REFLECTION:
Prompt: ${entry.writing_prompt || 'N/A'}
Response: ${writing_response || 'No response provided'}

PHYSICAL REFLECTION:
Prompt: ${entry.physical_prompt || 'N/A'}
Response: ${physical_response || 'No response provided'}

Please provide:
1. Key insights from their reflections
2. Patterns or themes you notice
3. Constructive suggestions for growth
4. Encouragement and positive reinforcement

Keep the feedback supportive, actionable, and personalized.
    `.trim();

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive life coach and reflective guide helping someone with their personal growth journey. Provide thoughtful, encouraging, and actionable feedback.',
        },
        {
          role: 'user',
          content: analysisContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    // Check if we got a valid response
    if (!completion.choices || completion.choices.length === 0 || !completion.choices[0]?.message?.content) {
      return NextResponse.json(
        { error: 'No feedback generated from OpenAI' },
        { status: 500 }
      );
    }

    const aiFeedback = completion.choices[0].message.content;

    // Save the feedback to the database
    const updatedEntry = upsertEntry({
      date,
      ai_feedback: aiFeedback,
    });

    return NextResponse.json({
      feedback: aiFeedback,
      entry: updatedEntry,
    });
  } catch (error: any) {
    console.error('Error analyzing with OpenAI:', error);
    
    // Provide more specific error messages
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your API usage.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to analyze responses' },
      { status: 500 }
    );
  }
}
