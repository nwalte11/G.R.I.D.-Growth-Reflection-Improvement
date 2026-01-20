import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateId } from '@/lib/auth';
import { getPromptsByUserIdAndDate, createPrompt } from '@/lib/db';
import { generatePsychologicalPrompt, generateWritingPrompt, generatePhysicalPrompt } from '@/lib/openai';

export async function GET(request: NextRequest) {
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

    const today = new Date().toISOString().split('T')[0];
    const existingPrompts = await getPromptsByUserIdAndDate(decoded.userId, today);

    if (existingPrompts.length > 0) {
      return NextResponse.json({ prompts: existingPrompts });
    }

    // Generate new prompts for today
    const prompts = [];
    
    try {
      const psychPrompt = await generatePsychologicalPrompt();
      prompts.push(await createPrompt({
        id: generateId(),
        userId: decoded.userId,
        date: today,
        type: 'psychological',
        prompt: psychPrompt,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error generating psychological prompt:', error);
      prompts.push(await createPrompt({
        id: generateId(),
        userId: decoded.userId,
        date: today,
        type: 'psychological',
        prompt: 'What emotions did you experience today, and what triggered them?',
        createdAt: new Date().toISOString(),
      }));
    }

    try {
      const writePrompt = await generateWritingPrompt();
      prompts.push(await createPrompt({
        id: generateId(),
        userId: decoded.userId,
        date: today,
        type: 'writing',
        prompt: writePrompt,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error generating writing prompt:', error);
      prompts.push(await createPrompt({
        id: generateId(),
        userId: decoded.userId,
        date: today,
        type: 'writing',
        prompt: 'Write a paragraph describing your morning using only active voice and strong action verbs.',
        createdAt: new Date().toISOString(),
      }));
    }

    const physPrompt = await generatePhysicalPrompt();
    prompts.push(await createPrompt({
      id: generateId(),
      userId: decoded.userId,
      date: today,
      type: 'physical',
      prompt: physPrompt,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Daily prompts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily prompts' },
      { status: 500 }
    );
  }
}
