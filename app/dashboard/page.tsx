'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Prompt {
  id: string;
  type: 'psychological' | 'writing' | 'physical';
  prompt: string;
  response?: string;
  feedback?: string;
  completedAt?: string;
}

interface ProgressData {
  date: string;
  promptsCompleted: number;
  workoutsCompleted: number;
  caloriesLogged: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompts' | 'workout' | 'calories' | 'progress'>('prompts');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  
  const [workoutForm, setWorkoutForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    duration: '',
    intensity: 'moderate',
    notes: '',
  });

  const [calorieForm, setCalorieForm] = useState({
    date: new Date().toISOString().split('T')[0],
    meal: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/auth?mode=login');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchDailyPrompts(token);
    fetchProgressData(token);
  }, [router]);

  const fetchDailyPrompts = async (token: string) => {
    try {
      const response = await fetch('/api/prompts/daily', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPrompts(data.prompts || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressData = async (token: string) => {
    try {
      const response = await fetch('/api/progress/data?days=30', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProgressData(data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleSubmitResponse = async (promptId: string) => {
    if (!response.trim()) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/prompts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ promptId, response }),
      });

      const data = await res.json();
      
      setPrompts(prompts.map(p => 
        p.id === promptId 
          ? { ...p, response, feedback: data.feedback, completedAt: new Date().toISOString() }
          : p
      ));
      
      setResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/workouts/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workoutForm),
      });
      
      setWorkoutForm({
        date: new Date().toISOString().split('T')[0],
        type: '',
        duration: '',
        intensity: 'moderate',
        notes: '',
      });
      
      alert('Workout logged successfully!');
      if (token) fetchProgressData(token);
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  const handleLogCalories = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/calories/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(calorieForm),
      });
      
      setCalorieForm({
        date: new Date().toISOString().split('T')[0],
        meal: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        notes: '',
      });
      
      alert('Calories logged successfully!');
      if (token) fetchProgressData(token);
    } catch (error) {
      console.error('Error logging calories:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">G.R.I.D.</h1>
              <span className="text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'prompts', label: 'Daily Prompts', icon: '📝' },
              { id: 'workout', label: 'Log Workout', icon: '💪' },
              { id: 'calories', label: 'Log Calories', icon: '🍎' },
              { id: 'progress', label: 'Progress', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'prompts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today&apos;s Prompts</h2>
            
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    prompt.type === 'psychological' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    prompt.type === 'writing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {prompt.type.charAt(0).toUpperCase() + prompt.type.slice(1)}
                  </span>
                  {prompt.completedAt && (
                    <span className="ml-3 text-sm text-green-600 dark:text-green-400">✓ Completed</span>
                  )}
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 mb-4">{prompt.prompt}</p>
                
                {!prompt.completedAt ? (
                  <div className="space-y-4">
                    <textarea
                      value={activePrompt?.id === prompt.id ? response : ''}
                      onChange={(e) => {
                        setActivePrompt(prompt);
                        setResponse(e.target.value);
                      }}
                      placeholder="Your response..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-32"
                    />
                    <button
                      onClick={() => handleSubmitResponse(prompt.id)}
                      disabled={submitting || !response.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Response'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Response:</h4>
                      <p className="text-gray-700 dark:text-gray-300">{prompt.response}</p>
                    </div>
                    {prompt.feedback && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">AI Feedback:</h4>
                        <p className="text-blue-800 dark:text-blue-300">{prompt.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Log Workout</h2>
            <form onSubmit={handleLogWorkout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={workoutForm.date}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workout Type</label>
                <input
                  type="text"
                  value={workoutForm.type}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                  placeholder="e.g., Running, Weight Training, Yoga"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={workoutForm.duration}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Intensity</label>
                <select
                  value={workoutForm.intensity}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, intensity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <textarea
                  value={workoutForm.notes}
                  onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Log Workout
              </button>
            </form>
          </div>
        )}

        {activeTab === 'calories' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Log Calories</h2>
            <form onSubmit={handleLogCalories} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  value={calorieForm.date}
                  onChange={(e) => setCalorieForm({ ...calorieForm, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal</label>
                <input
                  type="text"
                  value={calorieForm.meal}
                  onChange={(e) => setCalorieForm({ ...calorieForm, meal: e.target.value })}
                  placeholder="e.g., Breakfast, Lunch, Snack"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
                <input
                  type="number"
                  value={calorieForm.calories}
                  onChange={(e) => setCalorieForm({ ...calorieForm, calories: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={calorieForm.protein}
                    onChange={(e) => setCalorieForm({ ...calorieForm, protein: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={calorieForm.carbs}
                    onChange={(e) => setCalorieForm({ ...calorieForm, carbs: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={calorieForm.fat}
                    onChange={(e) => setCalorieForm({ ...calorieForm, fat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                <textarea
                  value={calorieForm.notes}
                  onChange={(e) => setCalorieForm({ ...calorieForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Log Calories
              </button>
            </form>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Progress (Last 30 Days)</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Activity Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="promptsCompleted" stroke="#8b5cf6" name="Prompts Completed" />
                  <Line type="monotone" dataKey="workoutsCompleted" stroke="#3b82f6" name="Workouts" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Caloric Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="caloriesLogged" stroke="#10b981" name="Calories Logged" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
