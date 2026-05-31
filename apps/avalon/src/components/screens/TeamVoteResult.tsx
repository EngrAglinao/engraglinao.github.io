import { Button } from '../ui/Button';
import { QuestBoard } from './QuestBoard';
import type { GameState, Player } from '../../types/game';

interface TeamVoteResultProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onContinue: () => void;
}

export function TeamVoteResult({ gameState, myPlayer, isHost, onContinue }: TeamVoteResultProps) {
  const currentQuest = gameState.quests[gameState.currentQuestIndex];
  const votes = currentQuest?.votes || {};

  const approvals = Object.values(votes).filter((v) => v === 'approve').length;
  const rejections = Object.values(votes).filter((v) => v === 'reject').length;
  const totalPlayers = gameState.players.length;
  const isApproved = approvals > totalPlayers / 2;

  const approveVoters = gameState.players.filter((p) => votes[p.id] === 'approve');
  const rejectVoters = gameState.players.filter((p) => votes[p.id] === 'reject');

  const nextLeader = gameState.players.find((p) => p.id === gameState.currentLeaderId);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 pb-6">
      {/* Quest Board */}
      <div className="pt-5 pb-3 px-4 border-b border-slate-700/40">
        <QuestBoard gameState={gameState} myPlayer={myPlayer} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
        {/* Result Banner */}
        <div
          className={`rounded-2xl border-2 p-6 text-center ${
            isApproved
              ? 'bg-green-900/30 border-green-400/60'
              : 'bg-red-900/30 border-red-400/60'
          }`}
        >
          <div className="text-6xl mb-3">{isApproved ? '✅' : '❌'}</div>
          <h2
            className={`font-cinzel text-3xl font-black ${
              isApproved ? 'text-green-400' : 'text-red-400'
            }`}
          >
            Team {isApproved ? 'Approved!' : 'Rejected!'}
          </h2>
          <p className="font-crimson text-slate-300 mt-2 text-lg">
            {approvals} Approved · {rejections} Rejected
          </p>

          {!isApproved && (
            <div className="mt-3 bg-orange-900/30 border border-orange-500/30 rounded-xl px-4 py-2">
              <p className="font-cinzel text-orange-400 text-sm">
                {gameState.consecutiveRejects >= 5
                  ? '💀 5 Rejections! Evil wins!'
                  : `⚠️ ${gameState.consecutiveRejects}/5 Rejections`}
              </p>
            </div>
          )}
        </div>

        {/* Vote Breakdown */}
        <div className="space-y-3">
          <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest text-center">
            Vote Breakdown
          </p>

          {approveVoters.length > 0 && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3">
              <p className="font-cinzel text-green-400 text-xs mb-2">👍 Approved ({approveVoters.length})</p>
              <div className="flex flex-wrap gap-2">
                {approveVoters.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-green-900/30 rounded-lg px-2 py-1">
                    <span className="text-base">{p.avatar}</span>
                    <span className="font-cinzel text-green-300 text-xs">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rejectVoters.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3">
              <p className="font-cinzel text-red-400 text-xs mb-2">👎 Rejected ({rejectVoters.length})</p>
              <div className="flex flex-wrap gap-2">
                {rejectVoters.map((p) => (
                  <div key={p.id} className="flex items-center gap-1.5 bg-red-900/30 rounded-lg px-2 py-1">
                    <span className="text-base">{p.avatar}</span>
                    <span className="font-cinzel text-red-300 text-xs">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Leader */}
        {!isApproved && nextLeader && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 flex items-center gap-3">
            <div className="text-2xl">{nextLeader.avatar}</div>
            <div>
              <p className="font-cinzel text-yellow-400 text-xs">Next Leader</p>
              <p className="font-cinzel text-white text-sm font-bold">{nextLeader.name}</p>
            </div>
            <div className="ml-auto text-2xl">👑</div>
          </div>
        )}

        {/* Continue */}
        {isHost ? (
          <Button variant="gold" size="lg" fullWidth onClick={onContinue}>
            ▶ Continue
          </Button>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="font-cinzel text-slate-400 text-xs">Waiting for host...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
