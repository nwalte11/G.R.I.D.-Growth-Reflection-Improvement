import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'grid.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    psychology_prompt TEXT,
    psychology_response TEXT,
    writing_prompt TEXT,
    writing_response TEXT,
    physical_prompt TEXT,
    physical_response TEXT,
    workout TEXT,
    caloric_intake INTEGER,
    ai_feedback TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
`);

export interface Entry {
  id?: number;
  date: string;
  psychology_prompt?: string;
  psychology_response?: string;
  writing_prompt?: string;
  writing_response?: string;
  physical_prompt?: string;
  physical_response?: string;
  workout?: string;
  caloric_intake?: number;
  ai_feedback?: string;
  created_at?: string;
  updated_at?: string;
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Create or update an entry
export function upsertEntry(entry: Entry): Entry {
  const stmt = db.prepare(`
    INSERT INTO entries (
      date, psychology_prompt, psychology_response, 
      writing_prompt, writing_response, 
      physical_prompt, physical_response,
      workout, caloric_intake, ai_feedback, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(date) DO UPDATE SET
      psychology_prompt = excluded.psychology_prompt,
      psychology_response = excluded.psychology_response,
      writing_prompt = excluded.writing_prompt,
      writing_response = excluded.writing_response,
      physical_prompt = excluded.physical_prompt,
      physical_response = excluded.physical_response,
      workout = excluded.workout,
      caloric_intake = excluded.caloric_intake,
      ai_feedback = excluded.ai_feedback,
      updated_at = CURRENT_TIMESTAMP
  `);

  stmt.run(
    entry.date,
    entry.psychology_prompt || null,
    entry.psychology_response || null,
    entry.writing_prompt || null,
    entry.writing_response || null,
    entry.physical_prompt || null,
    entry.physical_response || null,
    entry.workout || null,
    entry.caloric_intake || null,
    entry.ai_feedback || null
  );

  return getEntryByDate(entry.date)!;
}

// Get entry by date
export function getEntryByDate(date: string): Entry | undefined {
  const stmt = db.prepare('SELECT * FROM entries WHERE date = ?');
  return stmt.get(date) as Entry | undefined;
}

// Get all entries, ordered by date descending
export function getAllEntries(): Entry[] {
  const stmt = db.prepare('SELECT * FROM entries ORDER BY date DESC');
  return stmt.all() as Entry[];
}

// Get recent entries with limit
export function getRecentEntries(limit: number = 10): Entry[] {
  const stmt = db.prepare('SELECT * FROM entries ORDER BY date DESC LIMIT ?');
  return stmt.all(limit) as Entry[];
}

export default db;
