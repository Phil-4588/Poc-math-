import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, Play, RotateCcw, Award } from 'lucide-react';
import { DifficultyLevel, MathQuestion, KidProfile } from '../types';
import { generateQuestion } from '../utils/mathGenerator';
import { pocAudio } from '../utils/audio';

interface SprintQuestProps {
  difficulty: DifficultyLevel;
  profile: KidProfile;
  onSprintCompleted: (starsEarned: number, finalScore: number) => void;
}

export const SprintQuest: React.FC<SprintQuestProps> = ({
  difficulty,
  profile,
  onSprintCompleted,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  const timerRef = useRef<number | null>(null);

  // Fetch leaderboard
  useEffect(() => {
    fetch('/api/scores')
      .then((res) => res.json())
      .then((data) => {
        if (data.scores) setLeaderboard(data.scores);
      })
      .catch(() => {});
  }, [gameOver]);

  const startSprint = () => {
    pocAudio.playCorrect();
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setCombo(1);
    const q = generateQuestion('add', difficulty);
    setQuestion(q);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endSprint();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endSprint = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setGameOver(true);
    pocAudio.playCorrect();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
    });

    const starsEarned = Math.max(1, Math.floor(score / 25));
    onSprintCompleted(starsEarned, score);

    // Post score to server
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, score, stars: starsEarned }),
    }).catch(() => {});
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectOption = (opt: number) => {
    if (!question || !isPlaying) return;

    if (opt === question.correctAnswer) {
      pocAudio.playCorrect();
      const points = 10 * combo;
      setScore((prev) => prev + points);
      setCombo((prev) => Math.min(5, prev + 1));
      // Next question
      const categories: ('add' | 'subtract' | 'count')[] = ['add', 'subtract', 'count'];
      const nextCat = categories[Math.floor(Math.random() * categories.length)];
      setQuestion(generateQuestion(nextCat, difficulty));
    } else {
      pocAudio.playTryAgain();
      setCombo(1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
          <span>⚡</span>
          <span>60-Second Math Sprint</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-800 font-medium mt-1">
          Solve as many quick math problems as you can before time runs out!
        </p>
      </div>

      {!isPlaying && !gameOver && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 shadow-md text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mx-auto mb-4 border border-amber-300 shadow-inner">
            ⏱️
          </div>
          <h3 className="text-xl font-black text-amber-950 mb-2">Ready, Set, Go!</h3>
          <p className="text-xs text-amber-700 font-medium mb-6">
            Get combos to multiply your score and earn bonus stars!
          </p>
          <button
            type="button"
            onClick={startSprint}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg shadow-lg shadow-emerald-300/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play size={20} className="fill-white" />
            <span>Start Sprint!</span>
          </button>
        </div>
      )}

      {isPlaying && question && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-md space-y-5">
          {/* Top Bar: Timer, Score & Combo */}
          <div className="flex items-center justify-between gap-3">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-100 border border-amber-300 font-black text-sm text-amber-950">
              <Timer size={16} className="text-amber-700 animate-spin" />
              <span>{timeLeft}s</span>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 font-black text-xl text-amber-950 font-mono">
              <span>Score:</span>
              <span className="text-emerald-600">{score}</span>
            </div>

            {/* Combo multiplier badge */}
            <div className="px-3 py-1 rounded-2xl bg-orange-100 border border-orange-300 text-orange-700 font-black text-xs flex items-center gap-1">
              <Zap size={14} className="fill-orange-500" />
              <span>{combo}x Combo</span>
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-3 rounded-full bg-amber-100 overflow-hidden border border-amber-200">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>

          {/* Rapid-fire Equation */}
          <div className="py-6 text-center rounded-2xl bg-amber-50/70 border border-amber-200">
            <span className="text-4xl sm:text-6xl font-black text-amber-950 font-mono">
              {question.category === 'count' ? (
                <span>Count: {question.emoji.repeat(question.num1)}</span>
              ) : (
                <span>
                  {question.num1} {question.operator} {question.num2} = ?
                </span>
              )}
            </span>
          </div>

          {/* 4 Quick Options */}
          <div className="grid grid-cols-2 gap-3.5">
            {question.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="h-16 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-2xl flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameOver && (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 shadow-md text-center max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center text-4xl mx-auto border border-amber-300">
            🏆
          </div>
          <h3 className="text-2xl font-black text-amber-950">Sprint Complete!</h3>
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 font-mono">
            <p className="text-xs text-amber-700 font-bold uppercase">Final Score</p>
            <p className="text-4xl font-black text-emerald-600 mt-1">{score}</p>
            <p className="text-xs text-amber-800 font-bold mt-2">
              ⭐ +{Math.max(1, Math.floor(score / 25))} Stars Added to Your Chest!
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={startSprint}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}

      {/* High Scores Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="bg-amber-50/80 rounded-3xl border-2 border-amber-200 p-5 shadow-xs">
          <h4 className="text-sm font-black text-amber-950 flex items-center gap-2 mb-3">
            <Award size={16} className="text-amber-600" />
            <span>Top Poc Math Sprinters</span>
          </h4>
          <div className="space-y-1.5">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 text-amber-600 font-black">{idx + 1}.</span>
                  <span className="text-amber-950">{entry.name}</span>
                </div>
                <span className="font-mono text-emerald-700">{entry.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
