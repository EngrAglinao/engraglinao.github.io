import {
  ref, set, get, update, onValue, off, remove
} from 'firebase/database';
import { getDb } from './firebase';
import { GameState, Player, RoomInfo } from './types';

function db() {
  const d = getDb();
  if (!d) throw new Error('Firebase not initialized');
  return d;
}

// ─── ROOMS ────────────────────────────────────────────────────────────────────

export async function createRoom(roomId: string, state: GameState): Promise<void> {
  await set(ref(db(), `rooms/${roomId}`), state);
}

export async function getRoomState(roomId: string): Promise<GameState | null> {
  const snap = await get(ref(db(), `rooms/${roomId}`));
  return snap.exists() ? (snap.val() as GameState) : null;
}

export async function updateRoomState(roomId: string, updates: Partial<GameState>): Promise<void> {
  await update(ref(db(), `rooms/${roomId}`), updates);
}

export async function deleteRoom(roomId: string): Promise<void> {
  await remove(ref(db(), `rooms/${roomId}`));
}

export function subscribeToRoom(
  roomId: string,
  callback: (state: GameState | null) => void
): () => void {
  const r = ref(db(), `rooms/${roomId}`);
  const listener = onValue(r, snap => {
    callback(snap.exists() ? (snap.val() as GameState) : null);
  });
  return () => off(r, 'value', listener);
}

// ─── PLAYERS ──────────────────────────────────────────────────────────────────

export async function addPlayerToRoom(roomId: string, player: Player): Promise<void> {
  await set(ref(db(), `rooms/${roomId}/players/${player.id}`), player);
}

export async function updatePlayer(
  roomId: string,
  playerId: string,
  updates: Partial<Player>
): Promise<void> {
  await update(ref(db(), `rooms/${roomId}/players/${playerId}`), updates);
}

export async function removePlayer(roomId: string, playerId: string): Promise<void> {
  await remove(ref(db(), `rooms/${roomId}/players/${playerId}`));
}

// ─── TEAM VOTE ────────────────────────────────────────────────────────────────

export async function submitTeamVote(
  roomId: string,
  playerId: string,
  vote: 'approve' | 'reject'
): Promise<void> {
  await set(ref(db(), `rooms/${roomId}/teamVotes/${playerId}`), vote);
}

export async function clearTeamVotes(roomId: string): Promise<void> {
  await remove(ref(db(), `rooms/${roomId}/teamVotes`));
}

// ─── QUEST VOTE ───────────────────────────────────────────────────────────────

export async function submitQuestVote(
  roomId: string,
  playerId: string,
  vote: 'success' | 'fail'
): Promise<void> {
  await set(ref(db(), `rooms/${roomId}/questVotes/${playerId}`), vote);
}

export async function clearQuestVotes(roomId: string): Promise<void> {
  await remove(ref(db(), `rooms/${roomId}/questVotes`));
}

// ─── ROOM LIST ────────────────────────────────────────────────────────────────

export async function listOpenRooms(): Promise<RoomInfo[]> {
  const snap = await get(ref(db(), 'rooms'));
  if (!snap.exists()) return [];
  const rooms: RoomInfo[] = [];
  snap.forEach(child => {
    const state = child.val() as GameState;
    if (state && state.phase === 'lobby') {
      const players = Object.values(state.players || {});
      rooms.push({
        id: state.id,
        hostId: state.hostId,
        hostName: players.find(p => p.id === state.hostId)?.name || 'Unknown',
        playerCount: players.length,
        maxPlayers: 10,
        status: 'waiting',
        createdAt: state.createdAt,
      });
    }
  });
  return rooms.sort((a, b) => b.createdAt - a.createdAt);
}

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────

export async function setAdminSetting(key: string, value: string): Promise<void> {
  await set(ref(db(), `adminSettings/${key}`), value);
}

export async function getAdminSetting(key: string): Promise<string | null> {
  const snap = await get(ref(db(), `adminSettings/${key}`));
  return snap.exists() ? snap.val() : null;
}

export async function getAllAdminSettings(): Promise<Record<string, string>> {
  const snap = await get(ref(db(), 'adminSettings'));
  return snap.exists() ? snap.val() : {};
}

export function subscribeToAdminSettings(
  callback: (settings: Record<string, string>) => void
): () => void {
  const r = ref(db(), 'adminSettings');
  const listener = onValue(r, snap => {
    callback(snap.exists() ? snap.val() : {});
  });
  return () => off(r, 'value', listener);
}
