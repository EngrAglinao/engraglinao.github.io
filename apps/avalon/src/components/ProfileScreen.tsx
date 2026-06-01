import { useState } from 'react';
import { AVATARS } from '../types';
import { getGameName, getGameIcon } from '../firebase';

interface ProfileScreenProps {
  onProfile: (name: string, avatar: string) => void;
  onAdminLogin: () => void;
}

export default function ProfileScreen({ onProfile, onAdminLogin }: ProfileScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState('');
  const gameName = getGameName();
  const gameIcon = getGameIcon();

  const handleContinue = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (name.trim().length > 16) {
      setError('Name must be 16 characters or less.');
      return;
    }
    onProfile(name.trim(), selectedAvatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col items-center justify-between p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 w-full text-center pt-8">
        {gameIcon ? (
          <img src={gameIcon} alt="icon" className="w-20 h-20 rounded-2xl mx-auto mb-3 object-cover shadow-2xl" />
        ) : (
          <div className="text-6xl mb-3">⚔️</div>
        )}
        <h1 className="text-4xl font-bold text-amber-400 tracking-widest drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
          {gameName}
        </h1>
        <p className="text-amber-200/50 text-xs tracking-wider mt-1">THE RESISTANCE</p>
      </div>

      {/* Profile Setup */}
      <div className="relative z-10 w-full max-w-sm flex-1 flex flex-col justify-center py-6">
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-1 text-center">Create Your Profile</h2>
          <p className="text-gray-400 text-xs text-center mb-5">Choose your avatar and enter your name</p>

          {/* Avatar Display */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-900/50 to-amber-600/20 border-2 border-amber-400/50 flex items-center justify-center text-4xl shadow-lg mb-2">
              {selectedAvatar}
            </div>
            <p className="text-gray-400 text-xs">Your Avatar</p>
          </div>

          {/* Avatar Picker */}
          <div className="grid grid-cols-5 gap-2 mb-5">
            {AVATARS.map(av => (
              <button
                key={av}
                onClick={() => setSelectedAvatar(av)}
                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all active:scale-90 ${
                  selectedAvatar === av
                    ? 'bg-amber-500/30 border-2 border-amber-400 scale-110'
                    : 'bg-white/5 border border-white/10 hover:border-amber-400/50'
                }`}
              >
                {av}
              </button>
            ))}
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="text-gray-400 text-xs block mb-1">Your Name</label>
            <input
              type="text"
              maxLength={16}
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none text-center font-bold tracking-wide"
              placeholder="Enter your name..."
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
            />
            {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg text-sm tracking-wider"
          >
            ENTER THE REALM →
          </button>
        </div>
      </div>

      {/* Admin Login */}
      <div className="relative z-10 pb-4">
        <button
          onClick={onAdminLogin}
          className="text-gray-600 text-xs hover:text-amber-400 transition-colors"
        >
          ⚙️ Admin Access
        </button>
      </div>
    </div>
  );
}
