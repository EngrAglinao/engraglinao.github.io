import {
  ref,
  set,
  get,
  update,
  onValue,
  off,
  onDisconnect,
  Database,
} from 'firebase/database';
import {
  Room,
  Player,
  CharacterName,
  assignCharacters,
  generateRoomCode,
  QUEST_SIZES,
  FAILS_REQUIRED,
  getCharacter,
  shuffle,
} from './types';

// ─── Room ────────────────────────────────────────────────────────────────────

export async function createRoom(
  db: Database,
  hostPlayer: Player,
  enabledCharacters: CharacterName[]
): Promise<Room> {
  const code = generateRoomCode();
  const roomId = `room_${code}`;

  const room: Room = {
    id: roomId,
    code,
    hostId: hostPlayer.id,
    players: { [hostPlayer.id]: hostPlayer },
    phase: 'lobby',
    questResults: [],
    currentRound: 0,
    currentLeaderIndex: 0,
    teamProposal: [],
    votes: {},
    questVotes: {},
    consecutiveRejections: 0,
    enabledCharacters,
    createdAt: Date.now(),
    gameStarted: false,
  };

  await set(ref(db, `rooms/${roomId}`), room);

  // Handle host disconnect
  const connectedRef = ref(db, `rooms/${roomId}/players/${hostPlayer.id}/connected`);
  onDisconnect(connectedRef).set(false);

  return room;
}

export async function joinRoom(
  db: Database,
  code: string,
  player: Player
): Promise<Room | null> {
  const roomId = `room_${code.toUpperCase()}`;
  const snap = await get(ref(db, `rooms/${roomId}`));
  if (!snap.exists()) return null;

  const room = snap.val() as Room;
  if (room.gameStarted) return null;

  const playerCount = Object.keys(room.players || {}).length;
  if (playerCount >= 10) return null;

  player.isHost = false;
  await set(ref(db, `rooms/${roomId}/players/${player.id}`), player);

  // Handle disconnect
  const connectedRef = ref(db, `rooms/${roomId}/players/${player.id}/connected`);
  onDisconnect(connectedRef).set(false);

  return { ...room, players: { ...room.players, [player.id]: player } };
}

export function subscribeRoom(
  db: Database,
  roomId: string,
  cb: (room: Room | null) => void
) {
  const r = ref(db, `rooms/${roomId}`);
  onValue(r, snap => {
    cb(snap.exists() ? (snap.val() as Room) : null);
  });
  return () => off(r);
}

// ─── Game Start ──────────────────────────────────────────────────────────────

export async function startGame(db: Database, room: Room): Promise<void> {
  const players = Object.values(room.players).filter(p => p.connected !== false);
  const count = players.length;

  if (count < 5) throw new Error('Need at least 5 players');

  const roles = assignCharacters(count, room.enabledCharacters);
  const shuffledPlayers = shuffle(players);

  const updatedPlayers: Record<string, Player> = {};
  shuffledPlayers.forEach((p, i) => {
    updatedPlayers[p.id] = {
      ...p,
      character: roles[i],
      isLeader: i === 0,
    };
  });

  await update(ref(db, `rooms/${room.id}`), {
    players: updatedPlayers,
    phase: 'night',
    gameStarted: true,
    currentRound: 1,
    currentLeaderIndex: 0,
    teamProposal: [],
    votes: {},
    questVotes: {},
    questResults: [],
    consecutiveRejections: 0,
    revealRoles: false,
    nightPhaseComplete: false,
  });
}

// ─── Night Phase ─────────────────────────────────────────────────────────────

export async function completeNightPhase(db: Database, roomId: string): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), {
    nightPhaseComplete: true,
    phase: 'day',
  });
}

// ─── Team Proposal ───────────────────────────────────────────────────────────

export async function proposeTeam(
  db: Database,
  roomId: string,
  teamIds: string[]
): Promise<void> {
  await update(ref(db, `rooms/${roomId}`), {
    teamProposal: teamIds,
    phase: 'team_vote',
    votes: {},
  });
}

// ─── Team Vote ───────────────────────────────────────────────────────────────

