import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Plus, Minus, X, Divide, Sparkles, Volume2, RotateCcw, Play } from 'lucide-react';
import { pocAudio } from '../utils/audio';

const ITEMS = [
  { emoji: '⭐', name: 'Stars' },
  { emoji: '🍎', name: 'Apples' },
  { emoji: '🦆', name: 'Ducks' },
  { emoji: '🍪', name: 'Cookies' },
  { emoji: '🎈', name: 'Balloons' },
  { emoji: '🍓', name: 'Berries' },
];

export const MathLab: React.FC = () => {
  const [selectedEmoji, setSelectedEmoji] = useState('🍎');
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(2);
  const [operator, setOperator] = useState<'+' | '-' | '×' | '÷'>('+');
  const [isAnimating, setIsAnimating] = useState(false);

  // Compute result safely
  const calculateResult = () => {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return Math.max(0, num1 - num2);
      case '×':
        return num1 * num2;
      case '÷':
        return num2 === 0 ? 0 : Math.floor(num1 / num2);
    }
  };

  const result = calculateResult();

  const handleSpeakEquation = () => {
    let opWord = 'plus';
    if (operator === '-') opWord = 'minus';
    if (operator === '×') opWord = 'times';
    if (operator === '÷') opWord = 'divided by';
    const text = `${num1} ${opWord} ${num2} equals ${result}!`;
    pocAudio.speak(text);
  };

  const handlePlayAnimation = () => {
    setIsAnimating(true);
    pocAudio.playCorrect();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.65 },
    });
    handleSpeakEquation();
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const handleReset = () => {
    pocAudio.playTap();
    setNum1(2);
    setNum2(2);
    setOperator('+');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Introduction */}
      <div className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
          <span>🧪</span>
          <span>Poc Math Lab</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/90 font-medium mt-1">
          Add, take away, or group items to see how math works in real life!
        </p>
      </div>

      {/* Item Picker */}
      <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-2xl border-2 border-amber-200 shadow-xs max-w-md mx-auto">
        <span className="text-xs font-bold text-amber-800 ml-1">Pick Item:</span>
        <div className="flex gap-1.5 overflow-x-auto">
          {ITEMS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                pocAudio.playTap();
                setSelectedEmoji(item.emoji);
              }}
              className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                selectedEmoji === item.emoji
                  ? 'bg-amber-300 scale-110 shadow-sm border-2 border-amber-500'
                  : 'bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
              title={item.name}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Big Equation Bar */}
      <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-md flex flex-col items-center">
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-3xl sm:text-5xl font-black text-amber-950 font-mono my-2">
          <span className="p-2 sm:p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 shadow-inner min-w-[50px] sm:min-w-[70px] text-center">
            {num1}
          </span>
          <span className="text-amber-500">{operator}</span>
          <span className="p-2 sm:p-3 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 shadow-inner min-w-[50px] sm:min-w-[70px] text-center">
            {num2}
          </span>
          <span className="text-amber-500">=</span>
          <span className={`p-2 sm:p-3 rounded-2xl bg-emerald-100 text-emerald-950 border border-emerald-300 shadow-md min-w-[50px] sm:min-w-[70px] text-center ${
            isAnimating ? 'scale-125 transition-transform animate-bounce' : ''
          }`}>
            {result}
          </span>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleSpeakEquation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <Volume2 size={16} />
            <span>Read Equation</span>
          </button>

          <button
            type="button"
            onClick={handlePlayAnimation}
            className="flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Play size={16} className="fill-white" />
            <span>Combine!</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
            title="Reset numbers"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Operator Selector */}
      <div className="flex items-center justify-center gap-2">
        {(['+', '-', '×', '÷'] as const).map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => {
              pocAudio.playTap();
              setOperator(op);
            }}
            className={`w-14 h-12 rounded-2xl text-2xl font-black flex items-center justify-center transition-all cursor-pointer shadow-xs ${
              operator === op
                ? 'bg-amber-400 text-amber-950 border-2 border-amber-600 scale-105 shadow-md'
                : 'bg-white hover:bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Interactive Trays Playground */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tray 1 */}
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-amber-900">Tray 1 ({num1})</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  pocAudio.playPop();
                  setNum1(Math.max(0, num1 - 1));
                }}
                className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  pocAudio.playPop();
                  setNum1(Math.min(15, num1 + 1));
                }}
                className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="min-h-[120px] bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-200 p-3 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: num1 }).map((_, i) => (
              <span key={i} className="text-3xl transform hover:scale-125 transition-transform animate-fade-in">
                {selectedEmoji}
              </span>
            ))}
          </div>
        </div>

        {/* Tray 2 */}
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-amber-900">Tray 2 ({num2})</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  pocAudio.playPop();
                  setNum2(Math.max(0, num2 - 1));
                }}
                className="w-8 h-8 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  pocAudio.playPop();
                  setNum2(Math.min(15, num2 + 1));
                }}
                className="w-8 h-8 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="min-h-[120px] bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-200 p-3 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: num2 }).map((_, i) => (
              <span key={i} className="text-3xl transform hover:scale-125 transition-transform animate-fade-in">
                {selectedEmoji}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
