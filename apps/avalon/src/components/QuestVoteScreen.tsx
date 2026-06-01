import { useState } from 'react';
import { GameState, Player, ROLE_DEFINITIONS, QUEST_FAIL_REQUIRED, QUEST_TEAM_SIZES } from '../types';
import { submitQuestVote, updateRoomState } from '../dbService';
import { getNextLeaderIndex, checkWinCondition } from '../gameLogic';
import QuestBoard from './QuestBoard';

interface QuestVoteProps {
  gameState: GameState;
  myPlayer: Player;
}

export default function QuestVoteScreen({ gameState, myPlayer }: QuestVoteProps) {
  const players = Object.values(gameState.players || {});
  const playerCount = players.length;
  const selectedTeam = gameState.selectedTeam || [];
  const questVotes = gameState.questVotes || {};
  const votedCount = Object.keys(questVotes).length;
  const isOnQuest = selectedTeam.includes(myPlayer.id);
  const isHost = myPlayer.id === gameState.hostId;
  const currentRound = gameState.currentRound || 1;
  const failRequired = QUEST_FAIL_REQUIRED[playerCount] || [1,1,1,1,1];
  const questSizes = QUEST_TEAM_SIZES[playerCount] || [2,3,2,3,3];
  const teamSize = questSizes[currentRound - 1];
  const failsNeeded = failRequired[currentRound - 1];
  const myRole = myPlayer.role;
  const isEvil = myRole ? ROLE_DEFINITIONS[myRole].alignment === 'evil' : false;

  const [myVote, setMyVote] = useState<'success' | 'fail' | null>(
    (questVotes[myPlayer.id] as any) || null
  );
  const [showResult, setShowResult] = useState(false);

  const allVoted = votedCount >= teamSize;
  const failCount = Object.values(questVotes).filter(v => v === 'fail').length;
  const successCount = Object.values(questVotes).filter(v => v === 'success').length;
  const questFailed = failCount >= failsNeeded;

  const handleVote = async (vote: 'success' | 'fail') => {
    if (myVote || !isOnQuest) return;
    if (vote === 'fail' && !isEvil) return;
    setMyVote(vote);
    await submitQuestVote(gameState.id, myPlayer.id, vote);
    await updateRoomState(gameState.id, {
      [`players/${myPlayer.id}/hasVoted`]: true,
    } as any);
  };

  const handleReveal = () => {
    if (!isHost || !allVoted) return;
    setShowResult(true);
  };

  const handleContinueAfterResult = async () => {
    if (!isHost) return;
    const newResult = {
      round: currentRound,
      success: !questFailed,
      teamSize,
      failVotes: failCount,
      team: selectedTeam,
    };
    const newResults = [...(gameState.questResults || []), newResult];

    const leaderIndex = gameState.currentLeaderIndex || 0;
    const nextLeaderIndex = getNextLeaderIndex(leaderIndex, playerCount);
    const nextLeaderId = players[nextLeaderIndex]?.id;

    const updatedPlayers: any = {};
    players.forEach(p => {
      updatedPlayers[p.id] = { ...p, hasVoted: false, vote: undefined };
    });

    // Check win
    const tempState = { ...gameState, questResults: newResults };
    const winCheck = checkWinCondition(tempState);

    if (winCheck) {
      if (winCheck.winner === 'good') {
        // Check if assassin exists
        const hasAssassin = players.some(p => p.role === 'assassin');
        if (hasAssassin) {
          await updateRoomState(gameState.id, {
            phase: 'assassination',
            questResults: newResults,
            questVotes: {},
            players: updatedPlayers,
            currentLeaderIndex: nextLeaderIndex,
            currentLeaderId: nextLeaderId,
            selectedTeam: [],
            rejectedVotes: 0,
          });
        } else {
          await updateRoomState(gameState.id, {
            phase: 'game_over',
            winner: 'good',
            winReason: 'Good team completed 3 quests!',
            questResults: newResults,
          });
        }
      } else {
        await updateRoomState(gameState.id, {
          phase: 'game_over',
          winner: 'evil',
          winReason: winCheck.reason,
          questResults: newResults,
        });
      }
    } else {
      await updateRoomState(gameState.id, {
        phase: 'team_selection',
        currentRound: currentRound + 1,
        questResults: newResults,
        questVotes: {},
        selectedTeam: [],
        currentLeaderIndex: nextLeaderIndex,
        currentLeaderId: nextLeaderId,
        rejectedVotes: 0,
        players: updatedPlayers,
      });
    }
  };

  const teamPlayers = players.filter(p => selectedTeam.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random() * 2 + 1 + 'px', height: Math.random() * 2 + 1 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', opacity: Math.random() * 0.5 + 0.1 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4 pb-4">
        <div className="text-center pt-4">
          <p className="text-amber-400/60 text-xs tracking-widest">QUEST {currentRound} OF 5</p>
          <h1 className="text-2xl font-bold text-white mt-1">The Quest</h1>
          <p className="text-gray-400 text-sm">Quest team members cast their votes</p>
        </div>

        <QuestBoard gameState={gameState} myPlayer={myPlayer} compact={true} />

        {/* Quest Team */}
        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-4">
          <p className="text-amber-300 text-sm font-semibold mb-3">On This Quest</p>
          <div className="flex flex-wrap gap-2">
            {teamPlayers.map(p => {
              const hasVoted = p.hasVoted || questVotes.hasOwnProperty(p.id);
              return (
                <div key={p.id} className={`flex items-center gap-1.5 rounded-xl px-3 py-2 border transition-all ${
                  hasVoted ? 'bg-green-500/10 border-green-400/30' : 'bg-white/5 border-white/20'
                }`}>
                  <span className="text-xl">{p.avatar}</span>
                  <span className="text-white text-sm font-semibold">{p.name}</span>
                  {p.id === myPlayer.id && <span className="text-amber-400 text-xs">(You)</span>}
                  {hasVoted ? <span className="text-green-400 text-xs">✓</span> : <span className="text-gray-500 text-xs">...</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vote - only for quest members */}
        {isOnQuest && !myVote && (
          <div>
            <p className="text-white font-semibold text-center mb-1">Vote for this quest:</p>
            {isEvil && (
              <p className="text-red-400/70 text-xs text-center mb-3">
                As an evil player, you may choose to fail the quest
              </p>
            )}
            {!isEvil && (
              <p className="text-blue-400/70 text-xs text-center mb-3">
                As a good player, you must vote SUCCESS
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVote('success')}
                className="py-6 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg border border-blue-500/50"
              >
                <div className="text-3xl mb-1">⚔️</div>
                <div className="text-sm tracking-wider">SUCCESS</div>
              </button>
              <button
                onClick={() => handleVote('fail')}
                disabled={!isEvil}
                className={`py-6 bg-gradient-to-b from-red-700 to-red-800 text-white font-bold rounded-2xl active:scale-95 transition-all shadow-lg border border-red-500/50 ${
                  !isEvil ? 'opacity-20 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700'
                }`}
              >
                <div className="text-3xl mb-1">💀</div>
                <div className="text-sm tracking-wider">FAIL</div>
              </button>
            </div>
          </div>
        )}

        {isOnQuest && myVote && (
          <div className={`rounded-2xl p-4 border text-center ${
            myVote === 'success' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="text-3xl mb-1">{myVote === 'success' ? '⚔️' : '💀'}</div>
            <p className={`font-bold text-sm ${myVote === 'success' ? 'text-blue-300' : 'text-red-300'}`}>
              You voted {myVote === 'success' ? 'SUCCESS' : 'FAIL'}
            </p>
          </div>
        )}

        {!isOnQuest && (
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">👀 You are not on this quest</p>
            <p className="text-gray-600 text-xs mt-1">Watch the quest unfold...</p>
          </div>
        )}

        {/* Voting progress */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between mb-3">
            <p className="text-gray-400 text-sm">Quest Votes</p>
            <span className="text-amber-400 font-bold">{votedCount}/{teamSize}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {teamPlayers.map(p => {
              const voted = p.hasVoted || questVotes.hasOwnProperty(p.id);
              return (
                <div key={p.id} className={`flex items-center gap-2 rounded-xl p-2 border ${
                  voted ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'
                }`}>
                  <span className="text-base">{p.avatar}</span>
                  <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                  {voted ? <span className="text-green-400 text-xs">✓</span> : <span className="text-gray-600 text-xs">...</span>}
                </div>
              );
            })}
          </div>
          {failsNeeded > 1 && (
            <p className="text-amber-400 text-xs mt-2 text-center">★ Needs {failsNeeded} fail votes to fail</p>
          )}
        </div>

        {/* Result */}
        {showResult && (
          <div className={`rounded-2xl p-5 border-2 text-center ${
            questFailed ? 'bg-red-900/40 border-red-400/60' : 'bg-blue-900/40 border-blue-400/60'
          }`}>
            <div className="text-5xl mb-3">{questFailed ? '💀' : '✅'}</div>
            <h2 className={`text-2xl font-bold mb-2 ${questFailed ? 'text-red-300' : 'text-blue-300'}`}>
              Quest {questFailed ? 'FAILED' : 'SUCCEEDED'}!
            </h2>
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{successCount}</div>
                <div className="text-blue-300/70 text-xs">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{failCount}</div>
                <div className="text-red-300/70 text-xs">Fail</div>
              </div>
            </div>
            <p className={`text-sm mb-4 ${questFailed ? 'text-red-200' : 'text-blue-200'}`}>
              {questFailed
                ? `Evil sabotaged the quest with ${failCount} fail vote${failCount > 1 ? 's' : ''}!`
                : 'Good triumphed! The quest was a success!'}
            </p>
            {isHost && (
              <button
                onClick={handleContinueAfterResult}
                className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all text-sm"
              >
                Continue →
              </button>
            )}
            {!isHost && <p className="text-gray-400 text-xs">Waiting for host...</p>}
          </div>
        )}

        {!showResult && isHost && allVoted && (
          <button
            onClick={handleReveal}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg text-sm tracking-wider"
          >
            🎲 REVEAL QUEST RESULT
          </button>
        )}

        {!isHost && allVoted && !showResult && (
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-sm">⏳ Waiting for host to reveal...</p>
          </div>
        )}
      </div>
    </div>
  );
}
