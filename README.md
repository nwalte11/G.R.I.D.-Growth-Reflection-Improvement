# G.R.I.D. - Growth Reflection Improvement Development

A full-stack interactive dashboard for tracking and improving cognitive, professional, physical, psychological, writing, and appearance skills with personalized assessments and progress analytics.

## Features

- **Daily Entry System**: Structured AI prompts for psychology, writing, and physical tracking
- **Input Forms**: Capture user responses, workouts, and caloric intake
- **Database Storage**: SQLite database with timestamps for all entries
- **AI Analysis**: OpenAI integration to analyze responses and provide personalized feedback
- **Dashboard**: View today's entry and browse past entries

## Tech Stack

- **Frontend**: Next.js 14 with React and TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **AI**: OpenAI API (GPT-3.5-turbo)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nwalte11/G.R.I.D.-Growth-Reflection-Improvement.git
cd G.R.I.D.-Growth-Reflection-Improvement
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Daily Entry

1. Each day, the system generates three prompts:
   - **Psychology Reflection**: Questions about emotions, growth, and self-awareness
   - **Writing Prompt**: Creative writing exercises and personal narratives
   - **Physical Reflection**: Questions about body awareness and physical well-being

2. Fill in your responses to each prompt

3. Add your workout details and caloric intake for the day

4. Click **Save Entry** to store your data

5. Click **Get AI Feedback** to receive personalized analysis and suggestions from OpenAI

### Past Entries

Scroll down to view your historical entries. Each entry shows:
- Date and timestamp
- Preview of responses
- Workout and calorie information
- Indicator if AI feedback is available

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/       # OpenAI integration endpoint
│   │   └── entries/       # CRUD operations for entries
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── lib/
│   ├── database.ts        # Database operations
│   └── prompts.ts         # AI prompt generation
├── .env.example           # Environment variable template
├── .gitignore            
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Database Schema

The application uses SQLite with the following schema:

```sql
CREATE TABLE entries (
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
```

## API Endpoints

### GET /api/entries
Get all entries or a specific entry by date.

**Query Parameters:**
- `date` (optional): Get entry for specific date (YYYY-MM-DD)

### POST /api/entries
Create or update an entry.

**Body:**
```json
{
  "date": "2024-01-20",
  "psychology_response": "...",
  "writing_response": "...",
  "physical_response": "...",
  "workout": "30 min run",
  "caloric_intake": 2000
}
```

### POST /api/analyze
Analyze responses with OpenAI and save feedback.

**Body:**
```json
{
  "date": "2024-01-20",
  "psychology_response": "...",
  "writing_response": "...",
  "physical_response": "..."
}
```

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## License

ISC
