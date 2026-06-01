import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { submitTeamVote, resolveTeamVote } from '../gameService';
import QuestBoard from '../components/QuestBoard';

export default function TeamVoteScreen({ onResolved }: { onResolved: () => void }) {
  const { currentRoom, currentPlayer, db } = useGame();
  const [myVote, setMyVote] = useState<'approve' | 'reject' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const isHost = currentRoom.hostId === currentPlayer?.id;
  const votes = currentRoom.votes || {};
  const totalVotes = Object.keys(votes).length;
  const allVoted = totalVotes >= players.length;
  const teamProposal = currentRoom.teamProposal || [];

  const approvals = Object.values(votes).filter(v => v === 'approve').length;
  const rejections = Object.values(votes).filter(v => v === 'reject').length;
  const proposedPlayers = players.filter(p => teamProposal.includes(p.id));

  useEffect(() => {
    const myExistingVote = votes[currentPlayer?.id || ''];
    if (myExistingVote) setMyVote(myExistingVote);
  }, [votes]);

  useEffect(() => {
    if (currentRoom.phase === 'quest') onResolved();
    if (currentRoom.phase === 'day') onResolved();
  }, [currentRoom.phase]);

  const handleVote = async (vote: 'approve' | 'reject') => {
    if (!db || !currentPlayer || myVote) return;
    setMyVote(vote);
    setLoading(true);
    await submitTeamVote(db, currentRoom.id, currentPlayer.id, vote);
    setLoading(false);
  };

  const handleResolve = async () => {
    if (!db || !allVoted) return;
    setShowResults(true);
    await new Promise(r => setTimeout(r, 1500));
    await resolveTeamVote(db, currentRoom);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-4 pb-3">
          <p className="text-amber-500/70 text-xs uppercase tracking-widest">🗳️ Team Vote — Round {currentRoom.currentRound}</p>
          <h2 className="text-lg font-bold text-amber-400 font-serif mt-1">Approve or Reject?</h2>
        </div>

        <QuestBoard />

        {/* Proposed Team */}
        <div className="bg-gray-900/85 border border-amber-700/40 rounded-2xl p-4 mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">⚔️ Proposed Quest Team</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {proposedPlayers.map(p => (
              <div key={p.id} className="flex flex-col items-center bg-amber-900/40 border border-amber-700/50 rounded-xl px-3 py-2">
                <span className="text-2xl mb-1">{p.avatar}</span>
                <span className="text-white text-xs font-semibold">{p.name}</span>
                {p.id === currentPlayer?.id && <span className="text-amber-400 text-xs">(You)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Vote Status */}
        <div className="bg-gray-900/85 border border-gray-700/50 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Vote Status</p>
            <span className="text-gray-400 text-xs">{totalVotes}/{players.length} voted</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {players.map(p => {
              const voted = p.id in votes;
              return (
                <div key={p.id}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
                    voted ? 'bg-green-900/30 border-green-700/40' : 'bg-gray-800/40 border-gray-700/30'
                  }`}>
                  <span className="text-lg">{p.avatar}</span>
                  <span className="text-white text-xs font-medium truncate flex-1">{p.name}</span>
                  <span className="text-xs">{voted ? '✅' : '⏳'}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(totalVotes / players.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Show Results after reveal */}
        {showResults && allVoted && (
          <div className={`rounded-2xl p-4 mb-4 border text-center ${
            approvals > rejections
              ? 'bg-blue-900/60 border-blue-600'
              : 'bg-red-900/60 border-red-600'
          }`}>
            <p className="text-3xl mb-2">{approvals > rejections ? '✅' : '❌'}</p>
            <p className={`text-xl font-bold ${approvals > rejections ? 'text-blue-300' : 'text-red-300'}`}>
              {approvals > rejections ? 'APPROVED!' : 'REJECTED!'}
            </p>
            <p className="text-gray-300 text-sm mt-1">
              {approvals} Approve · {rejections} Reject
            </p>
          </div>
        )}

        {/* My Vote Buttons */}
        {!myVote ? (
          <div className="space-y-3 mb-4">
            <p className="text-center text-gray-300 text-sm font-semibold">Cast your vote:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVote('approve')}
                disabled={loading}
                className="bg-gradient-to-b from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl py-5 text-base transition-all active:scale-95 shadow-xl border border-blue-600/50"
              >
                <span className="text-2xl block mb-1">👍</span>
                APPROVE
              </button>
              <button
                onClick={() => handleVote('reject')}
                disabled={loading}
                className="bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl py-5 text-base transition-all active:scale-95 shadow-xl border border-red-600/50"
              >
                <span className="text-2xl block mb-1">👎</span>
                REJECT
              </button>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl p-4 mb-4 border text-center ${
            myVote === 'approve' ? 'bg-blue-900/40 border-blue-700/60' : 'bg-red-900/40 border-red-700/60'
          }`}>
            <p className="text-2xl mb-1">{myVote === 'approve' ? '👍' : '👎'}</p>
            <p className={`font-bold ${myVote === 'approve' ? 'text-blue-300' : 'text-red-300'}`}>
              You voted: {myVote.toUpperCase()}
            </p>
            <p className="text-gray-400 text-sm mt-1">Waiting for all votes...</p>
          </div>
        )}

        {/* Host resolves */}
        {isHost && allVoted && !showResults && (
          <button
            onClick={handleResolve}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl mb-4"
          >
            📊 Reveal Votes (Host)
          </button>
        )}

        {isHost && allVoted && showResults && (
          <button
            onClick={() => resolveTeamVote(db!, currentRoom)}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl mb-4"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
