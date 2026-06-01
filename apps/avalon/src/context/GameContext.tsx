import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Database } from 'firebase/database';
import { loadConfig, initFirebase, GAME_NAME_KEY, GAME_ICON_KEY, ADMIN_EMAIL } from '../firebase';
import { subscribeRoom } from '../gameService';
import { Room, Player, CharacterName } from '../types';

interface GameContextType {
  db: Database | undefined;
  isConfigured: boolean;
  gameName: string;
  gameIcon: string;
  setGameName: (name: string) => void;
  setGameIcon: (icon: string) => void;
  currentRoom: Room | null;
  currentPlayer: Player | null;
  setCurrentPlayer: (p: Player | null) => void;
  setCurrentRoom: (r: Room | null) => void;
  subscribeToRoom: (roomId: string) => void;
  unsubscribeRoom: () => void;
  isAdmin: boolean;
  enabledCharacters: CharacterName[];
  setEnabledCharacters: (chars: CharacterName[]) => void;
  initializeFirebase: (config: Parameters<typeof initFirebase>[0]) => boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<Database | undefined>(undefined);
  const [isConfigured, setIsConfigured] = useState(false);
  const [gameName, setGameNameState] = useState(localStorage.getItem(GAME_NAME_KEY) || 'AVALON');
  const [gameIcon, setGameIconState] = useState(localStorage.getItem(GAME_ICON_KEY) || '');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [enabledCharacters, setEnabledCharsState] = useState<CharacterName[]>([
    'Merlin', 'Percival', 'Morgana', 'Mordred', 'Assassin'
  ]);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const cfg = loadConfig();
    if (cfg) {
      try {
        const { db: database } = initFirebase(cfg);
        setDb(database);
        setIsConfigured(true);
      } catch {
        setIsConfigured(false);
      }
    }
    const savedPlayer = localStorage.getItem('avalon_player');
    if (savedPlayer) {
      try { setCurrentPlayer(JSON.parse(savedPlayer)); } catch {}
    }
    const savedChars = localStorage.getItem('avalon_enabled_chars');
    if (savedChars) {
      try { setEnabledCharsState(JSON.parse(savedChars)); } catch {}
    }
  }, []);

  const initializeFirebase = useCallback((config: Parameters<typeof initFirebase>[0]): boolean => {
    try {
      const { db: database } = initFirebase(config);
      setDb(database);
      setIsConfigured(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const setGameName = useCallback((name: string) => {
    setGameNameState(name);
    localStorage.setItem(GAME_NAME_KEY, name);
  }, []);

  const setGameIcon = useCallback((icon: string) => {
    setGameIconState(icon);
    localStorage.setItem(GAME_ICON_KEY, icon);
  }, []);

  const setEnabledCharacters = useCallback((chars: CharacterName[]) => {
    setEnabledCharsState(chars);
    localStorage.setItem('avalon_enabled_chars', JSON.stringify(chars));
  }, []);

  const subscribeToRoom = useCallback((roomId: string) => {
    if (!db) return;
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = subscribeRoom(db, roomId, (room) => {
      setCurrentRoom(room);
    });
  }, [db]);

  const unsubscribeRoom = useCallback(() => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    setCurrentRoom(null);
  }, []);

  const isAdmin = currentPlayer?.email === ADMIN_EMAIL;

  return (
    <GameContext.Provider value={{
      db,
      isConfigured,
      gameName,
      gameIcon,
      setGameName,
      setGameIcon,
      currentRoom,
      currentPlayer,
      setCurrentPlayer,
      setCurrentRoom,
      subscribeToRoom,
      unsubscribeRoom,
      isAdmin,
      enabledCharacters,
      setEnabledCharacters,
      initializeFirebase,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
