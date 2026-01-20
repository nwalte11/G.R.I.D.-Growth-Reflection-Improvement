// AI Prompts for daily entries

export interface DailyPrompts {
  psychology: string;
  writing: string;
  physical: string;
}

const psychologyPrompts = [
  "Reflect on a moment today when you felt most alive. What were you doing, and why did it resonate with you?",
  "Identify an emotion you experienced today that you'd like to understand better. What triggered it?",
  "What limiting belief about yourself came up today? How can you reframe it?",
  "Describe a recent interaction that challenged you. What did you learn about yourself?",
  "What are you grateful for today? How did these things impact your emotional state?",
  "Think about a decision you made today. What values guided your choice?",
  "What fear or anxiety surfaced today? What would it take to move through it?",
  "Reflect on your self-talk today. Was it supportive or critical? How can you adjust it?",
  "What boundaries did you set (or wish you had set) today? Why were they important?",
  "Describe a moment of growth or learning you experienced today, no matter how small.",
];

const writingPrompts = [
  "Write about a place from your childhood that holds special meaning. What memories does it evoke?",
  "Imagine your life 10 years from now. Describe a day in vivid detail.",
  "Write a letter to your younger self. What advice or comfort would you offer?",
  "Describe an object in your immediate surroundings in intricate detail, exploring its significance.",
  "Write about a person who changed your life. How are you different because of them?",
  "Create a short story that begins with: 'The door was already open when I arrived.'",
  "Write about a difficult truth you've had to accept. How has it shaped you?",
  "Describe your ideal creative space. What would you create there?",
  "Write about a time when you failed. What did that failure teach you?",
  "If you could have a conversation with any historical figure, who would it be and what would you discuss?",
];

const physicalPrompts = [
  "How does your body feel today? Note any areas of tension, energy, or discomfort.",
  "What physical activities brought you joy or satisfaction today?",
  "Reflect on your sleep quality last night. How has it affected your day?",
  "What did you notice about your energy levels throughout the day?",
  "How did you nourish your body today? How did your food choices make you feel?",
  "What physical sensations do you notice when you're stressed versus when you're relaxed?",
  "Describe your posture and physical presence today. What adjustments could improve your comfort?",
  "What movement or exercise would your body benefit from tomorrow?",
  "How connected do you feel to your body today? What helps you feel more embodied?",
  "What physical achievements, no matter how small, are you proud of today?",
];

function getDateBasedPrompt(prompts: string[], date: string): string {
  // Use date as seed for consistent prompts on the same day
  const dateNum = new Date(date).getTime();
  const index = dateNum % prompts.length;
  return prompts[index];
}

export function generateDailyPrompts(date: string): DailyPrompts {
  return {
    psychology: getDateBasedPrompt(psychologyPrompts, date),
    writing: getDateBasedPrompt(writingPrompts, date),
    physical: getDateBasedPrompt(physicalPrompts, date),
  };
}
