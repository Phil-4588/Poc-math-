import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Settings, Speech, HelpCircle } from 'lucide-react';
import { KidProfile, MathMode } from '../types';
import { pocAudio } from '../utils/audio';

interface HeaderProps {
  profile: KidProfile;
  currentMode: MathMode;
  onSelectMode: (mode: MathMode) => void;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentMode,
  onSelectMode,
  onToggleSound,
  onToggleSpeech,
  onOpenSettings,
}) => {
  const modes: { id: MathMode; label: string; icon: string }[] = [
    { id: 'quest', label: 'Practice', icon: '🎯' },
    { id: 'lab', label: 'Math Lab', icon: '🧪' },
    { id: 'sprint', label: 'Math Sprint', icon: '⚡' },
    { id: 'stickers', label: 'Stickers', icon: '🌟' },
  ];

  return (
    <header className="bg-amber-50/90 border-b-2 border-amber-200/80 px-4 py-3 select-none backdrop-blur-xs sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Brand Logo with bouncing star */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-orange-400 flex items-center justify-center text-2xl shadow-md shadow-amber-300/40 transform hover:rotate-6 transition-transform">
              🧮
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-amber-950 font-display">
                  Poc Math
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                  Kids
                </span>
              </div>
              <p className="text-[11px] font-medium text-amber-700/80">
                Hi, {profile.name}! {profile.avatar}
              </p>
            </div>
          </div>

          {/* Right on mobile: Stars & Streak */}
          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300/70 text-amber-900 font-bold text-xs shadow-xs">
              <span>⭐</span>
              <span>{profile.stars}</span>
            </div>
            {profile.streak > 1 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-100 border border-orange-300 text-orange-700 font-bold text-xs">
                <span>🔥</span>
                <span>{profile.streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: Mode Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-amber-100/80 border border-amber-200 shadow-inner w-full sm:w-auto justify-center overflow-x-auto">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  pocAudio.playTap();
                  onSelectMode(m.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-amber-950 shadow-sm shadow-amber-200/50 scale-102 font-extrabold'
                    : 'text-amber-800/80 hover:text-amber-950 hover:bg-amber-200/40'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Stars, Streak, Audio, Settings */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Stars Collected */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-yellow-100 border border-yellow-300 text-amber-950 font-black text-sm shadow-sm"
            title={`${profile.stars} Stars Earned!`}
          >
            <span className="text-base animate-bounce">⭐</span>
            <span>{profile.stars}</span>
          </div>

          {/* Streak Counter */}
          {profile.streak > 0 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-orange-100 border border-orange-300 text-orange-800 font-bold text-xs shadow-xs"
              title={`${profile.streak} in a row!`}
            >
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              <span>{profile.streak}</span>
            </div>
          )}

          {/* Voice Readout Toggle */}
          <button
            type="button"
            onClick={onToggleSpeech}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              profile.speechEnabled
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
            title={profile.speechEnabled ? 'Voice read-out: ON' : 'Voice read-out: OFF'}
          >
            <Speech size={18} />
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              profile.soundEnabled
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-zinc-100 border-zinc-200 text-zinc-400'
            }`}
            title={profile.soundEnabled ? 'Sound effects: ON' : 'Sound effects: OFF'}
          >
            {profile.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Settings modal trigger */}
          <button
            type="button"
            onClick={() => {
              pocAudio.playTap();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 transition-colors cursor-pointer"
            title="Settings & Age Level"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
