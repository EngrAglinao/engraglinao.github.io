import { useGame } from '../context/GameContext';
import { QUEST_SIZES, FAILS_REQUIRED } from '../types';

export default function QuestBoard() {
  const { currentRoom } = useGame();
  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const playerCount = players.length;
  const questSizes = QUEST_SIZES[playerCount] || QUEST_SIZES[5];
  const failsRequired = FAILS_REQUIRED[playerCount] || FAILS_REQUIRED[5];
  const questResults = currentRoom.questResults || [];
  const currentRound = currentRoom.currentRound;

  const goodWins = questResults.filter(r => r.success).length;
  const evilWins = questResults.filter(r => !r.success).length;

  return (
    <div className="bg-gray-900/90 border border-amber-800/40 rounded-2xl p-4 mb-4">
      {/* Score */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  i < goodWins ? 'bg-blue-500 border-blue-400' : 'bg-transparent border-blue-800/50'
                }`}
              />
            ))}
          </div>
          <span className="text-blue-400 text-sm font-bold">Good</span>
        </div>
        <span className="text-amber-500 text-lg font-black">⚜️</span>
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-sm font-bold">Evil</span>
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  i < evilWins ? 'bg-red-500 border-red-400' : 'bg-transparent border-red-800/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quest Slots */}
      <div className="flex gap-2 justify-center">
        {questSizes.map((size, i) => {
          const questNum = i + 1;
          const result = questResults.find(r => r.round === questNum);
          const isCurrentRound = questNum === currentRound;
          const twoFailsRequired = failsRequired[i] > 1;

          return (
            <div key={i}
              className={`flex-1 flex flex-col items-center rounded-xl border-2 p-2 transition-all ${
                result
                  ? result.success
                    ? 'bg-blue-900/60 border-blue-500'
                    : 'bg-red-900/60 border-red-500'
                  : isCurrentRound
                    ? 'bg-amber-900/40 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-gray-800/40 border-gray-700/40'
              }`}
            >
              {/* Quest Number */}
              <span className={`text-xs font-bold mb-1 ${
                result
                  ? result.success ? 'text-blue-300' : 'text-red-300'
                  : isCurrentRound ? 'text-amber-400' : 'text-gray-500'
              }`}>Q{questNum}</span>

              {/* Result Icon */}
              <div className="text-lg mb-1">
                {result
                  ? result.success ? '✅' : '❌'
                  : isCurrentRound ? '⚡' : '○'
                }
              </div>

              {/* Team Size */}
              <span className={`text-xs font-semibold ${
                isCurrentRound ? 'text-amber-300' : 'text-gray-500'
              }`}>
                👥{size}
              </span>

              {/* Double fail indicator */}
              {twoFailsRequired && (
                <span className="text-yellow-500 text-xs mt-0.5" title="Requires 2 fails">2✗</span>
              )}

              {/* Fail count on completed */}
              {result && !result.success && result.fails > 0 && (
                <span className="text-red-400 text-xs">{result.fails}✗</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Win condition message */}
      {goodWins >= 2 && evilWins < 3 && (
        <p className="text-blue-300 text-xs text-center mt-2">
          ⚔️ Good needs {3 - goodWins} more quest{3 - goodWins !== 1 ? 's' : ''} to win!
        </p>
      )}
      {evilWins >= 2 && goodWins < 3 && (
        <p className="text-red-300 text-xs text-center mt-2">
          💀 Evil needs {3 - evilWins} more quest{3 - evilWins !== 1 ? 's' : ''} to win!
        </p>
      )}
    </div>
  );
}
