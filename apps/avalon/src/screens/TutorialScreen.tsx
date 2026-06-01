import { useState } from 'react';

const sections = [
  {
    id: 'overview',
    title: '📖 What is Avalon?',
    icon: '⚜️',
    content: (
      <div className="space-y-3">
        <p className="text-gray-300 text-sm leading-relaxed">
          The Resistance: Avalon is a social deduction game for <span className="text-amber-300 font-semibold">5–10 players</span>.
          Players are secretly assigned roles as either <span className="text-blue-300 font-semibold">Good</span> (Servants of Arthur)
          or <span className="text-red-300 font-semibold">Evil</span> (Minions of Mordred).
        </p>
        <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">⚔️ Good wins by:</p>
          <p className="text-gray-300 text-xs">Successfully completing 3 out of 5 quests AND the Assassin fails to identify Merlin.</p>
        </div>
        <div className="bg-red-950/40 border border-red-800/40 rounded-xl p-3">
          <p className="text-red-300 text-xs font-semibold mb-1">💀 Evil wins by:</p>
          <p className="text-gray-300 text-xs">Failing 3 quests, OR 5 consecutive team rejections, OR the Assassin correctly identifies Merlin.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'characters',
    title: '🎭 Characters',
    icon: '🃏',
    content: (
      <div className="space-y-3">
        {[
          { name: 'Merlin', team: 'Good', icon: '🧙', desc: 'Knows Evil (except Mordred). Must stay hidden or Evil wins at the end.' },
          { name: 'Percival', team: 'Good', icon: '🛡️', desc: 'Sees Merlin & Morgana but cannot tell which is which.' },
          { name: 'Loyal Servants', team: 'Good', icon: '⚔️', desc: 'No special knowledge. Must deduce Evil through behavior.' },
          { name: 'Morgana', team: 'Evil', icon: '🔮', desc: 'Appears as Merlin to Percival. Confuses and misdirects.' },
          { name: 'Mordred', team: 'Evil', icon: '🗡️', desc: 'Hidden from Merlin — the ultimate unknown threat.' },
          { name: 'Oberon', team: 'Evil', icon: '🌙', desc: 'Does not know other Evil players, and they don\'t know Oberon.' },
          { name: 'Assassin', team: 'Evil', icon: '🎯', desc: 'Tries to identify and kill Merlin if Good wins 3 quests.' },
          { name: 'Minions', team: 'Evil', icon: '💀', desc: 'Know other Evil teammates. Sabotage quests and team votes.' },
        ].map(c => (
          <div key={c.name}
            className={`flex items-start gap-3 rounded-xl p-3 border ${
              c.team === 'Good' ? 'bg-blue-950/30 border-blue-800/40' : 'bg-red-950/30 border-red-800/40'
            }`}>
            <span className="text-2xl">{c.icon}</span>
            <div>
              <p className="text-white text-sm font-semibold">{c.name} <span className={`text-xs ${c.team === 'Good' ? 'text-blue-400' : 'text-red-400'}`}>({c.team})</span></p>
              <p className="text-gray-400 text-xs mt-0.5">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'flow',
    title: '🎮 Game Flow',
    icon: '🔄',
    content: (
      <div className="space-y-3">
        {[
          { step: 1, phase: '🌙 Night Phase', desc: 'All players close eyes. Roles are secretly revealed. Evil sees teammates (based on roles). Open eyes.' },
          { step: 2, phase: '☀️ Day Phase', desc: 'The Quest Leader proposes a team. Discuss who should go on the quest.' },
          { step: 3, phase: '🗳️ Team Vote', desc: 'ALL players vote Approve or Reject the proposed team. Majority wins. 5 rejections = Evil wins.' },
          { step: 4, phase: '⚔️ Quest Phase', desc: 'Approved quest team members secretly vote Success or Fail. Evil may vote Fail to sabotage.' },
          { step: 5, phase: '🗡️ Assassination', desc: 'If Good wins 3 quests, the Assassin gets one chance to identify and kill Merlin.' },
          { step: 6, phase: '🏆 End Game', desc: 'All roles are revealed. Winners celebrate!' },
        ].map(s => (
          <div key={s.step} className="flex gap-3 bg-gray-800/50 border border-gray-700/30 rounded-xl p-3">
            <div className="w-7 h-7 rounded-full bg-amber-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{s.step}</div>
            <div>
              <p className="text-amber-300 text-sm font-semibold">{s.phase}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'local-setup',
    title: '💻 Local Setup Guide',
    icon: '🖥️',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-3">
          <p className="text-amber-300 text-xs font-semibold mb-1">⚠️ Fix for 404 / main.tsx Not Loading</p>
          <p className="text-gray-300 text-xs">This happens when you open index.html directly. You MUST use a dev server.</p>
        </div>

        <div className="space-y-3">
          {[
            { step: '1', title: 'Install Node.js', desc: 'Download from nodejs.org (v18 or newer). Includes npm.' },
            { step: '2', title: 'Clone / Download Project', cmd: 'git clone https://github.com/YOUR/avalon-game.git\ncd avalon-game' },
            { step: '3', title: 'Install Dependencies', cmd: 'npm install' },
            { step: '4', title: 'Start Dev Server', cmd: 'npm run dev', note: 'Opens at http://localhost:5173' },
            { step: '5', title: 'Build for Production', cmd: 'npm run build', note: 'Creates dist/ folder' },
            { step: '6', title: 'Preview Production Build', cmd: 'npm run preview', note: 'Tests the built version locally' },
          ].map(s => (
            <div key={s.step} className="bg-gray-900/80 border border-gray-700/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center font-bold">{s.step}</span>
                <p className="text-white text-sm font-semibold">{s.title}</p>
              </div>
              {s.cmd && (
                <pre className="bg-black/60 rounded-lg p-2 text-green-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{s.cmd}</pre>
              )}
              {s.note && <p className="text-gray-500 text-xs mt-1">→ {s.note}</p>}
              {s.desc && <p className="text-gray-400 text-xs">{s.desc}</p>}
            </div>
          ))}
        </div>

        <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">💡 Why can't I just open index.html?</p>
          <p className="text-gray-400 text-xs">
            React with Vite uses ES modules and TypeScript which require a server to compile.
            Double-clicking index.html skips compilation → blank screen or 404.
            Always use <code className="text-green-400">npm run dev</code>.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'github-pages',
    title: '🐙 GitHub Pages Deployment',
    icon: '🌐',
    content: (
      <div className="space-y-4">
        <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-3">
          <p className="text-amber-300 text-xs font-semibold mb-1">⚠️ Fix for 404 on GitHub Pages</p>
          <p className="text-gray-300 text-xs">GitHub Pages shows 404 when the base URL path doesn't match your repo name. Fix it in vite.config.ts.</p>
        </div>

        <div className="space-y-3">
          {[
            {
              step: '1',
              title: 'Fix vite.config.ts (base path)',
              cmd: `// vite.config.ts\nexport default defineConfig({\n  base: '/YOUR-REPO-NAME/',\n  plugins: [react(), tailwindcss()],\n});`,
              note: 'Replace YOUR-REPO-NAME with your GitHub repo name',
            },
            {
              step: '2',
              title: 'Build the project',
              cmd: 'npm run build',
              note: 'Creates dist/ folder with all files',
            },
            {
              step: '3',
              title: 'Install gh-pages package',
              cmd: 'npm install -D gh-pages',
            },
            {
              step: '4',
              title: 'Add deploy script to package.json',
              cmd: `"scripts": {\n  "deploy": "gh-pages -d dist"\n}`,
            },
            {
              step: '5',
              title: 'Deploy to GitHub Pages',
              cmd: 'npm run deploy',
              note: 'Pushes dist/ to gh-pages branch',
            },
            {
              step: '6',
              title: 'Enable GitHub Pages',
              desc: 'Go to your GitHub repo → Settings → Pages → Source: gh-pages branch → Save',
            },
            {
              step: '7',
              title: 'Fix 404 on refresh (SPA)',
              desc: 'Create a 404.html in public/ that redirects to index.html for client-side routing.',
              cmd: `<!-- public/404.html -->\n<script>\n  window.location.href = '/YOUR-REPO-NAME/';\n</script>`,
            },
          ].map(s => (
            <div key={s.step} className="bg-gray-900/80 border border-gray-700/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">{s.step}</span>
                <p className="text-white text-sm font-semibold">{s.title}</p>
              </div>
              {s.cmd && (
                <pre className="bg-black/60 rounded-lg p-2 text-green-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{s.cmd}</pre>
              )}
              {s.note && <p className="text-gray-500 text-xs mt-1">→ {s.note}</p>}
              {s.desc && <p className="text-gray-400 text-xs mt-1">{s.desc}</p>}
            </div>
          ))}
        </div>

        <div className="bg-green-950/40 border border-green-700/40 rounded-xl p-3">
          <p className="text-green-300 text-xs font-semibold mb-1">✅ Your game will be live at:</p>
          <p className="text-green-400 text-xs font-mono">https://USERNAME.github.io/REPO-NAME/</p>
        </div>
      </div>
    ),
  },
  {
    id: 'firebase-setup',
    title: '🔥 Firebase Setup Guide',
    icon: '🔥',
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          {[
            { step: '1', title: 'Create Firebase Project', desc: 'Go to console.firebase.google.com → Add project → Enter name → Continue' },
            {
              step: '2',
              title: 'Enable Realtime Database',
              desc: 'In Firebase Console → Build → Realtime Database → Create database → Start in test mode',
            },
            {
              step: '3',
              title: 'Set Database Rules (Development)',
              cmd: `{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}`,
              note: 'For production, use proper authentication rules',
            },
            { step: '4', title: 'Register Web App', desc: 'Project Settings (gear icon) → Your apps → Web (</>)  → Register app → Get config' },
            {
              step: '5',
              title: 'Your Firebase Config looks like:',
              cmd: `const firebaseConfig = {\n  apiKey: "AIzaSy...",\n  authDomain: "project.firebaseapp.com",\n  databaseURL: "https://project-rtdb.firebaseio.com",\n  projectId: "your-project",\n  storageBucket: "project.appspot.com",\n  messagingSenderId: "1234567890",\n  appId: "1:123:web:abc"\n};`,
            },
            { step: '6', title: 'Enter in Avalon App', desc: 'On first launch, the app shows the Firebase Setup screen. Paste your config or fill the fields manually.' },
            { step: '7', title: 'Config is saved locally', desc: 'Once configured, all devices that connect with the same config will join the same game network.' },
          ].map(s => (
            <div key={s.step} className="bg-gray-900/80 border border-gray-700/40 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-orange-700 text-white text-xs flex items-center justify-center font-bold">{s.step}</span>
                <p className="text-white text-sm font-semibold">{s.title}</p>
              </div>
              {s.cmd && (
                <pre className="bg-black/60 rounded-lg p-2 text-green-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{s.cmd}</pre>
              )}
              {s.desc && <p className="text-gray-400 text-xs">{s.desc}</p>}
              {s.note && <p className="text-amber-400 text-xs mt-1">⚠️ {s.note}</p>}
            </div>
          ))}
        </div>

        <div className="bg-blue-950/40 border border-blue-700/40 rounded-xl p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">🌐 Same WiFi / IP Connection</p>
          <p className="text-gray-400 text-xs">
            All players must be on the same WiFi network OR have internet access to reach Firebase.
            Firebase Realtime Database syncs all game state instantly across all devices.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'faq',
    title: '❓ FAQ',
    icon: '💬',
    content: (
      <div className="space-y-3">
        {[
          { q: 'Why is the screen blank?', a: 'You opened index.html directly. Run "npm run dev" and open http://localhost:5173 instead.' },
          { q: 'Why does GitHub Pages show 404?', a: 'Add base: "/your-repo-name/" to vite.config.ts and redeploy.' },
          { q: 'Firebase connection failed?', a: 'Check your databaseURL — it must include "https://" and end in ".firebaseio.com".' },
          { q: 'Can players be on different WiFi networks?', a: 'Yes! As long as everyone has internet access to reach Firebase Realtime Database.' },
          { q: 'How do I access Admin settings?', a: 'Create a profile with email: buenavistaaglinaodanny@gmail.com. Admin button appears on home screen.' },
          { q: 'Game not starting?', a: 'You need at least 5 connected players. Only the Host can start the game.' },
          { q: 'Can I use this offline?', a: 'Firebase requires internet. For LAN play, make sure all devices can reach Firebase servers.' },
          { q: 'Cards showing wrong?', a: 'Character images are in /public/images/. Ensure they were generated during build.' },
        ].map((faq, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-3">
            <p className="text-amber-300 text-sm font-semibold mb-1">Q: {faq.q}</p>
            <p className="text-gray-400 text-xs">A: {faq.a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function TutorialScreen({ onBack }: { onBack: () => void }) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col"
      style={{ backgroundImage: 'url(./images/avalon_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/88" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 pt-5 border-b border-gray-800">
          <button onClick={onBack} className="text-amber-400 hover:text-amber-300 transition text-sm">← Back</button>
          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold text-amber-400 font-serif">📖 Guide & Tutorial</h2>
          </div>
          <div className="w-10" />
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto gap-2 px-4 py-3 border-b border-gray-800/50" style={{ scrollbarWidth: 'none' }}>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSection === i
                  ? 'bg-amber-700 text-white'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60'
              }`}
            >
              {s.icon} {s.title.replace(/[📖🎭🎮💻🐙🔥❓]\s/, '')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xl font-bold text-amber-400 font-serif mb-4">{sections[activeSection].title}</h3>
          {sections[activeSection].content}
        </div>
      </div>
    </div>
  );
}
