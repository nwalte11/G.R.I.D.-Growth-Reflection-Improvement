import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePsychologicalPrompt(): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a psychological coach. Generate a thought-provoking scenario or question that helps users reflect on their emotions, behaviors, and mental patterns. Keep it under 200 words.'
      },
      {
        role: 'user',
        content: 'Generate a unique psychological reflection prompt for today.'
      }
    ],
    temperature: 0.8,
  });

  return completion.choices[0].message.content || 'What emotions did you experience today, and what triggered them?';
}

export async function generateWritingPrompt(): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a writing coach. Generate a creative writing exercise that emphasizes active voice and strong verbs. Keep it under 150 words.'
      },
      {
        role: 'user',
        content: 'Generate a writing exercise focused on using active tone.'
      }
    ],
    temperature: 0.8,
  });

  return completion.choices[0].message.content || 'Write a paragraph describing your morning using only active voice and strong action verbs.';
}

export async function generatePhysicalPrompt(): Promise<string> {
  const prompts = [
    'Log your workout today: What exercises did you complete? How long? What intensity?',
    'Track your nutrition: What did you eat today? Estimate calories and macros.',
    'Reflect on your physical state: How is your energy level? Any physical discomfort?',
    'Log your sleep and recovery: How many hours did you sleep? How do you feel today?'
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export async function analyzeResponse(prompt: string, response: string, type: string): Promise<string> {
  let systemPrompt = '';
  
  if (type === 'psychological') {
    systemPrompt = 'You are a supportive psychological coach. Analyze the user\'s response to their reflection prompt. Provide constructive, empathetic feedback (100-150 words) that acknowledges their insights and offers gentle guidance for growth.';
  } else if (type === 'writing') {
    systemPrompt = 'You are a writing coach. Analyze the user\'s writing for use of active voice, strong verbs, and clarity. Provide specific feedback (100-150 words) on what they did well and areas for improvement.';
  } else if (type === 'physical') {
    systemPrompt = 'You are a fitness and nutrition coach. Review the user\'s physical log entry. Provide encouraging feedback (100-150 words) and practical suggestions for their fitness or nutrition journey.';
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Prompt: ${prompt}\n\nUser's Response: ${response}\n\nProvide feedback:`
      }
    ],
    temperature: 0.7,
  });

  return completion.choices[0].message.content || 'Thank you for your response. Keep up the great work!';
}
