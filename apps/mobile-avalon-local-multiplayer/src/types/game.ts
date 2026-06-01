export type Role =
  | 'Merlin'
  | 'Percival'
  | 'LoyalServant'
  | 'Morgana'
  | 'Assassin'
  | 'Mordred'
  | 'Oberon'
  | 'Minion';

export type Team = 'good' | 'evil';

export type GamePhase =
  | 'lobby'
  | 'role_reveal'
  | 'team_selection'
  | 'team_vote'
  | 'team_vote_result'
  | 'quest_vote'
  | 'quest_vote_result'
  | 'quest_board'
  | 'assassin_phase'
  | 'game_over';

export type VoteOption = 'approve' | 'reject' | null;
export type QuestVote = 'success' | 'fail' | null;

export interface Player {
  id: string;
  name: string;
  avatar: string; // emoji
  isHost: boolean;
  isConnected: boolean;
  role?: Role;
  team?: Team;
}

export interface QuestConfig {
  players: number;
  failsRequired: number;
}

export interface Quest {
  id: number;
  requiredPlayers: number;
  failsRequired: number;
  teamProposal: string[]; // player IDs
  votes: Record<string, VoteOption>; // playerId -> vote
  questVotes: Record<string, QuestVote>; // playerId -> vote
  result: 'success' | 'fail' | null;
  rejectCount: number; // how many times team was rejected
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentLeaderId: string; // who is proposing the team
  quests: Quest[];
  currentQuestIndex: number;
  availableRoles: Role[];
  goodScore: number;
  evilScore: number;
  winner: 'good' | 'evil' | null;
  assassinTargetId: string | null;
  hammerUsed: boolean; // 5th rejection auto-fail
  voteHistoryVisible: boolean;
  consecutiveRejects: number;
  hostId: string;
  roomCode: string;
  cardHidden: Record<string, boolean>; // per-player card hidden state
  teamPickingDone: boolean;
}

export type NetworkMessage =
  | { type: 'GAME_STATE'; state: GameState }
  | { type: 'PLAYER_JOIN'; player: Player }
  | { type: 'PLAYER_DISCONNECT'; playerId: string }
  | { type: 'HOST_TRANSFER'; newHostId: string }
  | { type: 'PING' }
  | { type: 'PONG' };
