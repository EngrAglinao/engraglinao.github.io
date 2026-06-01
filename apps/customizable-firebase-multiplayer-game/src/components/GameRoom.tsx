import { useEffect, useState } from 'react';
import { Database } from 'firebase/database';
import { GameRoom as GameRoomType, Player, Role, ROLE_INFO, QUEST_SIZES, EVIL_COUNT } from '../types/game';
import {
  subscribeToRoom,
  startGame,
  setAvailableRoles,
  proceedToTeamBuilding,
  togglePlayerOnTeam,
  startTeamVote,
  castTeamVote,
  resolveTeamVote,
  proceedAfterTeamVoteResult,
  startQuestVote,
  castQuestVote,
  resolveQuestVote,
  proceedAfterQuestResult,
  submitAssassination,
  resetRoom,
  toggleCardVisibility,
  leaveRoom,
} from '../firebase/gameService';

interface Props {
  db: Database;
  roomId: string;
  myPlayer: Player;
  onLeave: () => void;
}



function QuestBoard({ room, playerCount }: { room: GameRoomType; playerCount: number }) {
  const questSizes = QUEST_SIZES[playerCount] || [2, 3, 2, 3, 3];
  const results = room.questResults || [];

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {questSizes.map((size, i) => {
        const result = results[i];
        const isCurrent = i === (room.questNumber - 1) && room.phase !== 'lobby' && room.phase !== 'role-reveal';
        return (
          <div
            key={i}
            className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-sm transition-all duration-300 ${
              result === 'success'
                ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/50'
                : result === 'fail'
                ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/50'
                : isCurrent
                ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-900/30 animate-pulse'
                : 'bg-gray-800/50 border-gray-600 text-gray-500'
            }`}
          >
            <span className="text-xs">{i + 1}</span>
            <span className="text-xs">{size}p</span>
            {result === 'success' && <span className="absolute -top-1 -right-1 text-lg">✅</span>}
            {result === 'fail' && <span className="absolute -top-1 -right-1 text-lg">❌</span>}
            {isCurrent && !result && <span className="absolute -top-1 -right-1 text-sm">⚡</span>}
          </div>
        );
      })}
    </div>
  );
}

function PlayerCard({
  player,
  isMe,
  myRole,
  myPlayer,
  room,
  db,
  roomId,
  onToggleTeam,
  isLeader,
  showAssassinTarget,
  onSelectAssassinTarget,
  assassinTargetId,
}: {
  player: Player;
  isMe: boolean;
  myRole?: Role;
  myPlayer: Player;
  room: GameRoomType;
  db: Database;
  roomId: string;
  onToggleTeam?: () => void;
  isLeader?: boolean;
  showAssassinTarget?: boolean;
  onSelectAssassinTarget?: () => void;
  assassinTargetId?: string;
}) {
  const isOnTeam = room.selectedTeam?.includes(player.id);
  const isHost = player.id === room.hostId;

  // What can I see about this player?
  const getVisibleRole = (): { label: string; color: string } | null => {
    if (!myRole) return null;
    if (isMe && player.cardVisible) {
      return { label: `${ROLE_INFO[player.role!]?.icon} ${player.role}`, color: ROLE_INFO[player.role!]?.color || 'text-gray-300' };
    }

    const isEvil = (r: Role) => ROLE_INFO[r]?.team === 'evil';

    if (!isMe) {
      // Merlin sees evil players (except Mordred)
      if (myRole === 'Merlin' && player.role && isEvil(player.role) && player.role !== 'Mordred') {
        return { label: '😈 Evil', color: 'text-red-400' };
      }
      // Percival sees Merlin and Morgana (but not which is which)
      if (myRole === 'Percival' && (player.role === 'Merlin' || player.role === 'Morgana')) {
        return { label: '🔮 Merlin?', color: 'text-blue-300' };
      }
      // Bad guys see each other (except Oberon doesn't see others, others don't see Oberon)
      if (isEvil(myRole)) {
        if (myRole !== 'Oberon' && player.role && isEvil(player.role) && player.role !== 'Oberon') {
          const label = player.role === 'Morgana' ? '🌙 Morgana (Ally)' : `😈 Evil Ally`;
          return { label, color: 'text-red-400' };
        }
      }
      // Morgana sees Merlin
      if (myRole === 'Morgana' && player.role === 'Merlin') {
        return { label: '🔮 Merlin', color: 'text-blue-400' };
      }
    }
    return null;
  };

  const visibleRole = getVisibleRole();
  const canSeeMyCard = isMe;
  const gameOver = room.phase === 'game-over' || room.phase === 'assassination';

  return (
    <div
      className={`relative bg-gray-900 rounded-xl border-2 p-3 transition-all duration-200 ${
        isOnTeam
          ? 'border-yellow-400 shadow-lg shadow-yellow-900/30'
          : isMe
          ? 'border-purple-500 shadow-md shadow-purple-900/30'
          : 'border-gray-700'
      } ${
        assassinTargetId === player.id ? 'border-red-500 shadow-lg shadow-red-900/40' : ''
      } ${
        showAssassinTarget && !isMe && player.team !== 'evil' ? 'cursor-pointer hover:border-red-400' : ''
      }`}
      onClick={() => {
        if (showAssassinTarget && !isMe && player.team !== 'evil') {
          onSelectAssassinTarget?.();
        }
      }}
    >
      {/* Top badges */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-1 flex-wrap">
          {isHost && (
            <span className="text-xs bg-yellow-600/30 text-yellow-300 border border-yellow-600/50 px-1.5 py-0.5 rounded-full">
              👑 Host
            </span>
          )}
          {isLeader && (
            <span className="text-xs bg-blue-600/30 text-blue-300 border border-blue-600/50 px-1.5 py-0.5 rounded-full">
              🗡️ Leader
            </span>
          )}
          {isMe && (
            <span className="text-xs bg-purple-600/30 text-purple-300 border border-purple-600/50 px-1.5 py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        {isOnTeam && (
          <span className="text-xs bg-yellow-600/30 text-yellow-300 border border-yellow-600/50 px-1.5 py-0.5 rounded-full">
            ⚔️ Quest
          </span>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{player.avatar}</span>
        <div>
          <p className="text-white font-bold text-sm leading-tight">{player.name}</p>
          {visibleRole && !gameOver && (
            <p className={`text-xs font-medium ${visibleRole.color}`}>{visibleRole.label}</p>
          )}
          {gameOver && player.role && (
            <p className={`text-xs font-medium ${ROLE_INFO[player.role]?.color}`}>
              {ROLE_INFO[player.role]?.icon} {player.role}
            </p>
          )}
        </div>
      </div>

      {/* Vote status */}
      {(room.phase === 'team-vote' || (room.phase === 'quest' && room.questVotePhase)) && (
        <div className="text-xs">
          {player.hasVoted ? (
            <span className="text-green-400">✓ Voted</span>
          ) : (
            <span className="text-gray-500">⏳ Waiting...</span>
          )}
        </div>
      )}

      {/* Revealed vote (after counting) */}
      {room.phase === 'team-vote' && player.hasVoted && player.vote && (
        <div className="text-xs mt-1">
          {/* Only show own vote */}
          {isMe && (
            <span className={player.vote === 'approve' ? 'text-green-400' : 'text-red-400'}>
              You voted: {player.vote === 'approve' ? '✅ Approve' : '❌ Reject'}
            </span>
          )}
        </div>
      )}

      {/* Host team selection button */}
      {room.phase === 'team-building' && myPlayer.id === room.hostId && !isMe && onToggleTeam && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleTeam(); }}
          className={`mt-2 w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${
            isOnTeam
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {isOnTeam ? '✓ On Quest' : '+ Add to Quest'}
        </button>
      )}
      {room.phase === 'team-building' && myPlayer.id === room.hostId && isMe && onToggleTeam && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleTeam(); }}
          className={`mt-2 w-full text-xs py-1.5 rounded-lg font-medium transition-colors ${
            isOnTeam
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          {isOnTeam ? '✓ On Quest' : '+ Send Yourself'}
        </button>
      )}

      {/* Assassin target indicator */}
      {showAssassinTarget && !isMe && player.team !== 'evil' && (
        <div className={`mt-2 text-xs text-center py-1.5 rounded-lg border transition-colors ${
          assassinTargetId === player.id
            ? 'bg-red-700 border-red-500 text-white'
            : 'border-red-800/50 text-red-400 hover:bg-red-900/30'
        }`}>
          {assassinTargetId === player.id ? '🎯 Selected' : 'Target?'}
        </div>
      )}

      {/* Card toggle for my own card */}
      {canSeeMyCard && room.phase !== 'lobby' && room.phase !== 'game-over' && player.role && (
        <button
          onClick={async (e) => {
            e.stopPropagation();
            await toggleCardVisibility(db, roomId, player.id, !player.cardVisible);
          }}
          className="mt-2 w-full text-xs py-1.5 rounded-lg bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 hover:bg-indigo-800/50 transition-colors"
        >
          {player.cardVisible ? '🙈 Hide Card' : '👁️ Show My Role'}
        </button>
      )}
    </div>
  );
}

export default function GameRoom({ db, roomId, myPlayer, onLeave }: Props) {
  const [room, setRoom] = useState<GameRoomType | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [assassinTarget, setAssassinTarget] = useState<string>('');
  const [teamVoteChoice, setTeamVoteChoice] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const unsub = subscribeToRoom(db, roomId, (r) => {
      if (!r) {
        onLeave();
        return;
      }
      setRoom(r);
    });
    return unsub;
  }, [db, roomId, onLeave]);

  const me = room?.players[myPlayer.id];
  const isHost = me?.id === room?.hostId;
  const players = room ? Object.values(room.players) : [];
  const playerCount = players.length;
  const currentLeader = room ? players[room.currentLeaderIndex] : null;
  const evilCount = EVIL_COUNT[playerCount] || 2;
  const questIndex = (room?.questNumber ?? 1) - 1;
  const questSize = QUEST_SIZES[playerCount]?.[questIndex] ?? 2;
  const teamSize = room?.selectedTeam?.length ?? 0;

  const withLoading = async (fn: () => Promise<void>) => {
    setLoading(true);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => withLoading(() => startGame(db, roomId));
  const handleProceedToTeamBuilding = () => withLoading(() => proceedToTeamBuilding(db, roomId));
  const handleToggleTeam = (playerId: string) =>
    withLoading(() => togglePlayerOnTeam(db, roomId, playerId, room!));
  const handleStartTeamVote = () => withLoading(() => startTeamVote(db, roomId, room!));
  const handleCastTeamVote = (vote: 'approve' | 'reject') => {
    setTeamVoteChoice(vote);
    withLoading(() => castTeamVote(db, roomId, myPlayer.id, vote));
  };
  const handleResolveTeamVote = () => withLoading(() => resolveTeamVote(db, roomId, room!));
  const handleProceedAfterTeamVoteResult = () => withLoading(() => proceedAfterTeamVoteResult(db, roomId, room!));
  const handleStartQuestVote = () => withLoading(() => startQuestVote(db, roomId, room!));
  const handleCastQuestVote = (vote: 'pass' | 'fail') => {
    withLoading(() => castQuestVote(db, roomId, myPlayer.id, vote));
  };
  const handleResolveQuestVote = () => withLoading(() => resolveQuestVote(db, roomId, room!));
  const handleProceedAfterQuestResult = () => withLoading(() => proceedAfterQuestResult(db, roomId, room!));
  const handleAssassinate = () => {
    if (!assassinTarget) return;
    withLoading(() => submitAssassination(db, roomId, assassinTarget));
  };
  const handleReset = () => withLoading(() => resetRoom(db, roomId, room!));
  const handleLeave = async () => {
    await leaveRoom(db, roomId, myPlayer.id);
    onLeave();
  };

  const handleSetRoles = (roles: Role[]) =>
    withLoading(() => setAvailableRoles(db, roomId, roles));

  const allVoted = (phase: 'team' | 'quest') => {
    if (!room) return false;
    if (phase === 'team') return players.every((p) => p.hasVoted);
    if (phase === 'quest') {
      const questPlayers = players.filter((p) => room.selectedTeam?.includes(p.id));
      return questPlayers.every((p) => p.hasVoted);
    }
    return false;
  };

  if (!room || !me) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🔮</div>
          <p className="text-white text-xl">Connecting to room...</p>
          <p className="text-gray-500 text-sm mt-2">Room: {roomId}</p>
        </div>
      </div>
    );
  }

  const myRole = me.role;
  const goodWins = (room.questResults || []).filter((r) => r === 'success').length;
  const evilWins = (room.questResults || []).filter((r) => r === 'fail').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 text-white pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-white">🔮 AVALON</span>
            <span className="text-xs bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 px-2 py-1 rounded-lg font-mono">
              #{roomId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {myRole && (
              <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-gray-800 border border-gray-700 ${ROLE_INFO[myRole]?.color}`}>
                {ROLE_INFO[myRole]?.icon} {myRole}
              </span>
            )}
            <button
              onClick={handleLeave}
              className="text-xs bg-red-900/30 hover:bg-red-800/50 border border-red-800/50 text-red-400 px-2 py-1 rounded-lg transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 pt-4 space-y-4">

        {/* Quest Board - Always visible during game */}
        {room.phase !== 'lobby' && room.phase !== 'role-reveal' && (
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quest Board</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-900/40 border border-green-700/50 text-green-400 px-2 py-0.5 rounded-full">
                  ✅ {goodWins}
                </span>
                <span className="text-xs bg-red-900/40 border border-red-700/50 text-red-400 px-2 py-0.5 rounded-full">
                  ❌ {evilWins}
                </span>
                <span className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                  Rejections: {room.teamVoteRejections}/5
                </span>
              </div>
            </div>
            <QuestBoard room={room} playerCount={playerCount} />
            {currentLeader && room.phase !== 'game-over' && room.phase !== 'assassination' && (
              <p className="text-center text-xs text-gray-500 mt-3">
                👑 Leader: <span className="text-yellow-400 font-bold">{currentLeader.name}</span>
                {' '} | Quest {room.questNumber} needs <span className="text-blue-400 font-bold">{questSize} players</span>
              </p>
            )}
          </div>
        )}

        {/* Phase-specific header banner */}
        {room.phase !== 'lobby' && (
          <div className={`rounded-xl p-3 text-center border ${
            room.phase === 'role-reveal' ? 'bg-indigo-900/30 border-indigo-700/50' :
            room.phase === 'team-building' ? 'bg-blue-900/30 border-blue-700/50' :
            room.phase === 'team-vote' ? 'bg-yellow-900/30 border-yellow-700/50' :
            room.phase === 'quest' ? 'bg-green-900/30 border-green-700/50' :
            room.phase === 'quest-result' ? 'bg-purple-900/30 border-purple-700/50' :
            room.phase === 'assassination' ? 'bg-red-900/30 border-red-700/50' :
            room.phase === 'game-over' ? 'bg-gray-900/30 border-gray-700/50' : ''
          }`}>
            <p className={`text-sm font-bold ${
              room.phase === 'role-reveal' ? 'text-indigo-300' :
              room.phase === 'team-building' ? 'text-blue-300' :
              room.phase === 'team-vote' ? 'text-yellow-300' :
              room.phase === 'quest' ? 'text-green-300' :
              room.phase === 'quest-result' ? 'text-purple-300' :
              room.phase === 'assassination' ? 'text-red-300' :
              'text-gray-300'
            }`}>
              {room.phase === 'role-reveal' && '🌙 Night Phase — Learn Your Role'}
              {room.phase === 'team-building' && '🗡️ Team Building Phase'}
              {room.phase === 'team-vote' && '🗳️ Vote: Approve or Reject the Team?'}
              {room.phase === 'quest' && (room.questVotePhase ? '⚔️ Quest Voting in Progress...' : '⚔️ Quest Phase')}
              {room.phase === 'quest-result' && '📜 Quest Result'}
              {room.phase === 'assassination' && '🗡️ Assassination Phase'}
              {room.phase === 'game-over' && (room.winner === 'good' ? '🏆 Good Wins!' : '💀 Evil Wins!')}
            </p>
          </div>
        )}

        {/* ======================== LOBBY PHASE ======================== */}
        {room.phase === 'lobby' && (
          <div className="space-y-4">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-bold text-lg">🏰 Game Lobby</h2>
                <span className="text-sm bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full">
                  {playerCount}/10 Players
                </span>
              </div>

              {/* Share room code */}
              <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-xl p-4 mb-4 text-center">
                <p className="text-indigo-300 text-sm mb-1">Share this code with players on the same WiFi:</p>
                <p className="text-white font-black text-4xl font-mono tracking-widest">{roomId}</p>
              </div>

              {/* Player list */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {players.map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 bg-gray-800 rounded-lg p-2.5 border ${p.id === myPlayer.id ? 'border-purple-600' : 'border-gray-700'}`}>
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <p className="text-white text-sm font-medium leading-tight">{p.name}</p>
                      <p className="text-gray-500 text-xs">{p.id === room.hostId ? '👑 Host' : 'Player'}</p>
                    </div>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 5 - playerCount) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2.5 border border-gray-800 border-dashed">
                    <span className="text-2xl opacity-20">👤</span>
                    <p className="text-gray-700 text-xs">Waiting...</p>
                  </div>
                ))}
              </div>

              {/* Role selection (host only) */}
              {isHost && (
                <RoleSelector
                  playerCount={playerCount}
                  availableRoles={room.availableRoles || []}
                  onSetRoles={handleSetRoles}
                />
              )}
              {!isHost && room.availableRoles?.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">Selected Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.availableRoles.map((r) => (
                      <span key={r} className={`text-xs px-2 py-1 rounded-full border bg-gray-900 ${ROLE_INFO[r]?.color} border-current/30`}>
                        {ROLE_INFO[r]?.icon} {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl mb-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={loading || playerCount < 5}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all duration-200 shadow-lg text-lg"
                >
                  {playerCount < 5 ? `Need ${5 - playerCount} more player${5 - playerCount !== 1 ? 's' : ''}` : loading ? '⏳ Starting...' : '⚔️ Start Game'}
                </button>
              )}
              {!isHost && (
                <div className="text-center text-gray-500 text-sm py-3 bg-gray-800/30 rounded-xl">
                  ⏳ Waiting for host to start the game...
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================== ROLE REVEAL PHASE ======================== */}
        {room.phase === 'role-reveal' && me.role && (
          <div className="space-y-4">
            {/* My role card */}
            <div className={`bg-gray-900 border-2 ${ROLE_INFO[me.role]?.team === 'evil' ? 'border-red-600' : 'border-blue-600'} rounded-2xl p-6 text-center shadow-2xl`}>
              <div className="text-6xl mb-3">{ROLE_INFO[me.role]?.icon}</div>
              <p className="text-gray-400 text-sm mb-1">Your Role</p>
              <h2 className={`text-3xl font-black mb-2 ${ROLE_INFO[me.role]?.color}`}>{me.role}</h2>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                ROLE_INFO[me.role]?.team === 'evil' ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-blue-900/50 border border-blue-700 text-blue-300'
              }`}>
                {ROLE_INFO[me.role]?.team === 'evil' ? '😈 Servants of Mordred' : '✨ Servants of Arthur'}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{ROLE_INFO[me.role]?.description}</p>
            </div>

            {/* Role knowledge */}
            <RoleKnowledgePanel room={room} me={me} players={players} />

            {/* Players overview */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Players ({playerCount})</h3>
              <div className="text-xs text-gray-500 mb-3">
                ⚔️ Good: {playerCount - evilCount} | 😈 Evil: {evilCount}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p) => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    isMe={p.id === myPlayer.id}
                    myRole={myRole}
                    myPlayer={me}
                    room={room}
                    db={db}
                    roomId={roomId}
                  />
                ))}
              </div>
            </div>

            {isHost && (
              <button
                onClick={handleProceedToTeamBuilding}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                {loading ? '⏳...' : '▶️ Begin — Team Building'}
              </button>
            )}
            {!isHost && (
              <div className="text-center text-gray-500 text-sm py-3 bg-gray-800/30 rounded-xl">
                ⏳ Waiting for host to start team building...
              </div>
            )}
          </div>
        )}

        {/* ======================== TEAM BUILDING PHASE ======================== */}
        {room.phase === 'team-building' && (
          <div className="space-y-4">
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select Quest Team</h3>
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  teamSize === questSize ? 'bg-green-600/30 text-green-400 border border-green-700/50' : 'bg-blue-600/30 text-blue-400 border border-blue-700/50'
                }`}>
                  {teamSize}/{questSize} Selected
                </span>
              </div>

              {isHost ? (
                <p className="text-yellow-300 text-sm mb-3">
                  👑 You are the Host & Leader. Select <strong>{questSize}</strong> players for Quest {room.questNumber}.
                </p>
              ) : (
                <p className="text-gray-400 text-sm mb-3">
                  🗡️ <strong className="text-yellow-400">{currentLeader?.name}</strong> is choosing the quest team...
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p) => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    isMe={p.id === myPlayer.id}
                    myRole={myRole}
                    myPlayer={me}
                    room={room}
                    db={db}
                    roomId={roomId}
                    onToggleTeam={isHost ? () => handleToggleTeam(p.id) : undefined}
                    isLeader={p.id === currentLeader?.id}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isHost && (
              <button
                onClick={handleStartTeamVote}
                disabled={loading || teamSize !== questSize}
                className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                {teamSize !== questSize
                  ? `Select ${questSize - teamSize} more player${questSize - teamSize !== 1 ? 's' : ''}`
                  : loading ? '⏳...' : '🗳️ Start Team Vote'}
              </button>
            )}
            {!isHost && (
              <div className="text-center text-gray-500 text-sm py-3 bg-gray-800/30 rounded-xl">
                ⏳ Waiting for host to start the vote...
              </div>
            )}
          </div>
        )}

        {/* ======================== TEAM VOTE PHASE ======================== */}
        {room.phase === 'team-vote' && (
          <div className="space-y-4">
            {/* Proposed team display */}
            <div className="bg-gray-900/80 border border-yellow-800/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-widest mb-3">Proposed Quest Team</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {players.filter((p) => room.selectedTeam?.includes(p.id)).map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-3 py-2">
                    <span>{p.avatar}</span>
                    <span className="text-yellow-300 font-medium text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                Proposed by: <span className="text-yellow-400 font-bold">{currentLeader?.name}</span>
              </p>
            </div>

            {/* Vote buttons */}
            {!me.hasVoted ? (
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
                <p className="text-white font-bold text-center mb-4">Do you approve this team?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCastTeamVote('approve')}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-5 rounded-xl transition-colors shadow-lg text-2xl"
                  >
                    ✅ APPROVE
                  </button>
                  <button
                    onClick={() => handleCastTeamVote('reject')}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black py-5 rounded-xl transition-colors shadow-lg text-2xl"
                  >
                    ❌ REJECT
                  </button>
                </div>
                {teamVoteChoice && (
                  <p className="text-center text-sm text-gray-400 mt-3">
                    You voted: <span className={teamVoteChoice === 'approve' ? 'text-green-400' : 'text-red-400'}>
                      {teamVoteChoice === 'approve' ? '✅ Approve' : '❌ Reject'}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-green-400 font-bold text-lg">✓ Vote Cast!</p>
                <p className="text-gray-400 text-sm mt-1">Waiting for everyone else...</p>
              </div>
            )}

            {/* Who has voted */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                Votes Cast: {players.filter((p) => p.hasVoted).length}/{playerCount}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 rounded-lg p-2 border ${
                    p.hasVoted ? 'bg-green-900/20 border-green-700/40' : 'bg-gray-800/50 border-gray-700'
                  }`}>
                    <span>{p.avatar}</span>
                    <span className="text-sm text-white flex-1 truncate">{p.name}</span>
                    {p.hasVoted ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <span className="text-gray-600 text-sm">⏳</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {isHost && allVoted('team') && (
              <button
                onClick={handleResolveTeamVote}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                {loading ? '⏳...' : '📊 Count the Votes'}
              </button>
            )}
          </div>
        )}

        {/* ======================== QUEST PHASE ======================== */}
        {room.phase === 'quest' && (
          <div className="space-y-4">
            {/* Quest team */}
            <div className="bg-gray-900/80 border border-green-800/50 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">Quest Team</h3>
              <div className="flex flex-wrap gap-2">
                {players.filter((p) => room.selectedTeam?.includes(p.id)).map((p) => (
                  <div key={p.id} className={`flex items-center gap-2 rounded-xl px-3 py-2 border ${
                    p.id === myPlayer.id
                      ? 'bg-green-600/30 border-green-500'
                      : 'bg-gray-800 border-gray-700'
                  }`}>
                    <span>{p.avatar}</span>
                    <span className={`font-medium text-sm ${p.id === myPlayer.id ? 'text-green-300' : 'text-white'}`}>
                      {p.name} {p.id === myPlayer.id ? '(You)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!room.questVotePhase ? (
              <>
                <div className="text-center text-gray-400 text-sm py-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                  ⏳ The host will start the quest vote...
                </div>
                {isHost && (
                  <button
                    onClick={handleStartQuestVote}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
                  >
                    {loading ? '⏳...' : '⚔️ Start Quest Vote'}
                  </button>
                )}
              </>
            ) : (
              <>
                {room.selectedTeam?.includes(myPlayer.id) ? (
                  !me.hasVoted ? (
                    <div className="bg-gray-900/80 border border-green-800/50 rounded-2xl p-5">
                      <p className="text-white font-bold text-center text-lg mb-2">You are on this quest!</p>
                      <p className="text-gray-400 text-sm text-center mb-5">Choose wisely. Your vote is secret.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleCastQuestVote('pass')}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black py-6 rounded-xl transition-colors shadow-lg text-2xl"
                        >
                          ✅ PASS
                        </button>
                        <button
                          onClick={() => handleCastQuestVote('fail')}
                          disabled={loading || me.team === 'good'}
                          className="bg-red-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-6 rounded-xl transition-colors shadow-lg text-2xl"
                          title={me.team === 'good' ? 'Good players must always pass quests' : ''}
                        >
                          ❌ FAIL
                          {me.team === 'good' && (
                            <span className="block text-xs font-normal opacity-60">Good must pass</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-900/80 border border-green-800/50 rounded-2xl p-5 text-center">
                      <p className="text-green-400 font-bold text-xl">✓ Quest Vote Cast!</p>
                      <p className="text-gray-400 text-sm mt-2">Waiting for other quest members...</p>
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                    You are not on this quest. Waiting for results...
                  </div>
                )}

                {/* Quest vote progress */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Quest Votes: {players.filter((p) => room.selectedTeam?.includes(p.id) && p.hasVoted).length}/{room.selectedTeam?.length}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {players.filter((p) => room.selectedTeam?.includes(p.id)).map((p) => (
                      <div key={p.id} className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
                        p.hasVoted ? 'bg-green-900/20 border-green-700/40' : 'bg-gray-800 border-gray-700'
                      }`}>
                        <span>{p.avatar}</span>
                        <span className="text-sm text-white">{p.name}</span>
                        {p.hasVoted ? <span className="text-green-400">✓</span> : <span className="text-gray-600">⏳</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {isHost && allVoted('quest') && (
                  <button
                    onClick={handleResolveQuestVote}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
                  >
                    {loading ? '⏳...' : '📜 Reveal Quest Result'}
                  </button>
                )}
              </>
            )}

            {/* All players visible */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">All Players</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p) => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    isMe={p.id === myPlayer.id}
                    myRole={myRole}
                    myPlayer={me}
                    room={room}
                    db={db}
                    roomId={roomId}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================== QUEST RESULT PHASE ======================== */}
        {room.phase === 'quest-result' && (() => {
          const lastRecord = room.questRecords?.[room.questRecords.length - 1];
          return (
            <div className="space-y-4">
              <div className={`text-center p-8 rounded-2xl border-2 ${
                lastRecord?.result === 'success'
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-red-900/30 border-red-500'
              }`}>
                <div className="text-7xl mb-4">
                  {lastRecord?.result === 'success' ? '✅' : '❌'}
                </div>
                <h2 className={`text-3xl font-black mb-2 ${lastRecord?.result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  Quest {lastRecord?.questNumber} {lastRecord?.result === 'success' ? 'SUCCEEDED!' : 'FAILED!'}
                </h2>
                <p className="text-gray-400 text-sm">
                  Fail cards played: <span className="text-red-400 font-bold">{lastRecord?.failCount ?? 0}</span>
                </p>
              </div>

              <QuestBoard room={room} playerCount={playerCount} />

              {isHost && (
                <button
                  onClick={handleProceedAfterQuestResult}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors shadow-lg text-lg"
                >
                  {loading ? '⏳...' : '▶️ Continue to Next Quest'}
                </button>
              )}
              {!isHost && (
                <div className="text-center text-gray-500 text-sm py-3 bg-gray-800/30 rounded-xl">
                  ⏳ Waiting for host to continue...
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================== ASSASSINATION PHASE ======================== */}
        {room.phase === 'assassination' && (
          <div className="space-y-4">
            <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center">
              <div className="text-6xl mb-3">🗡️</div>
              <h2 className="text-2xl font-black text-red-400 mb-2">The Assassination</h2>
              <p className="text-gray-300 text-sm">
                Good has passed 3 quests! But the <strong className="text-red-400">Assassin</strong> now gets one chance...
                If they correctly identify <strong className="text-blue-400">Merlin</strong>, Evil still wins!
              </p>
            </div>

            {me.role === 'Assassin' ? (
              <div className="bg-gray-900/80 border border-red-800/50 rounded-2xl p-4">
                <h3 className="text-red-400 font-bold mb-3">🎯 Choose Merlin</h3>
                <p className="text-gray-400 text-sm mb-4">Select who you believe is Merlin:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {players.filter((p) => p.team !== 'evil').map((p) => (
                    <PlayerCard
                      key={p.id}
                      player={p}
                      isMe={p.id === myPlayer.id}
                      myRole={myRole}
                      myPlayer={me}
                      room={room}
                      db={db}
                      roomId={roomId}
                      showAssassinTarget={true}
                      onSelectAssassinTarget={() => setAssassinTarget(p.id)}
                      assassinTargetId={assassinTarget}
                    />
                  ))}
                </div>
                <button
                  onClick={handleAssassinate}
                  disabled={loading || !assassinTarget}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-colors shadow-lg text-lg"
                >
                  {loading ? '⏳...' : assassinTarget ? `🗡️ Assassinate ${players.find((p) => p.id === assassinTarget)?.name}` : 'Select a target first'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center text-gray-400 text-sm py-4 bg-gray-900/40 border border-gray-800 rounded-xl">
                  🗡️ The <span className="text-red-400 font-bold">Assassin</span> is making their choice...
                </div>
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Players</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {players.map((p) => (
                      <PlayerCard
                        key={p.id}
                        player={p}
                        isMe={p.id === myPlayer.id}
                        myRole={myRole}
                        myPlayer={me}
                        room={room}
                        db={db}
                        roomId={roomId}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================== GAME OVER PHASE ======================== */}
        {room.phase === 'game-over' && (
          <div className="space-y-4">
            <div className={`text-center p-8 rounded-2xl border-2 ${
              room.winner === 'good'
                ? 'bg-blue-900/30 border-blue-500'
                : 'bg-red-900/30 border-red-500'
            }`}>
              <div className="text-7xl mb-4">{room.winner === 'good' ? '🏆' : '💀'}</div>
              <h2 className={`text-3xl font-black mb-2 ${room.winner === 'good' ? 'text-blue-400' : 'text-red-400'}`}>
                {room.winner === 'good' ? '✨ Good Wins!' : '😈 Evil Wins!'}
              </h2>
              <p className="text-gray-300 text-sm">{room.winReason}</p>
            </div>

            <QuestBoard room={room} playerCount={playerCount} />

            {/* Full reveal */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">🔍 Full Role Reveal</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map((p) => (
                  <div key={p.id} className={`bg-gray-800 rounded-xl p-3 border ${
                    p.id === room.assassinTarget ? 'border-red-500' :
                    p.role === 'Merlin' ? 'border-blue-500' :
                    p.team === 'evil' ? 'border-red-800' : 'border-green-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{p.avatar}</span>
                      <div>
                        <p className="text-white text-sm font-bold">{p.name}</p>
                        {p.id === myPlayer.id && <span className="text-purple-400 text-xs">(You)</span>}
                      </div>
                    </div>
                    {p.role && (
                      <p className={`text-xs font-bold ${ROLE_INFO[p.role]?.color}`}>
                        {ROLE_INFO[p.role]?.icon} {p.role}
                      </p>
                    )}
                    {p.id === room.assassinTarget && (
                      <p className="text-red-400 text-xs mt-1">🎯 Assassin's Target</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isHost && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                {loading ? '⏳...' : '🔄 Play Again'}
              </button>
            )}
            {!isHost && (
              <div className="text-center text-gray-500 text-sm py-3 bg-gray-800/30 rounded-xl">
                ⏳ Waiting for host to reset...
              </div>
            )}
          </div>
        )}

        {/* Always visible - My Role card toggle during game */}
        {room.phase !== 'lobby' && room.phase !== 'game-over' && me.role && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-3">
            <button
              onClick={async () => {
                await toggleCardVisibility(db, roomId, myPlayer.id, !me.cardVisible);
              }}
              className={`w-full text-sm font-bold py-3 rounded-xl transition-all duration-200 ${
                me.cardVisible
                  ? 'bg-indigo-600 text-white shadow-indigo-900/50 shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {me.cardVisible
                ? `🙈 Hide My Role Card (${ROLE_INFO[me.role]?.icon} ${me.role})`
                : `👁️ Show My Role Card`}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ===== Role Knowledge Panel =====
function RoleKnowledgePanel({ me, players }: { room: GameRoomType; me: Player; players: Player[] }) {
  if (!me.role) return null;

  const role = me.role;
  const isEvil = (r: Role) => ROLE_INFO[r]?.team === 'evil';
  const knowledge: { label: string; names: string[]; color: string }[] = [];

  if (role === 'Merlin') {
    const evilKnown = players.filter(
      (p) => p.id !== me.id && p.role && isEvil(p.role) && p.role !== 'Mordred'
    );
    knowledge.push({
      label: '😈 You see these Evil players (not Mordred):',
      names: evilKnown.map((p) => `${p.avatar} ${p.name}`),
      color: 'text-red-400',
    });
  }

  if (role === 'Percival') {
    const merlinMorgana = players.filter(
      (p) => p.id !== me.id && (p.role === 'Merlin' || p.role === 'Morgana')
    );
    knowledge.push({
      label: '🔮 One of these is Merlin, one is Morgana — figure it out!',
      names: merlinMorgana.map((p) => `${p.avatar} ${p.name}`),
      color: 'text-blue-300',
    });
  }

  if (role === 'Morgana') {
    const merlinPlayer = players.find((p) => p.role === 'Merlin');
    if (merlinPlayer) {
      knowledge.push({
        label: '🔮 You see who Merlin is:',
        names: [`${merlinPlayer.avatar} ${merlinPlayer.name}`],
        color: 'text-blue-400',
      });
    }
    const evilAllies = players.filter(
      (p) => p.id !== me.id && p.role && isEvil(p.role) && p.role !== 'Oberon'
    );
    if (evilAllies.length > 0) {
      knowledge.push({
        label: '😈 Evil Allies:',
        names: evilAllies.map((p) => `${p.avatar} ${p.name}`),
        color: 'text-red-400',
      });
    }
  }

  if (isEvil(role) && role !== 'Oberon') {
    const evilAllies = players.filter(
      (p) => p.id !== me.id && p.role && isEvil(p.role) && p.role !== 'Oberon'
    );
    if (evilAllies.length > 0) {
      knowledge.push({
        label: `😈 Your Evil Allies${role === 'Mordred' ? ' (Merlin cannot see you!)' : ''}:`,
        names: evilAllies.map((p) => {
          let suffix = '';
          if (p.role === 'Morgana') suffix = ' (Morgana)';
          else if (p.role === 'Mordred') suffix = ' (Mordred)';
          else if (p.role === 'Assassin') suffix = ' (Assassin)';
          return `${p.avatar} ${p.name}${suffix}`;
        }),
        color: 'text-red-400',
      });
    }
  }

  if (knowledge.length === 0) return null;

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">🔍 Your Secret Knowledge</h3>
      <div className="space-y-3">
        {knowledge.map((k, i) => (
          <div key={i} className="bg-gray-800/70 rounded-xl p-3">
            <p className="text-gray-400 text-xs mb-2">{k.label}</p>
            <div className="flex flex-wrap gap-2">
              {k.names.map((n, j) => (
                <span key={j} className={`text-sm font-bold px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg ${k.color}`}>
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Role Selector (Host) =====
function RoleSelector({
  playerCount,
  availableRoles,
  onSetRoles,
}: {
  playerCount: number;
  availableRoles: Role[];
  onSetRoles: (roles: Role[]) => void;
}) {
  const evilCount = EVIL_COUNT[playerCount] || 2;
  const goodCount = playerCount - evilCount;

  const goodSpecials: Role[] = ['Merlin', 'Percival'];
  const evilSpecials: Role[] = ['Assassin', 'Morgana', 'Mordred', 'Oberon'];

  const isSelected = (r: Role) => availableRoles.includes(r);

  const toggle = (r: Role) => {
    const current = [...availableRoles];
    if (current.includes(r)) {
      onSetRoles(current.filter((x) => x !== r));
    } else {
      // Limit selections
      const currentGoodSpecials = current.filter((x) => goodSpecials.includes(x)).length;
      const currentEvilSpecials = current.filter((x) => evilSpecials.includes(x)).length;

      if (goodSpecials.includes(r) && currentGoodSpecials >= goodCount - 0) {
        // Allow up to goodCount specials (rest will be Loyal Servant)
      }
      if (evilSpecials.includes(r) && currentEvilSpecials >= evilCount) return;
      onSetRoles([...current, r]);
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
      <p className="text-sm font-bold text-white mb-1">⚙️ Choose Special Roles</p>
      <p className="text-xs text-gray-500 mb-3">
        Team: {goodCount} Good (blue), {evilCount} Evil (red). Unselected slots = Loyal Servant / Minion.
      </p>

      <div className="space-y-2">
        <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Good Team Specials</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {goodSpecials.map((r) => (
            <button
              key={r}
              onClick={() => toggle(r)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                isSelected(r)
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-blue-600'
              }`}
            >
              {ROLE_INFO[r]?.icon} {r}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-red-400 uppercase tracking-wide">Evil Team Specials</p>
        <div className="flex flex-wrap gap-2">
          {evilSpecials.map((r) => (
            <button
              key={r}
              onClick={() => toggle(r)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                isSelected(r)
                  ? 'bg-red-700 border-red-400 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-red-700'
              }`}
            >
              {ROLE_INFO[r]?.icon} {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(['Merlin', 'Assassin'] as Role[]).map((r) => {
          const included = isSelected(r);
          return (
            <span key={r} className={`text-xs px-2 py-0.5 rounded-full ${included ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-500'}`}>
              {r}: {included ? 'Included' : 'Not included (auto-assigned if Assassin missing)'}
            </span>
          );
        })}
      </div>
    </div>
  );
}
