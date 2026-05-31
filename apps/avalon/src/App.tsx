import { useState, useCallback } from 'react';
import type { Player } from './types/game';
import { ProfileSetup } from './components/screens/ProfileSetup';
import { MainMenu } from './components/screens/MainMenu';
import { Game } from './components/Game';

type AppScreen = 'profile' | 'menu' | 'game';

interface GameSession {
  isHost: boolean;
  roomCode: string;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('profile');
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);

  const handleProfileComplete = useCallback((player: Player) => {
    setMyPlayer(player);
    setScreen('menu');
  }, []);

  const handleCreateRoom = useCallback((roomCode: string) => {
    setSession({ isHost: true, roomCode });
    setScreen('game');
  }, []);

  const handleJoinRoom = useCallback((roomCode: string) => {
    setSession({ isHost: false, roomCode });
    setScreen('game');
  }, []);

  const handleLeaveGame = useCallback(() => {
    setSession(null);
    setScreen('menu');
  }, []);

  const handleEditProfile = useCallback(() => {
    setScreen('profile');
  }, []);

  if (screen === 'profile') {
    return (
      <ProfileSetup
        onComplete={handleProfileComplete}
      />
    );
  }

  if (screen === 'menu' && myPlayer) {
    return (
      <MainMenu
        myPlayer={myPlayer}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onEditProfile={handleEditProfile}
      />
    );
  }

  if (screen === 'game' && myPlayer && session) {
    return (
      <Game
        myPlayer={myPlayer}
        isHost={session.isHost}
        roomCode={session.roomCode}
        onLeave={handleLeaveGame}
      />
    );
  }

  return null;
}
