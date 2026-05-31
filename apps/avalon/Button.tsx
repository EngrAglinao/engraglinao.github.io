import { useState } from 'react';
import { Button } from '../ui/Button';
import { PlayerGrid } from './PlayerGrid';
import { QuestBoard } from './QuestBoard';
import type { GameState, Player } from '../../types/game';
import { ROLE_INFO } from '../../constants/gameConfig';
import { getVisibleEvilPlayers, getKnowledgeLabel } from '../../utils/gameLogic';

interface TeamSelectionProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  onConfirmTeam: (teamIds: string[]) => void;
  onStartTeamVote: () => void;
}

export function TeamSelection({
  gameState,
  myPlayer,
  isHost,
  onConfirmTeam,
  onStartTeamVote,
}: TeamSelectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [myCardHidden, setMyCardHidden] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayer.id);
  const currentQuest = gameState.quests[gameState.currentQuestIndex];
  const requiredCount = currentQuest.requiredPlayers;
  const isLeader = gameState.currentLeaderId === myPlayer.id;
  const leaderPlayer = gameState.players.find((p) => p.id === gameState.currentLeaderId);

  const visibleEvilIds = me ? getVisibleEvilPlayers(me, gameState.players) : [];

  const togglePlayerSelect = (playerId: string) => {
    if (!isLeader) return;
    setSelectedIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= requiredCount) return prev;
      return [...prev, playerId];
    });
  };

  const teamConfirmed = currentQuest.teamProposal.length === requiredCount;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 pb-6">
      {/* Quest Board */}
      <div className="pt-5 pb-3 px-4 border-b border-slate-700/40">
        <p className="font-cinzel text-xs text-slate-500 uppercase tracking-widest mb-3 text-center">
          Quest Progress
        </p>
        <QuestBoard gameState={gameState} myPlayer={myPlayer} />
        <div className="flex justify-between mt-3 px-1">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: gameState.goodScore }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              ))}
              {Array.from({ length: 3 - gameState.goodScore }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600" />
              ))}
            </div>
            <span className="font-cinzel text-xs text-blue-400">Good</span>
          </div>
          <div className="font-cinzel text-xs text-slate-500">
            Reject: {gameState.consecutiveRejects}/5
          </div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs text-red-400">Evil</span>
            <div className="flex gap-1">
              {Array.from({ length: gameState.evilScore }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-red-400 shadow-sm shadow-red-400/50" />
              ))}
              {Array.from({ length: 3 - gameState.evilScore }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-slate-700 border border-slate-600" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">
        {/* Phase Title */}
        <div className="text-center">
          <p className="font-cinzel text-xs text-slate-500 uppercase tracking-widest">
            Quest {gameState.currentQuestIndex + 1} — Team Selection
          </p>
          <h2 className="font-cinzel text-xl font-black text-white mt-1">
            {isLeader ? (
              <span className="text-yellow-400">You are the Leader!</span>
            ) : (
              <span>
                <span className="text-yellow-400">{leaderPlayer?.avatar} {leaderPlayer?.name}</span>
                {' '}is choosing
              </span>
            )}
          </h2>
          <p className="font-crimson text-slate-400 text-sm mt-1">
            {teamConfirmed
              ? `Team selected (${requiredCount}/${requiredCount}). Host will start the vote.`
              : isLeader
              ? `Select ${requiredCount - selectedIds.length} more player${requiredCount - selectedIds.length !== 1 ? 's' : ''}`
              : `Waiting for leader to select ${requiredCount} players...`}
          </p>
        </div>

        {/* My Role Card (hideable) */}
        {me?.role && (
          <div
            className="relative"
            onClick={() => setMyCardHidden(!myCardHidden)}
          >
            {myCardHidden ? (
              <div className="flex items-center justify-center gap-2 bg-slate-800/60 border border-slate-700/40 rounded-xl py-3 cursor-pointer">
                <span className="text-2xl opacity-30">⚜️</span>
                <span className="font-cinzel text-slate-500 text-sm">Tap to reveal your role</span>
              </div>
            ) : (
              <div
                className="rounded-xl border p-3 cursor-pointer"
                style={{
                  borderColor: ROLE_INFO[me.role].color + '60',
                  background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ROLE_INFO[me.role].icon}</span>
                  <div>
                    <p
                      className="font-cinzel font-bold text-sm"
                      style={{ color: ROLE_INFO[me.role].color }}
                    >
                      {me.role}
                    </p>
                    <p className="font-crimson text-slate-400 text-xs">
                      {ROLE_INFO[me.role].team === 'good' ? '✦ Good' : '⚔ Evil'}
                    </p>
                  </div>
                  {visibleEvilIds.length > 0 && (
                    <div className="ml-auto flex gap-1">
                      {gameState.players
                        .filter((p) => visibleEvilIds.includes(p.id) && p.id !== me.id)
                        .slice(0, 3)
                        .map((p) => (
                          <div
                            key={p.id}
                            className="text-lg"
                            title={`${p.name}: ${getKnowledgeLabel(me.role!, p.role!)}`}
                          >
                            {p.avatar}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                <p className="font-crimson text-slate-500 text-xs mt-1">Tap to hide</p>
              </div>
            )}
          </div>
        )}

        {/* Player Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest">
              All Players
            </p>
            {isLeader && (
              <span className="font-crimson text-yellow-400 text-xs">
                Tap to select ({selectedIds.length}/{requiredCount})
              </span>
            )}
            {teamConfirmed && !isLeader && (
              <span className="font-crimson text-green-400 text-xs">
                Team locked ✓
              </span>
            )}
          </div>
          <PlayerGrid
            gameState={gameState}
            myPlayer={myPlayer}
            onSelectPlayer={togglePlayerSelect}
            selectionMode={isLeader && !teamConfirmed}
            selectedPlayerIds={teamConfirmed ? currentQuest.teamProposal : selectedIds}
          />
        </div>

        {/* Confirm Team Button - Leader only */}
        {isLeader && !teamConfirmed && (
          <Button
            variant="gold"
            size="lg"
            fullWidth
            disabled={selectedIds.length !== requiredCount}
            onClick={() => onConfirmTeam(selectedIds)}
          >
            ✓ Confirm Team ({selectedIds.length}/{requiredCount})
          </Button>
        )}

        {/* Start Vote - Host only, after team is confirmed */}
        {isHost && teamConfirmed && (
          <Button variant="primary" size="lg" fullWidth onClick={onStartTeamVote}>
            🗳️ Start Team Vote
          </Button>
        )}

        {!isLeader && !teamConfirmed && (
          <div className="text-center py-2">
            <div className="inline-flex items-center gap-2 bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-2.5">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="font-cinzel text-slate-400 text-xs">
                {leaderPlayer?.avatar} {leaderPlayer?.name} is picking the team...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
