import { Role, Player, GameState, PLAYER_ROLE_COUNTS, ROLE_DEFINITIONS, Alignment } from './types';

export function assignRoles(players: Player[], selectedRoles: Role[]): Record<string, Role> {
  const playerIds = Object.values(players).map(p => p.id);
  const count = playerIds.length;
  const { good: goodCount, evil: evilCount } = PLAYER_ROLE_COUNTS[count];

  const goodRoles = selectedRoles.filter(r => ROLE_DEFINITIONS[r].alignment === 'good');
  const evilRoles = selectedRoles.filter(r => ROLE_DEFINITIONS[r].alignment === 'evil');

  const finalGood: Role[] = [...goodRoles];
  while (finalGood.length < goodCount) finalGood.push('loyal_servant');

  const finalEvil: Role[] = [...evilRoles];
  while (finalEvil.length < evilCount) finalEvil.push('minion');

  const allRoles = shuffle([...finalGood.slice(0, goodCount), ...finalEvil.slice(0, evilCount)]);
  const shuffledPlayers = shuffle([...playerIds]);

  const assignments: Record<string, Role> = {};
  shuffledPlayers.forEach((pid, i) => {
    assignments[pid] = allRoles[i];
  });
  return assignments;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getVisibleEvil(role: Role, players: Record<string, Player>): string[] {
  const playerList = Object.values(players);
  switch (role) {
    case 'merlin':
      return playerList
        .filter(p => {
          if (!p.role) return false;
          const def = ROLE_DEFINITIONS[p.role];
          return def.alignment === 'evil' && p.role !== 'mordred';
        })
        .map(p => p.id);
    case 'percival':
      return playerList
        .filter(p => p.role === 'merlin' || p.role === 'morgana')
        .map(p => p.id);
    case 'morgana':
    case 'assassin':
    case 'mordred':
    case 'minion':
      return playerList
        .filter(p => {
          if (!p.role) return false;
          const def = ROLE_DEFINITIONS[p.role];
          return def.alignment === 'evil' && p.role !== 'oberon';
        })
        .map(p => p.id);
    case 'oberon':
      return [];
    default:
      return [];
  }
}

export function getNightMessage(role: Role, players: Record<string, Player>, myId: string): string {
  const visibleIds = getVisibleEvil(role, players);
  const visibleNames = visibleIds
    .filter(id => id !== myId)
    .map(id => players[id]?.name || 'Unknown');

  switch (role) {
    case 'merlin':
      if (visibleNames.length === 0) return 'You see no evil players (Mordred is hidden from you).';
      return `Evil players visible to you: ${visibleNames.join(', ')}`;
    case 'percival':
      if (visibleNames.length === 0) return 'You cannot see Merlin or Morgana.';
      return `These players are either Merlin or Morgana (you don't know which): ${visibleNames.join(', ')}`;
    case 'morgana':
      if (visibleNames.length === 0) return 'You have no evil allies visible.';
      return `Your evil allies: ${visibleNames.join(', ')}`;
    case 'assassin':
      if (visibleNames.length === 0) return 'You have no evil allies visible.';
      return `Your evil allies: ${visibleNames.join(', ')}`;
    case 'mordred':
      if (visibleNames.length === 0) return 'You have no evil allies visible.';
      return `Your evil allies: ${visibleNames.join(', ')}`;
    case 'minion':
      if (visibleNames.length === 0) return 'You have no evil allies visible.';
      return `Your evil allies: ${visibleNames.join(', ')}`;
    case 'oberon':
      return 'You are alone. No one knows you are evil, and you know no one.';
    case 'loyal_servant':
      return 'You have no special knowledge. Trust your instincts.';
    default:
      return '';
  }
}

export function checkWinCondition(state: GameState): { winner: Alignment; reason: string } | null {
  const successCount = state.questResults.filter(r => r.success).length;
  const failCount = state.questResults.filter(r => !r.success).length;

  if (failCount >= 3) {
    return { winner: 'evil', reason: 'Evil succeeded in failing 3 quests!' };
  }
  if (successCount >= 3) {
    return { winner: 'good', reason: 'Good succeeded 3 quests! But beware the Assassin...' };
  }
  if (state.rejectedVotes >= 5) {
    return { winner: 'evil', reason: '5 team votes rejected! Evil wins by default!' };
  }
  return null;
}

export function getPlayerAlignment(role: Role): Alignment {
  return ROLE_DEFINITIONS[role].alignment;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getDefaultRolesForCount(count: number): Role[] {
  const { good, evil } = PLAYER_ROLE_COUNTS[count] || { good: 3, evil: 2 };
  const defaults: Role[] = [];
  if (good >= 1) defaults.push('merlin');
  if (good >= 2) defaults.push('percival');
  if (evil >= 1) defaults.push('assassin');
  if (evil >= 2) defaults.push('morgana');
  if (evil >= 3) defaults.push('mordred');
  if (evil >= 4) defaults.push('oberon');
  return defaults;
}

export function canStartGame(playerCount: number): boolean {
  return playerCount >= 5 && playerCount <= 10;
}

export function getNextLeaderIndex(current: number, total: number): number {
  return (current + 1) % total;
}
