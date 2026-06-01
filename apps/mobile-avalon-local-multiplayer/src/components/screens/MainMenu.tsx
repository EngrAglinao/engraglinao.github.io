import { useState } from 'react';
import { Button } from '../ui/Button';
import type { Player } from '../../types/game';

interface MainMenuProps {
  myPlayer: Player;
  onCreateRoom: (roomCode: string) => void;
  onJoinRoom: (roomCode: string) => void;
  onEditProfile: () => void;
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function MainMenu({ myPlayer, onCreateRoom, onJoinRoom, onEditProfile }: MainMenuProps) {
  const [joinCode, setJoinCode] = useState('');
  const [tab, setTab] = useState<'create' | 'join'>('create');

  const handleCreate = () => {
    const code = generateRoomCode();
    onCreateRoom(code);
  };

  const handleJoin = () => {
    if (joinCode.trim().length < 4) return;
    onJoinRoom(joinCode.trim().toUpperCase());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 px-5 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">⚜️</div>
        <h1 className="font-cinzel text-3xl font-black text-yellow-400 tracking-wider">AVALON</h1>
        <p className="font-crimson text-slate-400 italic">The Resistance</p>
      </div>

      {/* Player Card */}
      <div
        onClick={onEditProfile}
        className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 mb-6 active:scale-95 transition-transform cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-slate-700 border-2 border-yellow-500/50 flex items-center justify-center text-3xl">
          {myPlayer.avatar}
        </div>
        <div className="flex-1">
          <p className="font-cinzel text-white font-bold text-base">{myPlayer.name}</p>
          <p className="text-slate-400 text-xs font-crimson">Tap to edit profile</p>
        </div>
        <span className="text-slate-500 text-lg">✏️</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-slate-800/40 p-1 rounded-xl">
        <button
          onClick={() => setTab('create')}
          className={`flex-1 py-2.5 rounded-lg font-cinzel text-sm font-semibold transition-all ${
            tab === 'create'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
              : 'text-slate-400'
          }`}
        >
          Create Room
        </button>
        <button
          onClick={() => setTab('join')}
          className={`flex-1 py-2.5 rounded-lg font-cinzel text-sm font-semibold transition-all ${
            tab === 'join'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'text-slate-400'
          }`}
        >
          Join Room
        </button>
      </div>

      {tab === 'create' ? (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-3">🏰</div>
            <p className="font-cinzel text-white font-bold text-base mb-1">Host a Game</p>
            <p className="font-crimson text-slate-400 text-sm">
              Create a room and invite friends. You will be the Host and control the game.
            </p>
          </div>
          <Button variant="gold" size="lg" fullWidth onClick={handleCreate}>
            ⚔️ Create Room
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5">
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-3">
              Room Code
            </p>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="ABCD"
              maxLength={4}
              className="w-full bg-slate-900/80 border border-slate-600/50 rounded-xl px-4 py-4 text-white font-cinzel text-3xl text-center tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:border-blue-500/60"
            />
            <p className="font-crimson text-slate-500 text-xs mt-2 text-center">
              Ask the Host for the room code
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={joinCode.length < 4}
            onClick={handleJoin}
          >
            🚪 Join Room
          </Button>
        </div>
      )}

      <div className="mt-auto pt-8">
        <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
          <p className="font-cinzel text-xs text-yellow-500/80 uppercase tracking-widest mb-2 text-center">
            ⚠️ Requirements
          </p>
          <ul className="font-crimson text-slate-400 text-sm space-y-1">
            <li>• All players on the same WiFi network</li>
            <li>• 5 to 10 players required</li>
            <li>• Host controls the game flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
