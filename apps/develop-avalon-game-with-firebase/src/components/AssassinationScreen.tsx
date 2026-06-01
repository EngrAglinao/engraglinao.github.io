import { useState } from 'react';
import { GameState, Player, ROLE_DEFINITIONS } from '../types';
import { updateRoomState } from '../dbService';

interface AssassinationProps {
  gameState: GameState;
  myPlayer: Player;
}

export default function AssassinationScreen({ gameState, myPlayer }: AssassinationProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(gameState.assassinTarget || null);
  const players = Object.values(gameState.players || {});
  const isHost = myPlayer.id === gameState.hostId;
  const assassin = players.find(p => p.role === 'assassin');
  const isAssassin = myPlayer.role === 'assassin';
  const myRole = myPlayer.role;

  const goodPlayers = players.filter(p => p.role && ROLE_DEFINITIONS[p.role].alignment === 'good');

  const handleSelectTarget = async (pid: string) => {
    if (!isAssassin) return;
    setSelectedTarget(pid);
    await updateRoomState(gameState.id, { assassinTarget: pid });
  };

  const handleAssassinate = async () => {
    if (!isHost || !selectedTarget) return;
    const target = players.find(p => p.id === selectedTarget);
    const isMerlin = target?.role === 'merlin';
    await updateRoomState(gameState.id, {
      phase: 'game_over',
      winner: isMerlin ? 'evil' : 'good',
      winReason: isMerlin
        ? `The Assassin correctly identified and killed Merlin (${target?.name})! Evil wins!`
        : `The Assassin chose ${target?.name}, who is NOT Merlin! Good wins!`,
    });
  };

  const currentTarget = gameState.assassinTarget || selectedTarget;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] via-[#2a0a0a] to-[#1a0000] flex flex-col p-4 relative overflow-hidden">
      {/* Dark red atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ width: Math.random()*3+1+'px', height: Math.random()*3+1+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', opacity: Math.random()*0.4+0.1, background: Math.random() > 0.7 ? '#ef4444' : '#fff' }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4 pb-6">
        {/* Dramatic header */}
        <div className="text-center pt-6">
          <div className="text-5xl mb-2 animate-pulse">🗡️</div>
          <p className="text-red-400/70 text-xs tracking-[0.3em] mb-1">FINAL GAMBIT</p>
          <h1 className="text-3xl font-bold text-red-300">Assassination</h1>
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            Good has completed 3 quests. The Assassin now has one chance to identify and kill Merlin.
          </p>
        </div>

        {/* Assassin info */}
        <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            {assassin && (
              <>
                <div className="w-12 h-12 rounded-full bg-red-900/50 border-2 border-red-400/50 flex items-center justify-center text-2xl">
                  {assassin.avatar}
                </div>
                <div>
                  <p className="text-red-300 text-xs">The Assassin</p>
                  <p className="text-white font-bold">{assassin.name}</p>
                  {assassin.id === myPlayer.id && (
                    <p className="text-red-400 text-xs">That's you!</p>
                  )}
                </div>
              </>
            )}
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            {isAssassin
              ? '🎯 You are the Assassin. Choose who you believe is Merlin to strike them down.'
              : `🕵️ ${assassin?.name || 'The Assassin'} is choosing their target. If they pick Merlin, Evil wins!`}
          </p>
        </div>

        {/* Rules reminder */}
        <div className="bg-black/30 border border-white/10 rounded-xl p-3">
          <p className="text-gray-400 text-xs leading-relaxed">
            If the Assassin correctly identifies <span className="text-blue-300 font-semibold">Merlin</span>, 
            Evil wins despite losing the quests. If they are wrong, <span className="text-blue-300 font-semibold">Good wins</span>!
          </p>
        </div>

        {/* Player selection */}
        <div>
          <p className="text-gray-400 text-xs font-semibold tracking-wider mb-2">
            {isAssassin ? 'SELECT YOUR TARGET (Good players only)' : 'GOOD PLAYERS'}
          </p>
          <div className="space-y-2">
            {goodPlayers.map(p => {
              const isSelected = currentTarget === p.id;
              const isMe = p.id === myPlayer.id;
              return (
                <button
                  key={p.id}
                  onClick={() => isAssassin && !isMe && handleSelectTarget(p.id)}
                  disabled={!isAssassin || isMe}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-red-500/30 border-red-400/70 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : isAssassin && !isMe
                      ? 'bg-white/5 border-white/10 hover:border-red-400/30 active:scale-98'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 flex-shrink-0 ${
                    isSelected ? 'border-red-400 bg-red-900/50' : 'border-white/20 bg-white/5'
                  }`}>
                    {p.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{p.name}</p>
                      {isMe && <span className="text-amber-400 text-xs">(You)</span>}
                    </div>
                    <p className="text-gray-500 text-xs">
                      {isMe && myRole ? ROLE_DEFINITIONS[myRole].name : '??? — Role unknown'}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-red-400 text-xl">🎯</span>
                      <span className="text-red-300 text-xs font-bold">TARGET</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current target display */}
        {currentTarget && !isAssassin && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-red-300 text-sm">
              🎯 Targeting: <span className="font-bold">{players.find(p => p.id === currentTarget)?.name || '?'}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Waiting for host to confirm...</p>
          </div>
        )}

        {/* Assassin confirm button */}
        {isAssassin && currentTarget && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center">
            <p className="text-red-300 text-sm font-semibold">
              Target selected: <span className="text-white">{players.find(p => p.id === currentTarget)?.name}</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Wait for host to confirm the assassination.</p>
          </div>
        )}

        {/* Host confirm button */}
        {isHost && (
          <button
            onClick={handleAssassinate}
            disabled={!currentTarget}
            className="w-full py-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-900/50 text-sm tracking-wider border border-red-500/50"
          >
            {currentTarget
              ? `🗡️ ASSASSINATE ${players.find(p => p.id === currentTarget)?.name?.toUpperCase() || '?'}`
              : '🗡️ WAITING FOR TARGET SELECTION'}
          </button>
        )}

        {!isHost && !currentTarget && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-sm">⏳ The Assassin is choosing their target...</p>
          </div>
        )}

        {!isHost && currentTarget && (
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-sm">⏳ Waiting for host to confirm assassination...</p>
          </div>
        )}
      </div>
    </div>
  );
}
