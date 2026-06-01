import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  remove,
  Database,
  DatabaseReference,
} from 'firebase/database';
import {
  GameRoom,
  Player,
  Role,
  QUEST_SIZES,
  EVIL_COUNT,
  QUEST4_DOUBLE_FAIL,
  ROLE_INFO,
  QuestRecord,
  TeamVoteRecord,
} from '../types/game';

function roomRef(db: Database, roomId: string): DatabaseReference {
  return ref(db, `rooms/${roomId}`);
}

export async function createRoom(db: Database, host: Player): Promise<string> {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const room: GameRoom = {
    id: roomId,
    hostId: host.id,
    players: { [host.id]: { ...host, isHost: true } },
    phase: 'lobby',
    availableRoles: [],
    currentLeaderIndex: 0,
    questNumber: 1,
    questResults: [],
    questRecords: [],
    teamVoteRejections: 0,
    teamVoteRecords: [],
    selectedTeam: [],
    createdAt: Date.now(),
    lastUpdated: Date.now(),
  };
  await set(roomRef(db, roomId), room);
  return roomId;
}

export async function joinRoom(db: Database, roomId: string, player: Player): Promise<boolean> {
  const snap = await get(roomRef(db, roomId));
  if (!snap.exists()) return false;
  const room = snap.val() as GameRoom;
  if (room.phase !== 'lobby') return false;
  if (Object.keys(room.players).length >= 10) return false;

  await update(ref(db, `rooms/${roomId}/players/${player.id}`), player);
  return true;
}

export async function leaveRoom(db: Database, roomId: string, playerId: string): Promise<void> {
  await remove(ref(db, `rooms/${roomId}/players/${playerId}`));
}

export function subscribeToRoom(
  db: Database,
  roomId: string,
  callback: (room: GameRoom | null) => void
): () => void {
  const r = roomRef(db, roomId);
  const handler = onValue(r, (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    callback(snap.val() as GameRoom);
  });
  return () => off(r, 'value', handler);
}

export async function setAvailableRoles(
  db: Database,
  roomId: string,
  roles: Role[]
): Promise<void> {
  await update(roomRef(db, roomId), { availableRoles: roles, lastUpdated: Date.now() });
}

export async function startGame(db: Database, roomId: string): Promise<void> {
  const snap = await get(roomRef(db, roomId));
  if (!snap.exists()) throw new Error('Room not found');
  const room = snap.val() as GameRoom;
  const players = Object.values(room.players);
  const count = players.length;

  if (count < 5) throw new Error('Need at least 5 players');

  const roles = assignRoles(players, room.availableRoles, count);

  const updates: Record<string, unknown> = {
    phase: 'role-reveal',
    currentLeaderIndex: 0,
    questNumber: 1,
    questResults: [],
    questRecords: [],
    teamVoteRejections: 0,
    teamVoteRecords: [],
    selectedTeam: [],
    lastUpdated: Date.now(),
  };

  for (const p of players) {
    const assignment = roles.find((r) => r.playerId === p.id)!;
    updates[`players/${p.id}/role`] = assignment.role;
    updates[`players/${p.id}/team`] = ROLE_INFO[assignment.role].team;
    updates[`players/${p.id}/hasVoted`] = false;
    updates[`players/${p.id}/vote`] = null;
    updates[`players/${p.id}/isOnQuest`] = false;
    updates[`players/${p.id}/cardVisible`] = false;
  }

  await update(roomRef(db, roomId), updates);
}

function assignRoles(
  players: Player[],
  availableRoles: Role[],
  count: number
): { playerId: string; role: Role }[] {
  const evilCount = EVIL_COUNT[count] || 2;
  const goodCount = count - evilCount;

  // Separate available special roles by team
  const goodSpecials = availableRoles.filter(
    (r) => ROLE_INFO[r].team === 'good' && r !== 'Loyal Servant'
  );
  const evilSpecials = availableRoles.filter(
    (r) => ROLE_INFO[r].team === 'evil' && r !== 'Minion'
  );

  // Limit specials to team sizes
  const assignedGood: Role[] = goodSpecials.slice(0, goodCount);
  while (assignedGood.length < goodCount) assignedGood.push('Loyal Servant');

  const assignedEvil: Role[] = evilSpecials.slice(0, evilCount);
  while (assignedEvil.length < evilCount) assignedEvil.push('Minion');

  // Ensure Assassin is on evil team if no other evil special
  if (!assignedEvil.some((r) => r === 'Assassin')) {
    const minionIdx = assignedEvil.lastIndexOf('Minion');
    if (minionIdx >= 0) assignedEvil[minionIdx] = 'Assassin';
  }

  const allRoles = [...assignedGood, ...assignedEvil];

  // Shuffle both players and roles
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  const shuffledRoles = [...allRoles].sort(() => Math.random() - 0.5);

  return shuffledPlayers.map((p, i) => ({
    playerId: p.id,
    role: shuffledRoles[i],
  }));
}

