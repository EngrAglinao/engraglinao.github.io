import { useState, useEffect, useRef } from 'react';
import { GameState, Player } from './types';
import { isFirebaseSetupDone, initFirebaseFromStorage, ADMIN_EMAIL, getGameName } from './firebase';
import { subscribeToRoom } from './dbService';

import FirebaseSetup from './components/FirebaseSetup';
import ProfileScreen from './components/ProfileScreen';
import RoomScreen from './components/RoomScreen';
import LobbyScreen from './components/LobbyScreen';
import NightScreen from './components/NightScreen';
import TeamSelectionScreen from './components/TeamSelectionScreen';
import TeamVoteScreen from './components/TeamVoteScreen';
import QuestVoteScreen from './components/QuestVoteScreen';
import AssassinationScreen from './components/AssassinationScreen';
import GameOverScreen from './components/GameOverScreen';
import AdminSettings from './components/AdminSettings';
import GitHubUpload from './components/GitHubUpload';

type AppScreen =
  | 'firebase_setup'
  | 'profile'
  | 'room'
  | 'game';

function generatePlayerId(): string {
  const stored = localStorage.getItem('avalon_player_id');
  if (stored) return stored;
  const id = 'p_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  localStorage.setItem('avalon_player_id', id);
  return id;
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('firebase_setup');
  const [_firebaseReady, setFirebaseReady] = useState(false);
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // Initialize Firebase on load
  useEffect(() => {
    if (isFirebaseSetupDone()) {
      const result = initFirebaseFromStorage();
      if (result) {
        setFirebaseReady(true);
        // Check if player profile exists
        const savedName = localStorage.getItem('avalon_player_name');
        const savedAvatar = localStorage.getItem('avalon_player_avatar');
        if (savedName && savedAvatar) {
          const pid = generatePlayerId();
          setMyPlayer({
            id: pid,
            name: savedName,
            avatar: savedAvatar,
            isHost: false,
            isConnected: true,
          });
          setScreen('room');
        } else {
          setScreen('profile');
        }
      } else {
        setScreen('firebase_setup');
      }
    } else {
      setScreen('firebase_setup');
    }
  }, []);

  // Subscribe to room changes
  useEffect(() => {
    if (!currentRoomId || !myPlayer) return;
    if (unsubRef.current) unsubRef.current();
    const unsub = subscribeToRoom(currentRoomId, (state) => {
      if (state) {
        setGameState(state);
      } else {
        // Room deleted
        setCurrentRoomId(null);
        setGameState(null);
        setScreen('room');
      }
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [currentRoomId, myPlayer]);

  const handleFirebaseComplete = () => {
    const result = initFirebaseFromStorage();
    if (result) {
      setFirebaseReady(true);
      setScreen('profile');
    }
  };

  const handleProfile = (name: string, avatar: string) => {
    localStorage.setItem('avalon_player_name', name);
    localStorage.setItem('avalon_player_avatar', avatar);
    const pid = generatePlayerId();
    setMyPlayer({
      id: pid,
      name,
      avatar,
      isHost: false,
      isConnected: true,
    });
    setScreen('room');
  };

  const handleJoinedRoom = async (roomId: string, _unsub: () => void) => {
    setCurrentRoomId(roomId);
    setScreen('game');
  };

  const handleLeaveRoom = async () => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }
    setCurrentRoomId(null);
    setGameState(null);
    setScreen('room');
  };

  const handlePlayAgain = () => {
    // State will update via subscription
  };

  const handleAdminLogin = () => {
    if (adminEmail === ADMIN_EMAIL) {
      setAdminLoggedIn(true);
      setShowAdminLogin(false);
      setShowAdmin(true);
      setAdminError('');
    } else {
      setAdminError('Access denied. Invalid admin email.');
    }
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setShowAdmin(false);
  };

  // Determine current player from game state (for updated role info)
  const currentPlayer = gameState && myPlayer
    ? { ...myPlayer, ...(gameState.players?.[myPlayer.id] || {}) }
    : myPlayer;

  void getGameName(); // used in child components

  return (
    <div className="max-w-sm mx-auto min-h-screen relative" style={{ fontFamily: "'Cinzel', serif" }}>
      {/* GitHub Upload Button - always visible on start screens */}
      {(screen === 'profile' || screen === 'room') && !showGitHub && !showAdmin && (
        <button
          onClick={() => setShowGitHub(true)}
          className="fixed bottom-4 right-4 z-40 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full p-3 shadow-lg active:scale-95 transition-all"
          title="Upload to GitHub"
        >
          <span className="text-xl">🐙</span>
        </button>
      )}

      {/* Card flip overlay for revealing card */}
      {cardFlipped && gameState && currentPlayer && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setCardFlipped(false)}
        />
      )}

      {/* Main Screen Content */}
      {screen === 'firebase_setup' && (
        <FirebaseSetup onComplete={handleFirebaseComplete} />
      )}

      {screen === 'profile' && (
        <ProfileScreen
          onProfile={handleProfile}
          onAdminLogin={() => setShowAdminLogin(true)}
        />
      )}

      {screen === 'room' && myPlayer && (
        <RoomScreen
          myPlayer={myPlayer}
          onJoinedRoom={handleJoinedRoom}
        />
      )}

      {screen === 'game' && gameState && currentPlayer && (
        <>
          {/* Floating card peek button */}
          {gameState.phase !== 'lobby' && gameState.phase !== 'night' && gameState.phase !== 'game_over' && currentPlayer.role && (
            <div className="fixed top-3 right-3 z-30">
              <button
                onClick={() => setCardFlipped(v => !v)}
                className="bg-black/70 border border-amber-400/40 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-lg active:scale-95 transition-all backdrop-blur-sm"
              >
                <span className="text-xs">{cardFlipped ? '🙈' : '👁️'}</span>
                <span className="text-amber-400 text-xs font-semibold">{cardFlipped ? 'Hide' : 'My Card'}</span>
              </button>
              {/* Card peek overlay */}
              {cardFlipped && (
                <div className="absolute top-10 right-0 w-36 shadow-2xl z-50 rounded-xl overflow-hidden border border-amber-400/30">
                  <img
                    src={currentPlayer.role ? `/cards/${currentPlayer.role}.png` : '/cards/card_back.png'}
                    alt="My Role"
                    className="w-full object-cover"
                  />
                  <div className="bg-black/80 p-2 text-center">
                    <p className="text-amber-400 text-xs font-bold">{currentPlayer.role ? currentPlayer.role.replace('_', ' ').toUpperCase() : '?'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {gameState.phase === 'lobby' && (
            <LobbyScreen
              gameState={gameState}
              myPlayer={currentPlayer}
              onLeave={handleLeaveRoom}
            />
          )}

          {gameState.phase === 'night' && (
            <NightScreen
              gameState={gameState}
              myPlayer={currentPlayer}
            />
          )}

          {gameState.phase === 'team_selection' && (
            <TeamSelectionScreen
              gameState={gameState}
              myPlayer={currentPlayer}
            />
          )}

          {gameState.phase === 'team_vote' && (
            <TeamVoteScreen
              gameState={gameState}
              myPlayer={currentPlayer}
            />
          )}

          {gameState.phase === 'quest_vote' && (
            <QuestVoteScreen
              gameState={gameState}
              myPlayer={currentPlayer}
            />
          )}

          {gameState.phase === 'assassination' && (
            <AssassinationScreen
              gameState={gameState}
              myPlayer={currentPlayer}
            />
          )}

          {gameState.phase === 'game_over' && (
            <GameOverScreen
              gameState={gameState}
              myPlayer={currentPlayer}
              onPlayAgain={handlePlayAgain}
            />
          )}
        </>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0f2e] border border-amber-400/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <span>👑</span> Admin Login
              </h3>
              <button onClick={() => { setShowAdminLogin(false); setAdminError(''); }} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Admin Email</label>
                <input
                  type="email"
                  className="w-full bg-black/40 border border-gray-600 rounded-xl px-3 py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={e => { setAdminEmail(e.target.value); setAdminError(''); }}
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Password (any)</label>
                <input
                  type="password"
                  className="w-full bg-black/40 border border-gray-600 rounded-xl px-3 py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
            </div>
            {adminError && <p className="text-red-400 text-xs mb-3 text-center">{adminError}</p>}
            <p className="text-gray-600 text-xs mb-4 text-center">Only the designated admin email can access settings.</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAdminLogin(false); setAdminError(''); }}
                className="flex-1 py-3 bg-white/10 text-gray-300 font-semibold rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm active:scale-95 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Settings Panel */}
      {showAdmin && adminLoggedIn && (
        <AdminSettings
          onClose={() => setShowAdmin(false)}
          onLogout={handleAdminLogout}
        />
      )}

      {/* GitHub Upload Modal */}
      {showGitHub && (
        <GitHubUpload onClose={() => setShowGitHub(false)} />
      )}
    </div>
  );
}
