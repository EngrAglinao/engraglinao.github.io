import type { GameState, Player } from '../../types/game';

interface QuestBoardProps {
  gameState: GameState;
  myPlayer: Player;
}

export function QuestBoard({ gameState, myPlayer: _myPlayer }: QuestBoardProps) {

  return (
    <div className="flex gap-2 justify-center px-2">
      {gameState.quests.map((quest, i) => {
        const isCurrent = i === gameState.currentQuestIndex;

        let bgClass = 'bg-slate-800/60 border-slate-600/40';
        let icon = '⚔️';
        let textClass = 'text-slate-400';

        if (quest.result === 'success') {
          bgClass = 'bg-blue-900/60 border-blue-400/60';
          icon = '✦';
          textClass = 'text-blue-300';
        } else if (quest.result === 'fail') {
          bgClass = 'bg-red-900/60 border-red-400/60';
          icon = '✕';
          textClass = 'text-red-300';
        } else if (isCurrent) {
          bgClass = 'bg-yellow-900/40 border-yellow-400/60 shadow-yellow-500/20 shadow-md';
          icon = '⚡';
          textClass = 'text-yellow-300';
        }

        return (
          <div
            key={quest.id}
            className={`relative flex flex-col items-center justify-center rounded-xl border p-2 transition-all ${bgClass} ${
              isCurrent ? 'scale-110' : ''
            }`}
            style={{ minWidth: '52px' }}
          >
            <div className={`text-lg font-bold ${textClass}`}>{icon}</div>
            <div className="font-cinzel text-xs text-white font-bold">{quest.requiredPlayers}p</div>
            {quest.failsRequired > 1 && (
              <div className="text-yellow-400 text-xs leading-none">2✕</div>
            )}
            {isCurrent && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
            )}
          </div>
        );
      })}
    </div>
  );
}
