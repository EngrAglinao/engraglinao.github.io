import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ADMIN_EMAIL } from '../firebase';

interface StartScreenProps {
  onCreateProfile: () => void;
  onEnterGame: () => void;
  onAdminSettings: () => void;
  onTutorial: () => void;
}

export default function StartScreen({ onCreateProfile, onEnterGame, onAdminSettings, onTutorial }: StartScreenProps) {
  const { gameName, gameIcon, isAdmin, currentPlayer } = useGame();
  const [showGithub, setShowGithub] = useState(false);
  const [githubRepo, setGithubRepo] = useState('');

  const handleGithubUpload = () => {
    if (!githubRepo) return;
    window.open(`https://github.com/${githubRepo}`, '_blank');
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/85" />
      <div className="absolute inset-0 bg-stars opacity-50" />

      {/* Admin Button */}
      <div className="relative z-10 w-full flex justify-between items-center pt-2">
        <div className="w-16" />
        {isAdmin && (
          <button
            onClick={onAdminSettings}
            className="text-amber-400 border border-amber-700/50 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-semibold hover:bg-amber-900/40 transition flex items-center gap-2 btn-press"
          >
            ⚙️ Admin
          </button>
        )}
      </div>

      {/* Logo Section */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center mt-[-3rem]">
        {/* Icon */}
        <div className="mb-5 animate-float">
          {gameIcon ? (
            <img
              src={gameIcon}
              alt="icon"
              className="w-24 h-24 rounded-2xl object-cover shadow-2xl border-2 border-amber-500/80 pulse-glow"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-800/80 to-amber-950 flex items-center justify-center shadow-2xl border-2 border-amber-600/60 pulse-glow text-5xl">
              ⚜️
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-6xl font-black font-serif tracking-[0.15em] drop-shadow-2xl mb-1 shimmer-text">
          {gameName}
        </h1>
        <p className="text-amber-200/50 text-xs tracking-[0.45em] uppercase font-light mb-2">
          The Resistance
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 mb-8 w-48">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/60" />
          <span className="text-amber-600/80 text-base">⚜️</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/60" />
        </div>

        {/* Current Player Badge */}
        {currentPlayer && (
          <div className="mb-6 bg-black/60 backdrop-blur-sm border border-amber-700/30 rounded-2xl px-5 py-3 flex items-center gap-3 animate-scale-in">
            <span className="text-3xl">{currentPlayer.avatar}</span>
            <div>
              <p className="text-amber-300 font-semibold text-sm">{currentPlayer.name}</p>
              {currentPlayer.email === ADMIN_EMAIL && (
                <p className="text-amber-500 text-xs">👑 Admin</p>
              )}
            </div>
            <button
              onClick={onCreateProfile}
              className="ml-2 text-gray-500 hover:text-gray-300 text-xs transition"
            >
              Edit
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-xs space-y-3">
          {currentPlayer ? (
            <button
              onClick={onEnterGame}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-lg shadow-xl shadow-amber-900/40 transition-all active:scale-95 btn-press border border-amber-500/30"
            >
              🏰 Enter Game
            </button>
          ) : (
            <button
              onClick={onCreateProfile}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-lg shadow-xl shadow-amber-900/40 transition-all active:scale-95 btn-press border border-amber-500/30"
            >
              ⚔️ Create Profile
            </button>
          )}

          {!currentPlayer && (
            <button
              onClick={onEnterGame}
              className="w-full bg-gray-900/60 border border-gray-700/50 hover:bg-gray-800/60 text-gray-400 font-semibold rounded-2xl py-3 text-sm transition-all active:scale-95 btn-press backdrop-blur-sm"
            >
              🚪 Enter as Guest
            </button>
          )}

          <button
            onClick={onTutorial}
            className="w-full bg-black/40 border border-amber-700/40 hover:bg-amber-900/20 text-amber-300/90 font-semibold rounded-2xl py-3 text-sm transition-all active:scale-95 btn-press backdrop-blur-sm"
          >
            📖 Tutorial & Setup Guide
          </button>

          <button
            onClick={() => setShowGithub(!showGithub)}
            className="w-full bg-black/30 border border-gray-800/60 hover:bg-gray-800/30 text-gray-600 font-semibold rounded-2xl py-2.5 text-xs transition-all active:scale-95 backdrop-blur-sm"
          >
            🐙 GitHub Deploy
          </button>

          {showGithub && (
            <div className="bg-black/70 border border-gray-700/60 rounded-xl p-4 space-y-2 animate-fade-in">
              <p className="text-gray-400 text-xs">GitHub username/repo:</p>
              <input
                type="text"
                placeholder="username/avalon-game"
                value={githubRepo}
                onChange={e => setGithubRepo(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-amber-500 transition"
              />
              <button
                onClick={handleGithubUpload}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 text-sm font-semibold transition btn-press"
              >
                Open Repository →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-2">
        <p className="text-gray-700 text-xs tracking-widest uppercase">5–10 Players · Social Deduction</p>
      </div>
    </div>
  );
}
