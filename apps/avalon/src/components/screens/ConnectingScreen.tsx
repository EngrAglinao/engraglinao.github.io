import { Button } from '../ui/Button';

interface ConnectingScreenProps {
  isHost: boolean;
  roomCode: string;
  connectionError: string | null;
  onBack: () => void;
}

export function ConnectingScreen({ isHost, roomCode, connectionError, onBack }: ConnectingScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 items-center justify-center px-6 text-center">
      <div className="text-6xl mb-6">{isHost ? '🏰' : '🔗'}</div>

      {connectionError ? (
        <>
          <h2 className="font-cinzel text-xl font-bold text-red-400 mb-3">Connection Failed</h2>
          <div className="bg-red-900/30 border border-red-500/40 rounded-2xl p-4 mb-6 max-w-sm">
            <p className="font-crimson text-red-200 text-sm leading-relaxed">{connectionError}</p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4 mb-6 text-left max-w-sm">
            <p className="font-cinzel text-yellow-400 text-xs uppercase tracking-widest mb-2">Tips</p>
            <ul className="font-crimson text-slate-300 text-sm space-y-1.5">
              <li>• Ensure all devices are on the <strong>same WiFi network</strong></li>
              <li>• Double-check the room code</li>
              <li>• Make sure the host is online first</li>
              <li>• Disable VPN if active</li>
            </ul>
          </div>
          <Button variant="secondary" size="lg" onClick={onBack}>
            ← Go Back
          </Button>
        </>
      ) : (
        <>
          <h2 className="font-cinzel text-xl font-bold text-white mb-2">
            {isHost ? 'Creating Room...' : 'Joining Room...'}
          </h2>
          {!isHost && (
            <p className="font-crimson text-slate-400 mb-6">
              Connecting to room <span className="text-yellow-400 font-cinzel font-bold tracking-widest">{roomCode}</span>
            </p>
          )}
          {isHost && (
            <p className="font-crimson text-slate-400 mb-6">
              Your room code: <span className="text-yellow-400 font-cinzel font-bold tracking-widest">{roomCode}</span>
            </p>
          )}

          <div className="flex gap-2 justify-center mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-yellow-400"
                style={{
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4 max-w-sm">
            <p className="font-crimson text-slate-400 text-sm leading-relaxed">
              {isHost
                ? 'Waiting for connection... Share the room code with other players on the same WiFi.'
                : 'Connecting to the host... Make sure you are on the same WiFi network.'}
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-6 font-cinzel text-slate-500 text-sm underline"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
