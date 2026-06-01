import { useGame } from '../context/GameContext';
import { getCharacter, CharacterName } from '../types';
import { resetRoom } from '../gameService';

export default function EndGameScreen({ onPlayAgain }: { onPlayAgain: () => void }) {
  const { currentRoom, currentPlayer, db, unsubscribeRoom } = useGame();

  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const winner = currentRoom.winner;
  const isGoodWin = winner === 'good';
  const isHost = currentRoom.hostId === currentPlayer?.id;
  const assassinTarget = currentRoom.assassinTarget
    ? players.find(p => p.id === currentRoom.assassinTarget)
    : null;
  const assassin = players.find(p => p.character === 'Assassin');
  const merlin = players.find(p => p.character === 'Merlin');
  const questResults = currentRoom.questResults || [];

  const handlePlayAgain = async () => {
    if (!db || !currentRoom) return;
    await resetRoom(db, currentRoom.id);
    unsubscribeRoom();
    onPlayAgain();
  };

  const handleLeave = () => {
    unsubscribeRoom();
    onPlayAgain();
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className={`absolute inset-0 ${isGoodWin ? 'bg-blue-950/88' : 'bg-red-950/88'}`} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Winner Banner */}
        <div className="text-center pt-8 pb-5">
          <div className="text-6xl mb-3 animate-bounce">{isGoodWin ? '👑' : '💀'}</div>
          <h1 className={`text-4xl font-black font-serif mb-2 ${isGoodWin ? 'text-blue-300' : 'text-red-300'}`}>
            {isGoodWin ? 'GOOD WINS!' : 'EVIL WINS!'}
          </h1>
          <p className="text-gray-300 text-sm">
            {isGoodWin
              ? assassin
                ? `The Assassin failed to identify Merlin!`
                : 'The forces of Good have triumphed!'
              : assassinTarget?.character === 'Merlin'
                ? `${assassin?.name} correctly assassinated ${merlin?.name}!`
                : 'Evil sabotaged the quests!'}
          </p>
        </div>

        {/* Quest Results Summary */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">📊 Quest Results</p>
          <div className="flex gap-2 justify-center mb-3">
            {questResults.map((r, i) => (
              <div key={i}
                className={`flex-1 flex flex-col items-center rounded-xl p-2 border ${
                  r.success ? 'bg-blue-900/60 border-blue-600' : 'bg-red-900/60 border-red-600'
                }`}>
                <span className="text-xs font-bold text-gray-400 mb-1">Q{r.round}</span>
                <span className="text-xl">{r.success ? '✅' : '❌'}</span>
                {!r.success && r.fails > 0 && (
                  <span className="text-red-400 text-xs">{r.fails}✗</span>
                )}
              </div>
            ))}
            {Array.from({ length: 5 - questResults.length }).map((_, i) => (
              <div key={`empty-${i}`}
                className="flex-1 flex flex-col items-center rounded-xl p-2 border border-gray-700/30 bg-gray-800/20">
                <span className="text-xs font-bold text-gray-600 mb-1">Q{questResults.length + i + 1}</span>
                <span className="text-xl text-gray-700">○</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{questResults.filter(r => r.success).length}</p>
              <p className="text-blue-300 text-xs">Good Wins</p>
            </div>
            <div className="text-2xl text-gray-600">|</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{questResults.filter(r => !r.success).length}</p>
              <p className="text-red-300 text-xs">Evil Wins</p>
            </div>
          </div>
        </div>

        {/* Assassination Result */}
        {assassinTarget && (
          <div className={`rounded-2xl p-4 mb-4 border text-center ${
            assassinTarget.character === 'Merlin'
              ? 'bg-red-900/60 border-red-700'
              : 'bg-blue-900/60 border-blue-700'
          }`}>
            <p className="text-sm font-semibold mb-1">
              🗡️ {assassin?.name} assassinated {assassinTarget.name}
            </p>
            <p className={`text-lg font-bold ${assassinTarget.character === 'Merlin' ? 'text-red-300' : 'text-blue-300'}`}>
              {assassinTarget.character === 'Merlin' ? '💀 Merlin is dead — Evil wins!' : '✅ Wrong target — Good wins!'}
            </p>
          </div>
        )}

        {/* Full Role Reveal */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 mb-4 flex-1">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">🃏 Full Role Reveal</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {players.map(p => {
              const char = p.character ? getCharacter(p.character as CharacterName) : null;
              const isWinner = (winner === char?.team);
              return (
                <div key={p.id}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${
                    isWinner
                      ? char?.team === 'good' ? 'bg-blue-900/40 border-blue-700/50' : 'bg-red-900/40 border-red-700/50'
                      : 'bg-gray-800/40 border-gray-700/30'
                  }`}>
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    <p className={`text-xs ${char?.team === 'good' ? 'text-blue-400' : 'text-red-400'}`}>
                      {char?.name || 'Unknown'}
                    </p>
                  </div>
                  {char && (
                    <div className="flex flex-col items-end">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        char.team === 'good' ? 'bg-blue-800 text-blue-300' : 'bg-red-800 text-red-300'
                      }`}>
                        {char.team === 'good' ? '⚔️ Good' : '💀 Evil'}
                      </span>
                      {isWinner && <span className="text-yellow-400 text-xs mt-1">🏆 Winner</span>}
                    </div>
                  )}
                  {p.id === assassinTarget?.id && <span className="text-red-400">🗡️</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pb-4">
          {isHost ? (
            <button
              onClick={handlePlayAgain}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl"
            >
              🔄 Play Again (Host)
            </button>
          ) : (
            <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-3 text-center">
              <p className="text-gray-400 text-sm">Waiting for host to start new game...</p>
            </div>
          )}
          <button
            onClick={handleLeave}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 font-semibold rounded-2xl py-3 text-sm transition-all active:scale-95"
          >
            🚪 Leave Game
          </button>
        </div>
      </div>
    </div>
  );
}
