import { useState } from 'react';
import { Database } from 'firebase/database';
import { Player, AVATARS } from '../types/game';
import { createRoom, joinRoom } from '../firebase/gameService';
import { v4 as uuidv4 } from 'uuid';
import HowToPlay from './HowToPlay';

interface Props {
  db: Database;
  onJoinRoom: (roomId: string, player: Player) => void;
  onOpenFirebaseSettings?: () => void;
  savedProfile?: { name: string; avatar: string } | null;
}

export default function Lobby({ db, onJoinRoom, onOpenFirebaseSettings, savedProfile }: Props) {
  const [name, setName] = useState(savedProfile?.name || '');
  const [avatar, setAvatar] = useState(savedProfile?.avatar || AVATARS[0]);
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'main' | 'create' | 'join' | 'profile'>('main');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const validateProfile = (): boolean => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (name.trim().length > 20) {
      setError('Name must be 20 characters or less.');
      return false;
    }
    return true;
  };

  const makePlayer = (isHost: boolean): Player => ({
    id: uuidv4(),
    name: name.trim(),
    avatar,
    isHost,
    isReady: false,
    hasVoted: false,
    cardVisible: false,
  });

  const handleCreate = async () => {
    if (!validateProfile()) return;
    setError('');
    setLoading(true);
    try {
      const player = makePlayer(true);
      const roomId = await createRoom(db, player);
      onJoinRoom(roomId, player);
    } catch (err) {
      setError('Failed to create room. Check your Firebase connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!validateProfile()) return;
    if (!roomCode.trim()) {
      setError('Please enter a room code.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const player = makePlayer(false);
      const success = await joinRoom(db, roomCode.trim().toUpperCase(), player);
      if (!success) {
        setError('Room not found or game already started. Check the room code.');
        return;
      }
      onJoinRoom(roomCode.trim().toUpperCase(), player);
    } catch (err) {
      setError('Failed to join room. Check your Firebase connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 drop-shadow-2xl">🔮</div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-1">AVALON</h1>
          <p className="text-purple-400 text-base font-medium tracking-widest uppercase">The Resistance</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>

        {mode === 'main' && (
          <div className="space-y-4">
            <div className="bg-gray-900/80 backdrop-blur border border-purple-800/40 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-white font-bold text-lg mb-4 text-center">🏰 Welcome to Camelot</h2>
              
              {/* Quick Profile */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-purple-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <label className="block text-sm font-medium text-purple-300 mt-3 mb-2">Choose Avatar</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAvatar(a)}
                      className={`text-2xl p-1.5 rounded-lg transition-all duration-150 ${
                        avatar === a
                          ? 'bg-purple-600 scale-110 shadow-lg shadow-purple-900/50'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/50 text-lg"
                >
                  {loading ? '⏳ Creating...' : '👑 Create Room (Host)'}
                </button>
                <button
                  onClick={() => setMode('join')}
                  className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
                >
                  🚪 Join Room
                </button>
                <button
                  onClick={() => setShowHelp(true)}
                  className="w-full bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-gray-400 font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  📖 How to Play
                </button>
              </div>
            </div>

            {/* Firebase Settings button for admin */}
            {onOpenFirebaseSettings && (
              <button
                onClick={onOpenFirebaseSettings}
                className="w-full bg-gray-900/60 hover:bg-gray-800/60 border border-gray-700/50 text-gray-500 hover:text-gray-400 font-medium py-2.5 rounded-xl transition-colors text-xs"
              >
                ⚙️ Firebase Settings (Admin Only)
              </button>
            )}

            <div className="text-center text-gray-600 text-xs">
              All players must be on the same WiFi network
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-gray-900/80 backdrop-blur border border-purple-800/40 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-white font-bold text-xl mb-6 text-center">🚪 Join a Room</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  placeholder="Enter 6-digit code..."
                  maxLength={6}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-4 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors uppercase"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setMode('main'); setError(''); }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleJoin}
                  disabled={loading || !name.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {loading ? '⏳ Joining...' : 'Join!'}
                </button>
              </div>
              {!name.trim() && (
                <p className="text-amber-400 text-xs text-center">
                  ⚠️ Go back and enter your name first!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
