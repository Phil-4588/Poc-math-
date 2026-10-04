import React, { useState } from 'react';
import { X, Check, Volume2, Speech, User, Award, RotateCcw } from 'lucide-react';
import { KidProfile, DifficultyLevel } from '../types';
import { pocAudio } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: KidProfile;
  onSaveProfile: (updated: Partial<KidProfile>) => void;
  onResetProgress: () => void;
}

const AVATARS = ['🦁', '🐶', '🐱', '🐰', '🐼', '🦊', '🦄', '🚀', '⭐'];

const LEVELS: { level: DifficultyLevel; title: string; subtitle: string; badge: string }[] = [
  { level: 1, title: 'Level 1: Little Explorers', subtitle: 'Numbers 1 to 5 with fun counting', badge: 'Ages 3-5' },
  { level: 2, title: 'Level 2: Junior Stars', subtitle: 'Numbers 1 to 10 (+ and -)', badge: 'Ages 5-6' },
  { level: 3, title: 'Level 3: Math Adventurers', subtitle: 'Numbers 1 to 20 (+, -, and arrays)', badge: 'Ages 6-7' },
  { level: 4, title: 'Level 4: Math Champions', subtitle: 'Numbers up to 50 with multiplication & division', badge: 'Ages 7-9' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onResetProgress,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(profile.difficulty);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [speechEnabled, setSpeechEnabled] = useState(profile.speechEnabled);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pocAudio.isSoundEnabled = soundEnabled;
    pocAudio.isSpeechEnabled = speechEnabled;
    onSaveProfile({
      name: name.trim() || 'Math Hero',
      avatar,
      difficulty,
      soundEnabled,
      speechEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border-3 border-amber-300 w-full max-w-md p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-950">Settings & Level</h2>
            <p className="text-xs text-amber-800 font-medium">Personalize Poc Math for your child</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Child Name */}
          <div>
            <label className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-1">
              Player Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Child's name"
              maxLength={14}
              className="w-full bg-amber-50/70 border-2 border-amber-200 focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-base font-bold text-amber-950 focus:outline-none"
            />
          </div>

          {/* Avatar picker */}
          <div>
            <label className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-1.5">
              Favorite Buddy
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setAvatar(av)}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    avatar === av
                      ? 'bg-amber-300 scale-110 border-2 border-amber-500 shadow-sm'
                      : 'bg-amber-50 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Levels */}
          <div>
            <label className="text-xs font-black text-amber-900 uppercase tracking-wider block mb-2">
              Math Skill Level
            </label>
            <div className="space-y-2">
              {LEVELS.map((lvl) => {
                const isSelected = difficulty === lvl.level;
                return (
                  <button
                    key={lvl.level}
                    type="button"
                    onClick={() => setDifficulty(lvl.level)}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-sm'
                        : 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-amber-950">{lvl.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800">
                          {lvl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-700 font-medium">{lvl.subtitle}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Toggles */}
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Volume2 size={16} />
                <span>Cheerful Sound Effects</span>
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Speech size={16} />
                <span>Voice Read-Aloud for Questions</span>
              </span>
              <input
                type="checkbox"
                checked={speechEnabled}
                onChange={(e) => setSpeechEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500 cursor-pointer"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all earned stars and progress?')) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Stars</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm border-2 border-amber-500 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
