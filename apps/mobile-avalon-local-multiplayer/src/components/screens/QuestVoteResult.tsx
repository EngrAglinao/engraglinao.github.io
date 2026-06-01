import { Button } from '../ui/Button';
import { QuestBoard } from './QuestBoard';
import type { GameState, Player } from '../../types/game';

interface QuestVoteResultProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onContinue: () => void;
}

export function QuestVoteResult({ gameState, myPlayer, isHost, onContinue }: QuestVoteResultProps) {
  const currentQuest = gameState.quests[gameState.currentQuestIndex];
  const questVotes = currentQuest?.questVotes || {};
  const successes = Object.values(questVotes).filter((v) => v === 'success').length;
  const fails = Object.values(questVotes).filter((v) => v === 'fail').length;
  const isSuccess = currentQuest?.result === 'success';

  // Show votes shuffled (don't reveal who voted what)
  const allVoteValues = Object.values(questVotes).sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 pb-6">
      {/* Quest Board */}
      <div className="pt-5 pb-3 px-4 border-b border-slate-700/40">
        <QuestBoard gameState={gameState} myPlayer={myPlayer} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-5">
        {/* Result */}
        <div
          className={`rounded-2xl border-2 p-6 text-center ${
            isSuccess
              ? 'bg-blue-900/30 border-blue-400/60'
              : 'bg-red-900/30 border-red-400/60'
          }`}
        >
          <div className="text-7xl mb-4">{isSuccess ? '⚔️' : '💀'}</div>
          <h2
            className={`font-cinzel text-4xl font-black ${
              isSuccess ? 'text-blue-400' : 'text-red-400'
            }`}
          >
            Quest {isSuccess ? 'Success!' : 'Failed!'}
          </h2>
          <p className="font-crimson text-slate-300 mt-2 text-base">
            {successes} Success · {fails} Fail{fails !== 1 ? 's' : ''}
          </p>
          {!isSuccess && currentQuest?.failsRequired > 1 && (
            <p className="font-crimson text-orange-400 text-xs mt-1">
              Required {currentQuest.failsRequired} fails
            </p>
          )}
        </div>

        {/* Score */}
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-1">
              {Array.from({ length: gameState.goodScore }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-blue-400" />
              ))}
              {Array.from({ length: 3 - gameState.goodScore }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600" />
              ))}
            </div>
            <p className="font-cinzel text-blue-400 text-xs">Good: {gameState.goodScore}</p>
          </div>
          <div className="font-cinzel text-slate-500 text-2xl">vs</div>
          <div className="text-center">
            <div className="flex gap-1 justify-center mb-1">
              {Array.from({ length: gameState.evilScore }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-red-400" />
              ))}
              {Array.from({ length: 3 - gameState.evilScore }).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-slate-700 border border-slate-600" />
              ))}
            </div>
            <p className="font-cinzel text-red-400 text-xs">Evil: {gameState.evilScore}</p>
          </div>
        </div>

        {/* Vote Cards (anonymous) */}
        <div>
          <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-3 text-center">
            Secret Votes (Shuffled)
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {allVoteValues.map((vote, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 ${
                  vote === 'success'
                    ? 'bg-blue-900/40 border-blue-400/60'
                    : 'bg-red-900/40 border-red-400/60'
                }`}
              >
                <span className="text-2xl">{vote === 'success' ? '⚔️' : '💀'}</span>
                <span
                  className={`font-cinzel text-xs font-bold mt-1 ${
                    vote === 'success' ? 'text-blue-400' : 'text-red-400'
                  }`}
                >
                  {vote === 'success' ? 'Pass' : 'Fail'}
                </span>
              </div>
            ))}
          </div>
        </div>

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
