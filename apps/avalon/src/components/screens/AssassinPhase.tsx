import { useState } from 'react';
import { Button } from '../ui/Button';
import type { GameState, Player } from '../../types/game';

interface AssassinPhaseProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onAssassinate: (targetId: string) => void;
  onHostConfirmAssassination: () => void;
}

export function AssassinPhase({
  gameState,
  myPlayer,
  isHost,
  onAssassinate,
  onHostConfirmAssassination,
}: AssassinPhaseProps) {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const me = gameState.players.find((p) => p.id === myPlayer.id);
  const isAssassin = me?.role === 'Assassin';
  const assassin = gameState.players.find((p) => p.role === 'Assassin');

  const goodPlayers = gameState.players.filter((p) => p.team === 'good');


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-red-950 via-slate-950 to-slate-950 px-5 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🗡️</div>
        <h1 className="font-cinzel text-3xl font-black text-red-400">Assassination</h1>
        <p className="font-crimson text-slate-300 text-base mt-2 leading-snug">
          Good has won the quests... but the Assassin has one final chance!
        </p>
      </div>

      <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 mb-6">
        <p className="font-crimson text-red-200 text-center leading-relaxed">
          <strong className="font-cinzel text-red-400">{assassin?.avatar} {assassin?.name}</strong>
          {isAssassin ? (
            <>, you must identify and assassinate <strong className="text-white">Merlin</strong>. If you succeed, Evil wins!</>
          ) : (
            <> must identify and assassinate Merlin. If they succeed, Evil wins!</>
          )}
        </p>
      </div>

      {isAssassin && !gameState.assassinTargetId ? (
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest text-center">
            Select Your Target
          </p>
          <div className="grid grid-cols-2 gap-3">
            {goodPlayers.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedTarget(player.id)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 active:scale-95 transition-all ${
                  selectedTarget === player.id
                    ? 'bg-red-900/40 border-red-400/80 shadow-red-500/20 shadow-lg'
                    : 'bg-slate-800/60 border-slate-600/40'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-3xl ${
                    selectedTarget === player.id
                      ? 'border-red-400 bg-red-900/40'
                      : 'border-slate-600 bg-slate-700'
                  }`}
                >
                  {player.avatar}
                </div>
                <p className="font-cinzel text-white text-sm font-bold">{player.name}</p>
                {selectedTarget === player.id && (
                  <div className="text-2xl">🎯</div>
                )}
              </button>
            ))}
          </div>

          <Button
            variant="danger"
            size="lg"
            fullWidth
            disabled={!selectedTarget}
            onClick={() => selectedTarget && onAssassinate(selectedTarget)}
          >
            🗡️ Assassinate!
          </Button>
        </div>
      ) : gameState.assassinTargetId ? (
        <div className="flex-1 flex flex-col gap-4">
          {/* Target Chosen */}
          {(() => {
            const target = gameState.players.find((p) => p.id === gameState.assassinTargetId);
            return (
              <div className="bg-red-900/30 border-2 border-red-400/60 rounded-2xl p-5 text-center">
                <p className="font-cinzel text-slate-400 text-xs uppercase tracking-widest mb-3">
                  Target Chosen
                </p>
                <div className="w-20 h-20 rounded-full bg-red-900/40 border-2 border-red-400 flex items-center justify-center text-4xl mx-auto mb-2">
                  {target?.avatar}
                </div>
                <p className="font-cinzel text-white text-xl font-bold">{target?.name}</p>
                <div className="text-3xl mt-2">🎯</div>
              </div>
            );
          })()}

          {isHost && (
            <Button variant="danger" size="lg" fullWidth onClick={onHostConfirmAssassination}>
              ⚡ Reveal the Truth
            </Button>
          )}

          {!isHost && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-2.5">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="font-cinzel text-slate-400 text-xs">Waiting for host to reveal...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-900/40 border-2 border-red-400/60 flex items-center justify-center text-4xl">
            {assassin?.avatar}
          </div>
          <div className="text-center">
            <p className="font-cinzel text-red-400 text-base font-bold">{assassin?.name} is thinking...</p>
            <p className="font-crimson text-slate-400 text-sm mt-1">The Assassin is choosing their target</p>
          </div>
          <div className="text-4xl animate-bounce">⏳</div>
        </div>
      )}
    </div>
  );
}
