import React, { useState, useEffect } from 'react';
import { MathQuestion } from '../types';
import { pocAudio } from '../utils/audio';

interface VisualManipulativeProps {
  question: MathQuestion;
}

export const VisualManipulative: React.FC<VisualManipulativeProps> = ({ question }) => {
  const { category, num1, num2, emoji, itemName } = question;
  const [tappedIndices, setTappedIndices] = useState<Set<number>>(new Set());
  const [showTenFrame, setShowTenFrame] = useState(false);

  // Reset tapped indices when question changes
  useEffect(() => {
    setTappedIndices(new Set());
  }, [question.id]);

  const handleTapItem = (index: number) => {
    const updated = new Set(tappedIndices);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
      const countSoFar = updated.size;
      pocAudio.playPop(1.0 + (countSoFar * 0.08));
      // Read out the count number if speech enabled
      pocAudio.speak(String(countSoFar));
    }
    setTappedIndices(updated);
  };

  return (
    <div className="w-full bg-amber-50/80 rounded-3xl border-2 border-amber-200/80 p-5 shadow-sm">
      {/* Header bar: Helper hint & Ten-frame toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
          <span>👆</span>
          <span>Tap the {itemName} to count along! ({tappedIndices.size} counted)</span>
        </span>

        <button
          type="button"
          onClick={() => {
            pocAudio.playTap();
            setShowTenFrame(!showTenFrame);
          }}
          className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-200/60 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
        >
          {showTenFrame ? 'Hide Ten-Frame' : 'Show Ten-Frame 🔲'}
        </button>
      </div>

      {/* Ten-Frame visualization if enabled */}
      {showTenFrame && (
        <div className="mb-4 p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-xs max-w-sm mx-auto">
          <p className="text-[11px] font-bold text-amber-700 text-center mb-1.5">Base-10 Frame</p>
          <div className="grid grid-cols-5 gap-1.5 p-1 bg-amber-50 rounded-xl border border-amber-200">
            {Array.from({ length: 10 }).map((_, i) => {
              const totalItems = category === 'add' ? (num1 + num2) : num1;
              const isFilled = i < Math.min(10, totalItems);
              return (
                <div
                  key={i}
                  className={`h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                    isFilled ? 'bg-amber-100 border-amber-400 scale-105' : 'bg-white border-dashed border-amber-200'
                  }`}
                >
                  {isFilled && emoji}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Primary Visual Manipulatives by category */}
      {category === 'count' && (
        <div className="flex flex-wrap items-center justify-center gap-3 p-4 min-h-[140px] bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
          {Array.from({ length: num1 }).map((_, i) => {
            const isTapped = tappedIndices.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleTapItem(i)}
                className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all cursor-pointer transform hover:scale-110 active:scale-95 ${
                  isTapped
                    ? 'bg-amber-200 border-2 border-amber-400 shadow-md scale-105 -rotate-3'
                    : 'bg-amber-50/70 border border-amber-200 hover:bg-amber-100 shadow-xs'
                }`}
              >
                <span>{emoji}</span>
                {isTapped && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shadow">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {category === 'add' && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
          {/* Group 1 */}
          <div className="flex-1 w-full bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 flex flex-col items-center">
            <span className="text-xs font-black text-amber-800 mb-2">Group 1 ({num1})</span>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: num1 }).map((_, i) => {
                const isTapped = tappedIndices.has(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTapItem(i)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer transform hover:scale-105 ${
                      isTapped ? 'bg-amber-200 border-2 border-amber-400' : 'bg-white border border-amber-200'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plus sign */}
          <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-amber-400 text-amber-950 font-black text-xl flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            +
          </div>

          {/* Group 2 */}
          <div className="flex-1 w-full bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80 flex flex-col items-center">
            <span className="text-xs font-black text-amber-800 mb-2">Group 2 ({num2})</span>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: num2 }).map((_, i) => {
                const globalIdx = num1 + i;
                const isTapped = tappedIndices.has(globalIdx);
                return (
                  <button
                    key={globalIdx}
                    type="button"
                    onClick={() => handleTapItem(globalIdx)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all cursor-pointer transform hover:scale-105 ${
                      isTapped ? 'bg-amber-200 border-2 border-amber-400' : 'bg-white border border-amber-200'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {category === 'subtract' && (
        <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
          <p className="text-xs font-black text-amber-800 mb-2">
            Start with {num1}, take away {num2}! (Items with ❌ are taken away)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: num1 }).map((_, i) => {
              const isSubtracted = i >= (num1 - num2);
              return (
                <div
                  key={i}
                  className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                    isSubtracted
                      ? 'bg-zinc-100 border-2 border-red-300 opacity-40 scale-95'
                      : 'bg-amber-50 border-2 border-amber-300 shadow-sm'
                  }`}
                >
                  <span>{emoji}</span>
                  {isSubtracted && (
                    <span className="absolute inset-0 flex items-center justify-center text-red-500 font-black text-2xl pointer-events-none">
                      ✕
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {category === 'multiply' && (
        <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
          <p className="text-xs font-black text-amber-800 mb-2.5">
            {num1} groups of {num2} {itemName}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: num1 }).map((_, groupIdx) => (
              <div
                key={groupIdx}
                className="p-2.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center gap-1.5 shadow-sm"
              >
                {Array.from({ length: num2 }).map((_, itemIdx) => (
                  <span key={itemIdx} className="text-2xl hover:scale-110 transition-transform">
                    {emoji}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {category === 'divide' && (
        <div className="flex flex-col items-center p-4 bg-white/80 rounded-2xl border border-amber-200 shadow-inner">
          <p className="text-xs font-black text-amber-800 mb-2.5">
            Sharing {num1} {itemName} into {num2} equal plates:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: num2 }).map((_, plateIdx) => {
              const itemsPerPlate = num1 / num2;
              return (
                <div
                  key={plateIdx}
                  className="p-3 rounded-3xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center gap-1 shadow-sm min-w-[90px]"
                >
                  <span className="text-[11px] font-bold text-amber-700">Friend {plateIdx + 1} 🐶</span>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {Array.from({ length: itemsPerPlate }).map((_, itemIdx) => (
                      <span key={itemIdx} className="text-xl">
                        {emoji}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
