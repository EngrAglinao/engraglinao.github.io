import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { proposeTeam } from '../gameService';
import { QUEST_SIZES } from '../types';
import QuestBoard from '../components/QuestBoard';

export default function DayPhaseScreen({ onVotePhase }: { onVotePhase: () => void }) {
  const { currentRoom, currentPlayer, db, gameName } = useGame();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const round = currentRoom.currentRound;
  const playerCount = players.length;
  const requiredTeamSize = (QUEST_SIZES[playerCount] || QUEST_SIZES[5])[round - 1] || 2;
  const leader = players.find(p => p.isLeader);
  const isLeader = leader?.id === currentPlayer?.id;
  const rejections = currentRoom.consecutiveRejections || 0;

  const togglePlayer = (id: string) => {
    if (!isLeader) return;
    setSelectedPlayers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < requiredTeamSize ? [...prev, id] : prev
    );
  };

  const handlePropose = async () => {
    if (!db || !currentRoom) return;
    if (selectedPlayers.length !== requiredTeamSize) { setError(`Select exactly ${requiredTeamSize} players`); return; }
    setLoading(true); setError('');
    try {
      await proposeTeam(db, currentRoom.id, selectedPlayers);
      onVotePhase();
    } catch (e: unknown) { setError((e as Error).message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/82" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-4 pb-3">
          <p className="text-amber-500/70 text-xs uppercase tracking-widest">☀️ Day Phase — Round {round}</p>
          <h2 className="text-xl font-bold text-amber-400 font-serif mt-1">{gameName}</h2>
        </div>

        {/* Quest Board */}
        <QuestBoard />

        {/* Consecutive Rejections Warning */}
        {rejections > 0 && (
          <div className={`mx-0 mb-3 px-4 py-2 rounded-xl border text-center ${
            rejections >= 4 ? 'bg-red-900/60 border-red-600 text-red-300' : 'bg-amber-900/40 border-amber-700/50 text-amber-300'
          }`}>
            <p className="text-sm font-semibold">
              ⚠️ {rejections} consecutive rejection{rejections !== 1 ? 's' : ''}
              {rejections >= 4 && ' — 1 more and Evil wins!'}
            </p>
          </div>
        )}

        {/* Current Leader */}
        <div className="bg-gray-900/80 border border-amber-700/40 rounded-2xl px-4 py-3 mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">⚔️ Quest Leader</p>
          {leader ? (
            <div className="flex items-center gap-3">
              <span className="text-3xl">{leader.avatar}</span>
              <div>
                <p className="text-white font-bold">{leader.name}</p>
                <p className="text-amber-400 text-xs">
                  {isLeader ? 'You are the leader!' : 'Choosing the quest team...'}
                </p>
              </div>
              <div className="ml-auto">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Loading leader...</p>
          )}
        </div>

        {/* Team Selection */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 mb-4 flex-1">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-300 text-sm font-semibold">
              {isLeader ? `Select ${requiredTeamSize} players for Quest ${round}` : `Quest ${round} requires ${requiredTeamSize} players`}
            </p>
            <span className="bg-amber-800/50 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-700/50">
              {selectedPlayers.length}/{requiredTeamSize}
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {players.map(p => {
              const isSelected = selectedPlayers.includes(p.id);
              const isMe = p.id === currentPlayer?.id;
              return (
                <button
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  disabled={!isLeader}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-amber-900/60 border-amber-500/60 ring-1 ring-amber-500/40'
                      : 'bg-gray-800/60 border-gray-700/40 hover:bg-gray-700/60'
                  } ${!isLeader ? 'cursor-default' : 'cursor-pointer active:scale-98'}`}
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold text-sm">
                      {p.name} {isMe && <span className="text-amber-400 text-xs">(You)</span>}
                    </p>
                    {p.isLeader && <p className="text-amber-400 text-xs">👑 Leader</p>}
                  </div>
                  {isSelected && <span className="text-amber-400 text-lg">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">⚠️ {error}</p>
        )}

        {isLeader ? (
          <button
            onClick={handlePropose}
            disabled={selectedPlayers.length !== requiredTeamSize || loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl mb-4"
          >
            {loading ? '⏳ Proposing...' : `⚔️ Propose Team (${selectedPlayers.length}/${requiredTeamSize})`}
          </button>
        ) : (
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-4 text-center mb-4">
            <p className="text-gray-400 text-sm">👁️ Watching {leader?.name} choose the quest team...</p>
          </div>
        )}
      </div>
    </div>
  );
}
