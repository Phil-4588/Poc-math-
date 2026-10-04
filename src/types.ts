export type MathCategory = 'count' | 'add' | 'subtract' | 'multiply' | 'divide';

export type MathMode = 'quest' | 'lab' | 'sprint' | 'stickers';

export type DifficultyLevel = 1 | 2 | 3 | 4; // 1-5, 1-10, 1-20, 1-50

export interface MathQuestion {
  id: string;
  category: MathCategory;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷' | 'count';
  correctAnswer: number;
  options: number[];
  emoji: string;
  itemName: string;
  prompt: string;
}

export interface KidProfile {
  name: string;
  avatar: string;
  stars: number;
  totalSolved: number;
  streak: number;
  bestStreak: number;
  soundEnabled: boolean;
  speechEnabled: boolean;
  difficulty: DifficultyLevel;
  unlockedStickers: string[];
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  starsRequired: number;
  description: string;
}

export interface LabItem {
  id: string;
  emoji: string;
  color: string;
}
