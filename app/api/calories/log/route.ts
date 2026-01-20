import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateId } from '@/lib/auth';
import { createCaloricLog, getCaloricLogsByUserId } from '@/lib/db';

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

    const { date, meal, calories, protein, carbs, fat, notes } = await request.json();

    if (!date || !meal || !calories) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const caloricLog = await createCaloricLog({
      id: generateId(),
      userId: decoded.userId,
      date,
      meal,
      calories: Number(calories),
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fat: fat ? Number(fat) : undefined,
      notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ caloricLog }, { status: 201 });
  } catch (error) {
    console.error('Caloric log error:', error);
    return NextResponse.json(
      { error: 'Failed to log calories' },
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

    const calories = await getCaloricLogsByUserId(decoded.userId);
    return NextResponse.json({ calories });
  } catch (error) {
    console.error('Get calories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calories' },
      { status: 500 }
    );
  }
}
