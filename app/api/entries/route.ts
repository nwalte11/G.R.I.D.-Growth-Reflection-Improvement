import { NextRequest, NextResponse } from 'next/server';
import { upsertEntry, getEntryByDate, getTodayDate, getAllEntries } from '@/lib/database';
import { generateDailyPrompts } from '@/lib/prompts';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (date) {
      // Get specific entry
      const entry = getEntryByDate(date);
      if (!entry) {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
      }
      return NextResponse.json(entry);
    } else {
      // Get all entries
      const entries = getAllEntries();
      return NextResponse.json(entries);
    }
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const date = body.date || getTodayDate();

    // Generate prompts for the date if not provided
    let entry = getEntryByDate(date);
    if (!entry || !entry.psychology_prompt) {
      const prompts = generateDailyPrompts(date);
      body.psychology_prompt = body.psychology_prompt || prompts.psychology;
      body.writing_prompt = body.writing_prompt || prompts.writing;
      body.physical_prompt = body.physical_prompt || prompts.physical;
    }

    // Upsert entry
    const savedEntry = upsertEntry({ date, ...body });
    return NextResponse.json(savedEntry);
  } catch (error) {
    console.error('Error saving entry:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}
