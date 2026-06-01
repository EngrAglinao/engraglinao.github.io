import { useState } from 'react';
import { GameState, Player, QUEST_TEAM_SIZES, ROLE_DEFINITIONS } from '../types';
import { updateRoomState } from '../dbService';
import QuestBoard from './QuestBoard';

interface TeamSelectionProps {
  gameState: GameState;
  myPlayer: Player;
}

export default function TeamSelectionScreen({ gameState, myPlayer }: TeamSelectionProps) {
  const players = Object.values(gameState.players || {});
  const playerCount = players.length;
  const questSizes = QUEST_TEAM_SIZES[playerCount] || [2, 3, 2, 3, 3];
  const currentRound = gameState.currentRound || 1;
  const teamSize = questSizes[currentRound - 1] || 2;

  const leaderId = gameState.currentLeaderId || players[gameState.currentLeaderIndex || 0]?.id;
  const isLeader = myPlayer.id === leaderId;
  const isHost = myPlayer.id === gameState.hostId;
  const leader = players.find(p => p.id === leaderId);

  const selectedTeam = gameState.selectedTeam || [];
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTeam);

  const togglePlayer = async (pid: string) => {
    if (!isLeader) return;
    let next: string[];
    if (localSelected.includes(pid)) {
      next = localSelected.filter(id => id !== pid);
    } else {
      if (localSelected.length >= teamSize) return;
      next = [...localSelected, pid];
    }
    setLocalSelected(next);
    await updateRoomState(gameState.id, { selectedTeam: next });
  };

  const handleSubmitTeam = async () => {
    if (!isHost || localSelected.length !== teamSize) return;
    const updatedPlayers: any = {};
    players.forEach(p => {
      updatedPlayers[p.id] = { ...p, hasVoted: false, vote: undefined };
    });
    await updateRoomState(gameState.id, {
      phase: 'team_vote',
      selectedTeam: localSelected,
      teamVotes: {},
      players: updatedPlayers,
    });
  };

  const currentSelected = gameState.selectedTeam || localSelected;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random() * 2 + 1 + 'px', height: Math.random() * 2 + 1 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', opacity: Math.random() * 0.5 + 0.1 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4">
        {/* Header */}
        <div className="text-center pt-4">
          <p className="text-amber-400/60 text-xs tracking-widest">QUEST {currentRound} OF 5</p>
          <h1 className="text-2xl font-bold text-white mt-1">Team Selection</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLeader ? `Choose ${teamSize} players for the quest` : `${leader?.name || 'Leader'} is choosing the team`}
          </p>
        </div>

        {/* Quest Board */}
        <QuestBoard gameState={gameState} myPlayer={myPlayer} compact={true} />

        {/* Leader indicator */}
        <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <div>
              <p className="text-amber-300 text-xs">Quest Leader</p>
              <p className="text-white font-bold text-sm">{leader?.name || '?'} {leader?.id === myPlayer.id ? '(You)' : ''}</p>
            </div>
          </div>
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg px-2 py-1">
            <p className="text-amber-400 text-xs font-bold">{currentSelected.length}/{teamSize}</p>
            <p className="text-amber-400/60 text-xs">selected</p>
          </div>
        </div>

        {/* Player Selection */}
        <div className="space-y-2">
          <p className="text-gray-400 text-xs font-semibold tracking-wider">SELECT QUEST TEAM</p>
          {players.map(p => {
            const isSelected = currentSelected.includes(p.id);
            const pRole = p.role;
            const isMyCard = p.id === myPlayer.id;

            return (
              <button
                key={p.id}
                onClick={() => togglePlayer(p.id)}
                disabled={!isLeader}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-98 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-white/5 border-white/10'
                } ${isLeader && !isSelected && currentSelected.length >= teamSize ? 'opacity-40' : ''}`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0 transition-all ${
                  isSelected ? 'border-amber-400 bg-amber-500/20' : 'border-white/20 bg-white/5'
                }`}>
                  {p.avatar}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    {isMyCard && <span className="text-xs text-amber-400/70">(You)</span>}
                    {p.id === gameState.hostId && <span className="text-amber-400 text-xs">👑</span>}
                    {p.id === leaderId && <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Leader</span>}
                  </div>
                  {isMyCard && pRole && (
                    <p className={`text-xs ${ROLE_DEFINITIONS[pRole].alignment === 'good' ? 'text-blue-400' : 'text-red-400'}`}>
                      {ROLE_DEFINITIONS[pRole].name}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm font-bold">✓</span>
                  </div>
                )}
                {!isSelected && isLeader && currentSelected.length < teamSize && (
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-white/20 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected team summary */}
        {currentSelected.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2">SELECTED TEAM</p>
            <div className="flex flex-wrap gap-2">
              {currentSelected.map(pid => {
                const p = players.find(pl => pl.id === pid);
                if (!p) return null;
                return (
                  <div key={pid} className="flex items-center gap-1 bg-amber-500/10 border border-amber-400/30 rounded-lg px-2 py-1">
                    <span className="text-base">{p.avatar}</span>
                    <span className="text-white text-xs font-semibold">{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Host start vote button */}
        {isHost && (
          <button
            onClick={handleSubmitTeam}
            disabled={currentSelected.length !== teamSize}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg text-sm tracking-wider"
          >
            {currentSelected.length !== teamSize
              ? `Select ${teamSize - currentSelected.length} more player${teamSize - currentSelected.length !== 1 ? 's' : ''}`
              : '🗳️ START TEAM VOTE'}
          </button>
        )}

        {!isHost && currentSelected.length === teamSize && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-sm">⏳ Waiting for host to start the vote...</p>
          </div>
        )}

        {!isHost && currentSelected.length < teamSize && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-sm">⏳ Leader is selecting the team...</p>
          </div>
        )}
      </div>
    </div>
  );
}
