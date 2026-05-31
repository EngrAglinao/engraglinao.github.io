import { useState } from 'react';
import { Button } from '../ui/Button';
import type { GameState, Player } from '../../types/game';
import { ROLE_INFO } from '../../constants/gameConfig';
import { getVisibleEvilPlayers, getKnowledgeLabel } from '../../utils/gameLogic';

interface RoleRevealProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onContinue: () => void;
}

export function RoleReveal({ gameState, myPlayer, isHost, onContinue }: RoleRevealProps) {
  const [cardHidden, setCardHidden] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayer.id);
  if (!me?.role) return null;

  const roleInfo = ROLE_INFO[me.role];
  const visibleEvilIds = getVisibleEvilPlayers(me, gameState.players);

  const getPlayerKnowledge = () => {
    return gameState.players
      .filter((p) => p.id !== me.id && visibleEvilIds.includes(p.id))
      .map((p) => ({
        player: p,
        label: getKnowledgeLabel(me.role!, p.role!),
      }));
  };

  const knowledgeList = getPlayerKnowledge();

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b ${roleInfo.bgGradient} px-5 py-8`}>
      <div className="text-center mb-6">
        <p className="font-cinzel text-xs text-white/50 uppercase tracking-widest mb-1">
          Your Secret Role
        </p>
        <h1 className="font-cinzel text-2xl font-black text-white">Only You Can See This</h1>
      </div>

      {/* Role Card */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Flip Card */}
        <div
          className="relative w-64 h-80 cursor-pointer select-none"
          onClick={() => setCardHidden(!cardHidden)}
          style={{ perspective: '1000px' }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: cardHidden ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-3xl border-2 flex flex-col items-center justify-center p-6"
              style={{
                backfaceVisibility: 'hidden',
                borderColor: roleInfo.color,
                background: `radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.4) 100%)`,
                boxShadow: `0 0 40px ${roleInfo.color}40`,
              }}
            >
              <div className="text-7xl mb-4">{roleInfo.icon}</div>
              <h2
                className="font-cinzel text-3xl font-black mb-2"
                style={{ color: roleInfo.color }}
              >
                {me.role}
              </h2>
              <div
                className={`px-3 py-1 rounded-full text-xs font-cinzel font-bold mb-4 ${
                  roleInfo.team === 'good'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                    : 'bg-red-500/20 text-red-300 border border-red-400/40'
                }`}
              >
                {roleInfo.team === 'good' ? '✦ Servant of Arthur' : '⚔ Minion of Mordred'}
              </div>
              <p className="font-crimson text-white/70 text-sm text-center leading-snug">
                {roleInfo.description}
              </p>
              <p className="font-crimson text-white/40 text-xs mt-4 text-center">
                Tap to hide
              </p>
            </div>

            {/* Back (hidden) */}
            <div
              className="absolute inset-0 rounded-3xl border-2 border-slate-600 flex flex-col items-center justify-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              }}
            >
              <div className="text-6xl mb-3 opacity-30">⚜️</div>
              <p className="font-cinzel text-slate-400 text-sm">Card Hidden</p>
              <p className="font-crimson text-slate-600 text-xs mt-1">Tap to reveal</p>
            </div>
          </div>
        </div>

        {/* Special Knowledge */}
        {knowledgeList.length > 0 && !cardHidden && (
          <div className="w-full max-w-xs">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
              <p className="font-cinzel text-xs text-white/50 uppercase tracking-widest mb-3 text-center">
                🔐 Your Knowledge
              </p>
              <p className="font-crimson text-white/60 text-xs mb-3 text-center">
                {roleInfo.seeInfo}
              </p>
              <div className="space-y-2">
                {knowledgeList.map(({ player, label }) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-2.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xl">
                      {player.avatar}
                    </div>
                    <div>
                      <p className="font-cinzel text-white text-sm font-bold">{player.name}</p>
                      <p className="font-crimson text-yellow-400/80 text-xs">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        {!confirmed ? (
          <Button
            variant="gold"
            size="lg"
            onClick={() => setConfirmed(true)}
          >
            ✓ I've Memorized My Role
          </Button>
        ) : (
          <div className="text-center">
            <div className="bg-green-500/20 border border-green-400/30 rounded-xl px-5 py-3 mb-3">
              <p className="font-cinzel text-green-400 text-sm">✓ Ready!</p>
              <p className="font-crimson text-green-300/60 text-xs">Waiting for all players...</p>
            </div>
            {isHost && (
              <Button variant="gold" size="lg" onClick={onContinue}>
                ▶ Continue to Game
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
