'use client';

import { useState, useEffect } from 'react';
import { generateDailyPrompts } from '@/lib/prompts';

interface Entry {
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

export default function Home() {
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [pastEntries, setPastEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/entries');
      const entries = await response.json();

      // Find today's entry
      const today = entries.find((e: Entry) => e.date === todayDate);
      
      if (today) {
        setTodayEntry(today);
      } else {
        // Create entry with prompts for today
        const prompts = generateDailyPrompts(todayDate);
        setTodayEntry({
          date: todayDate,
          psychology_prompt: prompts.psychology,
          writing_prompt: prompts.writing,
          physical_prompt: prompts.physical,
          psychology_response: '',
          writing_response: '',
          physical_response: '',
          workout: '',
          caloric_intake: undefined,
        });
      }

      // Set past entries (excluding today)
      setPastEntries(entries.filter((e: Entry) => e.date !== todayDate));
      setLoading(false);
    } catch (err) {
      setError('Failed to load entries');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!todayEntry) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todayEntry),
      });

      if (!response.ok) {
        throw new Error('Failed to save entry');
      }

      const saved = await response.json();
      setTodayEntry(saved);
      setSaving(false);
    } catch (err) {
      setError('Failed to save entry');
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!todayEntry) return;

    try {
      setAnalyzing(true);
      setError(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayEntry.date,
          psychology_response: todayEntry.psychology_response,
          writing_response: todayEntry.writing_response,
          physical_response: todayEntry.physical_response,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze responses');
      }

      const result = await response.json();
      setTodayEntry({ ...todayEntry, ai_feedback: result.feedback });
      setAnalyzing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze responses');
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            G.R.I.D. Daily Entry
          </h1>
          <p className="text-gray-600">
            Growth • Reflection • Improvement • Development
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Today's Entry */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Today's Entry - {todayDate}
          </h2>

          {todayEntry && (
            <div className="space-y-6">
              {/* Psychology Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  Psychology Reflection
                </h3>
                <p className="text-gray-700 mb-3 italic">
                  {todayEntry.psychology_prompt}
                </p>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={4}
                  placeholder="Your response..."
                  value={todayEntry.psychology_response || ''}
                  onChange={(e) =>
                    setTodayEntry({
                      ...todayEntry,
                      psychology_response: e.target.value,
                    })
                  }
                />
              </div>

              {/* Writing Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Writing Prompt
                </h3>
                <p className="text-gray-700 mb-3 italic">
                  {todayEntry.writing_prompt}
                </p>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  rows={4}
                  placeholder="Your response..."
                  value={todayEntry.writing_response || ''}
                  onChange={(e) =>
                    setTodayEntry({
                      ...todayEntry,
                      writing_response: e.target.value,
                    })
                  }
                />
              </div>

              {/* Physical Section */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-600">
                  Physical Reflection
                </h3>
                <p className="text-gray-700 mb-3 italic">
                  {todayEntry.physical_prompt}
                </p>
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  rows={4}
                  placeholder="Your response..."
                  value={todayEntry.physical_response || ''}
                  onChange={(e) =>
                    setTodayEntry({
                      ...todayEntry,
                      physical_response: e.target.value,
                    })
                  }
                />
              </div>

              {/* Workout and Caloric Intake */}
              <div className="grid md:grid-cols-2 gap-6 pb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">
                    Workout
                  </h3>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    rows={3}
                    placeholder="Describe your workout (e.g., 30 min run, yoga, weights)..."
                    value={todayEntry.workout || ''}
                    onChange={(e) =>
                      setTodayEntry({ ...todayEntry, workout: e.target.value })
                    }
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">
                    Caloric Intake
                  </h3>
                  <input
                    type="number"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900"
                    placeholder="Total calories consumed today..."
                    value={todayEntry.caloric_intake || ''}
                    onChange={(e) =>
                      setTodayEntry({
                        ...todayEntry,
                        caloric_intake: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                >
                  {saving ? 'Saving...' : 'Save Entry'}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || !todayEntry.psychology_response}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                >
                  {analyzing ? 'Analyzing...' : 'Get AI Feedback'}
                </button>
              </div>

              {/* AI Feedback */}
              {todayEntry.ai_feedback && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800">
                    AI Feedback
                  </h3>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {todayEntry.ai_feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Past Entries */}
        {pastEntries.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Past Entries
            </h2>
            <div className="space-y-4">
              {pastEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {entry.date}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {entry.updated_at ? new Date(entry.updated_at).toLocaleString() : ''}
                    </span>
                  </div>
                  
                  {entry.psychology_response && (
                    <div className="mb-2">
                      <span className="font-semibold text-blue-600">Psychology: </span>
                      <span className="text-gray-700">
                        {entry.psychology_response.substring(0, 100)}
                        {entry.psychology_response.length > 100 ? '...' : ''}
                      </span>
                    </div>
                  )}
                  
                  {entry.workout && (
                    <div className="mb-2">
                      <span className="font-semibold text-orange-600">Workout: </span>
                      <span className="text-gray-700">{entry.workout}</span>
                    </div>
                  )}
                  
                  {entry.caloric_intake && (
                    <div className="mb-2">
                      <span className="font-semibold text-orange-600">Calories: </span>
                      <span className="text-gray-700">{entry.caloric_intake}</span>
                    </div>
                  )}
                  
                  {entry.ai_feedback && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ AI Feedback Available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
