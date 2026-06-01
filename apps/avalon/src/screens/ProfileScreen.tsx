import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types';
import { ADMIN_EMAIL } from '../firebase';

const AVATARS = ['⚔️','🛡️','👑','🏹','🪄','🗡️','🔮','📜','🌙','⚡','🦅','🐉','🌟','🍀','🔱','🌊'];

interface ProfileScreenProps {
  onDone: () => void;
  onBack: () => void;
}

export default function ProfileScreen({ onDone, onBack }: ProfileScreenProps) {
  const { setCurrentPlayer, currentPlayer } = useGame();
  const [name, setName] = useState(currentPlayer?.name || '');
  const [avatar, setAvatar] = useState(currentPlayer?.avatar || '⚔️');
  const [email, setEmail] = useState(currentPlayer?.email || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('Enter your name'); return; }
    const player: Player = {
      id: currentPlayer?.id || `player_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      name: name.trim(),
      avatar,
      email: email.trim().toLowerCase() || undefined,
      isHost: false,
      isAdmin: email.trim().toLowerCase() === ADMIN_EMAIL,
      connected: true,
    };
    setCurrentPlayer(player);
    localStorage.setItem('avalon_player', JSON.stringify(player));
    onDone();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5 relative"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/75" />
      <div className="relative z-10 w-full max-w-sm">
        <button onClick={onBack} className="text-amber-400 mb-4 flex items-center gap-1 text-sm hover:text-amber-300 transition">
          ← Back
        </button>

        <div className="bg-gray-900/95 border border-amber-800/40 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-amber-400 font-serif text-center mb-6">
            ⚔️ Your Profile
          </h2>

          {/* Avatar Display */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 border-2 border-amber-500 flex items-center justify-center text-4xl shadow-xl">
              {avatar}
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-8 gap-1 mb-5 bg-gray-800/50 rounded-2xl p-2">
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                  avatar === a
                    ? 'bg-amber-600 ring-2 ring-amber-400 scale-110'
                    : 'hover:bg-gray-700'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm block mb-1">Display Name *</label>
            <input
              type="text"
              maxLength={20}
              placeholder="Your knight name..."
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-base outline-none transition"
            />
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="text-gray-400 text-sm block mb-1">Email (optional — Admin unlock)</label>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-base outline-none transition"
            />
            {email.toLowerCase() === ADMIN_EMAIL && (
              <p className="text-amber-400 text-xs mt-1">👑 Admin access granted</p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-3 text-center">⚠️ {error}</p>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-lg shadow-lg transition-all active:scale-95"
          >
            Save Profile ✓
          </button>
        </div>
      </div>
    </div>
  );
}
