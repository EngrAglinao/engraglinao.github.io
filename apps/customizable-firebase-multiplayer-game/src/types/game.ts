export type Role =
  | 'Merlin'
  | 'Percival'
  | 'Loyal Servant'
  | 'Assassin'
  | 'Morgana'
  | 'Mordred'
  | 'Oberon'
  | 'Minion';

export type Team = 'good' | 'evil';

export type GamePhase =
  | 'lobby'
  | 'role-reveal'
  | 'team-building'
  | 'team-vote'
  | 'team-vote-result'
  | 'quest'
  | 'quest-result'
  | 'assassination'
  | 'game-over';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  role?: Role;
  team?: Team;
  isReady: boolean;
  hasVoted: boolean;
  vote?: 'approve' | 'reject' | 'pass' | 'fail';
  isOnQuest?: boolean;
  cardVisible?: boolean;
}

export interface QuestRecord {
  questNumber: number;
  teamSize: number;
  team: string[];
  votes: { playerId: string; vote: 'pass' | 'fail' }[];
  result: 'success' | 'fail';
  failCount: number;
}

export interface TeamVoteRecord {
  leaderId: string;
  team: string[];
  approvals: number;
  rejections: number;
  result: 'approved' | 'rejected';
  round: number;
}

export interface GameRoom {
  id: string;
  hostId: string;
  players: { [playerId: string]: Player };
  phase: GamePhase;
  availableRoles: Role[];
  currentLeaderIndex: number;
  questNumber: number; // 1-5
  questResults: ('success' | 'fail')[];
  questRecords: QuestRecord[];
  teamVoteRejections: number; // consecutive rejections
  teamVoteRecords: TeamVoteRecord[];
  selectedTeam: string[]; // player IDs
  assassinTarget?: string;
  winner?: 'good' | 'evil';
  winReason?: string;
  createdAt: number;
  lastUpdated: number;
  questVotePhase?: boolean;
  teamVotePhase?: boolean;
  assassinationPhase?: boolean;
  pendingTeamVoteResult?: {
    approvals: number;
    rejections: number;
    result: 'approved' | 'rejected';
    votes: { playerId: string; vote: string }[];
  };
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Quest team sizes per player count
export const QUEST_SIZES: { [playerCount: number]: number[] } = {
  5:  [2, 3, 2, 3, 3],
  6:  [2, 3, 4, 3, 4],
  7:  [2, 3, 3, 4, 4],
  8:  [3, 4, 4, 5, 5],
  9:  [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};

// Number of evil players per total player count
export const EVIL_COUNT: { [playerCount: number]: number } = {
  5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4,
};

// Whether quest 4 needs 2 fails (only for 7+ players)
export const QUEST4_DOUBLE_FAIL: { [playerCount: number]: boolean } = {
  5: false, 6: false, 7: true, 8: true, 9: true, 10: true,
};

export const ROLE_INFO: {
  [key in Role]: { team: Team; description: string; color: string; icon: string };
} = {
  Merlin: {
    team: 'good',
    description: 'You know all evil players except Mordred. Guide the good team without revealing yourself.',
    color: 'text-blue-400',
    icon: '🔮',
  },
  Percival: {
    team: 'good',
    description: 'You see two players: one is Merlin, one is Morgana. Figure out which is which!',
    color: 'text-cyan-400',
    icon: '🛡️',
  },
  'Loyal Servant': {
    team: 'good',
    description: 'You are a loyal servant of Arthur. Help the good team pass quests.',
    color: 'text-green-400',
    icon: '⚔️',
  },
  Assassin: {
    team: 'evil',
    description: 'You are the Assassin. If good wins, you get one chance to identify Merlin!',
    color: 'text-red-500',
    icon: '🗡️',
  },
  Morgana: {
    team: 'evil',
    description: 'You appear as Merlin to Percival. Deceive the good team!',
    color: 'text-purple-500',
    icon: '🌙',
  },
  Mordred: {
    team: 'evil',
    description: 'Merlin cannot see you! You are invisible to their power.',
    color: 'text-orange-500',
    icon: '💀',
  },
  Oberon: {
    team: 'evil',
    description: 'You do not know the other evil players and they do not know you.',
    color: 'text-pink-500',
    icon: '👁️',
  },
  Minion: {
    team: 'evil',
    description: 'You are a Minion of Mordred. Work with your evil allies to fail quests.',
    color: 'text-red-400',
    icon: '😈',
  },
};

export const AVATARS = [
  '🧙', '🤴', '👸', '🧝', '🧚', '🦹', '🧜', '🧛',
  '🐉', '🦄', '🦊', '🐺', '🦁', '🐯', '🦅', '🦋',
  '⚔️', '🛡️', '🏹', '🔱', '🌟', '🌙', '☀️', '🔮',
];
