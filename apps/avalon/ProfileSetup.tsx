import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { GameState, Player, Role } from '../../types/game';
import {
  ROLE_INFO,
  PLAYER_ROLE_COUNTS,
  MIN_PLAYERS,
  MAX_PLAYERS,
  OPTIONAL_GOOD_ROLES,
  OPTIONAL_EVIL_ROLES,
} from '../../constants/gameConfig';

interface LobbyProps {
  gameState: GameState;
  myPlayer: Player;
  isHost: boolean;
  isConnected: boolean;
  connectionError: string | null;
  onStartGame: (availableRoles: Role[]) => void;
  onKickPlayer?: (playerId: string) => void;
}

const ALL_OPTIONAL_ROLES: Role[] = [...OPTIONAL_GOOD_ROLES, ...OPTIONAL_EVIL_ROLES];

export function Lobby({
  gameState,
  myPlayer,
  isHost,
  isConnected,
  connectionError,
  onStartGame,
  onKickPlayer,
}: LobbyProps) {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(['Merlin', 'Assassin']);

  const playerCount = gameState.players.length;
  const roleCounts = PLAYER_ROLE_COUNTS[playerCount] || null;
  const canStart = playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS && isConnected;

  const selectedGood = selectedRoles.filter((r) => ROLE_INFO[r].team === 'good').length;
  const selectedEvil = selectedRoles.filter((r) => ROLE_INFO[r].team === 'evil').length;

  const maxGood = roleCounts ? roleCounts.good : 0;
  const maxEvil = roleCounts ? roleCounts.evil : 0;

  // Always include Merlin (good) and Assassin (evil)
  const toggleRole = (role: Role) => {
    if (!isHost) return;
    const isRequired = role === 'Merlin' || role === 'Assassin';
    if (isRequired) return;

    const isSelected = selectedRoles.includes(role);
    const roleTeam = ROLE_INFO[role].team;

    if (isSelected) {
      setSelectedRoles((prev) => prev.filter((r) => r !== role));
    } else {
      // Check limits
      const currentGood = selectedRoles.filter((r) => ROLE_INFO[r].team === 'good').length;
      const currentEvil = selectedRoles.filter((r) => ROLE_INFO[r].team === 'evil').length;

      if (roleTeam === 'good' && roleCounts && currentGood >= roleCounts.good) return;
      if (roleTeam === 'evil' && roleCounts && currentEvil >= roleCounts.evil) return;
      setSelectedRoles((prev) => [...prev, role]);
    }
  };

  const getRoleCardStyle = (role: Role) => {
    const isSelected = selectedRoles.includes(role);
    const isRequired = role === 'Merlin' || role === 'Assassin';
    const info = ROLE_INFO[role];

    if (isRequired) {
      return info.team === 'good'
        ? 'border-blue-400/60 bg-blue-900/30 opacity-90'
        : 'border-red-400/60 bg-red-900/30 opacity-90';
    }

    if (isSelected) {
      return info.team === 'good'
        ? 'border-emerald-400/60 bg-emerald-900/20'
        : 'border-red-400/60 bg-red-900/20';
    }

    return 'border-slate-700/40 bg-slate-800/40 opacity-50';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 pb-6">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-700/40">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-cinzel text-xl font-black text-yellow-400">Game Lobby</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
            <span className="font-cinzel text-xs text-slate-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-crimson text-slate-400 text-sm">Room Code:</span>
          <span className="font-cinzel text-yellow-400 font-bold text-lg tracking-widest bg-yellow-400/10 px-3 py-0.5 rounded-lg border border-yellow-400/30">
            {gameState.roomCode}
          </span>
        </div>
        {connectionError && (
          <div className="mt-2 bg-red-900/30 border border-red-500/40 rounded-lg px-3 py-2">
            <p className="text-red-400 text-xs font-crimson">{connectionError}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-5">
        {/* Players */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest">
              Players ({playerCount}/{MAX_PLAYERS})
            </p>
            {playerCount < MIN_PLAYERS && (
              <span className="text-xs font-crimson text-orange-400">
                Need {MIN_PLAYERS - playerCount} more
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {gameState.players.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-2 rounded-xl p-2.5 border transition-all ${
                  p.id === myPlayer.id
                    ? 'bg-yellow-500/10 border-yellow-500/40'
                    : 'bg-slate-800/60 border-slate-700/40'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xl flex-shrink-0">
                  {p.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-white text-xs font-bold truncate">{p.name}</p>
                  <div className="flex gap-1 flex-wrap">
                    {p.isHost && (
                      <span className="text-yellow-400 text-xs">👑 Host</span>
                    )}
                    {p.id === myPlayer.id && (
                      <span className="text-blue-400 text-xs">You</span>
                    )}
                  </div>
                </div>
                {isHost && p.id !== myPlayer.id && (
                  <button
                    onClick={() => onKickPlayer?.(p.id)}
                    className="text-red-500/60 hover:text-red-400 text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, MIN_PLAYERS - playerCount) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-2 rounded-xl p-2.5 border border-dashed border-slate-700/40 bg-slate-800/20"
              >
                <div className="w-9 h-9 rounded-full border border-dashed border-slate-600 flex items-center justify-center text-slate-600">
                  ?
                </div>
                <p className="font-crimson text-slate-600 text-xs italic">Waiting...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role Selection - Host Only */}
        {isHost && roleCounts && (
          <div>
            <p className="font-cinzel text-xs text-slate-400 uppercase tracking-widest mb-2">
              Role Selection
            </p>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 mb-3">
              <div className="flex justify-between text-xs font-crimson">
                <span className="text-blue-400">
                  Good: {selectedGood}/{maxGood} selected
                </span>
                <span className="text-red-400">
                  Evil: {selectedEvil}/{maxEvil} selected
                </span>
              </div>
              <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(selectedGood / maxGood) * 50}%` }}
                />
                <div className="flex-1" />
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(selectedEvil / maxEvil) * 50}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* Required Roles */}
              {(['Merlin', 'Assassin'] as Role[]).map((role) => {
                const info = ROLE_INFO[role];
                return (
                  <Card
                    key={role}
                    className={`p-3 border ${getRoleCardStyle(role)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-sm font-bold text-white">{role}</span>
                          <span className="text-xs font-crimson text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        </div>
                        <p className="font-crimson text-slate-400 text-xs mt-0.5 leading-tight">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {/* Optional Roles */}
              {ALL_OPTIONAL_ROLES.map((role) => {
                const info = ROLE_INFO[role];
                const isSelected = selectedRoles.includes(role);
                const roleTeam = info.team;
                const currentCount =
                  roleTeam === 'good'
                    ? selectedGood
                    : selectedEvil;
                const maxCount = roleTeam === 'good' ? maxGood : maxEvil;
                const canToggle = isSelected || currentCount < maxCount;

                return (
                  <button
                    key={role}
                    onClick={() => canToggle && toggleRole(role)}
                    className={`w-full text-left rounded-xl p-3 border transition-all active:scale-[0.98] ${getRoleCardStyle(role)} ${
                      !canToggle && !isSelected ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-cinzel text-sm font-bold text-white">{role}</span>
                          <span
                            className={`text-xs font-cinzel px-1.5 py-0.5 rounded ${
                              roleTeam === 'good'
                                ? 'text-blue-300 bg-blue-900/40'
                                : 'text-red-300 bg-red-900/40'
                            }`}
                          >
                            {roleTeam === 'good' ? 'Good' : 'Evil'}
                          </span>
                          {isSelected && <span className="text-green-400 text-xs">✓</span>}
                        </div>
                        <p className="font-crimson text-slate-400 text-xs mt-0.5 leading-tight">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!isHost && (
          <div className="text-center py-6">
            <div className="text-4xl mb-3 animate-pulse">⏳</div>
            <p className="font-cinzel text-slate-300 font-bold">Waiting for Host</p>
            <p className="font-crimson text-slate-500 text-sm mt-1">
              The host is configuring the game...
            </p>
          </div>
        )}
      </div>

      {/* Start Button - Host Only */}
      {isHost && (
        <div className="px-5 pt-4">
          <Button
            variant="gold"
            size="lg"
            fullWidth
            disabled={!canStart || selectedGood < maxGood || selectedEvil < maxEvil}
            onClick={() => onStartGame(selectedRoles)}
          >
            {!canStart
              ? `Need ${Math.max(0, MIN_PLAYERS - playerCount)} more players`
              : selectedGood < maxGood || selectedEvil < maxEvil
              ? `Select ${maxGood - selectedGood + (maxEvil - selectedEvil)} more roles`
              : '⚔️ Start Game'}
          </Button>
        </div>
      )}
    </div>
  );
}
