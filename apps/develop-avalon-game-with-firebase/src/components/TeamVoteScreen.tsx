import { useState } from 'react';
import { GameState, Player } from '../types';
import { submitTeamVote, updateRoomState } from '../dbService';
import { getNextLeaderIndex } from '../gameLogic';
import QuestBoard from './QuestBoard';

interface TeamVoteProps {
  gameState: GameState;
  myPlayer: Player;
}

export default function TeamVoteScreen({ gameState, myPlayer }: TeamVoteProps) {
  const [myVote, setMyVote] = useState<'approve' | 'reject' | null>(
    (gameState.teamVotes?.[myPlayer.id] as any) || null
  );
  const [showResult, setShowResult] = useState(false);

  const players = Object.values(gameState.players || {});
  const playerCount = players.length;
  const selectedTeam = gameState.selectedTeam || [];
  const teamVotes = gameState.teamVotes || {};
  const votedCount = Object.keys(teamVotes).length;
  const allVoted = votedCount === playerCount;
  const isHost = myPlayer.id === gameState.hostId;
  const currentRound = gameState.currentRound || 1;
  const leaderId = gameState.currentLeaderId || players[gameState.currentLeaderIndex || 0]?.id;

  const approveCount = Object.values(teamVotes).filter(v => v === 'approve').length;
  const rejectCount = Object.values(teamVotes).filter(v => v === 'reject').length;
  const teamApproved = approveCount > rejectCount;

  const handleVote = async (vote: 'approve' | 'reject') => {
    if (myVote) return;
    setMyVote(vote);
    await submitTeamVote(gameState.id, myPlayer.id, vote);
    await updateRoomState(gameState.id, {
      [`players/${myPlayer.id}/hasVoted`]: true,
    } as any);
  };

  const handleRevealAndContinue = async () => {
    if (!isHost || !allVoted) return;
    setShowResult(true);
  };

  const handleContinueAfterResult = async () => {
    if (!isHost) return;
    if (teamApproved) {
      // Move to quest vote
      const updatedPlayers: any = {};
      players.forEach(p => {
        updatedPlayers[p.id] = { ...p, hasVoted: false, vote: undefined };
      });
      await updateRoomState(gameState.id, {
        phase: 'quest_vote',
        questVotes: {},
        players: updatedPlayers,
      });
    } else {
      // Rejected - next leader
      const leaderIndex = gameState.currentLeaderIndex || 0;
      const nextLeaderIndex = getNextLeaderIndex(leaderIndex, playerCount);
      const nextLeaderId = players[nextLeaderIndex]?.id;
      const newRejected = (gameState.rejectedVotes || 0) + 1;
      const updatedPlayers: any = {};
      players.forEach(p => {
        updatedPlayers[p.id] = { ...p, hasVoted: false, vote: undefined };
      });
      if (newRejected >= 5) {
        // Evil wins
        await updateRoomState(gameState.id, {
          phase: 'game_over',
          winner: 'evil',
          winReason: '5 consecutive team rejections — Evil wins!',
          teamVotes: {},
          players: updatedPlayers,
        });
      } else {
        await updateRoomState(gameState.id, {
          phase: 'team_selection',
          rejectedVotes: newRejected,
          currentLeaderIndex: nextLeaderIndex,
          currentLeaderId: nextLeaderId,
          selectedTeam: [],
          teamVotes: {},
          players: updatedPlayers,
        });
      }
    }
  };

  const teamPlayers = players.filter(p => selectedTeam.includes(p.id));
  const leaderPlayer = players.find(p => p.id === leaderId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random() * 2 + 1 + 'px', height: Math.random() * 2 + 1 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', opacity: Math.random() * 0.5 + 0.1 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4 pb-4">
        {/* Header */}
        <div className="text-center pt-4">
          <p className="text-amber-400/60 text-xs tracking-widest">QUEST {currentRound} OF 5</p>
          <h1 className="text-2xl font-bold text-white mt-1">Team Vote</h1>
          <p className="text-gray-400 text-sm">Approve or reject the proposed quest team</p>
        </div>

        <QuestBoard gameState={gameState} myPlayer={myPlayer} compact={true} />

        {/* Proposed Team */}
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-amber-300 text-sm font-semibold">Proposed Team</p>
            <p className="text-gray-400 text-xs">{teamPlayers.length} players</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {teamPlayers.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 rounded-xl px-3 py-2">
                <span className="text-xl">{p.avatar}</span>
                <span className="text-white text-sm font-semibold">{p.name}</span>
                {p.id === myPlayer.id && <span className="text-amber-400 text-xs">(You)</span>}
              </div>
            ))}
          </div>
          {leaderPlayer && (
            <p className="text-gray-500 text-xs">
              👑 Proposed by <span className="text-amber-400">{leaderPlayer.name}</span>
            </p>
          )}
        </div>

        {/* Vote Buttons */}
        {!myVote && (
          <div>
            <p className="text-white font-semibold text-sm text-center mb-3">Cast your vote:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVote('approve')}
                className="py-5 bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg text-lg border border-green-500/50"
              >
                <div className="text-3xl mb-1">✅</div>
                <div className="text-sm tracking-wider">APPROVE</div>
              </button>
              <button
                onClick={() => handleVote('reject')}
                className="py-5 bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg text-lg border border-red-500/50"
              >
                <div className="text-3xl mb-1">❌</div>
                <div className="text-sm tracking-wider">REJECT</div>
              </button>
            </div>
          </div>
        )}

        {myVote && (
          <div className={`rounded-2xl p-4 border text-center ${
            myVote === 'approve'
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="text-3xl mb-1">{myVote === 'approve' ? '✅' : '❌'}</div>
            <p className={`font-bold text-sm ${myVote === 'approve' ? 'text-green-300' : 'text-red-300'}`}>
              You voted to {myVote === 'approve' ? 'APPROVE' : 'REJECT'}
            </p>
          </div>
        )}

        {/* Vote status */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-400 text-sm font-semibold">Votes Cast</p>
            <span className="text-amber-400 font-bold">{votedCount}/{playerCount}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {players.map(p => {
              const voted = teamVotes.hasOwnProperty(p.id) || p.hasVoted;
              return (
                <div key={p.id} className={`flex items-center gap-2 rounded-xl p-2 border transition-all ${
                  voted ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-white/5'
                }`}>
                  <span className="text-base">{p.avatar}</span>
                  <span className="text-white text-xs font-semibold truncate flex-1">{p.name}</span>
                  {voted ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-gray-600 text-xs">...</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Result modal */}
        {showResult && (
          <div className={`rounded-2xl p-5 border-2 text-center ${
            teamApproved
              ? 'bg-green-900/40 border-green-400/60'
              : 'bg-red-900/40 border-red-400/60'
          }`}>
            <div className="text-4xl mb-2">{teamApproved ? '✅' : '❌'}</div>
            <h2 className={`text-xl font-bold mb-2 ${teamApproved ? 'text-green-300' : 'text-red-300'}`}>
              Team {teamApproved ? 'APPROVED' : 'REJECTED'}!
            </h2>
            <div className="flex justify-center gap-6 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{approveCount}</div>
                <div className="text-green-300/70 text-xs">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{rejectCount}</div>
                <div className="text-red-300/70 text-xs">Rejected</div>
              </div>
            </div>
            {/* Reveal who voted what */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {players.map(p => {
                const vote = teamVotes[p.id];
                return (
                  <div key={p.id} className={`flex items-center gap-2 rounded-lg p-2 ${
                    vote === 'approve' ? 'bg-green-500/20' : vote === 'reject' ? 'bg-red-500/20' : 'bg-white/5'
                  }`}>
                    <span>{p.avatar}</span>
                    <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                    <span>{vote === 'approve' ? '✅' : vote === 'reject' ? '❌' : '?'}</span>
                  </div>
                );
              })}
            </div>
            {isHost && (
              <button
                onClick={handleContinueAfterResult}
                className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all text-sm"
              >
                {teamApproved ? '⚔️ Proceed to Quest' : '↺ New Leader, New Team'}
              </button>
            )}
            {!isHost && <p className="text-gray-400 text-xs">Waiting for host to continue...</p>}
          </div>
        )}

        {/* Host reveal button */}
        {!showResult && isHost && allVoted && (
          <button
            onClick={handleRevealAndContinue}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg text-sm tracking-wider"
          >
            📊 REVEAL VOTES
          </button>
        )}

        {!isHost && !showResult && allVoted && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-sm">⏳ Waiting for host to reveal votes...</p>
          </div>
        )}
      </div>
    </div>
  );
}
