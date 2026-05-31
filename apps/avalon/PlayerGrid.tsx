import { Button } from '../ui/Button';
import type { GameState, Player } from '../../types/game';
import { ROLE_INFO } from '../../constants/gameConfig';

interface GameOverProps {
  gameState: GameState;
  myPlayer: Player;
  onPlayAgain: () => void;
  onReturnToMenu: () => void;
}

export function GameOver({ gameState, myPlayer, onPlayAgain, onReturnToMenu }: GameOverProps) {
  const winner = gameState.winner;
  const me = gameState.players.find((p) => p.id === myPlayer.id);
  const iWon = me?.team === winner;

  const assassinTarget = gameState.players.find((p) => p.id === gameState.assassinTargetId);
  const merlin = gameState.players.find((p) => p.role === 'Merlin');
  const assassin = gameState.players.find((p) => p.role === 'Assassin');

  const wasAssassinated = winner === 'evil' && gameState.assassinTargetId != null;

  return (
    <div
      className={`flex flex-col min-h-screen px-5 py-8 ${
        winner === 'good'
          ? 'bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950'
          : 'bg-gradient-to-b from-red-950 via-slate-950 to-slate-950'
      }`}
    >
      {/* Winner Banner */}
      <div className="text-center mb-6">
        <div className="text-7xl mb-3">{winner === 'good' ? '⚜️' : '💀'}</div>
        <h1
          className={`font-cinzel text-4xl font-black ${
            winner === 'good' ? 'text-yellow-400' : 'text-red-400'
          }`}
        >
          {winner === 'good' ? 'Good Wins!' : 'Evil Wins!'}
        </h1>
        <p
          className={`font-crimson text-lg mt-1 ${
            iWon ? 'text-green-400' : 'text-slate-400'
          }`}
        >
          {iWon ? '🎉 Victory is yours!' : '😔 You have been defeated'}
        </p>

        {gameState.hammerUsed && (
          <div className="mt-3 bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-2">
            <p className="font-cinzel text-red-400 text-sm">💀 5 Consecutive Rejections — Evil Wins!</p>
          </div>
        )}

        {wasAssassinated && (
          <div className="mt-3 bg-red-900/30 border border-red-500/40 rounded-xl px-4 py-2">
            <p className="font-cinzel text-red-400 text-sm">
              🗡️ {assassin?.avatar} {assassin?.name} assassinated{' '}
              {assassinTarget?.id === merlin?.id ? (
                <span className="text-yellow-400">Merlin!</span>
              ) : (
                <span className="text-green-400">the wrong person — Merlin survives!</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Score */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="text-center">
          <div className="flex gap-1 justify-center mb-1">
            {gameState.quests.map((q, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full ${
                  q.result === 'success'
                    ? 'bg-blue-400'
                    : q.result === 'fail'
                    ? 'bg-red-400'
                    : 'bg-slate-700 border border-slate-600'
                }`}
              />
            ))}
          </div>
          <p className="font-cinzel text-blue-400 text-xs">Good: {gameState.goodScore}</p>
        </div>
        <div className="font-cinzel text-slate-500 text-2xl">vs</div>
        <div className="text-center">
          <div className="flex gap-1 justify-center mb-1">
            {Array.from({ length: gameState.evilScore }).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full bg-red-400" />
            ))}
          </div>
          <p className="font-cinzel text-red-400 text-xs">Evil: {gameState.evilScore}</p>
        </div>
      </div>

      {/* Roles Revealed */}
      <div className="mb-6">
        <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
          Role Reveal
        </p>
        <div className="space-y-2">
          {gameState.players.map((player) => {
            if (!player.role) return null;
            const roleInfo = ROLE_INFO[player.role];
            const isMe = player.id === myPlayer.id;
            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  isMe ? 'border-yellow-500/40 bg-yellow-900/10' : 'border-slate-700/40 bg-slate-800/40'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xl">
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-cinzel text-white text-sm font-bold">{player.name}</p>
                    {isMe && <span className="text-blue-400 text-xs">(You)</span>}
                    {player.role === 'Merlin' && (
                      <span className="text-yellow-400 text-xs">🎯</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{roleInfo.icon}</span>
                    <span className="font-cinzel text-xs" style={{ color: roleInfo.color }}>
                      {player.role}
                    </span>
                    <span
                      className={`font-crimson text-xs ml-1 ${
                        roleInfo.team === 'good' ? 'text-blue-400' : 'text-red-400'
                      }`}
                    >
                      ({roleInfo.team === 'good' ? 'Good' : 'Evil'})
                    </span>
                  </div>
                </div>
                {player.id === gameState.assassinTargetId && (
                  <div className="text-2xl">🎯</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button variant="gold" size="lg" fullWidth onClick={onPlayAgain}>
          🔄 Play Again (Same Players)
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={onReturnToMenu}>
          🏠 Return to Menu
        </Button>
      </div>
    </div>
  );
}