export async function proceedToTeamBuilding(db: Database, roomId: string): Promise<void> {
  await update(roomRef(db, roomId), {
    phase: 'team-building',
    selectedTeam: [],
    lastUpdated: Date.now(),
  });
}

export async function togglePlayerOnTeam(
  db: Database,
  roomId: string,
  playerId: string,
  room: GameRoom
): Promise<void> {
  const players = Object.values(room.players);
  const count = players.length;
  const questIndex = room.questNumber - 1;
  const teamSize = QUEST_SIZES[count]?.[questIndex] ?? 2;

  let team = [...(room.selectedTeam || [])];
  if (team.includes(playerId)) {
    team = team.filter((id) => id !== playerId);
  } else {
    if (team.length >= teamSize) return;
    team.push(playerId);
  }

  const playerUpdates: Record<string, unknown> = {};
  for (const p of players) {
    playerUpdates[`players/${p.id}/isOnQuest`] = team.includes(p.id);
  }

  await update(roomRef(db, roomId), {
    selectedTeam: team,
    ...playerUpdates,
    lastUpdated: Date.now(),
  });
}

export async function startTeamVote(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const updates: Record<string, unknown> = {
    phase: 'team-vote',
    teamVotePhase: true,
    lastUpdated: Date.now(),
  };
  for (const p of players) {
    updates[`players/${p.id}/hasVoted`] = false;
    updates[`players/${p.id}/vote`] = null;
  }
  await update(roomRef(db, roomId), updates);
}

export async function castTeamVote(
  db: Database,
  roomId: string,
  playerId: string,
  vote: 'approve' | 'reject'
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    hasVoted: true,
    vote,
  });
}

export async function resolveTeamVote(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const approvals = players.filter((p) => p.vote === 'approve').length;
  const rejections = players.filter((p) => p.vote === 'reject').length;
  const approved = approvals > rejections;

  const voteSnapshot = players.map((p) => ({ playerId: p.id, vote: p.vote || 'reject' }));

  // First show the vote result to everyone
  await update(roomRef(db, roomId), {
    phase: 'team-vote-result',
    pendingTeamVoteResult: {
      approvals,
      rejections,
      result: approved ? 'approved' : 'rejected',
      votes: voteSnapshot,
    },
    lastUpdated: Date.now(),
  });
}

export async function proceedAfterTeamVoteResult(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const pending = room.pendingTeamVoteResult;
  if (!pending) return;

  const approved = pending.result === 'approved';

  const record: TeamVoteRecord = {
    leaderId: players[room.currentLeaderIndex]?.id || '',
    team: room.selectedTeam,
    approvals: pending.approvals,
    rejections: pending.rejections,
    result: pending.result,
    round: (room.teamVoteRecords?.length || 0) + 1,
  };

  const records = [...(room.teamVoteRecords || []), record];
  const rejectionCount = approved ? 0 : (room.teamVoteRejections || 0) + 1;

  if (!approved && rejectionCount >= 5) {
    await update(roomRef(db, roomId), {
      phase: 'game-over',
      winner: 'evil',
      winReason: '5 consecutive team proposals were rejected!',
      teamVoteRecords: records,
      teamVoteRejections: rejectionCount,
      pendingTeamVoteResult: null,
      lastUpdated: Date.now(),
    });
    return;
  }

  const nextLeaderIndex = (room.currentLeaderIndex + 1) % players.length;

  if (approved) {
    const updates: Record<string, unknown> = {
      phase: 'quest',
      questVotePhase: false,
      teamVotePhase: false,
      teamVoteRecords: records,
      teamVoteRejections: rejectionCount,
      pendingTeamVoteResult: null,
      lastUpdated: Date.now(),
    };
    for (const p of players) {
      updates[`players/${p.id}/hasVoted`] = false;
      updates[`players/${p.id}/vote`] = null;
    }
    await update(roomRef(db, roomId), updates);
  } else {
    const updates: Record<string, unknown> = {
      phase: 'team-building',
      currentLeaderIndex: nextLeaderIndex,
      selectedTeam: [],
      teamVoteRecords: records,
      teamVoteRejections: rejectionCount,
      pendingTeamVoteResult: null,
      lastUpdated: Date.now(),
    };
    for (const p of players) {
      updates[`players/${p.id}/hasVoted`] = false;
      updates[`players/${p.id}/vote`] = null;
      updates[`players/${p.id}/isOnQuest`] = false;
    }
    await update(roomRef(db, roomId), updates);
  }
}

export async function startQuestVote(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const updates: Record<string, unknown> = {
    questVotePhase: true,
    lastUpdated: Date.now(),
  };
  for (const p of players) {
    if (room.selectedTeam.includes(p.id)) {
      updates[`players/${p.id}/hasVoted`] = false;
      updates[`players/${p.id}/vote`] = null;
    }
  }
  await update(roomRef(db, roomId), updates);
}

export async function castQuestVote(
  db: Database,
  roomId: string,
  playerId: string,
  vote: 'pass' | 'fail'
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    hasVoted: true,
    vote,
  });
}

