import { useState } from 'react';
import { initFirebase } from '../firebase';

interface FirebaseSetupProps {
  onComplete: () => void;
}

export default function FirebaseSetup({ onComplete }: FirebaseSetupProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [useJson, setUseJson] = useState(false);

  const handleJsonParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setConfig({
        apiKey: parsed.apiKey || '',
        authDomain: parsed.authDomain || '',
        databaseURL: parsed.databaseURL || '',
        projectId: parsed.projectId || '',
        storageBucket: parsed.storageBucket || '',
        messagingSenderId: parsed.messagingSenderId || '',
        appId: parsed.appId || '',
      });
      setUseJson(false);
      setStep(2);
    } catch {
      setError('Invalid JSON. Please check your Firebase config.');
    }
  };

  const handleConnect = async () => {
    setError('');
    if (!config.apiKey || !config.databaseURL || !config.projectId) {
      setError('API Key, Database URL, and Project ID are required.');
      return;
    }
    setLoading(true);
    try {
      initFirebase(config);
      setTimeout(() => {
        setLoading(false);
        onComplete();
      }, 1500);
    } catch (e: any) {
      setLoading(false);
      setError(e.message || 'Failed to connect to Firebase.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2e] to-[#0a0a1a] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">⚔️</div>
          <h1 className="text-4xl font-bold text-amber-400 tracking-widest drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            AVALON
          </h1>
          <p className="text-amber-200/60 text-sm mt-1 tracking-wider">FIRST-TIME SETUP</p>
        </div>

        <div className="bg-white/5 border border-amber-400/20 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-black">
              🔥
            </div>
            <h2 className="text-white font-bold text-lg">Firebase Configuration</h2>
          </div>

          <p className="text-gray-400 text-xs mb-5 leading-relaxed">
            This setup only runs once. Go to{' '}
            <span className="text-amber-400 font-semibold">Firebase Console</span> → Project Settings → Your apps
            → Web app → Config to get your credentials.
          </p>

          {step === 1 && (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setUseJson(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    !useJson ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => setUseJson(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                    useJson ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  Paste JSON
                </button>
              </div>

              {useJson ? (
                <>
                  <textarea
                    className="w-full bg-black/40 border border-gray-600 rounded-xl p-3 text-white text-xs font-mono h-40 resize-none focus:border-amber-400 focus:outline-none"
                    placeholder={`{\n  "apiKey": "...",\n  "authDomain": "...",\n  "databaseURL": "...",\n  "projectId": "...",\n  "storageBucket": "...",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                    value={jsonInput}
                    onChange={e => setJsonInput(e.target.value)}
                  />
                  {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  <button
                    onClick={handleJsonParse}
                    className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all active:scale-95"
                  >
                    Parse JSON →
                  </button>
                </>
              ) : (
                <>
                  {[
                    { key: 'apiKey', label: 'API Key', placeholder: 'AIza...' },
                    { key: 'authDomain', label: 'Auth Domain', placeholder: 'project.firebaseapp.com' },
                    { key: 'databaseURL', label: 'Database URL *', placeholder: 'https://project-default-rtdb.firebaseio.com' },
                    { key: 'projectId', label: 'Project ID *', placeholder: 'my-avalon-game' },
                    { key: 'storageBucket', label: 'Storage Bucket', placeholder: 'project.appspot.com' },
                    { key: 'messagingSenderId', label: 'Messaging Sender ID', placeholder: '123456789' },
                    { key: 'appId', label: 'App ID', placeholder: '1:123:web:abc' },
                  ].map(field => (
                    <div key={field.key} className="mb-3">
                      <label className="text-gray-400 text-xs block mb-1">{field.label}</label>
                      <input
                        type="text"
                        className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-400 focus:outline-none"
                        placeholder={field.placeholder}
                        value={config[field.key as keyof typeof config]}
                        onChange={e => setConfig(c => ({ ...c, [field.key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  <button
                    onClick={() => { setError(''); setStep(2); }}
                    className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all active:scale-95"
                  >
                    Next →
                  </button>
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-3 mb-5">
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Project ID</p>
                  <p className="text-amber-300 text-sm font-mono truncate">{config.projectId || '—'}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Database URL</p>
                  <p className="text-amber-300 text-sm font-mono truncate">{config.databaseURL || '—'}</p>
                </div>
                <div className="bg-black/30 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">Admin Account</p>
                  <p className="text-green-400 text-xs font-mono">buenavistaaglinaodanny@gmail.com</p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-5">
                <p className="text-amber-300 text-xs leading-relaxed">
                  ⚠️ <strong>Important:</strong> Make sure your Firebase Realtime Database rules allow read/write access.
                  Set rules to <code className="bg-black/30 px-1 rounded">true</code> for testing.
                </p>
              </div>

              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-white/10 text-gray-300 font-bold rounded-xl transition-all active:scale-95"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">🔥</span> Connecting...
                    </span>
                  ) : (
                    '🔥 Connect'
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Powered by Firebase Realtime Database
        </p>
      </div>
    </div>
  );
}
