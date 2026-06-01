export type Role =
  | 'merlin'
  | 'percival'
  | 'loyal_servant'
  | 'morgana'
  | 'assassin'
  | 'mordred'
  | 'oberon'
  | 'minion';

export type Alignment = 'good' | 'evil';

export type GamePhase =
  | 'lobby'
  | 'night'
  | 'team_selection'
  | 'team_vote'
  | 'quest_vote'
  | 'quest_result'
  | 'assassination'
  | 'game_over';

export interface RoleDefinition {
  id: Role;
  name: string;
  alignment: Alignment;
  description: string;
  nightInfo: string;
  image: string;
  minPlayers: number;
  special: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  role?: Role;
  isHost: boolean;
  isConnected: boolean;
  ipAddress?: string;
  hasVoted?: boolean;
  vote?: string;
  isOnQuest?: boolean;
  isSelected?: boolean;
}

export interface QuestResult {
  round: number;
  success: boolean;
  teamSize: number;
  failVotes: number;
  team: string[];
}

export interface GameState {
  id: string;
  phase: GamePhase;
  players: Record<string, Player>;
  hostId: string;
  currentRound: number;
  currentLeaderIndex: number;
  rejectedVotes: number;
  selectedTeam: string[];
  questResults: QuestResult[];
  availableRoles: Role[];
  teamVotes: Record<string, 'approve' | 'reject'>;
  questVotes: Record<string, 'success' | 'fail'>;
  assassinTarget?: string;
  winner?: 'good' | 'evil';
  winReason?: string;
  nightPhaseComplete?: boolean;
  gameName: string;
  gameIcon?: string;
  createdAt: number;
  currentLeaderId?: string;
}

export interface RoomInfo {
  id: string;
  hostId: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'playing';
  createdAt: number;
}

export const QUEST_TEAM_SIZES: Record<number, number[]> = {
  5:  [2, 3, 2, 3, 3],
  6:  [2, 3, 4, 3, 4],
  7:  [2, 3, 3, 4, 4],
  8:  [3, 4, 4, 5, 5],
  9:  [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

export const QUEST_FAIL_REQUIRED: Record<number, number[]> = {
  5:  [1, 1, 1, 1, 1],
  6:  [1, 1, 1, 1, 1],
  7:  [1, 1, 1, 2, 1],
  8:  [1, 1, 1, 2, 1],
  9:  [1, 1, 1, 2, 1],
  10: [1, 1, 1, 2, 1],
};

export const PLAYER_ROLE_COUNTS: Record<number, { good: number; evil: number }> = {
  5:  { good: 3, evil: 2 },
  6:  { good: 4, evil: 2 },
  7:  { good: 4, evil: 3 },
  8:  { good: 5, evil: 3 },
  9:  { good: 6, evil: 3 },
  10: { good: 6, evil: 4 },
};

export const ROLE_DEFINITIONS: Record<Role, RoleDefinition> = {
  merlin: {
    id: 'merlin',
    name: 'Merlin',
    alignment: 'good',
    description: 'Knows who the evil players are (except Mordred). Must guide the good team without revealing identity.',
    nightInfo: 'You see all Evil players except Mordred.',
    image: '/cards/merlin.png',
    minPlayers: 5,
    special: true,
  },
  percival: {
    id: 'percival',
    name: 'Percival',
    alignment: 'good',
    description: 'Sees two players — Merlin and Morgana — but does not know which is which.',
    nightInfo: 'You see Merlin and Morgana, but cannot tell them apart.',
    image: '/cards/percival.png',
    minPlayers: 5,
    special: true,
  },
  loyal_servant: {
    id: 'loyal_servant',
    name: 'Loyal Servant',
    alignment: 'good',
    description: 'A loyal knight of Arthur with no special knowledge. Use logic and deduction to root out evil.',
    nightInfo: 'You have no special knowledge. Use your wits.',
    image: '/cards/loyal_servant.png',
    minPlayers: 5,
    special: false,
  },
  morgana: {
    id: 'morgana',
    name: 'Morgana',
    alignment: 'evil',
    description: 'Evil sorceress who appears as Merlin to Percival. Knows fellow evil allies.',
    nightInfo: 'You appear as Merlin to Percival. You know your evil allies.',
    image: '/cards/morgana.png',
    minPlayers: 5,
    special: true,
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    alignment: 'evil',
    description: 'If Good succeeds 3 quests, the Assassin gets one chance to identify and kill Merlin.',
    nightInfo: 'If Good wins, you may assassinate Merlin to steal victory.',
    image: '/cards/assassin.png',
    minPlayers: 5,
    special: true,
  },
  mordred: {
    id: 'mordred',
    name: 'Mordred',
    alignment: 'evil',
    description: 'Hidden from Merlin. Knows evil allies. The most dangerous hidden enemy.',
    nightInfo: 'Merlin cannot see you. You know your evil allies.',
    image: '/cards/mordred.png',
    minPlayers: 7,
    special: true,
  },
  oberon: {
    id: 'oberon',
    name: 'Oberon',
    alignment: 'evil',
    description: 'Evil but unknown to other evil players. Neither knows nor is known by evil allies.',
    nightInfo: 'You are alone. Other evil players do not know you, and you do not know them.',
    image: '/cards/oberon.png',
    minPlayers: 7,
    special: true,
  },
  minion: {
    id: 'minion',
    name: 'Minion of Mordred',
    alignment: 'evil',
    description: 'A generic evil player who knows fellow evil allies (except Oberon).',
    nightInfo: 'You know your evil allies (except Oberon).',
    image: '/cards/minion.png',
    minPlayers: 5,
    special: false,
  },
};

export const AVATARS = [
  '👑', '⚔️', '🛡️', '🏹', '🔮', '🗡️', '🪄', '🏰', '⚡', '🌙',
  '🌟', '🦅', '🐉', '🍀', '🔱', '🎭', '🌹', '🦁', '🦊', '🐺',
];
