import React, { useState } from 'react';
import { saveConfig, FirebaseConfig } from '../firebase';
import { useGame } from '../context/GameContext';

export default function FirebaseSetupScreen({ onDone }: { onDone: () => void }) {
  const { initializeFirebase } = useGame();
  const [form, setForm] = useState<FirebaseConfig>({
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

  const handleChange = (key: keyof FirebaseConfig) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value.trim() }));
    setError('');
  };

  const handleParse = () => {
    try {
      let cleaned = pasteText.trim();
      // Handle SDK snippet format
      const match = cleaned.match(/firebaseConfig\s*=\s*(\{[\s\S]*?\})/);
      if (match) cleaned = match[1];
      // Try direct JSON parse
      cleaned = cleaned.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
      const parsed = JSON.parse(cleaned);
      setForm({
        apiKey: parsed.apiKey || '',
        authDomain: parsed.authDomain || '',
        databaseURL: parsed.databaseURL || '',
        projectId: parsed.projectId || '',
        storageBucket: parsed.storageBucket || '',
        messagingSenderId: parsed.messagingSenderId || '',
        appId: parsed.appId || '',
      });
      setPasteMode(false);
      setError('');
    } catch {
      setError('Could not parse config. Please fill fields manually.');
      setPasteMode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const required: (keyof FirebaseConfig)[] = ['apiKey', 'authDomain', 'databaseURL', 'projectId'];
    for (const key of required) {
      if (!form[key]) { setError(`Missing: ${key}`); setLoading(false); return; }
    }
    try {
      saveConfig(form);
      const ok = initializeFirebase(form);
      if (ok) { onDone(); }
      else { setError('Firebase init failed. Check your config.'); }
    } catch (err: unknown) {
      setError('Error: ' + (err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  const fields: { key: keyof FirebaseConfig; label: string; placeholder: string }[] = [
    { key: 'apiKey', label: 'API Key', placeholder: 'AIzaSy...' },
    { key: 'authDomain', label: 'Auth Domain', placeholder: 'project.firebaseapp.com' },
    { key: 'databaseURL', label: 'Database URL', placeholder: 'https://project-default-rtdb.firebaseio.com' },
    { key: 'projectId', label: 'Project ID', placeholder: 'my-avalon-app' },
    { key: 'storageBucket', label: 'Storage Bucket', placeholder: 'project.appspot.com' },
    { key: 'messagingSenderId', label: 'Messaging Sender ID', placeholder: '123456789' },
    { key: 'appId', label: 'App ID', placeholder: '1:123:web:abc' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: 'url(/images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🔥</div>
          <h1 className="text-3xl font-bold text-amber-400 font-serif">Firebase Setup</h1>
          <p className="text-gray-300 text-sm mt-2">One-time configuration — connects all devices</p>
        </div>

        <div className="bg-gray-900/95 border border-amber-800/50 rounded-2xl p-6 shadow-2xl">
          {/* Paste Mode Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setPasteMode(!pasteMode)}
              className="text-xs text-amber-400 border border-amber-700 rounded-lg px-3 py-1 hover:bg-amber-900/30 transition"
            >
              {pasteMode ? '✏️ Manual Entry' : '📋 Paste Config'}
            </button>
          </div>

          {pasteMode ? (
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Paste your Firebase config object:</label>
              <textarea
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 text-xs font-mono h-36 focus:outline-none focus:border-amber-500"
                placeholder={`const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "...",\n  databaseURL: "...",\n  ...\n};`}
                value={pasteText}
                onChange={e => setPasteText(e.target.value)}
              />
              <button
                onClick={handleParse}
                className="mt-2 w-full bg-amber-600 hover:bg-amber-500 text-white rounded-lg py-2 text-sm font-semibold transition"
              >
                Parse Config
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-gray-400 text-xs mb-1">{f.label}</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-amber-500 transition"
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={handleChange(f.key)}
                  />
                </div>
              ))}

              {error && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold rounded-xl py-3 text-base mt-2 transition shadow-lg"
              >
                {loading ? '⏳ Connecting...' : '🔗 Connect Firebase'}
              </button>
            </form>
          )}

          <div className="mt-4 p-3 bg-blue-950/50 border border-blue-800/50 rounded-lg">
            <p className="text-blue-300 text-xs">
              <span className="font-semibold">📖 How to get config:</span> Go to Firebase Console →
              Project Settings → Your Apps → Web App → SDK Setup → Config
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
