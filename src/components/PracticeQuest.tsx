import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { MathCategory, DifficultyLevel, MathQuestion, KidProfile } from '../types';
import { generateQuestion } from '../utils/mathGenerator';
import { VisualManipulative } from './VisualManipulative';
import { pocAudio } from '../utils/audio';

interface PracticeQuestProps {
  difficulty: DifficultyLevel;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  profile: KidProfile;
}

const CATEGORIES: { id: MathCategory; label: string; icon: string }[] = [
  { id: 'count', label: 'Counting', icon: '🍎' },
  { id: 'add', label: 'Addition', icon: '➕' },
  { id: 'subtract', label: 'Subtraction', icon: '➖' },
  { id: 'multiply', label: 'Multiply', icon: '✖️' },
  { id: 'divide', label: 'Divide', icon: '➗' },
];

export const PracticeQuest: React.FC<PracticeQuestProps> = ({
  difficulty,
  onCorrectAnswer,
  onWrongAnswer,
  profile,
}) => {
  const [currentCategory, setCurrentCategory] = useState<MathCategory>('add');
  const [question, setQuestion] = useState<MathQuestion>(() =>
    generateQuestion('add', difficulty)
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Generate new question on category or difficulty change
  useEffect(() => {
    loadNewQuestion(currentCategory);
  }, [currentCategory, difficulty]);

  const loadNewQuestion = (cat: MathCategory = currentCategory) => {
    const q = generateQuestion(cat, difficulty);
    setQuestion(q);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setFeedbackMessage('');

    // Speak prompt if speech enabled
    if (profile.speechEnabled) {
      setTimeout(() => {
        pocAudio.speak(q.prompt);
      }, 250);
    }
  };

  const handleSelectOption = (option: number) => {
    if (isAnswerCorrect === true) return; // already solved
    setSelectedOption(option);

    if (option === question.correctAnswer) {
      setIsAnswerCorrect(true);
      pocAudio.playCorrect();
      pocAudio.playStar();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6'],
      });

      const praises = [
        '⭐ Superstar! You got it!',
        '🎉 Woohoo! Brilliant math!',
        '✨ High five! That is correct!',
        '🚀 Math wizard level up!',
        '🌟 Amazing counting skills!',
      ];
      const praise = praises[Math.floor(Math.random() * praises.length)];
      setFeedbackMessage(praise);
      if (profile.speechEnabled) {
        pocAudio.speak(praise);
      }

      onCorrectAnswer();
      setAnsweredCount((prev) => prev + 1);

      // Advance after a joyful pause
      setTimeout(() => {
        loadNewQuestion(currentCategory);
      }, 1600);
    } else {
      setIsAnswerCorrect(false);
      pocAudio.playTryAgain();
      const retryTips = [
        'Almost! Count the items carefully and try again! 😊',
        'Good try! Give it one more shot! 🌈',
        'Not quite, check the numbers again! 💡',
      ];
      const tip = retryTips[Math.floor(Math.random() * retryTips.length)];
      setFeedbackMessage(tip);
      if (profile.speechEnabled) {
        pocAudio.speak('Try again, you can do it!');
      }
      onWrongAnswer();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Category selector pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                pocAudio.playTap();
                setCurrentCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-amber-400 text-amber-950 font-black scale-105 shadow-md shadow-amber-300/40 border-2 border-amber-500'
                  : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 p-6 shadow-md relative overflow-hidden">
        {/* Top Header: Voice button & Question Prompt */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                pocAudio.speak(question.prompt);
              }}
              className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-transform active:scale-95 cursor-pointer shadow-xs"
              title="Hear question aloud"
            >
              <Volume2 size={20} className="animate-pulse" />
            </button>
            <h2 className="text-base sm:text-lg font-black text-amber-950 leading-tight">
              {question.prompt}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => loadNewQuestion(currentCategory)}
            className="p-2 rounded-xl text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
            title="Next question"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Big Symbolic Equation Display */}
        <div className="flex items-center justify-center my-4 py-3 px-6 rounded-2xl bg-amber-50/70 border border-amber-200/80">
          <span className="text-3xl sm:text-5xl font-black text-amber-950 tracking-wider font-mono">
            {question.category === 'count' ? (
              <span className="flex items-center gap-2">
                <span>{question.emoji.repeat(Math.min(question.num1, 5))}</span>
                <span>= ?</span>
              </span>
            ) : (
              <span>
                {question.num1} {question.operator} {question.num2} = <span className="text-amber-500 underline decoration-wavy">?</span>
              </span>
            )}
          </span>
        </div>

        {/* Visual Manipulatives playground */}
        <div className="my-5">
          <VisualManipulative question={question} />
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-2xl text-center font-bold text-sm mb-5 transition-all animate-bounce ${
              isAnswerCorrect
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900'
                : 'bg-orange-100 border-2 border-orange-300 text-orange-900'
            }`}
          >
            {feedbackMessage}
          </div>
        )}

        {/* Answer Choices Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === question.correctAnswer;
            let btnClass = 'bg-amber-100/70 hover:bg-amber-200 text-amber-950 border-2 border-amber-300 hover:border-amber-400';

            if (isSelected) {
              if (isAnswerCorrect) {
                btnClass = 'bg-emerald-400 border-2 border-emerald-600 text-emerald-950 scale-105 shadow-md shadow-emerald-300/50';
              } else {
                btnClass = 'bg-orange-200 border-2 border-orange-400 text-orange-950 animate-shake';
              }
            } else if (isAnswerCorrect && isCorrectOption) {
              btnClass = 'bg-emerald-300 border-2 border-emerald-500 text-emerald-950';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                className={`h-18 rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 ${btnClass}`}
              >
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
