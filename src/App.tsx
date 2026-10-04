import React, { useState, useEffect } from 'react';
import { KidProfile, MathMode, DifficultyLevel } from './types';
import { Header } from './components/Header';
import { PracticeQuest } from './components/PracticeQuest';
import { MathLab } from './components/MathLab';
import { SprintQuest } from './components/SprintQuest';
import { StickerAlbum } from './components/StickerAlbum';
import { SettingsModal } from './components/SettingsModal';
import { pocAudio } from './utils/audio';

const DEFAULT_PROFILE: KidProfile = {
  name: 'Leo',
  avatar: '🦁',
  stars: 5,
  totalSolved: 0,
  streak: 0,
  bestStreak: 0,
  soundEnabled: true,
  speechEnabled: true,
  difficulty: 2, // 1-10 default Kindergarten/Grade 1
  unlockedStickers: ['st_rocket'],
};

export default function App() {
  const [profile, setProfile] = useState<KidProfile>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROFILE;
    try {
      const saved = localStorage.getItem('poc_math_profile');
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [currentMode, setCurrentMode] = useState<MathMode>('quest');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync sound/speech settings to audio engine
  useEffect(() => {
    pocAudio.isSoundEnabled = profile.soundEnabled;
    pocAudio.isSpeechEnabled = profile.speechEnabled;
  }, [profile.soundEnabled, profile.speechEnabled]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem('poc_math_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  const handleCorrectAnswer = () => {
    setProfile((prev) => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        stars: prev.stars + 1,
        totalSolved: prev.totalSolved + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  };

  const handleWrongAnswer = () => {
    setProfile((prev) => ({
      ...prev,
      streak: 0,
    }));
  };

  const handleSprintCompleted = (starsEarned: number) => {
    setProfile((prev) => ({
      ...prev,
      stars: prev.stars + starsEarned,
      totalSolved: prev.totalSolved + 5,
    }));
  };

  const handleUnlockSticker = (stickerId: string, cost: number) => {
    setProfile((prev) => {
      if (prev.stars < cost || prev.unlockedStickers.includes(stickerId)) return prev;
      return {
        ...prev,
        stars: prev.stars - cost,
        unlockedStickers: [...prev.unlockedStickers, stickerId],
      };
    });
  };

  const handleSaveProfile = (updated: Partial<KidProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    setProfile(DEFAULT_PROFILE);
  };

  const handleToggleSound = () => {
    const nextVal = !profile.soundEnabled;
    pocAudio.isSoundEnabled = nextVal;
    if (nextVal) pocAudio.playTap();
    setProfile((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  const handleToggleSpeech = () => {
    const nextVal = !profile.speechEnabled;
    pocAudio.isSpeechEnabled = nextVal;
    if (nextVal) pocAudio.speak('Voice is on!');
    setProfile((prev) => ({ ...prev, speechEnabled: nextVal }));
  };

  return (
    <div className="min-h-screen bg-amber-50/50 text-amber-950 font-sans flex flex-col justify-between selection:bg-amber-200">
      {/* Top Header */}
      <Header
        profile={profile}
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onToggleSound={handleToggleSound}
        onToggleSpeech={handleToggleSpeech}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto py-4">
        {currentMode === 'quest' && (
          <PracticeQuest
            difficulty={profile.difficulty}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            profile={profile}
          />
        )}

        {currentMode === 'lab' && <MathLab />}

        {currentMode === 'sprint' && (
          <SprintQuest
            difficulty={profile.difficulty}
            profile={profile}
            onSprintCompleted={handleSprintCompleted}
          />
        )}

        {currentMode === 'stickers' && (
          <StickerAlbum
            profile={profile}
            onUnlockSticker={handleUnlockSticker}
          />
        )}
      </main>

      {/* Kid-Friendly Footer */}
      <footer className="py-4 text-center text-xs font-bold text-amber-800/80 border-t border-amber-200/60 bg-amber-100/40">
        <p className="flex items-center justify-center gap-1.5">
          <span>🎈</span>
          <span>Poc Math · Learning basic math through play & visual fun</span>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
