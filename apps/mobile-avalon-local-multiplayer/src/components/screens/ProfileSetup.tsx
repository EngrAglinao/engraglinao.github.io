import { useState } from 'react';
import { Button } from '../ui/Button';
import { AVATARS } from '../../constants/gameConfig';
import type { Player } from '../../types/game';
import { v4 as uuidv4 } from 'uuid';

interface ProfileSetupProps {
  onComplete: (player: Player) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const player: Player = {
      id: uuidv4(),
      name: name.trim(),
      avatar: selectedAvatar,
      isHost: false,
      isConnected: true,
    };
    onComplete(player);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-5 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">⚜️</div>
        <h1 className="font-cinzel text-3xl font-black text-yellow-400 tracking-wider drop-shadow-lg">
          AVALON
        </h1>
        <p className="font-crimson text-slate-400 text-lg italic mt-1">The Resistance</p>
      </div>

      {/* Avatar Selection */}
      <div className="mb-6">
        <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
          Choose Your Crest
        </p>
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 border-2 border-yellow-500/50 text-4xl shadow-lg shadow-yellow-500/20">
            {selectedAvatar}
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {AVATARS.map((avatar) => (
            <button
              key={avatar}
              onClick={() => setSelectedAvatar(avatar)}
              className={`h-12 rounded-xl text-2xl transition-all duration-150 active:scale-90 ${
                selectedAvatar === avatar
                  ? 'bg-yellow-500/30 border-2 border-yellow-400 scale-105'
                  : 'bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Name Input */}
      <div className="mb-8">
        <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-2">
          Your Name
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter your name..."
          maxLength={20}
          className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-white font-crimson text-lg placeholder-slate-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30"
        />
      </div>

      <Button
        variant="gold"
        size="lg"
        fullWidth
        disabled={!name.trim()}
        onClick={handleSubmit}
      >
        Create Profile
      </Button>

      <p className="text-center text-slate-500 text-xs font-crimson mt-6">
        All players must be connected to the same WiFi network
      </p>
    </div>
  );
}
