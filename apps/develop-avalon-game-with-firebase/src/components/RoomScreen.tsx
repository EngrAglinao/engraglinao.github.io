import { useState, useEffect } from 'react';
import { GameState, Player } from '../types';
import { createRoom, getRoomState, addPlayerToRoom, subscribeToRoom, listOpenRooms } from '../dbService';
import { generateRoomCode, getDefaultRolesForCount } from '../gameLogic';
import { getGameName, getGameIcon } from '../firebase';
import { RoomInfo } from '../types';

interface RoomScreenProps {
  myPlayer: Player;
  onJoinedRoom: (roomId: string, unsubscribe: () => void) => void;
}

export default function RoomScreen({ myPlayer, onJoinedRoom }: RoomScreenProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join' | 'browse'>('menu');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRooms, setOpenRooms] = useState<RoomInfo[]>([]);
  const gameName = getGameName();
  const gameIcon = getGameIcon();

  useEffect(() => {
    if (mode === 'browse') {
      loadRooms();
    }
  }, [mode]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const rooms = await listOpenRooms();
      setOpenRooms(rooms);
    } catch (e) {
      setError('Failed to load rooms');
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');
    try {
      const roomId = generateRoomCode();
      const now = Date.now();
      const initialState: GameState = {
        id: roomId,
        phase: 'lobby',
        players: { [myPlayer.id]: { ...myPlayer, isHost: true } },
        hostId: myPlayer.id,
        currentRound: 1,
        currentLeaderIndex: 0,
        rejectedVotes: 0,
        selectedTeam: [],
        questResults: [],
        availableRoles: getDefaultRolesForCount(5),
        teamVotes: {},
        questVotes: {},
        gameName,
        createdAt: now,
        currentLeaderId: myPlayer.id,
      };
      await createRoom(roomId, initialState);
      const unsub = subscribeToRoom(roomId, () => {});
      unsub();
      const unsubscribe = subscribeToRoom(roomId, () => {});
      onJoinedRoom(roomId, unsubscribe);
    } catch (e: any) {
      setError(e.message || 'Failed to create room');
    }
    setLoading(false);
  };

  const handleJoinRoom = async (code: string) => {
    const roomCode = code.trim().toUpperCase();
    if (!roomCode || roomCode.length < 4) {
      setError('Enter a valid room code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const state = await getRoomState(roomCode);
      if (!state) {
        setError('Room not found. Check the code.');
        setLoading(false);
        return;
      }
      if (state.phase !== 'lobby') {
        setError('This game has already started.');
        setLoading(false);
        return;
      }
      const playerCount = Object.keys(state.players || {}).length;
      if (playerCount >= 10) {
        setError('Room is full (max 10 players).');
        setLoading(false);
        return;
      }
      await addPlayerToRoom(roomCode, { ...myPlayer, isHost: false });
      const unsubscribe = subscribeToRoom(roomCode, () => {});
      onJoinedRoom(roomCode, unsubscribe);
    } catch (e: any) {
      setError(e.message || 'Failed to join room');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col items-center p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random()*2+1+'px', height: Math.random()*2+1+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', opacity: Math.random()*0.5+0.1 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
        {/* Header */}
        <div className="text-center pt-8 pb-2">
          {gameIcon ? (
            <img src={gameIcon} alt="icon" className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover shadow-2xl" />
          ) : (
            <div className="text-5xl mb-3">⚔️</div>
          )}
          <h1 className="text-3xl font-bold text-amber-400 tracking-widest">{gameName}</h1>
          <p className="text-amber-200/50 text-xs tracking-wider mt-0.5">THE RESISTANCE</p>
        </div>

        {/* Player info */}
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-600/20 border-2 border-amber-400/40 flex items-center justify-center text-2xl">
            {myPlayer.avatar}
          </div>
          <div>
            <p className="text-gray-400 text-xs">Playing as</p>
            <p className="text-white font-bold text-base">{myPlayer.name}</p>
          </div>
        </div>

        {mode === 'menu' && (
          <div className="space-y-3">
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg border border-amber-500/50 text-sm tracking-wider"
            >
              {loading ? '⏳ Creating...' : '👑 CREATE ROOM'}
              <p className="text-amber-200/60 text-xs font-normal mt-0.5">You'll be the host</p>
            </button>

            <button
              onClick={() => setMode('join')}
              className="w-full py-5 bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg border border-blue-500/50 text-sm tracking-wider"
            >
              🔑 JOIN WITH CODE
              <p className="text-blue-200/60 text-xs font-normal mt-0.5">Enter room code from host</p>
            </button>

            <button
              onClick={() => setMode('browse')}
              className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/20 text-gray-300 font-bold rounded-2xl active:scale-95 transition-all text-sm tracking-wider"
            >
              🔍 BROWSE ROOMS
              <p className="text-gray-500 text-xs font-normal mt-0.5">Find open games on your network</p>
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-blue-300 text-xs leading-relaxed text-center">
                📶 All players must be on the same WiFi network to play
              </p>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Room Code</label>
              <input
                type="text"
                maxLength={8}
                className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-4 text-white text-xl font-mono font-bold text-center uppercase tracking-[0.3em] focus:border-amber-400 focus:outline-none"
                placeholder="XXXXXX"
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleJoinRoom(joinCode)}
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setMode('menu'); setError(''); setJoinCode(''); }}
                className="flex-1 py-3 bg-white/10 text-gray-300 font-semibold rounded-xl text-sm active:scale-95 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => handleJoinRoom(joinCode)}
                disabled={loading}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? '⏳ Joining...' : '🔑 Join Room'}
              </button>
            </div>
          </div>
        )}

        {mode === 'browse' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button onClick={() => setMode('menu')} className="text-gray-400 text-sm hover:text-white">← Back</button>
              <button onClick={loadRooms} className="text-amber-400 text-sm hover:text-amber-300">🔄 Refresh</button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <span className="animate-spin text-3xl inline-block">⚔️</span>
                <p className="text-gray-400 text-sm mt-3">Searching for rooms...</p>
              </div>
            ) : openRooms.length === 0 ? (
              <div className="text-center py-8 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-5xl mb-3">🏰</p>
                <p className="text-white font-semibold">No open rooms found</p>
                <p className="text-gray-400 text-xs mt-1">Create a room or ask for the room code</p>
              </div>
            ) : (
              openRooms.map(room => (
                <button
                  key={room.id}
                  onClick={() => handleJoinRoom(room.id)}
                  className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-400/30 active:scale-98 transition-all text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono font-bold text-base tracking-wider">{room.id}</span>
                      <span className="text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-1.5 py-0.5 rounded-full">Open</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">Host: {room.hostName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{room.playerCount}</p>
                    <p className="text-gray-500 text-xs">players</p>
                  </div>
                </button>
              ))
            )}

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
