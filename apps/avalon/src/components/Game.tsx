import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Player, Role, VoteOption } from '../types/game';
import type { QuestVote as QuestVoteType } from '../types/game';
import { useNetwork } from '../hooks/useNetwork';
import { assignRoles, createInitialQuests, getNextLeaderId, processTeamVote, processQuestVote } from '../utils/gameLogic';
import { Lobby } from './screens/Lobby';
import { RoleReveal } from './screens/RoleReveal';
import { TeamSelection } from './screens/TeamSelection';
import { TeamVote } from './screens/TeamVote';
import { TeamVoteResult } from './screens/TeamVoteResult';
import { QuestVote as QuestVoteScreen } from './screens/QuestVote';
import { QuestVoteResult } from './screens/QuestVoteResult';
import { AssassinPhase } from './screens/AssassinPhase';
import { GameOver } from './screens/GameOver';
import { ConnectingScreen } from './screens/ConnectingScreen';

interface GameProps {
  myPlayer: Player;
  isHost: boolean;
  roomCode: string;
  onLeave: () => void;
}

export function Game({ myPlayer, isHost, roomCode, onLeave }: GameProps) {
  const buildInitialState = (): GameState => ({
    phase: 'lobby',
    players: [{ ...myPlayer, isHost }],
    currentLeaderId: myPlayer.id,
    quests: [],
    currentQuestIndex: 0,
    availableRoles: [],
    goodScore: 0,
    evilScore: 0,
    winner: null,
    assassinTargetId: null,
    hammerUsed: false,
    voteHistoryVisible: false,
    consecutiveRejects: 0,
    hostId: myPlayer.id,
    roomCode,
    cardHidden: {},
    teamPickingDone: false,
  });

  const [gameState, setGameState] = useState<GameState>(
    isHost ? buildInitialState() : { ...buildInitialState(), players: [] }
  );

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // ── Network ────────────────────────────────────────────────────────────────

  const broadcastRef = useRef<((s: GameState) => void) | null>(null);

  const handleGameStateUpdate = useCallback((state: GameState) => {
    if (isHost) {
      setGameState((prev) => {
        const merged = mergePlayerState(prev, state);
        setTimeout(() => broadcastRef.current?.(merged), 0);
        return merged;
      });
    } else {
      setGameState(state);
    }
  }, [isHost]);

  const handlePlayerJoin = useCallback((player: Player) => {
    if (!isHost) return;
    setGameState((prev) => {
      if (prev.players.find((p) => p.id === player.id)) return prev;
      return {
        ...prev,
        players: [...prev.players, { ...player, isHost: false, isConnected: true }],
      };
    });
  }, [isHost]);

  const handlePlayerDisconnect = useCallback((playerId: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, isConnected: false } : p
      ),
    }));
  }, []);

  const { isConnected, connectionError, broadcastGameState, sendToHost } = useNetwork({
    isHost,
    roomCode,
    myPlayer,
    onGameStateUpdate: handleGameStateUpdate,
    onPlayerJoin: handlePlayerJoin,
    onPlayerDisconnect: handlePlayerDisconnect,
  });

  // Keep broadcastRef in sync
  broadcastRef.current = broadcastGameState;

  // Broadcast lobby state periodically so joiners get updated
  useEffect(() => {
    if (!isHost) return;
    const interval = setInterval(() => {
      broadcastGameState(gameStateRef.current);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHost, broadcastGameState]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const updateAndBroadcast = useCallback((newState: GameState) => {
    setGameState(newState);
    broadcastGameState(newState);
  }, [broadcastGameState]);

  // ── Host Actions ───────────────────────────────────────────────────────────

  const handleStartGame = useCallback((selectedRoles: Role[]) => {
    const withRoles = assignRoles(gameState.players, selectedRoles);
    const randomLeader = withRoles[Math.floor(Math.random() * withRoles.length)].id;
    const newState: GameState = {
      ...gameState,
      players: withRoles,
      phase: 'role_reveal',
      quests: createInitialQuests(withRoles.length),
      currentLeaderId: randomLeader,
      availableRoles: selectedRoles,
      goodScore: 0,
      evilScore: 0,
      winner: null,
      consecutiveRejects: 0,
    };
    updateAndBroadcast(newState);
  }, [gameState, updateAndBroadcast]);

  const handleRoleRevealContinue = useCallback(() => {
    updateAndBroadcast({ ...gameState, phase: 'team_selection', teamPickingDone: false });
  }, [gameState, updateAndBroadcast]);

  const handleConfirmTeam = useCallback((teamIds: string[]) => {
    const updatedQuests = gameState.quests.map((q, i) =>
      i === gameState.currentQuestIndex ? { ...q, teamProposal: teamIds } : q
    );
    const newState: GameState = { ...gameState, quests: updatedQuests, teamPickingDone: true };
    if (isHost) {
      updateAndBroadcast(newState);
    } else {
      sendToHost({ type: 'GAME_STATE', state: newState });
    }
  }, [gameState, isHost, updateAndBroadcast, sendToHost]);

  const handleStartTeamVote = useCallback(() => {
    updateAndBroadcast({ ...gameState, phase: 'team_vote' });
  }, [gameState, updateAndBroadcast]);

  const handleCastTeamVote = useCallback((vote: VoteOption) => {
    const updatedQuests = gameState.quests.map((q, i) =>
      i === gameState.currentQuestIndex
        ? { ...q, votes: { ...q.votes, [myPlayer.id]: vote } }
        : q
    );
    const newState: GameState = { ...gameState, quests: updatedQuests };
    if (isHost) {
      updateAndBroadcast(newState);
    } else {
      sendToHost({ type: 'GAME_STATE', state: newState });
    }
  }, [gameState, myPlayer.id, isHost, updateAndBroadcast, sendToHost]);

  const handleRevealTeamVotes = useCallback(() => {
    updateAndBroadcast(processTeamVote(gameState));
  }, [gameState, updateAndBroadcast]);

  const handleTeamVoteResultContinue = useCallback(() => {
    const currentQuest = gameState.quests[gameState.currentQuestIndex];
    const approvals = Object.values(currentQuest.votes).filter((v) => v === 'approve').length;
    const isApproved = approvals > gameState.players.length / 2;

    if (isApproved) {
      updateAndBroadcast({ ...gameState, phase: 'quest_vote' });
    } else {
      const updatedQuests = gameState.quests.map((q, i) =>
        i === gameState.currentQuestIndex ? { ...q, teamProposal: [], votes: {} } : q
      );
      updateAndBroadcast({
        ...gameState,
        quests: updatedQuests,
        phase: 'team_selection',
        teamPickingDone: false,
      });
    }
  }, [gameState, updateAndBroadcast]);

  const handleCastQuestVote = useCallback((vote: QuestVoteType) => {
    const updatedQuests = gameState.quests.map((q, i) =>
      i === gameState.currentQuestIndex
        ? { ...q, questVotes: { ...q.questVotes, [myPlayer.id]: vote } }
        : q
    );
    const newState: GameState = { ...gameState, quests: updatedQuests };
    if (isHost) {
      updateAndBroadcast(newState);
    } else {
      sendToHost({ type: 'GAME_STATE', state: newState });
    }
  }, [gameState, myPlayer.id, isHost, updateAndBroadcast, sendToHost]);

  const handleRevealQuestVotes = useCallback(() => {
    updateAndBroadcast(processQuestVote(gameState));
  }, [gameState, updateAndBroadcast]);

  const handleQuestVoteResultContinue = useCallback(() => {
    if (gameState.phase === 'game_over' || gameState.phase === 'assassin_phase') {
      broadcastGameState(gameState);
      return;
    }
    const nextQuestIndex = gameState.currentQuestIndex + 1;
    const nextLeaderId = getNextLeaderId(gameState.players, gameState.currentLeaderId);
    updateAndBroadcast({
      ...gameState,
      currentQuestIndex: nextQuestIndex,
      currentLeaderId: nextLeaderId,
      phase: 'team_selection',
      teamPickingDone: false,
    });
  }, [gameState, updateAndBroadcast, broadcastGameState]);

  const handleAssassinate = useCallback((targetId: string) => {
    const newState: GameState = { ...gameState, assassinTargetId: targetId };
    if (isHost) {
      updateAndBroadcast(newState);
    } else {
      sendToHost({ type: 'GAME_STATE', state: newState });
    }
  }, [gameState, isHost, updateAndBroadcast, sendToHost]);

  const handleConfirmAssassination = useCallback(() => {
    const target = gameState.players.find((p) => p.id === gameState.assassinTargetId);
    const isKilledMerlin = target?.role === 'Merlin';
    updateAndBroadcast({
      ...gameState,
      phase: 'game_over',
      winner: isKilledMerlin ? 'evil' : 'good',
    });
  }, [gameState, updateAndBroadcast]);

  const handlePlayAgain = useCallback(() => {
    const resetState: GameState = {
      ...buildInitialState(),
      players: gameState.players.map((p) => ({
        ...p,
        role: undefined,
        team: undefined,
      })),
    };
    updateAndBroadcast(resetState);
  }, [gameState.players]);

  const handleKickPlayer = useCallback((playerId: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────

  const phase = gameState.phase;

  // Show connecting screen for non-host players until they get lobby state
  if (!isHost && !isConnected && gameState.players.length === 0) {
    return (
      <ConnectingScreen
        isHost={isHost}
        roomCode={roomCode}
        connectionError={connectionError}
        onBack={onLeave}
      />
    );
  }

  if (phase === 'lobby') {
    return (
      <Lobby
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        isConnected={isConnected}
        connectionError={connectionError}
        onStartGame={handleStartGame}
        onKickPlayer={handleKickPlayer}
      />
    );
  }

  if (phase === 'role_reveal') {
    return (
      <RoleReveal
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onContinue={handleRoleRevealContinue}
      />
    );
  }

  if (phase === 'team_selection') {
    return (
      <TeamSelection
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onConfirmTeam={handleConfirmTeam}
        onStartTeamVote={handleStartTeamVote}
      />
    );
  }

  if (phase === 'team_vote') {
    return (
      <TeamVote
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onCastVote={handleCastTeamVote}
        onRevealVotes={handleRevealTeamVotes}
      />
    );
  }

  if (phase === 'team_vote_result') {
    return (
      <TeamVoteResult
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onContinue={handleTeamVoteResultContinue}
      />
    );
  }

  if (phase === 'quest_vote') {
    return (
      <QuestVoteScreen
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onCastQuestVote={handleCastQuestVote}
        onRevealQuestVotes={handleRevealQuestVotes}
      />
    );
  }

  if (phase === 'quest_vote_result') {
    return (
      <QuestVoteResult
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onContinue={handleQuestVoteResultContinue}
      />
    );
  }

  if (phase === 'assassin_phase') {
    return (
      <AssassinPhase
        gameState={gameState}
        myPlayer={myPlayer}
        isHost={isHost}
        onAssassinate={handleAssassinate}
        onHostConfirmAssassination={handleConfirmAssassination}
      />
    );
  }

  if (phase === 'game_over') {
    return (
      <GameOver
        gameState={gameState}
        myPlayer={myPlayer}
        onPlayAgain={handlePlayAgain}
        onReturnToMenu={onLeave}
      />
    );
  }

  return null;
}

// Merge a player's partial state into the host's canonical state
function mergePlayerState(hostState: GameState, playerState: GameState): GameState {
  const mergedQuests = hostState.quests.map((q, i) => {
    const pq = playerState.quests[i];
    if (!pq) return q;
    return {
      ...q,
      votes: { ...q.votes, ...pq.votes },
      questVotes: { ...q.questVotes, ...pq.questVotes },
      teamProposal: pq.teamProposal.length > 0 ? pq.teamProposal : q.teamProposal,
    };
  });

  return {
    ...hostState,
    quests: mergedQuests,
    assassinTargetId: playerState.assassinTargetId || hostState.assassinTargetId,
    teamPickingDone: playerState.teamPickingDone || hostState.teamPickingDone,
  };
}
