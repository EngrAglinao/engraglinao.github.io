import { useState } from 'react';
import { ROLE_INFO } from '../types/game';

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'roles' | 'quests' | 'setup'>('overview');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-800/50 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-black text-xl">📖 How to Play Avalon</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b border-gray-800">
          {(['overview', 'roles', 'quests', 'setup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 text-xs py-2 rounded-lg font-medium capitalize transition-colors ${
                tab === t ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              {t === 'overview' ? '🏰 Overview' : t === 'roles' ? '🎭 Roles' : t === 'quests' ? '⚔️ Quests' : '⚙️ Setup'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-blue-900/30 border border-blue-800/50 rounded-xl p-3">
                <p className="text-blue-300 text-sm font-bold mb-1">🎯 Objective</p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Avalon is a social deduction game. <span className="text-blue-300 font-bold">Good</span> team tries to pass 3 quests. 
                  <span className="text-red-400 font-bold"> Evil</span> team tries to fail 3 quests or cause 5 team rejections.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-bold text-sm">📋 Game Flow</p>
                {[
                  { icon: '🌙', step: 'Night Phase', desc: 'Players secretly learn their roles and see limited info based on their role.' },
                  { icon: '👑', step: 'Team Building', desc: 'The Leader selects players to go on the Quest.' },
                  { icon: '🗳️', step: 'Team Vote', desc: 'ALL players vote to Approve or Reject the proposed team.' },
                  { icon: '⚔️', step: 'Quest Vote', desc: 'Selected quest members secretly play Pass or Fail cards.' },
                  { icon: '📜', step: 'Quest Result', desc: 'Even one Fail card fails the quest (4th quest needs 2 Fails for 7+ players).' },
                  { icon: '🗡️', step: 'Assassination', desc: 'If Good passes 3 quests, the Assassin gets one shot at killing Merlin!' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3 bg-gray-800/50 rounded-lg p-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-white text-xs font-bold">{item.step}</p>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-900/30 border border-amber-800/50 rounded-xl p-3">
                <p className="text-amber-300 text-xs font-bold mb-1">⚠️ 5 Rejections Rule</p>
                <p className="text-gray-300 text-xs">If 5 consecutive team proposals are rejected without a vote passing, Evil wins immediately!</p>
              </div>
            </div>
          )}

          {tab === 'roles' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">Tap a role to learn more</p>
              {Object.entries(ROLE_INFO).map(([role, info]) => (
                <div key={role} className={`rounded-xl p-3 border ${info.team === 'good' ? 'bg-blue-900/20 border-blue-800/40' : 'bg-red-900/20 border-red-800/40'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <span className={`font-bold text-sm ${info.color}`}>{role}</span>
                      <span className={`text-xs ml-2 ${info.team === 'good' ? 'text-blue-400' : 'text-red-400'}`}>
                        {info.team === 'good' ? '✨ Good' : '😈 Evil'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{info.description}</p>
                  
                  {/* Special visibility rules */}
                  {role === 'Merlin' && (
                    <div className="mt-2 bg-blue-950/50 rounded-lg p-2">
                      <p className="text-blue-300 text-xs">👁️ Sees: All evil players <span className="text-red-400">EXCEPT Mordred</span></p>
                    </div>
                  )}
                  {role === 'Percival' && (
                    <div className="mt-2 bg-cyan-950/50 rounded-lg p-2">
                      <p className="text-cyan-300 text-xs">👁️ Sees: Merlin & Morgana (but doesn't know which is which)</p>
                    </div>
                  )}
                  {role === 'Morgana' && (
                    <div className="mt-2 bg-purple-950/50 rounded-lg p-2">
                      <p className="text-purple-300 text-xs">👁️ Sees: Merlin's identity | Appears as Merlin to Percival</p>
                    </div>
                  )}
                  {role === 'Mordred' && (
                    <div className="mt-2 bg-orange-950/50 rounded-lg p-2">
                      <p className="text-orange-300 text-xs">👁️ Hidden from Merlin | Knows evil allies</p>
                    </div>
                  )}
                  {role === 'Oberon' && (
                    <div className="mt-2 bg-pink-950/50 rounded-lg p-2">
                      <p className="text-pink-300 text-xs">👁️ Doesn't know evil allies | Allies don't know Oberon | Merlin sees Oberon</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'quests' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left py-2 px-2">Players</th>
                      <th className="px-2">Evil</th>
                      <th className="px-2">Q1</th>
                      <th className="px-2">Q2</th>
                      <th className="px-2">Q3</th>
                      <th className="px-2">Q4</th>
                      <th className="px-2">Q5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { p: 5, e: 2, q: [2, 3, 2, 3, 3] },
                      { p: 6, e: 2, q: [2, 3, 4, 3, 4] },
                      { p: 7, e: 3, q: [2, 3, 3, 4, 4] },
                      { p: 8, e: 3, q: [3, 4, 4, 5, 5] },
                      { p: 9, e: 3, q: [3, 4, 4, 5, 5] },
                      { p: 10, e: 4, q: [3, 4, 4, 5, 5] },
                    ].map((row) => (
                      <tr key={row.p} className="border-t border-gray-800">
                        <td className="py-2 px-2 text-white font-bold">{row.p} Players</td>
                        <td className="text-center px-2 text-red-400">{row.e}</td>
                        {row.q.map((size, i) => (
                          <td key={i} className={`text-center px-2 ${i === 3 && row.p >= 7 ? 'text-amber-400 font-bold' : 'text-gray-300'}`}>
                            {size}{i === 3 && row.p >= 7 ? '*' : ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-amber-400 text-xs mt-2">* Quest 4 with 7+ players requires 2 Fail cards to fail</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                <p className="text-white text-sm font-bold mb-2">🏆 Winning Conditions</p>
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <span className="text-green-400 text-sm mt-0.5">✅</span>
                    <p className="text-xs text-gray-300"><span className="text-green-400 font-bold">Good wins</span> by passing 3 quests AND the Assassin fails to identify Merlin.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-red-400 text-sm mt-0.5">❌</span>
                    <p className="text-xs text-gray-300"><span className="text-red-400 font-bold">Evil wins</span> by failing 3 quests, causing 5 rejections, OR the Assassin correctly kills Merlin.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'setup' && (
            <div className="space-y-4">
              <div className="bg-indigo-900/30 border border-indigo-800/50 rounded-xl p-3">
                <p className="text-indigo-300 text-sm font-bold mb-2">📱 Getting Started</p>
                <ol className="text-gray-300 text-xs space-y-2 list-decimal list-inside">
                  <li>Open this app on all devices</li>
                  <li>Make sure all devices are on the <span className="text-yellow-400 font-bold">same WiFi</span></li>
                  <li>One player creates a room (Host)</li>
                  <li>Host shares the <span className="text-yellow-400 font-bold">6-letter room code</span></li>
                  <li>Others join using that code</li>
                  <li>Host selects which special roles to include</li>
                  <li>Host starts the game when everyone is in!</li>
                </ol>
              </div>

              <div className="bg-amber-900/30 border border-amber-800/50 rounded-xl p-3">
                <p className="text-amber-300 text-xs font-bold mb-1">🔥 Firebase Required</p>
                <p className="text-gray-300 text-xs leading-relaxed">
                  This game uses Firebase Realtime Database to sync between players. 
                  The first time you open this app, the admin needs to connect a Firebase project. 
                  Once set up, it works automatically for everyone on that device.
                </p>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
                <p className="text-white text-xs font-bold mb-2">⚙️ Host Controls</p>
                <ul className="text-gray-400 text-xs space-y-1.5">
                  <li>👑 <span className="text-white">Create Room</span> — Start a new game lobby</li>
                  <li>🎭 <span className="text-white">Choose Roles</span> — Pick which special characters are in the game</li>
                  <li>▶️ <span className="text-white">Start Game</span> — Begin when all players joined</li>
                  <li>🗳️ <span className="text-white">Start Vote</span> — Open team vote for all players</li>
                  <li>📊 <span className="text-white">Count Votes</span> — Reveal vote results</li>
                  <li>⚔️ <span className="text-white">Start Quest Vote</span> — Let quest members vote</li>
                  <li>📜 <span className="text-white">Reveal Result</span> — Show quest outcome</li>
                  <li>▶️ <span className="text-white">Continue</span> — Proceed to next quest</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
