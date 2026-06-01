import React, { useState } from 'react';
import { FirebaseConfig } from '../types/game';
import { initializeFirebase, saveFirebaseConfig } from '../firebase/config';
import { Database } from 'firebase/database';

interface Props {
  onSuccess: (db: Database) => void;
  onSkip?: () => void;
}

export default function FirebaseSetup({ onSuccess, onSkip }: Props) {
  const [step, setStep] = useState<'login' | 'form'>('login');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [config, setConfig] = useState<FirebaseConfig>({
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
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';

  const handleEmailCheck = () => {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setEmailError('❌ Only the admin can configure Firebase settings.');
      return;
    }
    setEmailError('');
    setStep('form');
  };

  const parseFirebaseConfig = (text: string): Partial<FirebaseConfig> => {
    const result: Partial<FirebaseConfig> = {};
    const patterns: { key: keyof FirebaseConfig; regex: RegExp }[] = [
      { key: 'apiKey', regex: /apiKey:\s*["']([^"']+)["']/ },
      { key: 'authDomain', regex: /authDomain:\s*["']([^"']+)["']/ },
      { key: 'databaseURL', regex: /databaseURL:\s*["']([^"']+)["']/ },
      { key: 'projectId', regex: /projectId:\s*["']([^"']+)["']/ },
      { key: 'storageBucket', regex: /storageBucket:\s*["']([^"']+)["']/ },
      { key: 'messagingSenderId', regex: /messagingSenderId:\s*["']([^"']+)["']/ },
      { key: 'appId', regex: /appId:\s*["']([^"']+)["']/ },
    ];
    for (const { key, regex } of patterns) {
      const match = text.match(regex);
      if (match) result[key] = match[1];
    }
    return result;
  };

  const handlePasteParse = () => {
    const parsed = parseFirebaseConfig(pasteText);
    setConfig((prev) => ({ ...prev, ...parsed }));
    setPasteMode(false);
    setPasteText('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    if (!config.apiKey || !config.databaseURL || !config.projectId) {
      setError('Please fill in at least: API Key, Database URL, and Project ID.');
      setLoading(false);
      return;
    }

    try {
      const db = await initializeFirebase(config);
      saveFirebaseConfig(config);
      onSuccess(db);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError('Firebase connection failed: ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-4xl font-bold text-white mb-2">Avalon</h1>
          <p className="text-purple-300 text-lg">The Resistance</p>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>

        {step === 'login' ? (
          <div className="bg-gray-900/80 backdrop-blur border border-purple-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h2 className="text-xl font-bold text-white">Admin Firebase Setup</h2>
              <p className="text-gray-400 text-sm mt-2">
                First-time setup requires admin authorization.<br />
                Only the designated admin can configure Firebase.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEmailCheck()}
                  placeholder="Enter admin email..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {emailError && (
                  <p className="text-red-400 text-sm mt-2">{emailError}</p>
                )}
              </div>

              <button
                onClick={handleEmailCheck}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/50"
              >
                Continue as Admin
              </button>

              {onSkip && (
                <button
                  onClick={onSkip}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
                >
                  ← Back to Game
                </button>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800/50 rounded-xl">
              <p className="text-blue-300 text-xs text-center">
                ℹ️ This setup only needs to be done once. After configuration, all players on the same WiFi network can play together.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur border border-purple-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">🔥</div>
              <h2 className="text-xl font-bold text-white">Firebase Configuration</h2>
              <p className="text-gray-400 text-sm mt-2">
                Enter your Firebase Realtime Database credentials.
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700/50 rounded-xl">
              <p className="text-amber-300 text-xs font-bold mb-2">📋 HOW TO GET THESE VALUES:</p>
              <ol className="text-amber-200/80 text-xs space-y-1 list-decimal list-inside">
                <li>Go to <span className="text-amber-300 font-mono">console.firebase.google.com</span></li>
                <li>Create or open your project</li>
                <li>Click the gear icon → Project Settings</li>
                <li>Scroll to "Your apps" → Add Web App (or select existing)</li>
                <li>Copy the <span className="text-amber-300">firebaseConfig</span> object</li>
                <li>Enable <span className="text-amber-300">Realtime Database</span> in your project</li>
                <li>Set Database Rules to <span className="text-amber-300 font-mono">read: true, write: true</span></li>
              </ol>
            </div>

            {/* Paste Mode Toggle */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setPasteMode(!pasteMode)}
                className="w-full bg-indigo-800/50 hover:bg-indigo-700/50 border border-indigo-600/50 text-indigo-300 font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                {pasteMode ? '📝 Manual Entry Instead' : '📋 Paste Firebase Config Code'}
              </button>
            </div>

            {pasteMode ? (
              <div className="space-y-3">
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={`Paste your firebaseConfig object here:\n\nconst firebaseConfig = {\n  apiKey: "...",\n  authDomain: "...",\n  databaseURL: "...",\n  ...\n};`}
                  rows={10}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-xs font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
                <button
                  type="button"
                  onClick={handlePasteParse}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Parse Config
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {(
                  [
                    { key: 'apiKey', label: 'API Key', required: true },
                    { key: 'authDomain', label: 'Auth Domain', required: false },
                    { key: 'databaseURL', label: 'Database URL', required: true, placeholder: 'https://your-project.firebaseio.com' },
                    { key: 'projectId', label: 'Project ID', required: true },
                    { key: 'storageBucket', label: 'Storage Bucket', required: false },
                    { key: 'messagingSenderId', label: 'Messaging Sender ID', required: false },
                    { key: 'appId', label: 'App ID', required: false },
                  ] as { key: keyof FirebaseConfig; label: string; required: boolean; placeholder?: string }[]
                ).map(({ key, label, required, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      {label} {required && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="text"
                      value={config[key]}
                      onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder || `Your ${label}...`}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                ))}

                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('login')}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-purple-900/50"
                  >
                    {loading ? '⏳ Connecting...' : '🔗 Connect Firebase'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
