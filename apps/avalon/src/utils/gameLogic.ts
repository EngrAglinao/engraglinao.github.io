import type { GameState, Player, Role, Quest } from '../types/game';
import {
  QUEST_CONFIGS,
  PLAYER_ROLE_COUNTS,
  ROLE_INFO,
  MAX_CONSECUTIVE_REJECTS,
} from '../constants/gameConfig';

export function assignRoles(players: Player[], availableRoles: Role[]): Player[] {
  const count = players.length;
  const roleCounts = PLAYER_ROLE_COUNTS[count];
  if (!roleCounts) return players;

  // Separate available roles into good and evil
  const goodRoles = availableRoles.filter((r) => ROLE_INFO[r].team === 'good');
  const evilRoles = availableRoles.filter((r) => ROLE_INFO[r].team === 'evil');

  // Pad with generic roles if needed
  const finalGoodRoles: Role[] = [...goodRoles];
  while (finalGoodRoles.length < roleCounts.good) {
    finalGoodRoles.push('LoyalServant');
  }

  const finalEvilRoles: Role[] = [...evilRoles];
  while (finalEvilRoles.length < roleCounts.evil) {
    finalEvilRoles.push('Minion');
  }

  // Trim if too many
  const assignedRoles: Role[] = [
    ...finalGoodRoles.slice(0, roleCounts.good),
    ...finalEvilRoles.slice(0, roleCounts.evil),
  ];

  // Shuffle
  const shuffled = [...assignedRoles].sort(() => Math.random() - 0.5);

  return players.map((p, i) => ({
    ...p,
    role: shuffled[i],
    team: ROLE_INFO[shuffled[i]].team,
  }));
}

export function createInitialQuests(playerCount: number): Quest[] {
  const configs = QUEST_CONFIGS[playerCount] || QUEST_CONFIGS[5];
  return configs.map((config, i) => ({
    id: i + 1,
    requiredPlayers: config.players,
    failsRequired: config.failsRequired,
    teamProposal: [],
    votes: {},
    questVotes: {},
    result: null,
    rejectCount: 0,
  }));
}

export function getNextLeaderId(players: Player[], currentLeaderId: string): string {
  const idx = players.findIndex((p) => p.id === currentLeaderId);
  const next = (idx + 1) % players.length;
  return players[next].id;
}

export function calculateTeamVoteResult(
  votes: Record<string, string | null>,
  playerCount: number
): 'approved' | 'rejected' {
  const approvals = Object.values(votes).filter((v) => v === 'approve').length;
  return approvals > playerCount / 2 ? 'approved' : 'rejected';
}

export function calculateQuestResult(
  questVotes: Record<string, string | null>,
  failsRequired: number
): 'success' | 'fail' {
  const fails = Object.values(questVotes).filter((v) => v === 'fail').length;
  return fails >= failsRequired ? 'fail' : 'success';
}

export function getVisibleEvilPlayers(viewer: Player, allPlayers: Player[]): string[] {
  if (!viewer.role) return [];

  const role = viewer.role;

  if (role === 'Merlin') {
    // Merlin sees all evil except Mordred
    return allPlayers
      .filter((p) => p.team === 'evil' && p.role !== 'Mordred')
      .map((p) => p.id);
  }

  if (role === 'Percival') {
    // Percival sees Merlin and Morgana (but doesn't know which is which)
    return allPlayers
      .filter((p) => p.role === 'Merlin' || p.role === 'Morgana')
      .map((p) => p.id);
  }

  if (role === 'Morgana') {
    // Morgana sees Merlin + other evil (not Oberon)
    return allPlayers
      .filter(
        (p) =>
          (p.team === 'evil' && p.role !== 'Oberon' && p.id !== viewer.id) ||
          p.role === 'Merlin'
      )
      .map((p) => p.id);
  }

  if (role === 'Assassin' || role === 'Minion') {
    // See other evil allies (not Oberon, not self)
    return allPlayers
      .filter((p) => p.team === 'evil' && p.role !== 'Oberon' && p.id !== viewer.id)
      .map((p) => p.id);
  }

  if (role === 'Mordred') {
    // See other evil allies (not Oberon, not self)
    return allPlayers
      .filter((p) => p.team === 'evil' && p.role !== 'Oberon' && p.id !== viewer.id)
      .map((p) => p.id);
  }

  return [];
}

export function getKnowledgeLabel(viewerRole: Role, targetRole: Role): string {
  if (viewerRole === 'Merlin') {
    return '⚠️ Evil Minion';
  }
  if (viewerRole === 'Percival') {
    if (targetRole === 'Merlin' || targetRole === 'Morgana') {
      return '🔮 Merlin or Morgana?';
    }
  }
  if (viewerRole === 'Morgana') {
    if (targetRole === 'Merlin') return '🔮 Merlin';
    return '🐍 Evil Ally';
  }
  if (['Assassin', 'Minion', 'Mordred'].includes(viewerRole)) {
    return '🐍 Evil Ally';
  }
  return '';
}

export function checkGameOver(state: GameState): GameState {
  const goodWins = state.quests.filter((q) => q.result === 'success').length;
  const evilWins = state.quests.filter((q) => q.result === 'fail').length;

  if (goodWins >= 3) {
    // Good wins quests — check if assassin can strike
    const hasAssassin = state.players.some((p) => p.role === 'Assassin');
    if (hasAssassin) {
      return { ...state, phase: 'assassin_phase', goodScore: goodWins, evilScore: evilWins };
    }
    return { ...state, phase: 'game_over', winner: 'good', goodScore: goodWins, evilScore: evilWins };
  }

  if (evilWins >= 3) {
    return { ...state, phase: 'game_over', winner: 'evil', goodScore: goodWins, evilScore: evilWins };
  }

  return { ...state, goodScore: goodWins, evilScore: evilWins };
}

export function processTeamVote(state: GameState): GameState {
  const currentQuest = state.quests[state.currentQuestIndex];
  const result = calculateTeamVoteResult(
    currentQuest.votes as Record<string, string | null>,
    state.players.length
  );

  if (result === 'approved') {
    const updatedQuests = state.quests.map((q, i) =>
      i === state.currentQuestIndex ? { ...q } : q
    );
    return {
      ...state,
      quests: updatedQuests,
      phase: 'team_vote_result',
      consecutiveRejects: 0,
    };
  } else {
    const newRejectCount = state.consecutiveRejects + 1;
    const updatedQuests = state.quests.map((q, i) =>
      i === state.currentQuestIndex
        ? { ...q, rejectCount: q.rejectCount + 1 }
        : q
    );

    if (newRejectCount >= MAX_CONSECUTIVE_REJECTS) {
      // Hammer — evil wins
      return {
        ...state,
        quests: updatedQuests,
        phase: 'game_over',
        winner: 'evil',
        hammerUsed: true,
        consecutiveRejects: newRejectCount,
      };
    }

    return {
      ...state,
      quests: updatedQuests,
      phase: 'team_vote_result',
      consecutiveRejects: newRejectCount,
      currentLeaderId: getNextLeaderId(state.players, state.currentLeaderId),
    };
  }
}

export function processQuestVote(state: GameState): GameState {
  const currentQuest = state.quests[state.currentQuestIndex];
  const result = calculateQuestResult(
    currentQuest.questVotes as Record<string, string | null>,
    currentQuest.failsRequired
  );

  const updatedQuests = state.quests.map((q, i) =>
    i === state.currentQuestIndex ? { ...q, result } : q
  );

  const newState: GameState = {
    ...state,
    quests: updatedQuests,
    phase: 'quest_vote_result',
  };

  return checkGameOver(newState);
}
