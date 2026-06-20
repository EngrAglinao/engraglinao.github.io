# Engr. Aglinao — Portfolio & Resume System
### `engraglinao.github.io`

> A premium, dark-themed single-page portfolio and resume web application powered by **Firebase Firestore** and deployed on **GitHub Pages**. Features a hidden CMS dashboard for real-time content management and a dynamic Swiss-aesthetic live resume generator.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture Matrix](#2-system-architecture-matrix)
3. [Firebase Environment Setup](#3-firebase-environment-setup)
4. [Detailed Connection Instructions](#4-detailed-connection-instructions)
5. [Steps for Deployment to GitHub Pages](#5-steps-for-deployment-to-github-pages)
6. [Operational Instructions](#6-operational-instructions)
7. [Firestore Data Schema Reference](#7-firestore-data-schema-reference)
8. [Technology Stack](#8-technology-stack)

---

## 1. Project Overview

This system is a **dual-file, decoupled architecture** consisting of:

| File | Role | Public Access |
|---|---|---|
| `index.html` | Public-facing portfolio site | ✅ Yes — served at the root URL |
| `manage.html` | Hidden CMS admin dashboard | 🔒 No — access by direct URL only |
| `README.md` | This documentation file | ✅ GitHub repository |

### How It Works

```
USER VISITS index.html
       │
       ▼
Firebase Firestore (Cloud DB)
       │
       ├── reads: portfolio_data/about
       ├── reads: experience (collection)
       ├── reads: portfolio  (collection)
       └── reads: apps       (collection)
       │
       ▼
Renders: Hero, Timeline, Carousel, Skills, Contact
       │
       ▼
Contact Form Submissions → Firestore: messages (collection)


ADMIN VISITS manage.html (direct URL)
       │
       ▼
Firebase Firestore (SAME Cloud DB)
       │
       ├── writes: portfolio_data/about   (setDoc)
       ├── writes: experience             (addDoc / deleteDoc)
       ├── writes: portfolio              (addDoc / deleteDoc)
       ├── writes: apps                   (addDoc / deleteDoc)
       └── reads:  messages               (getDocs)
```

**Both files share a single Firestore database instance.** Any content committed through `manage.html` immediately reflects on `index.html` upon the visitor's next page load or refresh.

The portfolio is a **static Single Page Application (SPA)** — no server-side code, no build steps, no Node.js required. It runs entirely in the browser using vanilla ES6+ JavaScript and Firebase's browser-compatible modular SDK.

---

## 2. System Architecture Matrix

```
engraglinao.github.io/
│
├── index.html          ← Public Portfolio (Single Page Application)
│   ├── Section: Navigation + Live Resume Generator button
│   ├── Section: Hero / About Me
│   ├── Section: Experience Timeline (Firestore-driven)
│   ├── Section: Portfolio Caravan Carousel (Firestore-driven)
│   ├── Section: Application Matrix / Skills Grid (Firestore-driven)
│   ├── Section: Contact Form (writes to Firestore 'messages')
│   ├── Section: Footer with system metadata
│   ├── Feature: Fullscreen Media Modal (Image/PDF/PPT/Site/Video)
│   ├── Feature: Hero Particle Canvas (animated)
│   ├── Feature: Loading Skeleton Overlay
│   └── Feature: Dynamic Swiss Resume Generator (window.print())
│
├── manage.html         ← Hidden CMS Dashboard (NOT linked from index.html)
│   ├── Tab: About Segment (read/write portfolio_data/about)
│   ├── Tab: Experience (add/delete from 'experience' collection)
│   ├── Tab: Portfolio Caravan (add/delete from 'portfolio' collection)
│   ├── Tab: Apps / Skills (add/delete from 'apps' collection)
│   └── Tab: Messages Inbox (read/delete from 'messages' collection)
│
└── README.md           ← This documentation file
```

### Key Design Decisions

- **No build pipeline** — Pure HTML/CSS/JS, deployable by drag-and-drop.
- **No backend server** — Firebase handles all database operations.
- **Decoupled CMS** — `manage.html` is invisible to search engines (`noindex`) and unlinked from the public site.
- **Unified Firebase config** — Both files reference identical config objects, ensuring one source of truth.
- **Graceful fallbacks** — `index.html` renders sample data if Firestore is unreachable or empty.

---

## 3. Firebase Environment Setup

Follow these steps to create and configure your Firebase project from scratch.

### Step 1 — Create a Google Firebase Project

1. Go to the **Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter your project name: `engraglinao-portfolio` (or similar)
4. Disable Google Analytics (optional — not needed for this system)
5. Click **"Create project"** and wait for provisioning

### Step 2 — Register a Web App

1. Inside your Firebase project dashboard, click the **`</>`** (Web) icon
2. Enter a nickname: `Portfolio Web App`
3. Do **not** enable Firebase Hosting (we use GitHub Pages instead)
4. Click **"Register app"**
5. Firebase will display your **Firebase SDK config snippet** — copy the entire `firebaseConfig` object. You will need this in Step 4.

```javascript
// Example of what Firebase shows you (your values will differ):
const firebaseConfig = {
  apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain:        "engraglinao-portfolio.firebaseapp.com",
  projectId:         "engraglinao-portfolio",
  storageBucket:     "engraglinao-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abcdef1234567890"
};
```

### Step 3 — Create a Firestore Database

1. In the left sidebar, navigate to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (you will secure it later)
4. Select a Firestore location closest to your users (e.g., `asia-southeast1` for Philippines)
5. Click **"Enable"**

### Step 4 — Initialize Firestore Collections

Firestore creates collections automatically when you first write data. However, you can pre-create them manually:

1. In Firestore console, click **"Start collection"**
2. Create the following collections and add an initial placeholder document to each:

| Collection Name | Purpose | Key Document ID |
|---|---|---|
| `portfolio_data` | Stores the About/Hero section data | `about` (fixed document ID) |
| `experience` | Career timeline entries | auto-generated IDs |
| `portfolio` | Portfolio carousel cards | auto-generated IDs |
| `apps` | Application matrix / skills | auto-generated IDs |
| `messages` | Contact form submissions (read-only in CMS) | auto-generated IDs |

**Important:** The `portfolio_data` collection uses a **fixed document ID** of `about`. All other collections use auto-generated document IDs.

### Step 5 — Configure Firestore Security Rules

Navigate to **Firestore → Rules** and apply the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read access for portfolio data
    match /portfolio_data/{document=**} {
      allow read: if true;
      allow write: if false; // Only managed.html (via trusted network) writes here
    }

    match /experience/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    match /apps/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // Write-only for contact form submissions
    match /messages/{document=**} {
      allow create: if true;  // Allow form submissions
      allow read, update, delete: if false; // Only accessible via manage.html
    }
  }
}
```

> **Security Note:** The rules above set write access to `false` for portfolio collections. For the **CMS (`manage.html`) to write data**, you have two options:
>
> **Option A (Simple — for personal use):** Temporarily set `allow write: if true;` while managing content, then revert to `false`. Since `manage.html` is unlinked and unlisted, this is a reasonable approach for personal portfolios.
>
> **Option B (Recommended):** Enable Firebase Authentication (Email/Password), add a sign-in form to `manage.html`, and update rules to `allow write: if request.auth != null;`. This requires adding the Auth SDK to `manage.html`.

---

## 4. Detailed Connection Instructions

This is the most critical section. Both `index.html` and `manage.html` must reference **the exact same Firebase config object** to connect to the same database.

### Where to Find the Config in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com) → Select your project
2. Click the **gear icon ⚙️** next to "Project Overview" → **Project settings**
3. Scroll down to the **"Your apps"** section
4. Click on your registered web app
5. Under **"SDK setup and configuration"**, select **"Config"** radio button
6. Copy the displayed `firebaseConfig` object

### Where to Insert the Config in Both Files

Both files contain a clearly labeled comment block:

```javascript
// ╔══════════════════════════════════════════════════════════════╗
// ║          FIREBASE CONFIGURATION — UNIFIED SOURCE OF TRUTH   ║
// ╚══════════════════════════════════════════════════════════════╝
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",           // ← Replace
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",  // ← Replace
  projectId:         "YOUR_PROJECT_ID",        // ← Replace
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",      // ← Replace
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← Replace
  appId:             "YOUR_APP_ID"             // ← Replace
};
```

**Replace the placeholder values in BOTH `index.html` AND `manage.html`.**

### Step-by-Step Config Replacement

```
1. Open index.html in a text editor
2. Use Find (Ctrl+F / Cmd+F) to search: "YOUR_API_KEY"
3. Replace the entire firebaseConfig object with your real values
4. Save index.html

5. Open manage.html in a text editor
6. Use Find (Ctrl+F / Cmd+F) to search: "YOUR_API_KEY"
7. Replace the entire firebaseConfig object with the SAME values
8. Save manage.html

Both files now point to the same Firestore database. ✅
```

### Visual Verification

After replacing the config, open `manage.html` directly in your browser. The top-right **connection badge** will turn green and display **"Connected"** within 1–2 seconds if the configuration is correct.

If it shows **"Disconnected"**, verify:
- The `apiKey`, `projectId`, and `appId` values are correct
- Your Firestore database has been created (Step 3 above)
- Your Firestore Security Rules allow read access

---

## 5. Steps for Deployment to GitHub Pages

### Step 1 — Create the GitHub Repository

1. Go to [github.com](https://github.com) and log in to your account `engraglinao`
2. Click the **`+`** icon → **"New repository"**
3. Set the repository name to exactly: **`engraglinao.github.io`**
   - This special naming convention tells GitHub to serve this repo as a Pages site
4. Set visibility to **Public** (required for free GitHub Pages)
5. Do **not** initialize with a README (you already have your own)
6. Click **"Create repository"**

### Step 2 — Upload Your Files

**Method A: GitHub Web Interface (Easiest)**

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop all three files: `index.html`, `manage.html`, `README.md`
3. Write a commit message: `Initial portfolio deployment`
4. Click **"Commit changes"**

**Method B: Git Command Line**

```bash
# Navigate to your project folder
cd /path/to/your/portfolio

# Initialize a git repository
git init

# Add all files
git add index.html manage.html README.md

# Commit
git commit -m "Initial portfolio deployment"

# Connect to GitHub (replace YOUR_USERNAME with engraglinao)
git remote add origin https://github.com/engraglinao/engraglinao.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings** (top navigation)
2. In the left sidebar, scroll to **"Pages"**
3. Under **"Source"**, select **"Deploy from a branch"**
4. Set **Branch** to `main` and folder to `/ (root)`
5. Click **Save**

### Step 4 — Access Your Live Portfolio

After 1–3 minutes, your portfolio will be live at:

```
https://engraglinao.github.io
```

Your hidden CMS will be accessible at:

```
https://engraglinao.github.io/manage.html
```

### Step 5 — Add Firebase Authorized Domain

Since your site is now live on a real domain, you must authorize it in Firebase:

1. Firebase Console → **Authentication** (even if not using Auth) OR **Project Settings → Authorized Domains**
2. Click **"Add domain"**
3. Enter: `engraglinao.github.io`
4. Save

This ensures Firebase's security policies accept requests from your GitHub Pages domain.

---

## 6. Operational Instructions

### Accessing the CMS Dashboard

The `manage.html` file is **intentionally not linked** anywhere on the public `index.html` site. To access it:

1. Navigate directly in your browser to: `https://engraglinao.github.io/manage.html`
2. The page is tagged with `<meta name="robots" content="noindex, nofollow">` — search engines will not index it
3. Bookmark this URL for future content management sessions

### How Data Flows Into the Portfolio

```
manage.html (CMS)                    Firebase Firestore
     │                                       │
     │  Fill form fields                     │
     │  Click "Commit" button                │
     │──── addDoc / setDoc ────────────────►│
     │                                       │  Stored in cloud
     │                                       │
                                             │
index.html (Portfolio)                       │
     │                                       │
     │  Page loads                           │
     │──── getDocs / getDoc ───────────────►│
     │◄─── Returns Firestore data ──────────│
     │                                       │
     │  Renders Hero, Timeline, Carousel,    │
     │  Skills Grid from live data           │
```

**Update cycle:** Content changes in `manage.html` are **instantly** written to Firestore. Visitors to `index.html` see the updated content on their **next page load**. There is no caching layer.

### CMS Tab-by-Tab Guide

| Tab | What It Does | Firestore Operation |
|---|---|---|
| **About** | Update hero headline, bio, contact info, resume URL | `setDoc(doc(db, "portfolio_data", "about"), {...})` |
| **Experience** | Add new career entries; view and delete existing ones | `addDoc(collection(db, "experience"), {...})` |
| **Portfolio** | Add new portfolio cards (PPT/PDF/Image/Site/URL/Video) | `addDoc(collection(db, "portfolio"), {...})` |
| **Apps / Skills** | Add new tool/skill cards with icon, category, level | `addDoc(collection(db, "apps"), {...})` |
| **Messages** | View and delete contact form submissions | `getDocs(collection(db, "messages"))` |

### Portfolio Card Type Reference

When adding a portfolio item, select the correct **Type** for proper modal rendering:

| Type | What Displays in Modal | Use For |
|---|---|---|
| `PPT` | Office Online Viewer iframe | `.pptx` files on SharePoint/OneDrive |
| `PDF` | Direct iframe embed | PDF documents (Google Drive, direct links) |
| `Image` | `<img>` tag, full view | JPEG/PNG/WebP/GIF files |
| `Site` | Sandboxed iframe | Live websites |
| `URL` | External link prompt | Any web URL |
| `Video` | HTML5 `<video>` player | Direct video file links |

### Dynamic Live Resume Generator

The **"Generate Live Resume"** button in the top navigation bar triggers `generateLiveResume()`:

1. The function reads the current in-memory state arrays (`window.__portfolioState`) that were populated during the Firebase fetch on page load
2. It dynamically builds a **Swiss Minimalist resume layout** — a two-column design with a dark header bar, left profile/skills column, and right experience/portfolio column
3. The layout is injected into a hidden `#resume-print-workspace` div positioned off-screen
4. `window.print()` is called — the browser's native print dialog opens
5. CSS `@media print` rules **hide the entire web application** and make only the resume workspace visible
6. The user can **Save as PDF** from the print dialog to generate a professional PDF resume
7. After printing, the workspace is cleared and hidden

**For best PDF output:**
- In the print dialog, set **Margins** to "None" or "Minimum"
- Enable **Background graphics** if using Chrome/Edge
- Select **Save as PDF** as the destination
- Paper size: **A4**

---

## 7. Firestore Data Schema Reference

### `portfolio_data/about` (Single Document)

```javascript
{
  headline:         "Engineer. Innovator. Creator.",
  bio:              "A versatile engineer and creative technologist...",
  yearsExperience:  "7+",
  email:            "hello@engraglinao.com",
  phone:            "+63 917 XXX XXXX",
  city:             "Philippines",
  linkedIn:         "https://linkedin.com/in/engraglinao",
  github:           "https://github.com/engraglinao",
  masterResumeUrl:  "https://drive.google.com/...",
  updatedAt:        Timestamp
}
```

### `experience` (Collection — Auto-ID Documents)

```javascript
{
  role:         "Senior Engineer",
  organization: "Tech Solutions Inc.",
  startDate:    "2021",
  endDate:      "Present",
  current:      true,
  order:        100,        // Higher number = displayed first
  description:  "Led cross-functional teams...",
  tags:         "Leadership, Project Management, AutoCAD",
  createdAt:    Timestamp
}
```

### `portfolio` (Collection — Auto-ID Documents)

```javascript
{
  title:       "Annual Report 2024",
  description: "Comprehensive stakeholder presentation.",
  type:        "PPT",     // PPT | PDF | Image | Site | URL | Video
  fileUrl:     "https://...",
  thumbnail:   "https://...",
  order:       10,
  createdAt:   Timestamp
}
```

### `apps` (Collection — Auto-ID Documents)

```javascript
{
  name:      "AutoCAD",
  category:  "Engineering",  // Engineering | Design | Software | Office | Other
  icon:      "fa-drafting-compass",  // FontAwesome class (without "fa-solid")
  level:     "Advanced",     // Beginner | Intermediate | Advanced | Expert
  createdAt: Timestamp
}
```

### `messages` (Collection — Auto-ID Documents)

```javascript
{
  name:      "John Doe",
  email:     "john@example.com",
  message:   "I'd like to discuss a project...",
  timestamp: Timestamp,
  read:      false
}
```

---

## 8. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Markup** | Semantic HTML5 | Structure and accessibility |
| **Styling** | Tailwind CSS v4 (CDN) | Utility-first responsive design |
| **Icons** | Font Awesome 6.5 (CDN) | Crisp iconography |
| **Scripting** | Vanilla ES6+ JavaScript | All interactivity and data binding |
| **Database** | Firebase Firestore (NoSQL) | Real-time cloud database |
| **SDK** | Firebase Web SDK v10.12.0 (ESM CDN) | Browser-native Firebase integration |
| **Hosting** | GitHub Pages | Free static site hosting |
| **Resume Export** | `window.print()` + CSS `@media print` | PDF resume generation |

---

## License

This project is personal portfolio software. All design, code, and content is the intellectual property of Engr. Aglinao. No license is granted for redistribution or commercial use.

---

*Generated and maintained at [engraglinao.github.io](https://engraglinao.github.io)*
