# ⚜️ AVALON — The Resistance (Digital Edition)

A fully-featured digital implementation of **The Resistance: Avalon** using React + Vite + Firebase Realtime Database.

---

## 📋 Table of Contents
1. [Features](#features)
2. [Local Setup Guide](#local-setup)
3. [Firebase Setup](#firebase-setup)
4. [GitHub Pages Deployment](#github-pages)
5. [Fix: 404 Error](#fix-404)
6. [Fix: main.tsx Not Loading](#fix-main-tsx)
7. [Admin Account](#admin)
8. [Game Rules](#game-rules)

---

## ✨ Features <a name="features"></a>

- 🔥 Firebase Realtime Database for live multiplayer
- 📱 Mobile-first dark fantasy UI
- 🎭 All official Avalon characters
- 🗳️ Full voting system with real-time sync
- 📊 Live quest board visible to all players
- 🌙 Night phase with character-specific reveals
- 🗡️ Assassination phase
- ⚙️ Admin panel (character management, custom name/icon)
- 🌐 Room code system for easy joining

---

## 💻 Local Setup Guide <a name="local-setup"></a>

### Prerequisites
- **Node.js v18+** — Download from [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)
- **Git** (optional)

### Step-by-Step

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/avalon-game.git
cd avalon-game

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser to: **http://localhost:5173**

> ⚠️ **IMPORTANT:** NEVER open `index.html` directly by double-clicking it!
> Always use `npm run dev`. The game uses ES modules and TypeScript that require
> a server to compile. Opening directly = blank screen.

### Build for Production

```bash
# Build the production files
npm run build

# Preview the built version locally
npm run preview
```

---

## 🔥 Firebase Setup <a name="firebase-setup"></a>

### Step 1 — Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter a project name (e.g., `my-avalon-game`)
4. Click **Continue** → **Create project**

### Step 2 — Enable Realtime Database
1. In the left sidebar: **Build → Realtime Database**
2. Click **"Create database"**
3. Choose a location (closest to you)
4. Select **"Start in test mode"** → Enable

### Step 3 — Set Database Rules (for development)
In Realtime Database → **Rules** tab, set:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ For production, replace with proper authentication rules.

### Step 4 — Register Web App
1. **Project Settings** (gear icon ⚙️ top left)
2. Scroll to **"Your apps"** → Click **"</>" (Web)**
3. Enter app nickname → **Register app**
4. Copy your `firebaseConfig` object

### Step 5 — Enter Config in Avalon
On first launch, the app shows the **Firebase Setup screen**.
Either:
- Click **"Paste Config"** and paste your entire config object, OR
- Fill in each field manually

Your config looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123"
};
```

> ✅ Once saved, all devices on the same network can connect to the same game rooms!

---

## 🐙 GitHub Pages Deployment <a name="github-pages"></a>

### Step 1 — Fix the Base Path
Edit `vite.config.ts` and add your repository name as the base:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/YOUR-REPO-NAME/',  // ← Add this line!
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

### Step 2 — Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit - Avalon game"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Install gh-pages

```bash
npm install -D gh-pages
```

### Step 4 — Add Deploy Script
Add to your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 5 — Deploy

```bash
npm run deploy
```

### Step 6 — Enable GitHub Pages
1. Go to your GitHub repo
2. **Settings → Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `gh-pages` → `/ (root)`
5. Click **Save**

### Step 7 — Access Your Game
Your game will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## 🔧 Fix: 404 Error <a name="fix-404"></a>

### Problem
GitHub Pages returns 404 when navigating or refreshing.

### Cause
GitHub Pages doesn't understand Single Page App (SPA) routing.

### Solution
The `public/404.html` file in this project handles this automatically.
It redirects all 404s back to the index page.

**If you still get 404:**
1. Make sure `base` in `vite.config.ts` matches your **exact** repo name
2. Make sure `public/404.html` exists in your repo
3. Wait 5–10 minutes after deploying for GitHub to propagate changes
4. Try clearing browser cache (Ctrl+Shift+R)

---

## 🔧 Fix: main.tsx Not Loading / Blank Screen <a name="fix-main-tsx"></a>

### Problem
White/blank screen, or browser shows raw TypeScript/JSX code.

### Causes & Fixes

| Cause | Fix |
|-------|-----|
| Opened `index.html` directly | Run `npm run dev` and use `http://localhost:5173` |
| Missing dependencies | Run `npm install` |
| Node version too old | Upgrade to Node.js v18+ |
| Port conflict | Try `npm run dev -- --port 3000` |
| Build not run | Run `npm run build` then `npm run preview` |

### The Golden Rule
```
❌ NEVER: File → Open → index.html
✅ ALWAYS: npm run dev → http://localhost:5173
```

---

## 👑 Admin Account <a name="admin"></a>

The admin account is locked to:
```
buenavistaaglinaodanny@gmail.com
```

**To access admin features:**
1. Go to **Create Profile**
2. Enter your display name
3. Enter the admin email address
4. Save profile
5. Return to home screen — you'll see the **⚙️ Admin** button

**Admin can:**
- 📛 Change the game name
- 🖼️ Upload a custom app icon
- 🎭 Enable/disable special characters per game
- Apply preset character configurations

---

## 🎮 Game Rules <a name="game-rules"></a>

### Player Count
| Players | Good | Evil |
|---------|------|------|
| 5       | 3    | 2    |
| 6       | 4    | 2    |
| 7       | 4    | 3    |
| 8       | 5    | 3    |
| 9       | 6    | 3    |
| 10      | 6    | 4    |

### Quest Team Sizes
| Players | Q1 | Q2 | Q3 | Q4 | Q5 |
|---------|----|----|----|----|----|
| 5       | 2  | 3  | 2  | 3  | 3  |
| 6       | 2  | 3  | 4  | 3  | 4  |
| 7       | 2  | 3  | 3  | 4* | 4  |
| 8       | 3  | 4  | 4  | 5* | 5  |
| 9       | 3  | 4  | 4  | 5* | 5  |
| 10      | 3  | 4  | 4  | 5* | 5  |

*Quest 4 requires **2 fails** to fail with 7+ players.

### Win Conditions
- **Good wins:** 3 successful quests + Assassin misses Merlin
- **Evil wins:** 3 failed quests OR 5 consecutive team rejections OR Assassin kills Merlin

---

## 🌐 Network Requirements

- All players need internet access (Firebase is cloud-hosted)
- Works on same WiFi OR different networks
- Firebase handles all real-time synchronization
- Tested on Chrome, Safari, Firefox (mobile browsers)

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (build tool)
- **Tailwind CSS 4** (styling)
- **Firebase Realtime Database** (multiplayer sync)
- **vite-plugin-singlefile** (bundle optimization)

---

*Made with ⚔️ for knights and sorcerers alike.*