export async function resolveQuestVote(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const questIndex = room.questNumber - 1;
  const count = players.length;

  const questPlayers = players.filter((p) => room.selectedTeam.includes(p.id));
  const failVotes = questPlayers.filter((p) => p.vote === 'fail').length;
  const needsDouble = QUEST4_DOUBLE_FAIL[count] && questIndex === 3;
  const failed = needsDouble ? failVotes >= 2 : failVotes >= 1;

  const result: 'success' | 'fail' = failed ? 'fail' : 'success';

  const record: QuestRecord = {
    questNumber: room.questNumber,
    teamSize: room.selectedTeam.length,
    team: room.selectedTeam,
    votes: questPlayers.map((p) => ({ playerId: p.id, vote: p.vote as 'pass' | 'fail' })),
    result,
    failCount: failVotes,
  };

  const questResults = [...(room.questResults || []), result];
  const questRecords = [...(room.questRecords || []), record];

  const goodWins = questResults.filter((r) => r === 'success').length;
  const evilWins = questResults.filter((r) => r === 'fail').length;

  let nextPhase: GameRoom['phase'] = 'quest-result';
  let winner: 'good' | 'evil' | undefined;
  let winReason: string | undefined;

  if (evilWins >= 3) {
    nextPhase = 'game-over';
    winner = 'evil';
    winReason = 'Evil failed 3 quests!';
  } else if (goodWins >= 3) {
    // Check if Assassin exists
    const hasAssassin = players.some((p) => p.role === 'Assassin');
    if (hasAssassin) {
      nextPhase = 'assassination';
    } else {
      nextPhase = 'game-over';
      winner = 'good';
      winReason = 'Good passed 3 quests and there is no Assassin!';
    }
  }

  const updates: Record<string, unknown> = {
    phase: nextPhase,
    questResults,
    questRecords,
    questVotePhase: false,
    lastUpdated: Date.now(),
    ...(winner ? { winner, winReason } : {}),
  };

  // Reset votes
  for (const p of players) {
    updates[`players/${p.id}/hasVoted`] = false;
    updates[`players/${p.id}/vote`] = null;
  }

  await update(roomRef(db, roomId), updates);
}

export async function proceedAfterQuestResult(
  db: Database,
  roomId: string,
  room: GameRoom
): Promise<void> {
  const players = Object.values(room.players);
  const nextLeaderIndex = (room.currentLeaderIndex + 1) % players.length;

  const updates: Record<string, unknown> = {
    phase: 'team-building',
    questNumber: room.questNumber + 1,
    currentLeaderIndex: nextLeaderIndex,
    selectedTeam: [],
    teamVoteRejections: 0,
    lastUpdated: Date.now(),
  };

  for (const p of players) {
    updates[`players/${p.id}/isOnQuest`] = false;
    updates[`players/${p.id}/hasVoted`] = false;
    updates[`players/${p.id}/vote`] = null;
  }

  await update(roomRef(db, roomId), updates);
}

export async function submitAssassination(
  db: Database,
  roomId: string,
  targetId: string
): Promise<void> {
  const snap = await get(roomRef(db, roomId));
  if (!snap.exists()) return;
  const room = snap.val() as GameRoom;
  const players = Object.values(room.players);
  const target = players.find((p) => p.id === targetId);

  const gotMerlin = target?.role === 'Merlin';
  const winner: 'good' | 'evil' = gotMerlin ? 'evil' : 'good';
  const winReason = gotMerlin
    ? `The Assassin correctly identified Merlin (${target?.name})! Evil wins!`
    : `The Assassin failed to identify Merlin! Good wins!`;

  await update(roomRef(db, roomId), {
    phase: 'game-over',
    assassinTarget: targetId,
    winner,
    winReason,
    lastUpdated: Date.now(),
  });
}

export async function resetRoom(db: Database, roomId: string, room: GameRoom): Promise<void> {
  const players = Object.values(room.players);
  const updates: Record<string, unknown> = {
    phase: 'lobby',
    availableRoles: [],
    currentLeaderIndex: 0,
    questNumber: 1,
    questResults: [],
    questRecords: [],
    teamVoteRejections: 0,
    teamVoteRecords: [],
    selectedTeam: [],
    winner: null,
    winReason: null,
    assassinTarget: null,
    questVotePhase: false,
    teamVotePhase: false,
    lastUpdated: Date.now(),
  };

  for (const p of players) {
    updates[`players/${p.id}/role`] = null;
    updates[`players/${p.id}/team`] = null;
    updates[`players/${p.id}/hasVoted`] = false;
    updates[`players/${p.id}/vote`] = null;
    updates[`players/${p.id}/isOnQuest`] = false;
    updates[`players/${p.id}/cardVisible`] = false;
    updates[`players/${p.id}/isReady`] = false;
  }

  await update(roomRef(db, roomId), updates);
}

export async function toggleCardVisibility(
  db: Database,
  roomId: string,
  playerId: string,
  visible: boolean
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    cardVisible: visible,
  });
}

export async function updatePlayerReady(
  db: Database,
  roomId: string,
  playerId: string,
  ready: boolean
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/players/${playerId}`), {
    isReady: ready,
  });
}
