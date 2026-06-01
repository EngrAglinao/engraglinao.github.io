import { useState } from 'react';
import { getGameName, setGameName, getGameIcon, setGameIcon, ADMIN_EMAIL, clearFirebaseConfig } from '../firebase';
import { setAdminSetting } from '../dbService';

interface AdminSettingsProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSettings({ onClose, onLogout }: AdminSettingsProps) {
  const [gameName, setGameNameLocal] = useState(getGameName());
  const [_gameIcon, setGameIconLocal] = useState<string | null>(getGameIcon());
  const [tab, setTab] = useState<'general' | 'firebase' | 'danger'>('general');
  const [saved, setSaved] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(getGameIcon());
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveGeneral = async () => {
    setGameName(gameName);
    if (iconPreview) {
      setGameIcon(iconPreview);
      setGameIconLocal(iconPreview);
    }
    try {
      await setAdminSetting('gameName', gameName);
      if (iconPreview) await setAdminSetting('gameIcon', iconPreview);
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setIconPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleResetFirebase = () => {
    clearFirebaseConfig();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
      <div className="bg-[#0a0a1a] border-b border-amber-400/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">⚙️</span>
          <h2 className="text-white font-bold text-base">Admin Settings</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onLogout} className="text-gray-500 text-xs hover:text-red-400 transition-colors">
            Sign Out
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg ml-2">✕</button>
        </div>
      </div>

      {/* Admin badge */}
      <div className="bg-amber-500/10 border-b border-amber-400/20 px-4 py-2 flex items-center gap-2">
        <span className="text-amber-400 text-xs">👑</span>
        <span className="text-amber-300 text-xs font-semibold">Logged in as Admin</span>
        <span className="text-gray-500 text-xs ml-auto">{ADMIN_EMAIL}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['general', 'firebase', 'danger'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-all ${
              tab === t
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t === 'general' ? '🎨 General' : t === 'firebase' ? '🔥 Firebase' : '⚠️ Danger'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 'general' && (
          <div className="space-y-5">
            {/* Game Name */}
            <div>
              <label className="text-gray-400 text-xs block mb-1">Game Name</label>
              <input
                type="text"
                maxLength={20}
                className="w-full bg-black/40 border border-gray-600 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
                value={gameName}
                onChange={e => setGameNameLocal(e.target.value)}
                placeholder="AVALON"
              />
              <p className="text-gray-600 text-xs mt-1">Displayed on all screens</p>
            </div>

            {/* Game Icon */}
            <div>
              <label className="text-gray-400 text-xs block mb-2">App Icon</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-amber-400/30 flex items-center justify-center overflow-hidden bg-black/30">
                  {iconPreview ? (
                    <img src={iconPreview} alt="icon" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">⚔️</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="py-2.5 px-4 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-300 text-sm font-semibold text-center hover:bg-amber-500/30 transition-all active:scale-95">
                      📁 Upload Icon
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconUpload}
                    />
                  </label>
                  {iconPreview && (
                    <button
                      onClick={() => { setIconPreview(null); setGameIconLocal(null); }}
                      className="w-full mt-2 py-2 text-red-400 text-xs hover:text-red-300 transition-colors"
                    >
                      Remove Icon
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-2">Shown on start screen and lobby</p>
            </div>

            {/* Preview */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-xs mb-3">Preview</p>
              <div className="flex flex-col items-center gap-2">
                {iconPreview ? (
                  <img src={iconPreview} alt="preview" className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                ) : (
                  <span className="text-5xl">⚔️</span>
                )}
                <span className="text-amber-400 font-bold text-2xl tracking-widest">{gameName || 'AVALON'}</span>
                <span className="text-amber-200/50 text-xs">THE RESISTANCE</span>
              </div>
            </div>

            <button
              onClick={handleSaveGeneral}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl active:scale-95 transition-all"
            >
              {saved ? '✅ Saved!' : '💾 Save Changes'}
            </button>
          </div>
        )}

        {tab === 'firebase' && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-lg">✅</span>
                <p className="text-green-300 font-semibold">Firebase Connected</p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Firebase is configured and active. All players on the same network can connect to rooms.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-xs font-semibold mb-3">CONNECTION REQUIREMENTS</p>
              <div className="space-y-2">
                {[
                  { icon: '📶', label: 'Same WiFi Network', desc: 'All players must be on the same WiFi' },
                  { icon: '🔥', label: 'Firebase Realtime DB', desc: 'Syncs game state in real-time' },
                  { icon: '📱', label: 'Mobile Optimized', desc: 'Designed for phone screens' },
                  { icon: '🔄', label: 'Auto-sync', desc: 'No manual refresh needed' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-white text-xs font-semibold">{item.label}</p>
                      <p className="text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-blue-300 text-xs leading-relaxed">
                💡 <strong>Tip:</strong> Make sure your Firebase Realtime Database rules allow read/write.
                Go to Firebase Console → Realtime Database → Rules.
              </p>
            </div>
          </div>
        )}

        {tab === 'danger' && (
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                <span>⚠️</span> Danger Zone
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                These actions cannot be undone. Proceed with caution.
              </p>
            </div>

            {/* Reset Firebase */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white font-semibold text-sm mb-1">Reset Firebase Configuration</p>
              <p className="text-gray-400 text-xs mb-3">
                Clears the stored Firebase config. The app will show the setup screen again on next load.
                Other devices will also need to reconfigure.
              </p>
              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2.5 bg-red-900/50 border border-red-500/40 text-red-300 font-semibold rounded-xl text-sm active:scale-95 transition-all"
                >
                  🗑️ Reset Firebase Config
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-400 text-xs text-center font-semibold">Are you sure? This will log everyone out.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="flex-1 py-2.5 bg-white/10 text-gray-300 font-semibold rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleResetFirebase}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm active:scale-95 transition-all"
                    >
                      Yes, Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Clear local data */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white font-semibold text-sm mb-1">Clear Local Data</p>
              <p className="text-gray-400 text-xs mb-3">
                Clears your saved profile and local settings on this device only.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem('avalon_player_name');
                  localStorage.removeItem('avalon_player_avatar');
                  localStorage.removeItem('avalon_player_id');
                  localStorage.removeItem('avalon_game_name');
                  localStorage.removeItem('avalon_game_icon');
                  window.location.reload();
                }}
                className="w-full py-2.5 bg-orange-900/50 border border-orange-500/40 text-orange-300 font-semibold rounded-xl text-sm active:scale-95 transition-all"
              >
                🧹 Clear Local Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
