import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { submitAssassination } from '../gameService';
import { getCharacter, CharacterName } from '../types';

export default function AssassinationScreen({ onEnd }: { onEnd: () => void }) {
  const { currentRoom, currentPlayer, db } = useGame();
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const myChar = currentPlayer?.character ? getCharacter(currentPlayer.character as CharacterName) : null;
  const isAssassin = myChar?.name === 'Assassin';

  // Good players only (excluding yourself if evil)
  const targetablePlayers = players.filter(p => {
    const pChar = p.character ? getCharacter(p.character as CharacterName) : null;
    return pChar?.team === 'good' && p.id !== currentPlayer?.id;
  });

  const handleAssassinate = async () => {
    if (!db || !selectedTarget) return;
    setLoading(true);
    await submitAssassination(db, currentRoom, selectedTarget);
    setLoading(false);
    onEnd();
  };

  const selectedPlayer = players.find(p => p.id === selectedTarget);

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/90" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-6 pb-4">
          <div className="text-5xl mb-3">🗡️</div>
          <p className="text-red-500 text-xs uppercase tracking-widest mb-1">Assassination Phase</p>
          <h2 className="text-2xl font-bold text-red-400 font-serif">Good has prevailed...</h2>
          <p className="text-gray-300 text-sm mt-2">
            {isAssassin
              ? 'You are the Assassin. Identify Merlin to steal victory for Evil!'
              : 'The Assassin must now choose who they believe is Merlin.'}
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-950/60 border border-red-700/60 rounded-2xl p-4 mb-5 text-center">
          <p className="text-red-300 text-sm font-semibold">
            ⚔️ Good won 3 quests — but Evil still has one chance!
          </p>
          <p className="text-red-400/70 text-xs mt-1">
            If the Assassin correctly identifies Merlin, Evil wins everything.
          </p>
        </div>

        {/* Assassin's View */}
        {isAssassin ? (
          <>
            <div className="bg-gray-900/85 border border-red-800/50 rounded-2xl p-4 mb-4 flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">🎯 Choose your target</p>
              <p className="text-gray-300 text-sm mb-4">Select the player you believe is Merlin:</p>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {targetablePlayers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedTarget(p.id); setConfirmed(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      selectedTarget === p.id
                        ? 'bg-red-900/60 border-red-500/60 ring-1 ring-red-500/40'
                        : 'bg-gray-800/60 border-gray-700/40 hover:bg-gray-700/60'
                    }`}
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="text-white font-semibold flex-1 text-left">{p.name}</span>
                    {selectedTarget === p.id && <span className="text-red-400">🎯</span>}
                  </button>
                ))}
              </div>
            </div>

            {selectedTarget && !confirmed && (
              <div className="bg-red-950/50 border border-red-700/50 rounded-2xl p-4 mb-4 text-center">
                <p className="text-red-300 font-semibold">
                  Target: <span className="text-white">{selectedPlayer?.avatar} {selectedPlayer?.name}</span>
                </p>
                <p className="text-red-400/70 text-xs mt-1">This cannot be undone!</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {!confirmed ? (
                <button
                  onClick={() => setConfirmed(true)}
                  disabled={!selectedTarget}
                  className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-40 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl"
                >
                  🗡️ Assassinate {selectedPlayer ? selectedPlayer.name : '...'}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-center text-red-300 text-sm font-semibold">Are you sure? This ends the game!</p>
                  <button
                    onClick={handleAssassinate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-black rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl border border-red-600"
                  >
                    {loading ? '⏳ Assassinating...' : `⚔️ CONFIRM: Kill ${selectedPlayer?.name}`}
                  </button>
                  <button
                    onClick={() => setConfirmed(false)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl py-3 text-sm transition-all"
                  >
                    ← Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Non-Assassin View */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-gray-900/85 border border-gray-700/50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🤫</div>
              <p className="text-gray-300 text-base font-semibold mb-2">Stay calm and reveal nothing.</p>
              <p className="text-gray-400 text-sm mb-5">
                The Assassin is studying all players. Don't give away who Merlin is!
              </p>
              <div className="space-y-2">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">All Players</p>
                {players.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-3 py-2">
                    <span className="text-xl">{p.avatar}</span>
                    <span className="text-white text-sm">{p.name}</span>
                    {p.id === currentPlayer?.id && <span className="text-amber-400 text-xs ml-auto">(You)</span>}
                    {getCharacter(p.character as CharacterName)?.name === 'Assassin' && (
                      <span className="text-red-400 text-xs ml-auto">🗡️ Assassin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
