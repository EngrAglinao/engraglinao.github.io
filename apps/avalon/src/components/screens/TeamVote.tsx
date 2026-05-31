import { useState } from 'react';
import { Button } from '../ui/Button';
import { PlayerGrid } from './PlayerGrid';
import { QuestBoard } from './QuestBoard';
import type { GameState, Player, VoteOption } from '../../types/game';
import { ROLE_INFO } from '../../constants/gameConfig';

interface TeamVoteProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onCastVote: (vote: VoteOption) => void;
  onRevealVotes: () => void;
}

export function TeamVote({ gameState, myPlayer, isHost, onCastVote, onRevealVotes }: TeamVoteProps) {
  const [myCardHidden, setMyCardHidden] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayer.id);
  const currentQuest = gameState.quests[gameState.currentQuestIndex];
  const myVote = currentQuest?.votes[myPlayer.id];
  const totalVotes = Object.keys(currentQuest?.votes || {}).length;
  const totalPlayers = gameState.players.length;
  const allVoted = totalVotes === totalPlayers;
  const votedPlayerIds = Object.keys(currentQuest?.votes || {});

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
          <h2 className="font-cinzel text-xl font-black text-white mt-1">Team Vote</h2>
          <p className="font-crimson text-slate-400 text-sm mt-1">
            Do you approve or reject this team?
          </p>
        </div>

        {/* Proposed Team */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-3">
          <p className="font-cinzel text-xs text-yellow-400 uppercase tracking-widest mb-2 text-center">
            Proposed Quest Team
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {currentQuest?.teamProposal.map((playerId) => {
              const player = gameState.players.find((p) => p.id === playerId);
              if (!player) return null;
              return (
                <div key={playerId} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-yellow-900/30 border-2 border-yellow-400/60 flex items-center justify-center text-2xl">
                    {player.avatar}
                  </div>
                  <span className="font-cinzel text-yellow-300 text-xs">{player.name}</span>
                </div>
              );
            })}
          </div>
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

        {/* Vote Buttons */}
        {!myVote ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onCastVote('approve')}
              className="flex flex-col items-center justify-center gap-2 bg-green-900/30 border-2 border-green-400/50 rounded-2xl py-6 active:scale-95 transition-all hover:bg-green-900/40"
            >
              <span className="text-4xl">👍</span>
              <span className="font-cinzel text-green-400 font-bold text-sm">Approve</span>
            </button>
            <button
              onClick={() => onCastVote('reject')}
              className="flex flex-col items-center justify-center gap-2 bg-red-900/30 border-2 border-red-400/50 rounded-2xl py-6 active:scale-95 transition-all hover:bg-red-900/40"
            >
              <span className="text-4xl">👎</span>
              <span className="font-cinzel text-red-400 font-bold text-sm">Reject</span>
            </button>
          </div>
        ) : (
          <div className={`rounded-2xl border-2 p-5 text-center ${
            myVote === 'approve'
              ? 'bg-green-900/30 border-green-400/50'
              : 'bg-red-900/30 border-red-400/50'
          }`}>
            <div className="text-4xl mb-2">{myVote === 'approve' ? '👍' : '👎'}</div>
            <p className={`font-cinzel font-bold text-base ${myVote === 'approve' ? 'text-green-400' : 'text-red-400'}`}>
              You voted to {myVote === 'approve' ? 'Approve' : 'Reject'}
            </p>
            <p className="font-crimson text-slate-400 text-xs mt-1">Waiting for others...</p>
          </div>
        )}

        {/* Vote Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest">
              Vote Status ({totalVotes}/{totalPlayers})
            </p>
            {allVoted && <span className="text-green-400 text-xs font-cinzel">All voted!</span>}
          </div>
          <PlayerGrid
            gameState={gameState}
            myPlayer={myPlayer}
            showVoteStatus={true}
            votedPlayerIds={votedPlayerIds}
          />
        </div>

        {/* Reveal Votes - Host only */}
        {isHost && allVoted && (
          <Button variant="gold" size="lg" fullWidth onClick={onRevealVotes}>
            📜 Reveal Votes
          </Button>
        )}

        {!allVoted && (
          <p className="text-center font-crimson text-slate-500 text-sm">
            Waiting for {totalPlayers - totalVotes} more vote{totalPlayers - totalVotes !== 1 ? 's' : ''}...
          </p>
        )}
      </div>
    </div>
  );
}
