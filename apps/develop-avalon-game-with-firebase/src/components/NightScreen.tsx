import { useState } from 'react';
import { GameState, Player, ROLE_DEFINITIONS } from '../types';
import { updateRoomState } from '../dbService';
import { getNightMessage } from '../gameLogic';

interface NightScreenProps {
  gameState: GameState;
  myPlayer: Player;
}

export default function NightScreen({ gameState, myPlayer }: NightScreenProps) {
  const [cardRevealed, setCardRevealed] = useState(false);
  const [ready, setReady] = useState(false);
  const isHost = myPlayer.id === gameState.hostId;
  const role = myPlayer.role;
  const roleDef = role ? ROLE_DEFINITIONS[role] : null;
  const nightMsg = role ? getNightMessage(role, gameState.players, myPlayer.id) : '';
  const isGood = roleDef?.alignment === 'good';

  const allPlayers = Object.values(gameState.players || {});
  const readyCount = allPlayers.filter(p => p.hasVoted).length;
  const allReady = readyCount === allPlayers.length;

  const handleReady = async () => {
    setReady(true);
    await updateRoomState(gameState.id, {
      [`players/${myPlayer.id}/hasVoted`]: true,
    } as any);
  };

  const handleContinue = async () => {
    // Reset hasVoted for day phase
    const updatedPlayers: any = {};
    allPlayers.forEach(p => {
      updatedPlayers[p.id] = { ...p, hasVoted: false, vote: null };
    });
    await updateRoomState(gameState.id, {
      phase: 'team_selection',
      players: updatedPlayers,
      teamVotes: {},
      questVotes: {},
      selectedTeam: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000010] via-[#05051a] to-[#000010] flex flex-col items-center p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{ width: Math.random()*2+1+'px', height: Math.random()*2+1+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', opacity: Math.random()*0.8+0.1, animationDuration: Math.random()*3+2+'s' }} />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-12 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 opacity-20 blur-sm" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Night header */}
        <div className="text-center mt-6 mb-6">
          <p className="text-blue-300/70 text-xs tracking-[0.3em] mb-1">🌙 NIGHT FALLS</p>
          <h1 className="text-3xl font-bold text-white">The Veil Lifts</h1>
          <p className="text-gray-400 text-xs mt-1">Your true identity is revealed...</p>
        </div>

        {/* Role Card */}
        <div className="w-full mb-5">
          <div
            className="relative w-full aspect-[2/3] cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => setCardRevealed(v => !v)}
          >
            <div
              className="relative w-full h-full transition-all duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: cardRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Card Back */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: 'hidden' }}>
                <img src="/cards/card_back.png" alt="Card Back" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  <div className="text-4xl mb-2">👆</div>
                  <p className="text-white font-bold text-sm">Tap to Reveal</p>
                  <p className="text-gray-300 text-xs">Your role awaits</p>
                </div>
              </div>

              {/* Card Front */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {roleDef && (
                  <>
                    <img src={roleDef.image} alt={roleDef.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isGood ? 'from-blue-900/90' : 'from-red-900/90'} via-transparent to-transparent`} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${
                        isGood ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50' : 'bg-red-500/30 text-red-300 border border-red-500/50'
                      }`}>
                        {isGood ? '✨ GOOD' : '💀 EVIL'}
                      </div>
                      <h2 className="text-white font-bold text-2xl drop-shadow-lg">{roleDef.name}</h2>
                      <p className="text-gray-200 text-xs mt-1 leading-relaxed">{roleDef.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs mt-2">
            {cardRevealed ? 'Tap card to hide again' : 'Tap card to reveal your role'}
          </p>
        </div>

        {/* Night Info Box */}
        {cardRevealed && (
          <div className={`w-full rounded-2xl p-4 mb-5 border ${
            isGood
              ? 'bg-blue-900/30 border-blue-500/40'
              : 'bg-red-900/30 border-red-500/40'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{isGood ? '👁️' : '🔮'}</span>
              <p className="text-white font-semibold text-sm">Your Knowledge</p>
            </div>
            <p className={`text-sm leading-relaxed ${isGood ? 'text-blue-200' : 'text-red-200'}`}>
              {nightMsg}
            </p>
          </div>
        )}

        {/* Player visibility info */}
        {cardRevealed && role && (
          <div className="w-full mb-5">
            <p className="text-gray-400 text-xs text-center mb-2">VISIBLE PLAYERS</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(gameState.players || {}).filter(p => p.id !== myPlayer.id).map(p => {
                const pRole = p.role;
                let visibility = 'unknown';
                if (role === 'merlin') {
                  if (pRole && ROLE_DEFINITIONS[pRole].alignment === 'evil' && pRole !== 'mordred') visibility = 'evil';
                } else if (role === 'percival') {
                  if (pRole === 'merlin' || pRole === 'morgana') visibility = 'merlin_or_morgana';
                } else if (['morgana','assassin','mordred','minion'].includes(role)) {
                  if (pRole && ROLE_DEFINITIONS[pRole].alignment === 'evil' && pRole !== 'oberon') visibility = 'ally';
                }

                return (
                  <div key={p.id} className={`flex items-center gap-2 rounded-xl p-2.5 border ${
                    visibility === 'evil' ? 'bg-red-500/10 border-red-500/30' :
                    visibility === 'merlin_or_morgana' ? 'bg-purple-500/10 border-purple-500/30' :
                    visibility === 'ally' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-white/5 border-white/10'
                  }`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center text-lg flex-shrink-0">
                      {p.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                      <p className={`text-xs ${
                        visibility === 'evil' ? 'text-red-400' :
                        visibility === 'merlin_or_morgana' ? 'text-purple-400' :
                        visibility === 'ally' ? 'text-red-400' :
                        'text-gray-500'
                      }`}>
                        {visibility === 'evil' ? '💀 Evil' :
                         visibility === 'merlin_or_morgana' ? '🔮 Merlin or Morgana' :
                         visibility === 'ally' ? '🤝 Evil Ally' :
                         '❓ Unknown'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ready status */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 mb-4">
          <p className="text-gray-400 text-xs text-center mb-2">
            Players Ready: {readyCount}/{allPlayers.length}
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {allPlayers.map(p => (
              <div key={p.id} className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 ${
                p.hasVoted ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                <span>{p.avatar}</span>
                <span>{p.name}</span>
                {p.hasVoted && <span>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {!ready && (
          <button
            onClick={handleReady}
            className="w-full py-4 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg mb-3 text-sm tracking-wider"
          >
            ✅ I've Seen My Role
          </button>
        )}

        {ready && !isHost && (
          <div className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 mb-3 text-center">
            <p className="text-indigo-300 text-sm">⏳ Waiting for all players & host...</p>
          </div>
        )}

        {isHost && allReady && (
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg text-sm tracking-wider"
          >
            ☀️ BEGIN THE DAY
          </button>
        )}

        {isHost && !allReady && ready && (
          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-xs">Waiting for {allPlayers.length - readyCount} more player(s)...</p>
          </div>
        )}
      </div>
    </div>
  );
}
