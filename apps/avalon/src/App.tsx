import { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import FirebaseSetupScreen from './screens/FirebaseSetupScreen';
import StartScreen from './screens/StartScreen';
import ProfileScreen from './screens/ProfileScreen';
import LobbyScreen from './screens/LobbyScreen';
import NightPhaseScreen from './screens/NightPhaseScreen';
import DayPhaseScreen from './screens/DayPhaseScreen';
import TeamVoteScreen from './screens/TeamVoteScreen';
import QuestPhaseScreen from './screens/QuestPhaseScreen';
import AssassinationScreen from './screens/AssassinationScreen';
import EndGameScreen from './screens/EndGameScreen';
import AdminSettingsScreen from './screens/AdminSettingsScreen';
import TutorialScreen from './screens/TutorialScreen';

type AppScreen =
  | 'firebase-setup'
  | 'start'
  | 'profile'
  | 'lobby'
  | 'night'
  | 'day'
  | 'team-vote'
  | 'quest'
  | 'assassination'
  | 'end'
  | 'admin'
  | 'tutorial';

function AppInner() {
  const { isConfigured, currentRoom, subscribeToRoom } = useGame();
  const [screen, setScreen] = useState<AppScreen>('firebase-setup');

  // Initialize screen based on config status
  useEffect(() => {
    if (isConfigured) {
      setScreen('start');
    } else {
      setScreen('firebase-setup');
    }
  }, [isConfigured]);

  // Sync game phase to screen
  useEffect(() => {
    if (!currentRoom) return;
    const phase = currentRoom.phase;
    const phaseMap: Record<string, AppScreen> = {
      night: 'night',
      day: 'day',
      team_vote: 'team-vote',
      quest: 'quest',
      assassination: 'assassination',
      end: 'end',
    };
    const targetScreen = phaseMap[phase];
    if (targetScreen && screen !== targetScreen) {
      setScreen(targetScreen);
    }
  }, [currentRoom?.phase, screen]);

  // Restore room subscription if player has one
  useEffect(() => {
    const savedRoom = localStorage.getItem('avalon_room_id');
    if (savedRoom && isConfigured) {
      subscribeToRoom(savedRoom);
    }
  }, [isConfigured]);

  // Save/clear room id
  useEffect(() => {
    if (currentRoom?.id) {
      localStorage.setItem('avalon_room_id', currentRoom.id);
    }
  }, [currentRoom?.id]);

  const goToStart = () => {
    localStorage.removeItem('avalon_room_id');
    setScreen('start');
  };

  if (screen === 'firebase-setup') {
    return <FirebaseSetupScreen onDone={() => setScreen('start')} />;
  }

  if (screen === 'tutorial') {
    return <TutorialScreen onBack={() => setScreen('start')} />;
  }

  if (screen === 'admin') {
    return <AdminSettingsScreen onBack={() => setScreen('start')} />;
  }

  if (screen === 'profile') {
    return (
      <ProfileScreen
        onDone={() => setScreen('lobby')}
        onBack={() => setScreen('start')}
      />
    );
  }

  if (screen === 'lobby') {
    return (
      <LobbyScreen
        onBack={goToStart}
      />
    );
  }

  if (screen === 'night') {
    return <NightPhaseScreen onDone={() => setScreen('day')} />;
  }

  if (screen === 'day') {
    return <DayPhaseScreen onVotePhase={() => setScreen('team-vote')} />;
  }

  if (screen === 'team-vote') {
    return <TeamVoteScreen onResolved={() => {
      const phase = currentRoom?.phase;
      if (phase === 'quest') setScreen('quest');
      else setScreen('day');
    }} />;
  }

  if (screen === 'quest') {
    return <QuestPhaseScreen onResolved={() => {
      const phase = currentRoom?.phase;
      if (phase === 'assassination') setScreen('assassination');
      else if (phase === 'end') setScreen('end');
      else setScreen('day');
    }} />;
  }

  if (screen === 'assassination') {
    return <AssassinationScreen onEnd={() => setScreen('end')} />;
  }

  if (screen === 'end') {
    return <EndGameScreen onPlayAgain={goToStart} />;
  }

  // Start screen
  return (
    <StartScreen
      onCreateProfile={() => setScreen('profile')}
      onEnterGame={() => setScreen('lobby')}
      onAdminSettings={() => setScreen('admin')}
      onTutorial={() => setScreen('tutorial')}
    />
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
