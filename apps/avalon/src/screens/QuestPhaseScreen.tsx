import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { submitQuestVote, resolveQuestVote } from '../gameService';
import { getCharacter, CharacterName } from '../types';
import QuestBoard from '../components/QuestBoard';

export default function QuestPhaseScreen({ onResolved }: { onResolved: () => void }) {
  const { currentRoom, currentPlayer, db } = useGame();
  const [myVote, setMyVote] = useState<'success' | 'fail' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  if (!currentRoom) return null;

  const players = Object.values(currentRoom.players);
  const isHost = currentRoom.hostId === currentPlayer?.id;
  const questVotes = currentRoom.questVotes || {};
  const totalVotes = Object.keys(questVotes).length;

  const myChar = currentPlayer?.character ? getCharacter(currentPlayer.character as CharacterName) : null;
  const isOnQuest = currentRoom.teamProposal?.includes(currentPlayer?.id || '');
  const isEvil = myChar?.team === 'evil';

  const questTeamPlayers = players.filter(p => currentRoom.teamProposal?.includes(p.id));
  const allVoted = totalVotes >= questTeamPlayers.length;

  const fails = Object.values(questVotes).filter(v => v === 'fail').length;
  const successes = Object.values(questVotes).filter(v => v === 'success').length;

  useEffect(() => {
    const myExistingVote = questVotes[currentPlayer?.id || ''];
    if (myExistingVote) setMyVote(myExistingVote as 'success' | 'fail');
  }, [questVotes]);

  useEffect(() => {
    if (currentRoom.phase !== 'quest') onResolved();
  }, [currentRoom.phase]);

  const handleVote = async (vote: 'success' | 'fail') => {
    if (!db || !currentPlayer || myVote || !isOnQuest) return;
    setMyVote(vote);
    setLoading(true);
    await submitQuestVote(db, currentRoom.id, currentPlayer.id, vote);
    setLoading(false);
  };

  const handleResolve = async () => {
    if (!db || !allVoted) return;
    setShowResults(true);
    await new Promise(r => setTimeout(r, 2000));
    await resolveQuestVote(db, currentRoom);
  };

  const failsCount = fails;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col p-4 relative overflow-hidden"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/87" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="text-center pt-4 pb-3">
          <p className="text-amber-500/70 text-xs uppercase tracking-widest">⚔️ Quest Phase — Round {currentRoom.currentRound}</p>
          <h2 className="text-lg font-bold text-amber-400 font-serif mt-1">Quest in Progress</h2>
        </div>

        <QuestBoard />

        {/* Quest Team */}
        <div className="bg-gray-900/85 border border-amber-700/40 rounded-2xl p-4 mb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">🛡️ Quest Team</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {questTeamPlayers.map(p => {
              const voted = p.id in questVotes;
              return (
                <div key={p.id}
                  className={`flex flex-col items-center rounded-xl px-3 py-2 border transition-all ${
                    voted ? 'bg-green-900/40 border-green-700/50' : 'bg-amber-900/30 border-amber-700/40'
                  }`}>
                  <span className="text-2xl mb-1">{p.avatar}</span>
                  <span className="text-white text-xs font-semibold">{p.name}</span>
                  <span className="text-xs mt-0.5">{voted ? '✅ Voted' : '⏳'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vote status */}
        <div className="bg-gray-900/85 border border-gray-700/50 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Quest Votes</p>
            <span className="text-gray-400 text-xs">{totalVotes}/{questTeamPlayers.length}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${questTeamPlayers.length > 0 ? (totalVotes / questTeamPlayers.length) * 100 : 0}%` }}
            />
          </div>
          {!isOnQuest && (
            <p className="text-gray-500 text-xs text-center">You are not on this quest. Waiting for results...</p>
          )}
        </div>

        {/* Results reveal */}
        {showResults && allVoted && (
          <div className={`rounded-2xl p-5 mb-4 border text-center ${
            failsCount === 0 ? 'bg-blue-900/60 border-blue-600' : 'bg-red-900/60 border-red-600'
          }`}>
            <p className="text-4xl mb-2">{failsCount === 0 ? '✅' : '❌'}</p>
            <p className={`text-2xl font-black ${failsCount === 0 ? 'text-blue-300' : 'text-red-300'}`}>
              QUEST {failsCount === 0 ? 'SUCCEEDED' : 'FAILED'}!
            </p>
            <p className="text-gray-300 text-sm mt-2">
              {successes} Success · {failsCount} Fail{failsCount !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Quest vote buttons (only for quest members) */}
        {isOnQuest && !myVote && (
          <div className="space-y-3 mb-4">
            <div className={`bg-gray-900/60 border rounded-xl p-3 mb-2 ${
              isEvil ? 'border-red-700/40' : 'border-blue-700/40'
            }`}>
              <p className="text-center text-sm text-gray-300">
                {isEvil
                  ? '💀 As Evil, you may play Fail to sabotage the quest.'
                  : '⚔️ As Good, you must play Success.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVote('success')}
                disabled={loading}
                className="bg-gradient-to-b from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl py-5 text-base transition-all active:scale-95 shadow-xl border border-blue-600/50"
              >
                <span className="text-2xl block mb-1">⚔️</span>
                SUCCESS
              </button>
              <button
                onClick={() => handleVote('fail')}
                disabled={loading || !isEvil}
                className={`font-bold rounded-2xl py-5 text-base transition-all active:scale-95 shadow-xl border ${
                  isEvil
                    ? 'bg-gradient-to-b from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white border-red-600/50'
                    : 'bg-gray-800/40 text-gray-600 border-gray-700/30 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl block mb-1">💀</span>
                FAIL
              </button>
            </div>
          </div>
        )}

        {isOnQuest && myVote && (
          <div className={`rounded-2xl p-4 mb-4 border text-center ${
            myVote === 'success' ? 'bg-blue-900/40 border-blue-700' : 'bg-red-900/40 border-red-700'
          }`}>
            <p className="text-2xl mb-1">{myVote === 'success' ? '⚔️' : '💀'}</p>
            <p className={`font-bold ${myVote === 'success' ? 'text-blue-300' : 'text-red-300'}`}>
              You played: {myVote.toUpperCase()}
            </p>
            <p className="text-gray-400 text-sm mt-1">Waiting for all quest members...</p>
          </div>
        )}

        {/* Host controls */}
        {isHost && allVoted && !showResults && (
          <button
            onClick={handleResolve}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl mb-4"
          >
            📊 Reveal Quest Results (Host)
          </button>
        )}

        {isHost && allVoted && showResults && (
          <button
            onClick={() => resolveQuestVote(db!, currentRoom)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-2xl py-4 text-base transition-all active:scale-95 shadow-xl mb-4"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
