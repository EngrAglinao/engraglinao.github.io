import type { GameState, Player } from '../../types/game';

interface PlayerGridProps {
  gameState: GameState;
  myPlayer: Player;
  onSelectPlayer?: (playerId: string) => void;
  selectionMode?: boolean;
  selectedPlayerIds?: string[];
  showVoteStatus?: boolean;
  votedPlayerIds?: string[];
}

export function PlayerGrid({
  gameState,
  myPlayer,
  onSelectPlayer,
  selectionMode = false,
  selectedPlayerIds = [],
  showVoteStatus = false,
  votedPlayerIds = [],
}: PlayerGridProps) {
  const currentQuest = gameState.quests[gameState.currentQuestIndex];

  return (
    <div className="grid grid-cols-3 gap-2">
      {gameState.players.map((player) => {
        const isMe = player.id === myPlayer.id;
        const isLeader = player.id === gameState.currentLeaderId;
        const isOnTeam = currentQuest?.teamProposal.includes(player.id);
        const isSelected = selectedPlayerIds.includes(player.id);
        const hasVoted = votedPlayerIds.includes(player.id);

        let borderClass = 'border-slate-700/40';
        let bgClass = 'bg-slate-800/60';
        let ringClass = '';

        if (isSelected || isOnTeam) {
          borderClass = 'border-yellow-400/60';
          bgClass = 'bg-yellow-900/20';
          ringClass = 'ring-1 ring-yellow-400/30';
        }

        if (isMe) {
          borderClass = isSelected || isOnTeam ? 'border-yellow-400/80' : 'border-blue-400/40';
        }

        return (
          <button
            key={player.id}
            onClick={() => selectionMode && onSelectPlayer?.(player.id)}
            disabled={!selectionMode}
            className={`relative flex flex-col items-center rounded-xl border p-2.5 transition-all active:scale-95 ${bgClass} ${borderClass} ${ringClass} ${
              selectionMode ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl mb-1 transition-all ${
                  isSelected || isOnTeam
                    ? 'border-yellow-400 bg-yellow-900/30'
                    : isMe
                    ? 'border-blue-400/60 bg-slate-700'
                    : 'border-slate-600 bg-slate-700'
                }`}
              >
                {player.avatar}
              </div>

              {/* Leader Crown */}
              {isLeader && (
                <div className="absolute -top-2 -right-1 text-sm">👑</div>
              )}

              {/* On Team indicator */}
              {(isSelected || isOnTeam) && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-black text-xs font-bold leading-none">✓</span>
                </div>
              )}

              {/* Voted indicator */}
              {showVoteStatus && (
                <div
                  className={`absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                    hasVoted
                      ? 'bg-green-400'
                      : 'bg-slate-600 border border-slate-500'
                  }`}
                >
                  {hasVoted && <span className="text-black text-xs font-bold leading-none">✓</span>}
                </div>
              )}
            </div>

            {/* Name */}
            <p className="font-cinzel text-white text-xs font-bold text-center leading-tight truncate w-full">
              {player.name}
            </p>
            {isMe && (
              <span className="text-blue-400 text-xs font-crimson">(You)</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
