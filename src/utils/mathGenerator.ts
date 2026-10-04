import { MathCategory, DifficultyLevel, MathQuestion } from '../types';

interface MathTheme {
  emoji: string;
  name: string;
}

const THEMES: MathTheme[] = [
  { emoji: '🍎', name: 'apples' },
  { emoji: '⭐', name: 'stars' },
  { emoji: '🍪', name: 'cookies' },
  { emoji: '🎈', name: 'balloons' },
  { emoji: '🦆', name: 'ducklings' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🐠', name: 'fish' },
  { emoji: '🚀', name: 'rockets' },
  { emoji: '🐱', name: 'kittens' },
  { emoji: '🍩', name: 'donuts' },
  { emoji: '🥕', name: 'carrots' },
  { emoji: '💎', name: 'gems' },
];

function getRandomTheme(): MathTheme {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correctAnswer: number, maxRange: number): number[] {
  const options = new Set<number>([correctAnswer]);
  const offsets = [-2, -1, 1, 2, 3, -3];

  // Try neighboring offsets
  for (const offset of offsets) {
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate <= maxRange && candidate !== correctAnswer) {
      options.add(candidate);
      if (options.size >= 4) break;
    }
  }

  // Fallback random numbers if needed
  while (options.size < 4) {
    const rand = getRandomInt(Math.max(0, correctAnswer - 5), correctAnswer + 5);
    options.add(rand);
  }

  // Shuffle options
  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function generateQuestion(category: MathCategory, difficulty: DifficultyLevel): MathQuestion {
  const theme = getRandomTheme();
  const id = 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

  let num1 = 1;
  let num2 = 1;
  let operator: '+' | '-' | '×' | '÷' | 'count' = '+';
  let correctAnswer = 2;
  let prompt = '';
  let maxRange = 10;

  switch (category) {
    case 'count': {
      operator = 'count';
      const maxCount = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 15;
      num1 = getRandomInt(1, maxCount);
      num2 = 0;
      correctAnswer = num1;
      maxRange = maxCount + 4;
      prompt = `How many ${theme.name} do you count?`;
      break;
    }

    case 'add': {
      operator = '+';
      const maxSum = difficulty === 1 ? 5 : difficulty === 2 ? 10 : difficulty === 3 ? 20 : 50;
      maxRange = maxSum + 5;
      num1 = getRandomInt(1, Math.floor(maxSum * 0.65));
      num2 = getRandomInt(1, maxSum - num1);
      correctAnswer = num1 + num2;
      prompt = `What is ${num1} + ${num2}?`;
      break;
    }

    case 'subtract': {
      operator = '-';
      const maxVal = difficulty === 1 ? 5 : difficulty === 2 ? 10 : difficulty === 3 ? 20 : 40;
      maxRange = maxVal;
      num1 = getRandomInt(2, maxVal);
      num2 = getRandomInt(1, num1);
      correctAnswer = num1 - num2;
      prompt = `What is ${num1} - ${num2}?`;
      break;
    }

    case 'multiply': {
      operator = '×';
      const maxFactor = difficulty <= 2 ? 5 : difficulty === 3 ? 7 : 10;
      num1 = getRandomInt(2, maxFactor);
      num2 = getRandomInt(1, difficulty <= 2 ? 4 : 6);
      correctAnswer = num1 * num2;
      maxRange = correctAnswer + 8;
      prompt = `What is ${num1} × ${num2}?`;
      break;
    }

    case 'divide': {
      operator = '÷';
      const divisorMax = difficulty <= 2 ? 4 : 5;
      num2 = getRandomInt(2, divisorMax);
      correctAnswer = getRandomInt(1, difficulty <= 2 ? 4 : 6);
      num1 = num2 * correctAnswer; // guarantees clean integer division
      maxRange = Math.max(10, correctAnswer + 5);
      prompt = `Share ${num1} ${theme.name} equally among ${num2} friends. How many each?`;
      break;
    }
  }

  const options = generateOptions(correctAnswer, maxRange);

  return {
    id,
    category,
    num1,
    num2,
    operator,
    correctAnswer,
    options,
    emoji: theme.emoji,
    itemName: theme.name,
    prompt,
  };
}
