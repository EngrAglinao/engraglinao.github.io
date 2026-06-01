import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getCharacter, CharacterName } from '../types';
import { completeNightPhase, getVisiblePlayers } from '../gameService';

export default function NightPhaseScreen({ onDone }: { onDone: () => void }) {
  const { currentRoom, currentPlayer, db, gameName } = useGame();
  const [cardFlipped, setCardFlipped] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [ready, setReady] = useState(false);
  const [isHost] = useState(currentRoom?.hostId === currentPlayer?.id);

  const myRole = currentPlayer?.character
    ? getCharacter(currentPlayer.character as CharacterName)
    : null;

  const allPlayers = currentRoom ? Object.values(currentRoom.players) : [];
  const visiblePlayers = myRole
    ? getVisiblePlayers(myRole.name, allPlayers.filter(p => p.id !== currentPlayer?.id))
    : [];

  useEffect(() => {
    if (currentRoom?.phase === 'day') onDone();
  }, [currentRoom?.phase]);

  const handleAdvance = async () => {
    if (!db || !currentRoom) return;
    await completeNightPhase(db, currentRoom.id);
  };

  const teamColors = {
    good: { bg: 'from-blue-900 to-blue-950', border: 'border-blue-600/60', text: 'text-blue-300', badge: 'bg-blue-800/60' },
    evil: { bg: 'from-red-900 to-red-950', border: 'border-red-600/60', text: 'text-red-300', badge: 'bg-red-800/60' },
  };
  const colors = myRole ? teamColors[myRole.team] : teamColors.good;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/88" />

      <div className="relative z-10 w-full max-w-sm flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <p className="text-amber-500/70 text-xs uppercase tracking-widest mb-1">🌙 Night Phase</p>
          <h2 className="text-2xl font-bold text-amber-400 font-serif">{gameName}</h2>
          <p className="text-gray-400 text-sm mt-1">Peek at your role — keep it secret!</p>
        </div>

        {/* Card */}
        <div className="flex justify-center mb-5">
          <div
            className="relative w-52 cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={() => { setCardFlipped(!cardFlipped); setShowInfo(true); }}
          >
            <div
              className="relative transition-transform duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                height: '320px',
              }}
            >
              {/* Card Back */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-amber-700/60 shadow-2xl shadow-amber-900/50"
                style={{ backfaceVisibility: 'hidden' }}>
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-amber-950 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-3">⚜️</div>
                  <p className="text-amber-500 font-serif text-lg font-bold tracking-widest">AVALON</p>
                  <p className="text-amber-700 text-xs mt-2">Tap to reveal role</p>
                </div>
              </div>

              {/* Card Front */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 shadow-2xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {myRole && (
                  <div className={`w-full h-full bg-gradient-to-b ${colors.bg} relative`}>
                    <img
                      src={`./images/${myRole.image.replace('/images/', '')}`}
                      alt={myRole.name}
                      className="w-full h-full object-cover absolute inset-0 opacity-70"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${colors.badge} ${colors.text} border ${colors.border}`}>
                        {myRole.team === 'good' ? '⚔️ Good' : '💀 Evil'}
                      </div>
                      <p className="text-white font-bold text-xl font-serif">{myRole.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Role Info */}
        {showInfo && myRole && (
          <div className={`bg-gray-900/90 border ${colors.border} rounded-2xl p-4 mb-4 animate-fade-in`}>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">{myRole.description}</p>
            {myRole.special && (
              <div className="bg-amber-950/50 border border-amber-700/40 rounded-xl p-2 mb-3">
                <p className="text-amber-300 text-xs">⚡ <span className="font-semibold">Special:</span> {myRole.special}</p>
              </div>
            )}

            {/* What you see */}
            {visiblePlayers.length > 0 && (
              <div className="mt-3">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
                  {myRole.name === 'Merlin' ? '👁️ You know these Evil players:' :
                   myRole.name === 'Percival' ? '👁️ You see these players (Merlin?)' :
                   myRole.name === 'Oberon' ? '❌ You see no Evil allies' :
                   '👁️ Your Evil allies:'}
                </p>
                <div className="space-y-1">
                  {visiblePlayers.map(({ player, seenAs }: { player: import('../types').Player; seenAs: string }) => (
                    <div key={player.id} className="flex items-center gap-2 bg-gray-800/60 rounded-lg px-3 py-2">
                      <span className="text-xl">{player.avatar}</span>
                      <span className="text-white text-sm font-semibold">{player.name}</span>
                      <span className="text-gray-400 text-xs ml-auto">({seenAs})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {visiblePlayers.length === 0 && myRole.sees.length === 0 && (
              <div className="bg-gray-800/40 rounded-xl p-3 text-center">
                <p className="text-gray-500 text-sm">👁️ You see no one. Trust only yourself.</p>
              </div>
            )}
          </div>
        )}

        {/* Ready Button */}
        <div className="mt-auto pb-6 space-y-3">
          {!cardFlipped ? (
            <button
              onClick={() => { setCardFlipped(true); setShowInfo(true); }}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl"
            >
              👁️ Reveal My Role
            </button>
          ) : (
            <>
              <button
                onClick={() => setCardFlipped(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-2xl py-3 text-sm transition-all active:scale-95"
              >
                🙈 Hide Card
              </button>
              {!ready ? (
                <button
                  onClick={() => setReady(true)}
                  className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl"
                >
                  ✅ I'm Ready
                </button>
              ) : (
                <div className="bg-green-900/40 border border-green-700 rounded-2xl p-3 text-center">
                  <p className="text-green-400 font-semibold">✅ Ready!</p>
                  {isHost ? (
                    <button onClick={handleAdvance}
                      className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl py-3 transition-all active:scale-95">
                      🌅 Begin Day Phase (Host)
                    </button>
                  ) : (
                    <p className="text-green-300/60 text-sm mt-1">Waiting for host...</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
