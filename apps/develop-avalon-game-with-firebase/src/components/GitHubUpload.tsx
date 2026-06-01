import { useState } from 'react';

interface GitHubUploadProps {
  onClose: () => void;
}

export default function GitHubUpload({ onClose }: GitHubUploadProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!repoUrl.trim() || !token.trim()) {
      setMessage('Please enter both repository URL and token.');
      setStatus('error');
      return;
    }

    // Parse owner/repo from URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      setMessage('Invalid GitHub URL. Use: https://github.com/owner/repo');
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setMessage('Preparing upload...');

    const owner = match[1];
    const repo = match[2].replace('.git', '');

    const filesToUpload = [
      {
        path: 'README.md',
        content: btoa(`# AVALON Game\n\nA digital multiplayer implementation of The Resistance: Avalon.\n\n## Features\n- Real-time multiplayer via Firebase\n- Same WiFi/network play\n- All official Avalon roles\n- Mobile-first design\n\n## Setup\n1. Install dependencies: \`npm install\`\n2. Run dev server: \`npm run dev\`\n3. Configure Firebase on first launch\n\n## Admin\nAdmin email: buenavistaaglinaodanny@gmail.com\n`),
      },
      {
        path: 'SETUP.md',
        content: btoa(`# Firebase Setup Guide\n\n1. Go to https://console.firebase.google.com\n2. Create a new project\n3. Enable Realtime Database\n4. Add a web app and copy the config\n5. Launch the game and paste your config\n`),
      },
    ];

    try {
      for (const file of filesToUpload) {
        setMessage(`Uploading ${file.path}...`);
        const checkRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
          { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
        );

        let sha: string | undefined;
        if (checkRes.ok) {
          const existing = await checkRes.json();
          sha = existing.sha;
        }

        const uploadRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Upload AVALON game files`,
              content: file.content,
              ...(sha ? { sha } : {}),
            }),
          }
        );

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || 'Upload failed');
        }
      }

      setStatus('done');
      setMessage(`✅ Successfully uploaded to ${owner}/${repo}!`);
    } catch (e: any) {
      setStatus('error');
      setMessage(`❌ Error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-[#0f0f2e] border border-amber-400/30 rounded-t-3xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐙</span>
            <h2 className="text-white font-bold text-lg">GitHub Upload</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <p className="text-gray-400 text-xs mb-4 leading-relaxed">
          Upload this app to your GitHub repository. You'll need a{' '}
          <span className="text-amber-400">Personal Access Token</span> with repo permissions.
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-gray-400 text-xs block mb-1">Repository URL</label>
            <input
              type="text"
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-3 py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
              placeholder="https://github.com/username/repo-name"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs block mb-1">GitHub Token</label>
            <input
              type="password"
              className="w-full bg-black/40 border border-gray-600 rounded-xl px-3 py-3 text-white text-sm focus:border-amber-400 focus:outline-none"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={e => setToken(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <div className={`rounded-xl p-3 mb-4 text-xs ${
            status === 'error' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            status === 'done' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {status === 'uploading' && <span className="animate-pulse">⏳ </span>}
            {message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 text-gray-300 font-semibold rounded-xl text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={status === 'uploading'}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-all"
          >
            {status === 'uploading' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-3">
          Token is never stored — only used for this upload
        </p>
      </div>
    </div>
  );
}
