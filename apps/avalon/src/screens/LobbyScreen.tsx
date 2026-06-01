import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { createRoom, joinRoom, startGame } from '../gameService';
import { ALL_CHARACTERS } from '../types';

interface LobbyScreenProps {
  onBack: () => void;
}

export default function LobbyScreen({ onBack }: LobbyScreenProps) {
  const { db, currentPlayer, currentRoom, subscribeToRoom, enabledCharacters, gameName } = useGame();
  const [mode, setMode] = useState<'choose' | 'in-room'>('choose');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const players = currentRoom ? Object.values(currentRoom.players).filter(p => p.connected !== false) : [];
  const isHost = currentRoom?.hostId === currentPlayer?.id;
  const canStart = players.length >= 5 && players.length <= 10;

  useEffect(() => {
    if (currentRoom) setMode('in-room');
  }, [currentRoom?.id]);

  const handleCreate = async () => {
    if (!db || !currentPlayer) return;
    setLoading(true); setError('');
    try {
      const room = await createRoom(db, { ...currentPlayer, isHost: true }, enabledCharacters);
      subscribeToRoom(room.id);
      setMode('in-room');
    } catch (e: unknown) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!db || !currentPlayer || !roomCode.trim()) { setError('Enter a room code'); return; }
    setLoading(true); setError('');
    try {
      const room = await joinRoom(db, roomCode.trim().toUpperCase(), currentPlayer);
      if (!room) { setError('Room not found or game already started'); setLoading(false); return; }
      subscribeToRoom(room.id);
      setMode('in-room');
    } catch (e: unknown) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const handleStart = async () => {
    if (!db || !currentRoom) return;
    setLoading(true); setError('');
    try {
      await startGame(db, currentRoom);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  const playerCount = players.length;
  const evilCount = playerCount <= 6 ? 2 : playerCount <= 9 ? 3 : 4;
  const goodCount = playerCount - evilCount;

  if (mode === 'in-room' && currentRoom) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col relative"
        style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/82" />
        <div className="relative z-10 flex flex-col h-full min-h-screen p-4 safe-top safe-bottom">

          {/* Header */}
          <div className="flex items-center justify-between mb-4 pt-2">
            <button onClick={onBack} className="text-amber-400/80 text-sm hover:text-amber-300 transition px-2 py-1">← Leave</button>
            <div className="text-center">
              <h2 className="text-base font-bold text-amber-400 font-serif">{gameName}</h2>
              <p className="text-gray-500 text-xs">Game Lobby</p>
            </div>
            <div className="w-16" />
          </div>

          {/* Room Code */}
          <div className="bg-gradient-to-br from-amber-950/70 to-gray-900/90 border border-amber-700/50 rounded-2xl p-4 mb-4 text-center pulse-glow">
            <p className="text-amber-600/80 text-xs uppercase tracking-widest mb-1">Room Code</p>
            <p className="text-5xl font-black text-amber-400 tracking-widest font-mono">{currentRoom.code}</p>
            <p className="text-gray-600 text-xs mt-1.5">📱 Share this with other players</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-2.5 text-center">
              <p className="text-2xl font-bold text-white">{players.length}</p>
              <p className="text-gray-500 text-xs">Players</p>
            </div>
            <div className="bg-blue-950/60 border border-blue-800/40 rounded-xl p-2.5 text-center">
              <p className="text-2xl font-bold text-blue-400">{playerCount >= 5 ? goodCount : '?'}</p>
              <p className="text-blue-400/80 text-xs">Good</p>
            </div>
            <div className="bg-red-950/60 border border-red-800/40 rounded-xl p-2.5 text-center">
              <p className="text-2xl font-bold text-red-400">{playerCount >= 5 ? evilCount : '?'}</p>
              <p className="text-red-400/80 text-xs">Evil</p>
            </div>
          </div>

          {/* Players List */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
              Players ({players.length}/10) — Need {Math.max(0, 5 - players.length)} more
            </p>
            {players.map((p, i) => (
              <div key={p.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all animate-slide-up ${
                  p.id === currentPlayer?.id
                    ? 'bg-amber-900/30 border-amber-600/50'
                    : 'bg-gray-900/70 border-gray-700/40'
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative">
                  <span className="text-2xl">{p.avatar}</span>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-900 ${
                    p.connected !== false ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {p.name}
                    {p.id === currentPlayer?.id && <span className="text-amber-400 text-xs ml-1.5">(You)</span>}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {currentRoom.hostId === p.id ? '👑 Host' : `Knight ${i + 1}`}
                  </p>
                </div>
              </div>
            ))}
            {players.length < 5 && (
              <div className="border-2 border-dashed border-gray-800 rounded-xl p-3 text-center">
                <p className="text-gray-700 text-sm">
                  ⏳ Waiting for {5 - players.length} more player{5 - players.length !== 1 ? 's' : ''}...
                </p>
              </div>
            )}
          </div>

          {/* Active Roles Preview */}
          <div className="mb-4 bg-gray-900/70 border border-gray-700/40 rounded-xl px-4 py-3">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Special Roles Active</p>
            <div className="flex flex-wrap gap-1.5">
              {enabledCharacters.map(c => {
                const char = ALL_CHARACTERS.find(ch => ch.name === c);
                return (
                  <span key={c} className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                    char?.team === 'good'
                      ? 'bg-blue-900/50 border-blue-700/50 text-blue-300'
                      : 'bg-red-900/50 border-red-700/50 text-red-300'
                  }`}>
                    {c}
                  </span>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-3 mb-3 text-red-300 text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {isHost ? (
            <button
              onClick={handleStart}
              disabled={!canStart || loading}
              className={`w-full font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl btn-press ${
                canStart
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {loading
                ? '⏳ Starting...'
                : canStart
                  ? '⚔️ Start Game'
                  : `Need ${Math.max(0, 5 - players.length)} more player${5 - players.length !== 1 ? 's' : ''}`}
            </button>
          ) : (
            <div className="w-full bg-gray-900/60 border border-gray-700/50 rounded-2xl py-4 text-center">
              <p className="text-gray-400 text-sm">⏳ Waiting for host to start...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Join/Create screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/82" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <button onClick={onBack} className="text-amber-400/80 mb-5 flex items-center gap-1 text-sm hover:text-amber-300 transition">
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl mb-2 animate-float">🏰</div>
          <h2 className="text-3xl font-bold text-amber-400 font-serif">Join the Table</h2>
          <p className="text-gray-500 text-sm mt-1">Create or join a game room</p>
        </div>

        <div className="space-y-4">
          {/* Create Room */}
          <div className="bg-gray-900/90 border border-amber-800/40 rounded-2xl p-5">
            <h3 className="text-amber-300 font-semibold text-sm mb-3">🏰 Host a Game</h3>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 text-white font-bold rounded-xl py-4 text-base transition-all active:scale-95 shadow-xl btn-press"
            >
              {loading ? '⏳ Creating...' : '+ Create Room'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-600 text-xs uppercase tracking-widest">or join</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Join Room */}
          <div className="bg-gray-900/90 border border-gray-700/40 rounded-2xl p-5">
            <h3 className="text-gray-300 font-semibold text-sm mb-3">🚪 Join a Room</h3>
            <input
              type="text"
              maxLength={6}
              placeholder="ROOM CODE"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              className="w-full bg-gray-800 border border-gray-700 focus:border-amber-500 rounded-xl px-4 py-4 text-white text-center text-2xl font-mono font-black tracking-widest outline-none transition mb-3 uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={loading || !roomCode.trim()}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white font-bold rounded-xl py-3.5 text-base transition-all active:scale-95 btn-press"
            >
              {loading ? '⏳ Joining...' : 'Join Room →'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-3 text-red-300 text-sm text-center">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
