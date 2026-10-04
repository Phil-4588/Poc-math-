import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Check, Sparkles, Move, RefreshCw } from 'lucide-react';
import { KidProfile, StickerItem } from '../types';
import { pocAudio } from '../utils/audio';

interface StickerAlbumProps {
  profile: KidProfile;
  onUnlockSticker: (stickerId: string, starsCost: number) => void;
}

const ALL_STICKERS: StickerItem[] = [
  { id: 'st_rocket', name: 'Cosmic Rocket', emoji: '🚀', starsRequired: 5, description: 'Blasts your math skills to space!' },
  { id: 'st_dino', name: 'Baby Dino', emoji: '🦖', starsRequired: 10, description: 'Loves munching on big numbers!' },
  { id: 'st_unicorn', name: 'Star Unicorn', emoji: '🦄', starsRequired: 15, description: 'Magical rainbow sparkle math!' },
  { id: 'st_robot', name: 'Robo Solver', emoji: '🤖', starsRequired: 20, description: 'Computes equations at super speed!' },
  { id: 'st_lion', name: 'Brave Lion', emoji: '🦁', starsRequired: 25, description: 'King of addition and subtraction!' },
  { id: 'st_cupcake', name: 'Candy Cupcake', emoji: '🧁', starsRequired: 30, description: 'Sweet rewards for sharp minds!' },
  { id: 'st_planet', name: 'Ringed Planet', emoji: '🪐', starsRequired: 40, description: 'Master of multiplication arrays!' },
  { id: 'st_crown', name: 'Math Champion Crown', emoji: '👑', starsRequired: 50, description: 'The ultimate royal Poc Math award!' },
];

interface PlacedSticker {
  uid: string;
  emoji: string;
  x: number;
  y: number;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({
  profile,
  onUnlockSticker,
}) => {
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    { uid: '1', emoji: '⭐', x: 20, y: 30 },
    { uid: '2', emoji: '🎈', x: 70, y: 25 },
  ]);

  const handleUnlock = (sticker: StickerItem) => {
    if (profile.stars < sticker.starsRequired) {
      pocAudio.playTryAgain();
      return;
    }
    pocAudio.playCorrect();
    pocAudio.playStar();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    onUnlockSticker(sticker.id, sticker.starsRequired);
  };

  const handlePlaceSticker = (emoji: string) => {
    pocAudio.playPop();
    const newSticker: PlacedSticker = {
      uid: 'ps_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleClearBoard = () => {
    pocAudio.playTap();
    setPlacedStickers([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-2">
          <span>🌟</span>
          <span>Sticker Album & Trophy Board</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-800 font-medium mt-1">
          Use your earned stars to unlock special stickers and decorate your sticker board!
        </p>
      </div>

      {/* Interactive Sticker Board */}
      <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl border-3 border-amber-300 p-6 shadow-md relative min-h-[260px] overflow-hidden select-none">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-sky-950 px-3 py-1 rounded-full bg-white/70 shadow-xs">
            🎨 Tap unlocked stickers below to place them here!
          </span>
          <button
            type="button"
            onClick={handleClearBoard}
            className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/80 hover:bg-white text-zinc-700 shadow-xs transition-colors cursor-pointer"
          >
            Clear Board
          </button>
        </div>

        {/* Scattered items */}
        {placedStickers.map((ps) => (
          <div
            key={ps.uid}
            style={{ left: `${ps.x}%`, top: `${ps.y}%` }}
            onClick={() => {
              pocAudio.playPop();
            }}
            className="absolute text-4xl sm:text-5xl cursor-pointer hover:scale-125 transition-transform filter drop-shadow-md animate-fade-in"
          >
            {ps.emoji}
          </div>
        ))}
      </div>

      {/* Available Stickers Catalog */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {ALL_STICKERS.map((st) => {
          const isUnlocked = profile.unlockedStickers.includes(st.id);
          const canAfford = profile.stars >= st.starsRequired;

          return (
            <div
              key={st.id}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-between text-center transition-all ${
                isUnlocked
                  ? 'bg-white border-amber-300 shadow-sm hover:shadow-md'
                  : 'bg-zinc-50 border-zinc-200 opacity-90'
              }`}
            >
              <div className="text-5xl my-2 transform hover:scale-110 transition-transform">
                {st.emoji}
              </div>

              <div>
                <h3 className="font-black text-sm text-amber-950">{st.name}</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{st.description}</p>
              </div>

              <div className="mt-4 w-full">
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handlePlaceSticker(st.emoji)}
                    className="w-full py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Place 📌</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUnlock(st)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-500 cursor-pointer active:scale-95'
                        : 'bg-zinc-200 text-zinc-500 cursor-not-allowed border border-zinc-300'
                    }`}
                  >
                    <Lock size={12} />
                    <span>{st.starsRequired} ⭐</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
