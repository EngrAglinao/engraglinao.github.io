export type CharacterName =
  | 'Merlin'
  | 'Percival'
  | 'Morgana'
  | 'Mordred'
  | 'Oberon'
  | 'Assassin'
  | 'Loyal Servant'
  | 'Minion of Mordred';

export type Team = 'good' | 'evil';

export type GamePhase =
  | 'lobby'
  | 'night'
  | 'day'
  | 'team_vote'
  | 'quest'
  | 'assassination'
  | 'end';

export interface Character {
  name: CharacterName;
  team: Team;
  description: string;
  image: string;
  sees: CharacterName[];
  seenAs?: string;
  special?: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isHost: boolean;
  isAdmin: boolean;
  character?: CharacterName;
  connected: boolean;
  hasVoted?: boolean;
  vote?: string;
  isOnQuest?: boolean;
  isLeader?: boolean;
}

export interface QuestResult {
  round: number;
  success: boolean;
  teamSize: number;
  fails: number;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: Record<string, Player>;
  phase: GamePhase;
  questResults: QuestResult[];
  currentRound: number;
  currentLeaderIndex: number;
  teamProposal: string[];
  votes: Record<string, 'approve' | 'reject'>;
  questVotes: Record<string, 'success' | 'fail'>;
  consecutiveRejections: number;
  assassinTarget?: string;
  winner?: Team;
  enabledCharacters: CharacterName[];
  revealRoles?: boolean;
  nightPhaseComplete?: boolean;
  createdAt: number;
  gameStarted: boolean;
}

export interface AppSettings {
  gameName: string;
  gameIcon: string;
}

// Quest team sizes per player count [round1, round2, round3, round4, round5]
export const QUEST_SIZES: Record<number, number[]> = {
  5:  [2, 3, 2, 3, 3],
  6:  [2, 3, 4, 3, 4],
  7:  [2, 3, 3, 4, 4],
  8:  [3, 4, 4, 5, 5],
  9:  [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

// Number of fails required per quest per player count
export const FAILS_REQUIRED: Record<number, number[]> = {
  5:  [1, 1, 1, 1, 1],
  6:  [1, 1, 1, 1, 1],
  7:  [1, 1, 1, 2, 1],
  8:  [1, 1, 1, 2, 1],
  9:  [1, 1, 1, 2, 1],
  10: [1, 1, 1, 2, 1],
};

export const ALL_CHARACTERS: Character[] = [
  {
    name: 'Merlin',
    team: 'good',
    description: 'Knows all Evil players except Mordred. Must stay hidden from the Assassin.',
    image: '/images/merlin.jpg',
    sees: ['Morgana', 'Oberon', 'Assassin', 'Minion of Mordred'],
    special: 'If Good wins, Assassin may guess Merlin. If correct, Evil wins.',
  },
  {
    name: 'Percival',
    team: 'good',
    description: 'Sees Merlin and Morgana but cannot tell which is which.',
    image: '/images/percival.jpg',
    sees: ['Merlin', 'Morgana'],
    seenAs: 'Merlin or Morgana (unknown)',
  },
  {
    name: 'Morgana',
    team: 'evil',
    description: 'Appears as Merlin to Percival. Knows other Evil players.',
    image: '/images/morgana.jpg',
    sees: ['Assassin', 'Mordred', 'Minion of Mordred'],
    seenAs: 'Merlin (to Percival)',
    special: 'Confuses Percival about who the real Merlin is.',
  },
  {
    name: 'Mordred',
    team: 'evil',
    description: 'Hidden from Merlin. Knows other Evil players.',
    image: '/images/mordred.jpg',
    sees: ['Morgana', 'Assassin', 'Minion of Mordred'],
    special: 'Merlin cannot see Mordred — the ultimate hidden threat.',
  },
  {
    name: 'Oberon',
    team: 'evil',
    description: 'Does not know other Evil players, and they do not know Oberon.',
    image: '/images/oberon.jpg',
    sees: [],
    special: 'Completely isolated from the Evil team. A rogue agent.',
  },
  {
    name: 'Assassin',
    team: 'evil',
    description: 'Knows Evil teammates. If Good wins 3 quests, may assassinate Merlin.',
    image: '/images/assassin.jpg',
    sees: ['Morgana', 'Mordred', 'Minion of Mordred'],
    special: 'If Assassin correctly identifies Merlin, Evil wins despite quest results.',
  },
  {
    name: 'Loyal Servant',
    team: 'good',
    description: 'A loyal servant of King Arthur with no special knowledge.',
    image: '/images/loyal_servant.jpg',
    sees: [],
  },
  {
    name: 'Minion of Mordred',
    team: 'evil',
    description: 'A minion serving Mordred. Knows all Evil teammates.',
    image: '/images/minion.jpg',
    sees: ['Morgana', 'Mordred', 'Assassin'],
  },
];

export function getCharacter(name: CharacterName): Character {
  return ALL_CHARACTERS.find(c => c.name === name)!;
}

// Generate character assignment for a given player count & enabled characters
export function assignCharacters(
  playerCount: number,
  enabledSpecials: CharacterName[]
): CharacterName[] {
  const goodSpecials: CharacterName[] = ['Merlin', 'Percival'].filter(c =>
    enabledSpecials.includes(c as CharacterName)
  ) as CharacterName[];

  const evilSpecials: CharacterName[] = ['Morgana', 'Mordred', 'Oberon', 'Assassin'].filter(c =>
    enabledSpecials.includes(c as CharacterName)
  ) as CharacterName[];

  const evilCount = playerCount <= 6 ? 2 : playerCount <= 9 ? 3 : 4;
  const goodCount = playerCount - evilCount;

  const evilRoles: CharacterName[] = [...evilSpecials];
  while (evilRoles.length < evilCount) {
    evilRoles.push('Minion of Mordred');
  }
  evilRoles.splice(evilCount);

  const goodRoles: CharacterName[] = [...goodSpecials];
  while (goodRoles.length < goodCount) {
    goodRoles.push('Loyal Servant');
  }
  goodRoles.splice(goodCount);

  // Ensure Assassin is always in evil if Merlin is enabled and no other evil special
  if (
    goodSpecials.includes('Merlin') &&
    !evilRoles.includes('Assassin') &&
    evilRoles.includes('Minion of Mordred')
  ) {
    const idx = evilRoles.indexOf('Minion of Mordred');
    evilRoles[idx] = 'Assassin';
  }

  return shuffle([...goodRoles, ...evilRoles]);
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
