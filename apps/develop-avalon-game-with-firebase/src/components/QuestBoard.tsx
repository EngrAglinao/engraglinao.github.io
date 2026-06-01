import { GameState, Player, QUEST_TEAM_SIZES, QUEST_FAIL_REQUIRED } from '../types';

interface QuestBoardProps {
  gameState: GameState;
  myPlayer: Player;
  compact?: boolean;
}

export default function QuestBoard({ gameState, myPlayer, compact = false }: QuestBoardProps) {
  const players = Object.values(gameState.players || {});
  const playerCount = players.length;
  const questSizes = QUEST_TEAM_SIZES[playerCount] || [2,3,2,3,3];
  const failRequired = QUEST_FAIL_REQUIRED[playerCount] || [1,1,1,1,1];
  const results = gameState.questResults || [];
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  const currentRound = gameState.currentRound || 1;

  const leaderIndex = gameState.currentLeaderIndex || 0;
  const leaderId = gameState.currentLeaderId || players[leaderIndex]?.id;
  const leader = players.find(p => p.id === leaderId) || players[leaderIndex];
  const rejectedVotes = gameState.rejectedVotes || 0;

  return (
    <div className={`bg-white/5 border border-amber-400/20 rounded-2xl ${compact ? 'p-3' : 'p-4'} w-full`}>
      {/* Title */}
      <div className="text-center mb-3">
        <p className="text-amber-400/70 text-xs tracking-widest">⚔️ QUEST BOARD ⚔️</p>
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{successCount}</div>
          <div className="text-xs text-blue-300/70">Good</div>
        </div>
        <div className="text-gray-600 text-2xl font-light">—</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400">{failCount}</div>
          <div className="text-xs text-red-300/70">Evil</div>
        </div>
      </div>

      {/* Quest Tokens */}
      <div className="flex justify-center gap-2 mb-4">
        {questSizes.map((size, i) => {
          const result = results.find(r => r.round === i + 1);
          const isCurrent = i + 1 === currentRound;
          const isDone = !!result;
          const isSuccess = result?.success;
          const needsTwo = failRequired[i] > 1;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`relative w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center transition-all ${
                isDone
                  ? isSuccess
                    ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'bg-red-500/30 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : isCurrent
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse'
                  : 'bg-white/5 border-white/20'
              }`}>
                {isDone ? (
                  <span className="text-xl">{isSuccess ? '✅' : '❌'}</span>
                ) : isCurrent ? (
                  <span className="text-lg">⚔️</span>
                ) : (
                  <span className="text-white/30 text-sm">○</span>
                )}
                {needsTwo && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-black text-xs flex items-center justify-center font-bold leading-none">2</span>
                )}
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-white/60">{size}</span>
                {needsTwo && <span className="text-xs text-amber-400 block leading-none">★</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Win progress bar */}
      <div className="mb-3">
        <div className="flex gap-1 h-2">
          <div className="flex-1 flex gap-0.5">
            {[0,1,2].map(i => (
              <div key={i} className={`flex-1 rounded-full transition-all ${i < successCount ? 'bg-blue-500' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="w-px bg-white/20" />
          <div className="flex-1 flex gap-0.5">
            {[0,1,2].map(i => (
              <div key={i} className={`flex-1 rounded-full transition-all ${i < failCount ? 'bg-red-500' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-blue-400 text-xs">Good needs 3</span>
          <span className="text-red-400 text-xs">Evil needs 3</span>
        </div>
      </div>

      {/* Current state */}
      {!compact && (
        <div className="space-y-2">
          {/* Leader */}
          {leader && (
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2">
              <span className="text-amber-300 text-xs">👑 Quest Leader</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{leader.avatar}</span>
                <span className="text-white text-xs font-semibold">
                  {leader.name} {leader.id === myPlayer.id ? '(You)' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Rejected votes tracker */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <span className="text-gray-400 text-xs">Team Rejections</span>
            <div className="flex gap-1">
              {[0,1,2,3,4].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border ${
                  i < rejectedVotes ? 'bg-red-500 border-red-400' : 'bg-white/5 border-white/20'
                }`} />
              ))}
            </div>
          </div>

          {/* ★ note for double-fail quests */}
          {failRequired[currentRound - 1] > 1 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2">
              <p className="text-amber-300 text-xs">★ This quest requires 2 fail votes to fail</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
