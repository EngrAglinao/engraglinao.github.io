import { useState, useEffect } from 'react';
import { Database } from 'firebase/database';
import { isFirebaseConfigured, initFromStorage } from './firebase/config';
import FirebaseSetup from './components/FirebaseSetup';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import { Player } from './types/game';

type AppScreen = 'loading' | 'firebase-setup' | 'lobby' | 'game';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [db, setDb] = useState<Database | null>(null);
  const [roomId, setRoomId] = useState('');
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [showFirebaseSettings, setShowFirebaseSettings] = useState(false);



  useEffect(() => {
    async function init() {
      if (isFirebaseConfigured()) {
        const database = await initFromStorage();
        if (database) {
          setDb(database);
          setScreen('lobby');
        } else {
          // Config exists but failed - show setup
          setScreen('firebase-setup');
        }
      } else {
        setScreen('firebase-setup');
      }
    }
    init();
  }, []);

  const handleFirebaseSuccess = (database: Database) => {
    setDb(database);
    setShowFirebaseSettings(false);
    setScreen('lobby');
  };

  const handleJoinRoom = (rid: string, player: Player) => {
    setRoomId(rid);
    setMyPlayer(player);
    setScreen('game');
  };

  const handleLeaveRoom = () => {
    setRoomId('');
    setMyPlayer(null);
    setScreen('lobby');
  };

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-white text-2xl font-bold">Loading Avalon...</p>
          <p className="text-gray-500 text-sm mt-2">Initializing...</p>
        </div>
      </div>
    );
  }

  if (screen === 'firebase-setup' || showFirebaseSettings) {
    return (
      <FirebaseSetup
        onSuccess={handleFirebaseSuccess}
        onSkip={showFirebaseSettings ? () => setShowFirebaseSettings(false) : undefined}
      />
    );
  }

  if (screen === 'game' && myPlayer && db) {
    return (
      <GameRoom
        db={db}
        roomId={roomId}
        myPlayer={myPlayer}
        onLeave={handleLeaveRoom}
      />
    );
  }

  if (screen === 'lobby' && db) {
    return (
      <Lobby
        db={db}
        onJoinRoom={handleJoinRoom}
        onOpenFirebaseSettings={() => setShowFirebaseSettings(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-white text-xl">Something went wrong. Please refresh.</p>
      </div>
    </div>
  );
}
