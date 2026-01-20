# G.R.I.D. - Growth Reflection Improvement Dashboard

A full-stack interactive dashboard for tracking and improving cognitive, professional, physical, psychological, writing, and appearance skills with personalized assessments and progress analytics.

## Features

### 🧠 Psychological Scenarios
- Daily AI-generated prompts for emotional reflection and mental growth
- Personalized feedback using OpenAI's GPT models
- Track your psychological journey over time

### ✍️ Writing Exercises
- Practice active voice and strong writing with AI-powered exercises
- Receive detailed feedback on clarity, tone, and verb usage
- Improve your writing skills with targeted exercises

### 💪 Physical Tracking
- Log workouts with type, duration, and intensity
- Track caloric intake with detailed macronutrient breakdown
- Visualize your fitness progress over time

### 📊 Progress Visualization
- Interactive charts showing your activity over the last 30 days
- Track prompts completed, workouts logged, and calories consumed
- Monitor your growth across all areas

### 🔒 Security
- Secure user authentication with JWT tokens
- Password hashing using bcrypt
- Protected API routes requiring authentication

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes (Node.js)
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **Data Visualization**: Recharts
- **Authentication**: JWT, bcryptjs
- **Database**: JSON file-based storage (easily upgradeable to PostgreSQL/MongoDB)

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- OpenAI API key

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

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Edit `.env` and add your configuration:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
DATABASE_PATH=./data
NODE_ENV=development
```

To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### First Time Setup

1. Navigate to the home page
2. Click "Get Started" to create an account
3. Fill in your name, email, and password
4. You'll be automatically logged in and redirected to the dashboard

### Daily Workflow

1. **Morning**: Check your daily prompts
   - Review psychological scenarios
   - Complete writing exercises
   - Log physical activities

2. **Throughout the Day**: Log activities as they happen
   - Add workout sessions with details
   - Track meals and caloric intake

3. **Evening**: Review feedback and progress
   - Read AI-generated feedback on your responses
   - Check progress charts
   - Plan for tomorrow

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── prompts/      # Daily prompts endpoints
│   │   ├── workouts/     # Workout logging
│   │   ├── calories/     # Calorie logging
│   │   └── progress/     # Progress data
│   ├── auth/             # Auth page
│   ├── dashboard/        # Main dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database operations
│   └── openai.ts         # OpenAI integration
├── data/                 # JSON database (auto-created)
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login existing user

### Prompts
- `GET /api/prompts/daily` - Get or generate daily prompts
- `POST /api/prompts/submit` - Submit response to prompt

### Physical Tracking
- `POST /api/workouts/log` - Log a workout
- `GET /api/workouts/log` - Get all workouts
- `POST /api/calories/log` - Log caloric intake
- `GET /api/calories/log` - Get all calorie logs

### Progress
- `GET /api/progress/data?days=30` - Get progress data

## Database Schema

The application uses a simple JSON file-based database with the following schemas:

- **Users**: id, email, password (hashed), name, createdAt
- **Daily Prompts**: id, userId, date, type, prompt, response, feedback, createdAt, completedAt
- **Workout Logs**: id, userId, date, type, duration, intensity, notes, createdAt
- **Caloric Logs**: id, userId, date, meal, calories, protein, carbs, fat, notes, createdAt

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

## Upgrading to Production Database

To upgrade to a production-ready database (PostgreSQL/MongoDB):

1. Install database client (e.g., `pg` for PostgreSQL)
2. Update `lib/db.ts` to use database queries instead of JSON files
3. Set up database connection with environment variables
4. Run migrations to create tables/collections

## Security Considerations

- Never commit `.env` file with real credentials
- Use strong passwords for user accounts
- Keep OpenAI API key secure and monitor usage
- In production, use HTTPS for all connections
- Implement rate limiting for API endpoints
- Add CSRF protection for production deployments

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.
