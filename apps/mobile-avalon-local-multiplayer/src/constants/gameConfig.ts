import type { Role, QuestConfig } from '../types/game';

export const ROLE_INFO: Record<
  Role,
  {
    team: 'good' | 'evil';
    description: string;
    color: string;
    bgGradient: string;
    icon: string;
    seeInfo: string;
  }
> = {
  Merlin: {
    team: 'good',
    description: 'Servant of Arthur. Knows the evil minions, but must remain hidden.',
    color: '#60a5fa',
    bgGradient: 'from-blue-900 via-blue-800 to-indigo-900',
    icon: '🔮',
    seeInfo: 'You see all Evil players (except Mordred).',
  },
  Percival: {
    team: 'good',
    description: "Loyal knight who knows Merlin's identity, but Morgana confuses him.",
    color: '#34d399',
    bgGradient: 'from-emerald-900 via-green-800 to-teal-900',
    icon: '⚔️',
    seeInfo: 'You see two players who could be Merlin or Morgana — you must figure out who is who.',
  },
  LoyalServant: {
    team: 'good',
    description: 'A faithful servant of Arthur with no special knowledge.',
    color: '#a78bfa',
    bgGradient: 'from-violet-900 via-purple-800 to-violet-900',
    icon: '🛡️',
    seeInfo: 'You have no special knowledge. Trust your instincts.',
  },
  Morgana: {
    team: 'evil',
    description: 'Appears as Merlin to Percival. A cunning deceiver.',
    color: '#f472b6',
    bgGradient: 'from-pink-900 via-rose-800 to-pink-900',
    icon: '🌙',
    seeInfo: "You see Merlin's identity. Evil allies are revealed to you.",
  },
  Assassin: {
    team: 'evil',
    description: 'If Good wins, the Assassin may identify and kill Merlin.',
    color: '#f87171',
    bgGradient: 'from-red-900 via-rose-900 to-red-900',
    icon: '🗡️',
    seeInfo: 'You see your evil allies (except Oberon). Win by killing Merlin if Good succeeds.',
  },
  Mordred: {
    team: 'evil',
    description: 'Hidden from Merlin. The ultimate villain.',
    color: '#fb923c',
    bgGradient: 'from-orange-900 via-red-900 to-orange-900',
    icon: '💀',
    seeInfo: 'Merlin cannot see you. You see your evil allies (except Oberon).',
  },
  Oberon: {
    team: 'evil',
    description: 'Evil but unknown to other evil players. Acts alone.',
    color: '#facc15',
    bgGradient: 'from-yellow-900 via-amber-800 to-yellow-900',
    icon: '👁️',
    seeInfo: 'You do not know your evil allies, and they do not know you.',
  },
  Minion: {
    team: 'evil',
    description: 'A minion of Mordred with no special ability.',
    color: '#e879f9',
    bgGradient: 'from-fuchsia-900 via-purple-900 to-fuchsia-900',
    icon: '🐍',
    seeInfo: 'You see your evil allies (except Oberon).',
  },
};

// Quest player counts and fail requirements per player count
export const QUEST_CONFIGS: Record<number, QuestConfig[]> = {
  5: [
    { players: 2, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 2, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
  ],
  6: [
    { players: 2, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
  ],
  7: [
    { players: 2, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 2 },
    { players: 4, failsRequired: 1 },
  ],
  8: [
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 5, failsRequired: 2 },
    { players: 5, failsRequired: 1 },
  ],
  9: [
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 5, failsRequired: 2 },
    { players: 5, failsRequired: 1 },
  ],
  10: [
    { players: 3, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 4, failsRequired: 1 },
    { players: 5, failsRequired: 2 },
    { players: 5, failsRequired: 1 },
  ],
};

export const PLAYER_ROLE_COUNTS: Record<number, { good: number; evil: number }> = {
  5: { good: 3, evil: 2 },
  6: { good: 4, evil: 2 },
  7: { good: 4, evil: 3 },
  8: { good: 5, evil: 3 },
  9: { good: 6, evil: 3 },
  10: { good: 6, evil: 4 },
};

export const REQUIRED_GOOD_ROLES: Role[] = ['Merlin', 'LoyalServant'];
export const REQUIRED_EVIL_ROLES: Role[] = ['Assassin'];

export const OPTIONAL_GOOD_ROLES: Role[] = ['Percival'];
export const OPTIONAL_EVIL_ROLES: Role[] = ['Morgana', 'Mordred', 'Oberon', 'Minion'];

export const AVATARS = ['🧙', '⚔️', '🛡️', '👑', '🗡️', '🏹', '🔮', '🦁', '🐉', '🌙', '⚡', '🌊', '🔥', '🌿', '💎'];

export const MIN_PLAYERS = 5;
export const MAX_PLAYERS = 10;
export const MAX_CONSECUTIVE_REJECTS = 5;
