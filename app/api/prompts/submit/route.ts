import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updatePrompt } from '@/lib/db';
import { analyzeResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { promptId, response } = await request.json();

    if (!promptId || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let feedback = 'Thank you for your response!';
    try {
      const prompt = await updatePrompt(promptId, { response });
      if (prompt) {
        feedback = await analyzeResponse(prompt.prompt, response, prompt.type);
      }
    } catch (error) {
      console.error('Error analyzing response:', error);
    }

    const updatedPrompt = await updatePrompt(promptId, {
      response,
      feedback,
      completedAt: new Date().toISOString(),
    });

    return NextResponse.json({ prompt: updatedPrompt, feedback });
  } catch (error) {
    console.error('Submit prompt error:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}
