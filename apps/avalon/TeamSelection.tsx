import { useState } from 'react';
import { Button } from '../ui/Button';
import { PlayerGrid } from './PlayerGrid';
import { QuestBoard } from './QuestBoard';
import type { GameState, Player, QuestVote as QuestVoteType } from '../../types/game';
import { ROLE_INFO } from '../../constants/gameConfig';

interface QuestVoteProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onCastQuestVote: (vote: QuestVoteType) => void;
  onRevealQuestVotes: () => void;
}

export function QuestVote({
  gameState,
  myPlayer,
  isHost,
  onCastQuestVote,
  onRevealQuestVotes,
}: QuestVoteProps) {
  const [myCardHidden, setMyCardHidden] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayer.id);
  const currentQuest = gameState.quests[gameState.currentQuestIndex];
  const isOnQuest = currentQuest?.teamProposal.includes(myPlayer.id);
  const myVote = currentQuest?.questVotes[myPlayer.id];

  const totalVoted = Object.keys(currentQuest?.questVotes || {}).length;
  const questTeamSize = currentQuest?.teamProposal.length || 0;
  const allVoted = totalVoted === questTeamSize;
  const votedPlayerIds = Object.keys(currentQuest?.questVotes || {});

  const canVoteFail = me?.team === 'evil';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 pb-6">
      {/* Quest Board */}
      <div className="pt-5 pb-3 px-4 border-b border-slate-700/40">
        <QuestBoard gameState={gameState} myPlayer={myPlayer} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
        {/* Header */}
        <div className="text-center">
          <p className="font-cinzel text-xs text-slate-500 uppercase tracking-widest">
            Quest {gameState.currentQuestIndex + 1}
          </p>
          <h2 className="font-cinzel text-xl font-black text-white mt-1">
            The Quest Begins!
          </h2>
        </div>

        {/* Quest Team */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3">
          <p className="font-cinzel text-xs text-yellow-400 uppercase tracking-widest mb-2 text-center">
            Quest Team
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {currentQuest?.teamProposal.map((playerId) => {
              const player = gameState.players.find((p) => p.id === playerId);
              if (!player) return null;
              const hasQuestVoted = votedPlayerIds.includes(playerId);
              return (
                <div key={playerId} className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-yellow-900/30 border-2 border-yellow-400/60 flex items-center justify-center text-2xl">
                      {player.avatar}
                    </div>
                    {hasQuestVoted && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                        <span className="text-black text-xs font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <span className="font-cinzel text-yellow-300 text-xs">{player.name}</span>
                </div>
              );
            })}
          </div>
          {currentQuest?.failsRequired > 1 && (
            <p className="font-crimson text-orange-400 text-xs text-center mt-2">
              ⚠️ This quest requires {currentQuest.failsRequired} fails to fail
            </p>
          )}
        </div>

        {/* My Role Card */}
        {me?.role && (
          <div onClick={() => setMyCardHidden(!myCardHidden)} className="cursor-pointer">
            {myCardHidden ? (
              <div className="flex items-center justify-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl py-3">
                <span className="text-2xl opacity-30">⚜️</span>
                <span className="font-cinzel text-slate-500 text-sm">Tap to reveal your role</span>
              </div>
            ) : (
              <div
                className="rounded-xl border p-3"
                style={{ borderColor: ROLE_INFO[me.role].color + '60' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ROLE_INFO[me.role].icon}</span>
                  <span className="font-cinzel text-sm font-bold" style={{ color: ROLE_INFO[me.role].color }}>
                    {me.role}
                  </span>
                  <span className="text-slate-500 text-xs font-crimson ml-auto">Tap to hide</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Voting Area */}
        {isOnQuest ? (
          !myVote ? (
            <div className="space-y-3">
              <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest text-center">
                Your Quest Vote (Secret)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onCastQuestVote('success')}
                  className="flex flex-col items-center justify-center gap-2 bg-blue-900/30 border-2 border-blue-400/50 rounded-2xl py-6 active:scale-95 transition-all"
                >
                  <span className="text-4xl">⚔️</span>
                  <span className="font-cinzel text-blue-400 font-bold text-sm">Success</span>
                  <span className="font-crimson text-blue-300/60 text-xs">Help the quest</span>
                </button>
                <button
                  onClick={() => canVoteFail ? onCastQuestVote('fail') : undefined}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl py-6 active:scale-95 transition-all ${
                    canVoteFail
                      ? 'bg-red-900/30 border-2 border-red-400/50'
                      : 'bg-slate-800/30 border-2 border-slate-700/30 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="text-4xl">{canVoteFail ? '💀' : '🔒'}</span>
                  <span className={`font-cinzel font-bold text-sm ${canVoteFail ? 'text-red-400' : 'text-slate-500'}`}>
                    Fail
                  </span>
                  <span className={`font-crimson text-xs ${canVoteFail ? 'text-red-300/60' : 'text-slate-600'}`}>
                    {canVoteFail ? 'Sabotage quest' : 'Good only: Success'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-2xl border-2 p-5 text-center ${
                myVote === 'success'
                  ? 'bg-blue-900/30 border-blue-400/50'
                  : 'bg-red-900/30 border-red-400/50'
              }`}
            >
              <div className="text-4xl mb-2">{myVote === 'success' ? '⚔️' : '💀'}</div>
              <p className={`font-cinzel font-bold text-base ${myVote === 'success' ? 'text-blue-400' : 'text-red-400'}`}>
                Voted: {myVote === 'success' ? 'Success' : 'Fail'}
              </p>
              <p className="font-crimson text-slate-400 text-xs mt-1">Your vote is secret</p>
            </div>
          )
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-2">👀</div>
            <p className="font-cinzel text-slate-300 font-bold">Observing</p>
            <p className="font-crimson text-slate-500 text-sm mt-1">
              You are not on this quest. Watch and wait.
            </p>
          </div>
        )}

        {/* Vote Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest">
              Quest Members Voted ({totalVoted}/{questTeamSize})
            </p>
          </div>
          <PlayerGrid
            gameState={gameState}
            myPlayer={myPlayer}
            showVoteStatus={true}
            votedPlayerIds={votedPlayerIds}
          />
        </div>

        {/* Reveal - Host only */}
        {isHost && allVoted && (
          <Button variant="gold" size="lg" fullWidth onClick={onRevealQuestVotes}>
            📜 Reveal Quest Results
          </Button>
        )}

        {!allVoted && (
          <p className="text-center font-crimson text-slate-500 text-sm">
            Waiting for {questTeamSize - totalVoted} more quest vote{questTeamSize - totalVoted !== 1 ? 's' : ''}...
          </p>
        )}
      </div>
    </div>
  );
}
