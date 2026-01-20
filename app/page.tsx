'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-6xl text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              G.R.I.D.
            </h1>
            <p className="text-2xl text-gray-600 dark:text-gray-300 font-semibold">
              Growth • Reflection • Improvement • Dashboard
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Your personal AI-powered platform for tracking and improving cognitive, physical, 
              and psychological growth with daily prompts, personalized feedback, and progress analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Psychological Scenarios
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Daily AI-generated prompts for emotional reflection and mental growth
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Writing Exercises
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice active voice and strong writing with personalized feedback
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Physical Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Log workouts and caloric intake with progress visualization
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/auth?mode=signup')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/auth?mode=login')}
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>

          <div className="pt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>🔒 Secure user profiles • 📊 Progress visualization • 🤖 AI-powered feedback</p>
          </div>
        </div>
      </main>
    </div>
  );
}