export async function submitTeamVote(
  db: Database,
  roomId: string,
  playerId: string,
  vote: 'approve' | 'reject'
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/votes`), { [playerId]: vote });
}

export async function resolveTeamVote(
  db: Database,
  room: Room
): Promise<void> {
  const votes = room.votes || {};
  const approvals = Object.values(votes).filter(v => v === 'approve').length;
  const rejections = Object.values(votes).filter(v => v === 'reject').length;
  const players = Object.values(room.players);
  const playerCount = players.length;

  const approved = approvals > rejections;

  if (!approved) {
    const newRejections = (room.consecutiveRejections || 0) + 1;
    if (newRejections >= 5) {
      // Evil wins by consecutive rejections
      await update(ref(db, `rooms/${room.id}`), {
        winner: 'evil',
        phase: 'end',
        revealRoles: true,
        consecutiveRejections: newRejections,
      });
      return;
    }

    // Move to next leader
    const nextLeaderIdx = ((room.currentLeaderIndex || 0) + 1) % playerCount;
    const updatedPlayers = { ...room.players };
    players.forEach((p, i) => {
      updatedPlayers[p.id] = { ...p, isLeader: i === nextLeaderIdx };
    });

    await update(ref(db, `rooms/${room.id}`), {
      phase: 'day',
      teamProposal: [],
      votes: {},
      consecutiveRejections: newRejections,
      currentLeaderIndex: nextLeaderIdx,
      players: updatedPlayers,
    });
  } else {
    // Move to quest phase
    const updatedPlayers = { ...room.players };
    players.forEach(p => {
      updatedPlayers[p.id] = {
        ...p,
        isOnQuest: room.teamProposal.includes(p.id),
        hasVoted: false,
        vote: undefined,
      };
    });

    await update(ref(db, `rooms/${room.id}`), {
      phase: 'quest',
      questVotes: {},
      players: updatedPlayers,
      consecutiveRejections: 0,
    });
  }
}

// ─── Quest Vote ──────────────────────────────────────────────────────────────

export async function submitQuestVote(
  db: Database,
  roomId: string,
  playerId: string,
  vote: 'success' | 'fail'
): Promise<void> {
  await update(ref(db, `rooms/${roomId}/questVotes`), { [playerId]: vote });
}

export async function resolveQuestVote(
  db: Database,
  room: Room
): Promise<void> {
  const questVotes = room.questVotes || {};
  const fails = Object.values(questVotes).filter(v => v === 'fail').length;
  const playerCount = Object.values(room.players).length;
  const round = room.currentRound;
  const failsNeeded = (FAILS_REQUIRED[playerCount] || FAILS_REQUIRED[5])[round - 1] || 1;

  const questSuccess = fails < failsNeeded;

  const newResult = {
    round,
    success: questSuccess,
    teamSize: room.teamProposal.length,
    fails,
  };

  const questResults = [...(room.questResults || []), newResult];
  const goodWins = questResults.filter(r => r.success).length;
  const evilWins = questResults.filter(r => !r.success).length;

  const players = Object.values(room.players);
  const playersList = [...players];

  // Check win conditions
  if (evilWins >= 3) {
    await update(ref(db, `rooms/${room.id}`), {
      questResults,
      phase: 'end',
      winner: 'evil',
      revealRoles: true,
    });
    return;
  }

  if (goodWins >= 3) {
    // Check if Assassin exists
    const hasAssassin = players.some(p => p.character === 'Assassin');
    if (hasAssassin) {
      await update(ref(db, `rooms/${room.id}`), {
        questResults,
        phase: 'assassination',
      });
    } else {
      await update(ref(db, `rooms/${room.id}`), {
        questResults,
        phase: 'end',
        winner: 'good',
        revealRoles: true,
      });
    }
    return;
  }

  // Move to next round
  const nextRound = round + 1;
  const nextLeaderIdx = ((room.currentLeaderIndex || 0) + 1) % playersList.length;
  const updatedPlayers = { ...room.players };
  playersList.forEach((p, i) => {
    updatedPlayers[p.id] = {
      ...p,
      isLeader: i === nextLeaderIdx,
      isOnQuest: false,
      hasVoted: false,
      vote: undefined,
    };
  });

  await update(ref(db, `rooms/${room.id}`), {
    questResults,
    phase: 'day',
    currentRound: nextRound,
    currentLeaderIndex: nextLeaderIdx,
    teamProposal: [],
    votes: {},
    questVotes: {},
    players: updatedPlayers,
  });
}

// ─── Assassination ────────────────────────────────────────────────────────────

export async function submitAssassination(
  db: Database,
  room: Room,
  targetId: string
): Promise<void> {
  const target = room.players[targetId];
  const isMerlin = target?.character === 'Merlin';

  await update(ref(db, `rooms/${room.id}`), {
    assassinTarget: targetId,
    winner: isMerlin ? 'evil' : 'good',
    phase: 'end',
    revealRoles: true,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getVisiblePlayers(
  myCharacter: CharacterName,
  allPlayers: Player[]
): { player: Player; seenAs: string }[] {
  const char = getCharacter(myCharacter);
  const result: { player: Player; seenAs: string }[] = [];

  if (!char.sees || char.sees.length === 0) return result;

  allPlayers.forEach(p => {
    if (!p.character) return;
    const pChar = getCharacter(p.character);

    if (myCharacter === 'Percival') {
      if (p.character === 'Merlin' || p.character === 'Morgana') {
        result.push({ player: p, seenAs: 'Merlin?' });
      }
    } else if (char.sees.includes(p.character as CharacterName)) {
      result.push({ player: p, seenAs: pChar.name });
    }
  });

  return result;
}

export function getQuestSizes(playerCount: number): number[] {
  return QUEST_SIZES[playerCount] || QUEST_SIZES[5];
}

export async function resetRoom(db: Database, roomId: string): Promise<void> {
  await set(ref(db, `rooms/${roomId}`), null);
}
