import { GameState, Player, ROLE_DEFINITIONS } from '../types';
import { updateRoomState } from '../dbService';
import QuestBoard from './QuestBoard';

interface GameOverProps {
  gameState: GameState;
  myPlayer: Player;
  onPlayAgain: () => void;
}

export default function GameOverScreen({ gameState, myPlayer, onPlayAgain }: GameOverProps) {
  const players = Object.values(gameState.players || {});
  const winner = gameState.winner;
  const isHost = myPlayer.id === gameState.hostId;
  const isGoodWin = winner === 'good';

  const goodPlayers = players.filter(p => p.role && ROLE_DEFINITIONS[p.role].alignment === 'good');
  const evilPlayers = players.filter(p => p.role && ROLE_DEFINITIONS[p.role].alignment === 'evil');

  const handlePlayAgain = async () => {
    await updateRoomState(gameState.id, {
      phase: 'lobby',
      questResults: [],
      teamVotes: {},
      questVotes: {},
      selectedTeam: [],
      currentRound: 1,
      currentLeaderIndex: 0,
      rejectedVotes: 0,
      winner: undefined,
      winReason: undefined,
      assassinTarget: undefined,
      players: Object.fromEntries(
        players.map(p => [p.id, { ...p, role: undefined, hasVoted: false, vote: undefined }])
      ),
    } as any);
    onPlayAgain();
  };

  return (
    <div className={`min-h-screen flex flex-col p-4 relative overflow-hidden ${
      isGoodWin
        ? 'bg-gradient-to-b from-[#000a1a] via-[#001a2e] to-[#000a1a]'
        : 'bg-gradient-to-b from-[#1a0000] via-[#2a0000] to-[#1a0000]'
    }`}>
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse"
            style={{
              width: Math.random()*3+1+'px',
              height: Math.random()*3+1+'px',
              top: Math.random()*100+'%',
              left: Math.random()*100+'%',
              opacity: Math.random()*0.6+0.1,
              background: isGoodWin
                ? (Math.random() > 0.5 ? '#60a5fa' : '#fbbf24')
                : (Math.random() > 0.5 ? '#ef4444' : '#fff'),
              animationDuration: Math.random()*3+1+'s',
            }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col gap-4 pb-6">
        {/* Victory/Defeat Banner */}
        <div className={`text-center pt-6 rounded-3xl p-6 border-2 ${
          isGoodWin
            ? 'bg-blue-900/30 border-blue-400/50'
            : 'bg-red-900/30 border-red-400/50'
        }`}>
          <div className="text-6xl mb-3">{isGoodWin ? '⚔️' : '💀'}</div>
          <div className={`text-xs tracking-[0.4em] mb-2 ${isGoodWin ? 'text-blue-400' : 'text-red-400'}`}>
            {isGoodWin ? '✨ THE LIGHT PREVAILS' : '💀 DARKNESS CONQUERS'}
          </div>
          <h1 className={`text-4xl font-bold mb-3 ${isGoodWin ? 'text-blue-200' : 'text-red-200'}`}>
            {isGoodWin ? 'GOOD WINS!' : 'EVIL WINS!'}
          </h1>
          {gameState.winReason && (
            <p className="text-gray-300 text-sm leading-relaxed">{gameState.winReason}</p>
          )}
        </div>

        {/* My role result */}
        <div className={`rounded-2xl p-4 border ${
          myPlayer.role && ROLE_DEFINITIONS[myPlayer.role].alignment === winner
            ? 'bg-green-900/30 border-green-500/40'
            : 'bg-gray-900/30 border-white/10'
        }`}>
          <div className="flex items-center gap-3">
            {myPlayer.role && (
              <img
                src={ROLE_DEFINITIONS[myPlayer.role].image}
                alt={ROLE_DEFINITIONS[myPlayer.role].name}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
            )}
            <div>
              <p className="text-gray-400 text-xs mb-0.5">You were</p>
              <h3 className="text-white font-bold text-lg">
                {myPlayer.role ? ROLE_DEFINITIONS[myPlayer.role].name : '?'}
              </h3>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
                myPlayer.role && ROLE_DEFINITIONS[myPlayer.role].alignment === 'good'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {myPlayer.role && ROLE_DEFINITIONS[myPlayer.role].alignment === 'good' ? '✨ Good' : '💀 Evil'}
              </div>
              {myPlayer.role && ROLE_DEFINITIONS[myPlayer.role].alignment === winner && (
                <p className="text-green-400 text-xs mt-1">🎉 You won!</p>
              )}
              {myPlayer.role && ROLE_DEFINITIONS[myPlayer.role].alignment !== winner && (
                <p className="text-gray-500 text-xs mt-1">😔 You lost.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quest Board Final */}
        <QuestBoard gameState={gameState} myPlayer={myPlayer} compact={false} />

        {/* Full Role Reveal */}
        <div>
          <p className="text-gray-400 text-xs font-semibold tracking-wider mb-3">— FULL ROLE REVEAL —</p>

          {/* Good team */}
          <div className="mb-3">
            <p className="text-blue-400 text-xs font-semibold mb-2 flex items-center gap-1">
              ✨ GOOD ({goodPlayers.length})
            </p>
            <div className="space-y-2">
              {goodPlayers.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-blue-900/20 border border-blue-500/20 rounded-xl p-2.5">
                  <img
                    src={p.role ? ROLE_DEFINITIONS[p.role].image : '/cards/loyal_servant.png'}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-400/30 flex items-center justify-center text-xl flex-shrink-0">
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {p.name} {p.id === myPlayer.id && <span className="text-amber-400 text-xs">(You)</span>}
                    </p>
                    <p className="text-blue-300 text-xs">{p.role ? ROLE_DEFINITIONS[p.role].name : 'Unknown'}</p>
                  </div>
                  {isGoodWin && <span className="text-yellow-400 text-xl">🏆</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Evil team */}
          <div>
            <p className="text-red-400 text-xs font-semibold mb-2 flex items-center gap-1">
              💀 EVIL ({evilPlayers.length})
            </p>
            <div className="space-y-2">
              {evilPlayers.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-red-900/20 border border-red-500/20 rounded-xl p-2.5">
                  <img
                    src={p.role ? ROLE_DEFINITIONS[p.role].image : '/cards/minion.png'}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-400/30 flex items-center justify-center text-xl flex-shrink-0">
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {p.name} {p.id === myPlayer.id && <span className="text-amber-400 text-xs">(You)</span>}
                    </p>
                    <p className="text-red-300 text-xs">{p.role ? ROLE_DEFINITIONS[p.role].name : 'Unknown'}</p>
                  </div>
                  {!isGoodWin && <span className="text-yellow-400 text-xl">🏆</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Play Again */}
        {isHost && (
          <button
            onClick={handlePlayAgain}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl active:scale-95 transition-all shadow-lg text-sm tracking-wider mt-2"
          >
            ⚔️ PLAY AGAIN
          </button>
        )}
        {!isHost && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-sm">⏳ Waiting for host to start a new game...</p>
          </div>
        )}
      </div>
    </div>
  );
}
