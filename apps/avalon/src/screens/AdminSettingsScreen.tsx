import { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { ALL_CHARACTERS, CharacterName } from '../types';

export default function AdminSettingsScreen({ onBack }: { onBack: () => void }) {
  const { gameName, setGameName, gameIcon, setGameIcon, enabledCharacters, setEnabledCharacters, isAdmin } = useGame();
  const [nameInput, setNameInput] = useState(gameName);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
        <div className="text-center">
          <p className="text-red-400 text-xl">🚫 Admin Access Only</p>
          <button onClick={onBack} className="mt-4 text-amber-400 hover:text-amber-300">← Back</button>
        </div>
      </div>
    );
  }

  const handleSaveName = () => {
    setGameName(nameInput.trim() || 'AVALON');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setGameIcon(url);
    };
    reader.readAsDataURL(file);
  };

  const toggleChar = (name: CharacterName) => {
    if (enabledCharacters.includes(name)) {
      setEnabledCharacters(enabledCharacters.filter(c => c !== name));
    } else {
      setEnabledCharacters([...enabledCharacters, name]);
    }
  };

  const specialChars = ALL_CHARACTERS.filter(c =>
    c.name !== 'Loyal Servant' && c.name !== 'Minion of Mordred'
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 relative overflow-y-auto"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 pt-5 pb-5">
          <button onClick={onBack} className="text-amber-400 hover:text-amber-300 transition">← Back</button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-amber-400 font-serif">⚙️ Admin Settings</h2>
            <p className="text-gray-500 text-xs">👑 Admin access only</p>
          </div>
        </div>

        {/* Game Name */}
        <div className="bg-gray-900/90 border border-amber-800/40 rounded-2xl p-5 mb-4">
          <h3 className="text-amber-300 font-semibold text-sm mb-3">📛 Game Name</h3>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={20}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-600 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
              placeholder="AVALON"
            />
            <button
              onClick={handleSaveName}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                saved ? 'bg-green-700 text-green-200' : 'bg-amber-700 hover:bg-amber-600 text-white'
              }`}
            >
              {saved ? '✓' : 'Save'}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2">Current: <span className="text-amber-400">{gameName}</span></p>
        </div>

        {/* App Icon */}
        <div className="bg-gray-900/90 border border-amber-800/40 rounded-2xl p-5 mb-4">
          <h3 className="text-amber-300 font-semibold text-sm mb-3">🖼️ App Icon</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border-2 border-amber-600/50 overflow-hidden bg-gray-800 flex items-center justify-center">
              {gameIcon ? (
                <img src={gameIcon} alt="icon" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">⚜️</span>
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleIconUpload}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-amber-700 hover:bg-amber-600 text-white font-semibold rounded-xl py-3 text-sm transition"
              >
                📁 Upload Icon
              </button>
              {gameIcon && (
                <button
                  onClick={() => setGameIcon('')}
                  className="mt-2 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl py-2 text-xs transition"
                >
                  ✕ Remove Icon
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Character Management */}
        <div className="bg-gray-900/90 border border-amber-800/40 rounded-2xl p-5 mb-4">
          <h3 className="text-amber-300 font-semibold text-sm mb-1">🎭 Special Characters</h3>
          <p className="text-gray-500 text-xs mb-4">Toggle which special roles are available in games</p>

          <div className="space-y-2">
            {specialChars.map(char => {
              const enabled = enabledCharacters.includes(char.name);
              const isGood = char.team === 'good';
              return (
                <div key={char.name}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all cursor-pointer ${
                    enabled
                      ? isGood
                        ? 'bg-blue-900/40 border-blue-700/60'
                        : 'bg-red-900/40 border-red-700/60'
                      : 'bg-gray-800/40 border-gray-700/30'
                  }`}
                  onClick={() => toggleChar(char.name)}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-600/50 flex-shrink-0">
                    <img
                      src={`./images/${char.image.replace('/images/', '')}`}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${enabled ? 'text-white' : 'text-gray-500'}`}>
                      {char.name}
                    </p>
                    <p className={`text-xs ${isGood ? 'text-blue-400' : 'text-red-400'}`}>
                      {isGood ? '⚔️ Good' : '💀 Evil'}
                    </p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-all ${
                    enabled ? isGood ? 'bg-blue-600' : 'bg-red-600' : 'bg-gray-700'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      enabled ? 'left-7' : 'left-1'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-gray-800/50 rounded-xl p-3">
            <p className="text-gray-400 text-xs">
              <span className="text-amber-400 font-semibold">Note:</span> Loyal Servants and Minions of Mordred are automatically added to fill remaining slots.
            </p>
          </div>
        </div>

        {/* Recommended Configs */}
        <div className="bg-gray-900/90 border border-gray-700/40 rounded-2xl p-5 mb-6">
          <h3 className="text-gray-300 font-semibold text-sm mb-3">💡 Recommended Setups</h3>
          <div className="space-y-2">
            {[
              { label: '5 Players (Core)', chars: ['Merlin', 'Assassin'] },
              { label: '6–7 Players (+Percival)', chars: ['Merlin', 'Percival', 'Morgana', 'Assassin'] },
              { label: '7–10 Players (Full)', chars: ['Merlin', 'Percival', 'Morgana', 'Mordred', 'Assassin'] },
              { label: '10 Players (+Oberon)', chars: ['Merlin', 'Percival', 'Morgana', 'Mordred', 'Oberon', 'Assassin'] },
            ].map(preset => (
              <button
                key={preset.label}
                onClick={() => setEnabledCharacters(preset.chars as CharacterName[])}
                className="w-full text-left bg-gray-800/50 hover:bg-gray-700/60 border border-gray-700/30 rounded-xl px-3 py-2 transition"
              >
                <p className="text-amber-300 text-xs font-semibold">{preset.label}</p>
                <p className="text-gray-500 text-xs">{preset.chars.join(', ')}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
