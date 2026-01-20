import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateId } from '@/lib/auth';
import { createWorkoutLog, getWorkoutLogsByUserId } from '@/lib/db';

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

    const { date, type, duration, intensity, notes } = await request.json();

    if (!date || !type || !duration || !intensity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const workout = await createWorkoutLog({
      id: generateId(),
      userId: decoded.userId,
      date,
      type,
      duration: Number(duration),
      intensity,
      notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Workout log error:', error);
    return NextResponse.json(
      { error: 'Failed to log workout' },
      { status: 500 }
    );
  }
}

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

    const workouts = await getWorkoutLogsByUserId(decoded.userId);
    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Get workouts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}
