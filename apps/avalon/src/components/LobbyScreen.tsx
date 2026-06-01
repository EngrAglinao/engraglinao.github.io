import { useState } from 'react';
import { GameState, Player, Role, ROLE_DEFINITIONS, PLAYER_ROLE_COUNTS, QUEST_TEAM_SIZES } from '../types';
import { updateRoomState } from '../dbService';
import { assignRoles, canStartGame } from '../gameLogic';
import { getGameName, getGameIcon } from '../firebase';

interface LobbyScreenProps {
  gameState: GameState;
  myPlayer: Player;
  onLeave: () => void;
}

export default function LobbyScreen({ gameState, myPlayer, onLeave }: LobbyScreenProps) {
  const [showRoleConfig, setShowRoleConfig] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(gameState.availableRoles || []);
  const [copyMsg, setCopyMsg] = useState('');
  const gameName = getGameName();
  const gameIcon = getGameIcon();

  const players = Object.values(gameState.players || {});
  const playerCount = players.length;
  const isHost = myPlayer.id === gameState.hostId;
  const canStart = canStartGame(playerCount);
  const { good: goodCount, evil: evilCount } = PLAYER_ROLE_COUNTS[playerCount] || { good: 0, evil: 0 };

  const goodRoles: Role[] = ['merlin', 'percival', 'loyal_servant'];
  const evilRoles: Role[] = ['morgana', 'assassin', 'mordred', 'oberon', 'minion'];

  const selectedGood = selectedRoles.filter(r => ROLE_DEFINITIONS[r].alignment === 'good');
  const selectedEvil = selectedRoles.filter(r => ROLE_DEFINITIONS[r].alignment === 'evil');

  const toggleRole = (role: Role) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleStartGame = async () => {
    if (!canStart) return;
    const roleAssignments = assignRoles(players, selectedRoles);
    const updatedPlayers: Record<string, Player> = {};
    players.forEach(p => {
      updatedPlayers[p.id] = { ...p, role: roleAssignments[p.id] };
    });
    await updateRoomState(gameState.id, {
      phase: 'night',
      players: updatedPlayers,
      availableRoles: selectedRoles,
      currentLeaderId: players[gameState.currentLeaderIndex]?.id,
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gameState.id).catch(() => {});
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 2000);
  };

  const questSizes = QUEST_TEAM_SIZES[playerCount] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col p-4 relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random()*2+1+'px', height: Math.random()*2+1+'px', top: Math.random()*100+'%', left: Math.random()*100+'%', opacity: Math.random()*0.5+0.1 }} />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 pt-2">
        <button onClick={onLeave} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          ← Leave
        </button>
        <div className="flex items-center gap-2">
          {gameIcon ? <img src={gameIcon} alt="" className="w-6 h-6 rounded" /> : <span>⚔️</span>}
          <span className="text-amber-400 font-bold text-sm tracking-wider">{gameName}</span>
        </div>
        <div className="w-12" />
      </div>

      {/* Room Code */}
      <div className="relative z-10 bg-white/5 border border-amber-400/20 rounded-2xl p-4 mb-4">
        <p className="text-gray-400 text-xs text-center mb-1">ROOM CODE</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-amber-400 font-mono font-bold text-2xl tracking-[0.3em]">{gameState.id}</span>
          <button
            onClick={handleCopyCode}
            className="bg-amber-500/20 border border-amber-400/30 rounded-lg px-3 py-1 text-amber-400 text-xs active:scale-95 transition-all"
          >
            {copyMsg || '📋 Copy'}
          </button>
        </div>
        <p className="text-gray-500 text-xs text-center mt-1">Share this code with players on the same WiFi</p>
      </div>

      {/* Players Grid */}
      <div className="relative z-10 bg-white/5 border border-amber-400/20 rounded-2xl p-4 mb-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">Players ({playerCount}/10)</h3>
          <div className="flex gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
              👼 {goodCount} Good
            </span>
            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
              😈 {evilCount} Evil
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {players.map(p => (
            <div key={p.id} className={`flex items-center gap-2 rounded-xl p-2.5 border transition-all ${
              p.id === myPlayer.id ? 'bg-amber-500/10 border-amber-400/40' : 'bg-white/5 border-white/10'
            }`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-900/40 to-amber-600/20 border border-amber-400/30 flex items-center justify-center text-xl flex-shrink-0">
                {p.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                <div className="flex gap-1 items-center">
                  {p.id === gameState.hostId && (
                    <span className="text-amber-400 text-xs">👑</span>
                  )}
                  {p.id === myPlayer.id && (
                    <span className="text-green-400 text-xs">You</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 5 - playerCount) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex items-center gap-2 rounded-xl p-2.5 border border-dashed border-white/10 opacity-30">
              <div className="w-9 h-9 rounded-full border border-dashed border-gray-600 flex items-center justify-center text-gray-600">
                ?
              </div>
              <span className="text-gray-600 text-xs">Waiting...</span>
            </div>
          ))}
        </div>

        {!canStart && (
          <p className="text-center text-amber-400/70 text-xs mt-3">
            Need at least 5 players to start ({5 - playerCount} more needed)
          </p>
        )}
      </div>

      {/* Quest Board Preview */}
      {canStart && questSizes.length > 0 && (
        <div className="relative z-10 bg-white/5 border border-amber-400/20 rounded-2xl p-3 mb-4">
          <p className="text-gray-400 text-xs mb-2 text-center">QUEST TEAM SIZES</p>
          <div className="flex justify-center gap-2">
            {questSizes.map((size, i) => (
              <div key={i} className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-400/30 flex flex-col items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">{size}</span>
                <span className="text-gray-500 text-xs">Q{i+1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Host Controls */}
      {isHost && (
        <div className="relative z-10 space-y-2">
          <button
            onClick={() => setShowRoleConfig(true)}
            className="w-full py-3 bg-white/10 border border-amber-400/30 text-amber-300 font-semibold rounded-xl text-sm active:scale-95 transition-all"
          >
            ⚙️ Configure Roles ({selectedRoles.length} selected)
          </button>
          <button
            onClick={handleStartGame}
            disabled={!canStart}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm tracking-wider shadow-lg shadow-amber-500/20"
          >
            {canStart ? '⚔️ START GAME' : `⚔️ NEED ${Math.max(0, 5 - playerCount)} MORE PLAYER${5 - playerCount !== 1 ? 'S' : ''}`}
          </button>
        </div>
      )}

      {!isHost && (
        <div className="relative z-10 bg-amber-500/10 border border-amber-400/20 rounded-xl p-3 text-center">
          <p className="text-amber-300 text-sm">⏳ Waiting for host to start the game...</p>
        </div>
      )}

      {/* Role Config Modal */}
      {showRoleConfig && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-[#0f0f2e] border border-amber-400/30 rounded-t-3xl w-full max-w-sm p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Configure Roles</h3>
              <button onClick={() => setShowRoleConfig(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4">
              <p className="text-blue-300 text-xs leading-relaxed">
                For <strong>{playerCount} players</strong>: You need <strong>{goodCount} Good</strong> and <strong>{evilCount} Evil</strong> roles.
                Extra slots auto-fill with Loyal Servants / Minions.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-green-400 text-xs font-semibold mb-2 flex items-center gap-1">
                <span>✨</span> GOOD ROLES ({selectedGood.length}/{goodCount})
              </p>
              <div className="space-y-2">
                {goodRoles.map(role => {
                  const def = ROLE_DEFINITIONS[role];
                  const isSelected = selectedRoles.includes(role);
                  const available = def.minPlayers <= playerCount;
                  return (
                    <button
                      key={role}
                      onClick={() => available && toggleRole(role)}
                      disabled={!available}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected && available
                          ? 'bg-green-500/20 border-green-400/50'
                          : available
                          ? 'bg-white/5 border-white/10 hover:border-green-400/30'
                          : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      <img src={def.image} alt={def.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{def.name}</p>
                        <p className="text-gray-400 text-xs truncate">{def.description.substring(0, 50)}...</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected && available ? 'bg-green-500 border-green-400' : 'border-gray-600'
                      }`}>
                        {isSelected && available && <span className="text-white text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
                <span>💀</span> EVIL ROLES ({selectedEvil.length}/{evilCount})
              </p>
              <div className="space-y-2">
                {evilRoles.map(role => {
                  const def = ROLE_DEFINITIONS[role];
                  const isSelected = selectedRoles.includes(role);
                  const available = def.minPlayers <= playerCount;
                  return (
                    <button
                      key={role}
                      onClick={() => available && toggleRole(role)}
                      disabled={!available}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected && available
                          ? 'bg-red-500/20 border-red-400/50'
                          : available
                          ? 'bg-white/5 border-white/10 hover:border-red-400/30'
                          : 'bg-white/5 border-white/5 opacity-40'
                      }`}
                    >
                      <img src={def.image} alt={def.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{def.name}</p>
                        <p className="text-gray-400 text-xs truncate">{def.description.substring(0, 50)}...</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected && available ? 'bg-red-500 border-red-400' : 'border-gray-600'
                      }`}>
                        {isSelected && available && <span className="text-white text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={async () => {
                await updateRoomState(gameState.id, { availableRoles: selectedRoles });
                setShowRoleConfig(false);
              }}
              className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl active:scale-95 transition-all"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
