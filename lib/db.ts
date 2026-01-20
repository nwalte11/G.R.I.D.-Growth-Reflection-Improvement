import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface DailyPrompt {
  id: string;
  userId: string;
  date: string;
  type: 'psychological' | 'writing' | 'physical';
  prompt: string;
  response?: string;
  feedback?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  type: string;
  duration: number;
  intensity: string;
  notes?: string;
  createdAt: string;
}

export interface CaloricLog {
  id: string;
  userId: string;
  date: string;
  meal: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  createdAt: string;
}

export interface ProgressData {
  userId: string;
  date: string;
  promptsCompleted: number;
  workoutsCompleted: number;
  caloriesLogged: number;
  averageFeedbackScore?: number;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// User operations
export async function getUsers(): Promise<User[]> {
  return readJsonFile<User>('users.json');
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) || null;
}

export async function createUser(user: User): Promise<User> {
  const users = await getUsers();
  users.push(user);
  await writeJsonFile('users.json', users);
  return user;
}

// Daily prompts operations
export async function getPrompts(): Promise<DailyPrompt[]> {
  return readJsonFile<DailyPrompt>('prompts.json');
}

export async function getPromptsByUserId(userId: string): Promise<DailyPrompt[]> {
  const prompts = await getPrompts();
  return prompts.filter(p => p.userId === userId);
}

export async function getPromptsByUserIdAndDate(userId: string, date: string): Promise<DailyPrompt[]> {
  const prompts = await getPrompts();
  return prompts.filter(p => p.userId === userId && p.date === date);
}

export async function createPrompt(prompt: DailyPrompt): Promise<DailyPrompt> {
  const prompts = await getPrompts();
  prompts.push(prompt);
  await writeJsonFile('prompts.json', prompts);
  return prompt;
}

export async function updatePrompt(id: string, updates: Partial<DailyPrompt>): Promise<DailyPrompt | null> {
  const prompts = await getPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  prompts[index] = { ...prompts[index], ...updates };
  await writeJsonFile('prompts.json', prompts);
  return prompts[index];
}

// Workout logs operations
export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  return readJsonFile<WorkoutLog>('workouts.json');
}

export async function getWorkoutLogsByUserId(userId: string): Promise<WorkoutLog[]> {
  const logs = await getWorkoutLogs();
  return logs.filter(l => l.userId === userId);
}

export async function createWorkoutLog(log: WorkoutLog): Promise<WorkoutLog> {
  const logs = await getWorkoutLogs();
  logs.push(log);
  await writeJsonFile('workouts.json', logs);
  return log;
}

// Caloric logs operations
export async function getCaloricLogs(): Promise<CaloricLog[]> {
  return readJsonFile<CaloricLog>('calories.json');
}

export async function getCaloricLogsByUserId(userId: string): Promise<CaloricLog[]> {
  const logs = await getCaloricLogs();
  return logs.filter(l => l.userId === userId);
}

export async function createCaloricLog(log: CaloricLog): Promise<CaloricLog> {
  const logs = await getCaloricLogs();
  logs.push(log);
  await writeJsonFile('calories.json', logs);
  return log;
}

// Progress data operations
export async function getProgressDataByUserId(userId: string, startDate: string, endDate: string): Promise<ProgressData[]> {
  const prompts = await getPromptsByUserId(userId);
  const workouts = await getWorkoutLogsByUserId(userId);
  const calories = await getCaloricLogsByUserId(userId);
  
  const dateMap = new Map<string, ProgressData>();
  
  // Process prompts
  prompts.forEach(p => {
    if (p.date >= startDate && p.date <= endDate && p.completedAt) {
      if (!dateMap.has(p.date)) {
        dateMap.set(p.date, {
          userId,
          date: p.date,
          promptsCompleted: 0,
          workoutsCompleted: 0,
          caloriesLogged: 0,
        });
      }
      const data = dateMap.get(p.date)!;
      data.promptsCompleted++;
    }
  });
  
  // Process workouts
  workouts.forEach(w => {
    if (w.date >= startDate && w.date <= endDate) {
      if (!dateMap.has(w.date)) {
        dateMap.set(w.date, {
          userId,
          date: w.date,
          promptsCompleted: 0,
          workoutsCompleted: 0,
          caloriesLogged: 0,
        });
      }
      const data = dateMap.get(w.date)!;
      data.workoutsCompleted++;
    }
  });
  
  // Process calories
  calories.forEach(c => {
    if (c.date >= startDate && c.date <= endDate) {
      if (!dateMap.has(c.date)) {
        dateMap.set(c.date, {
          userId,
          date: c.date,
          promptsCompleted: 0,
          workoutsCompleted: 0,
          caloriesLogged: 0,
        });
      }
      const data = dateMap.get(c.date)!;
      data.caloriesLogged += c.calories;
    }
  });
  
  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}
