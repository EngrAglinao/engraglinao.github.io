# Engr. Aglinao — Portfolio & Resume SPA

> **A premium, Firebase-powered single-page portfolio and resume application** deployed on GitHub Pages — featuring a decoupled public interface, a hidden CMS dashboard, and a dynamic print-optimized resume generator.

[![GitHub Pages](https://img.shields.io/badge/Hosted%20On-GitHub%20Pages-181717?logo=github)](https://engraglinao.github.io)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vanilla JS](https://img.shields.io/badge/JS-Vanilla%20ES6%2B-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture Matrix](#2-system-architecture-matrix)
3. [File Structure](#3-file-structure)
4. [Steps for Deployment to GitHub Pages](#4-steps-for-deployment-to-github-pages)
5. [Firebase Environment Setup](#5-firebase-environment-setup)
6. [Firestore Collection Initialization](#6-firestore-collection-initialization)
7. [Firestore Security Rules](#7-firestore-security-rules)
8. [Operational Instructions](#8-operational-instructions)
9. [Dynamic Resume Generator](#9-dynamic-resume-generator)
10. [Technology Reference](#10-technology-reference)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. Project Overview

This repository hosts a **fully static, client-side portfolio and resume web application** — no backend servers, no build pipelines, no npm installs. The entire system consists of two HTML files and this documentation:

| File | Purpose | Visibility |
|---|---|---|
| `index.html` | Public-facing portfolio, resume generator | Public (linked via GitHub Pages) |
| `manage.html` | Admin CMS dashboard for Firestore writes | Hidden (access by direct URL only) |
| `README.md` | System documentation | Public (GitHub repository) |

### How It Works

```
┌─────────────────────────────────────────┐
│           VISITOR (Public)              │
│                                         │
│    https://engraglinao.github.io/       │
│         (index.html loads)              │
│                  │                      │
│        Async Firebase fetch             │
│                  ↓                      │
│        Firestore Database               │
│    ┌─────────────────────────┐          │
│    │  portfolio_data/about   │          │
│    │  experience/            │          │
│    │  portfolio/             │          │
│    │  apps/                  │          │
│    └─────────────────────────┘          │
│                  │                      │
│       Renders live content              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           ADMIN (You)                   │
│                                         │
│  .../manage.html  (direct URL only)     │
│                  │                      │
│        Firestore read/write             │
│    (setDoc, addDoc, deleteDoc)          │
│                  ↓                      │
│       Live update reflected on          │
│       index.html on next visit          │
└─────────────────────────────────────────┘
```

The architecture is intentionally **serverless and dependency-free**. Firebase Firestore acts as the real-time content database. The public portfolio reads from Firestore on every page load, displaying the latest content automatically. The admin panel writes to Firestore directly from the browser using the Firebase Web SDK.

---

## 2. System Architecture Matrix

### Core Components

```
index.html
├── <head>
│   ├── Tailwind CSS (CDN Browser Build)
│   ├── FontAwesome 6 (CDN)
│   ├── Google Fonts: Inter + JetBrains Mono
│   └── @media print CSS (Resume Generator styles)
│
├── <body>
│   ├── #resume-workspace     ← Hidden print target div
│   ├── <header>              ← Fixed glass nav + Generate Resume btn
│   ├── #hero                 ← Dynamic headline + bio (Firestore)
│   ├── #about                ← Full bio + stats + social links
│   ├── #experience           ← Animated vertical timeline (Firestore)
│   ├── #portfolio            ← Touch-drag carousel (Firestore)
│   ├── #apps                 ← Tool grid grouped by category (Firestore)
│   ├── #contact              ← Form → Firestore messages collection
│   ├── <footer>              ← Meta, credits, year
│   └── #media-modal          ← Fullscreen overlay (image/iframe/PPT)
│
└── <script type="module">   ← Firebase SDK v10 (ESM via gstatic CDN)
    ├── fetchAbout()
    ├── fetchExperience()
    ├── fetchPortfolio()
    ├── fetchApps()
    ├── renderTimeline()
    ├── renderCarousel()
    ├── renderApps()
    └── submitContactForm()

manage.html
├── Sidebar navigation
├── Firebase status indicator
├── Section: About / Hero (setDoc)
├── Section: Portfolio Caravan (addDoc + deleteDoc)
├── Section: Experience Timeline (addDoc + deleteDoc)
├── Section: Application Matrix (addDoc)
├── Section: Messages Inbox (read-only)
└── Section: Firestore Schema Reference
```

### Data Flow

```
manage.html          Firestore           index.html
    │                    │                   │
    │── setDoc ─────────▶│                   │
    │                    │◀── getDocs ───────│
    │                    │── data ──────────▶│
    │                    │                   │── render UI
```

---

## 3. File Structure

```
engraglinao.github.io/
│
├── index.html        ← Public portfolio SPA
├── manage.html       ← Admin CMS (hidden, not linked)
└── README.md         ← This documentation file
```

> **Note:** There are no `node_modules`, no `package.json`, no build steps. All dependencies are loaded via CDN at runtime.

---

## 4. Steps for Deployment to GitHub Pages

### Step 1 — Create the GitHub Repository

1. Log in to [github.com](https://github.com).
2. Click the **"+"** icon → **"New repository"**.
3. Set the repository name to exactly: `engraglinao.github.io`
   - Format: `{your-github-username}.github.io`
   - This activates GitHub Pages' apex domain hosting automatically.
4. Set visibility to **Public**.
5. Do **not** initialize with a README (you'll upload your own).
6. Click **"Create repository"**.

### Step 2 — Upload Files

**Option A: GitHub Web Interface**
1. Click **"Add file"** → **"Upload files"**.
2. Drag and drop `index.html`, `manage.html`, and `README.md`.
3. Set commit message: `feat: initial portfolio deployment`.
4. Click **"Commit changes"**.

**Option B: Git CLI**
```bash
git clone https://github.com/engraglinao/engraglinao.github.io.git
cd engraglinao.github.io
cp /path/to/index.html .
cp /path/to/manage.html .
cp /path/to/README.md .
git add .
git commit -m "feat: initial portfolio deployment"
git push origin main
```

### Step 3 — Configure GitHub Pages

1. In your repository, navigate to **Settings** → **Pages**.
2. Under **Source**, select **"Deploy from a branch"**.
3. Set branch to **`main`** and folder to **`/ (root)`**.
4. Click **Save**.
5. Wait 2–5 minutes for the first deployment to complete.
6. GitHub will display your live URL: `https://engraglinao.github.io`

### Step 4 — Verify Deployment

- Visit `https://engraglinao.github.io` — you should see your portfolio.
- Visit `https://engraglinao.github.io/manage.html` — you should see the admin panel.

> **Custom Domain (Optional):** If you own a domain (e.g., `aglinao.dev`), add a `CNAME` file to the repo root containing only your domain name, then configure your DNS provider to point to `engraglinao.github.io`.

---

## 5. Firebase Environment Setup

### Step 1 — Create a Firebase Project

1. Navigate to [console.firebase.google.com](https://console.firebase.google.com).
2. Click **"Add project"**.
3. Enter project name (e.g., `aglinao-portfolio`).
4. Disable Google Analytics (not needed for this project).
5. Click **"Create project"**.

### Step 2 — Register Your Web App

1. In your Firebase project, click the **web icon** (`</>`) to add a web app.
2. Enter app nickname: `Portfolio SPA`.
3. Do **not** enable Firebase Hosting (you're using GitHub Pages).
4. Click **"Register app"**.
5. Firebase will display your **`firebaseConfig`** object. It will look like:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain:        "aglinao-portfolio.firebaseapp.com",
  projectId:         "aglinao-portfolio",
  storageBucket:     "aglinao-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abcdef1234567890"
};
```

6. **Copy this config object.**

### Step 3 — Inject Config into Both Files

Open both `index.html` and `manage.html`. Find the `firebaseConfig` object (search for `YOUR_API_KEY`) and replace the placeholder values with your actual Firebase config values.

In **both files**, the block looks like this — replace every `YOUR_*` placeholder:

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",           // ← replace
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",  // ← replace
  projectId:         "YOUR_PROJECT_ID",        // ← replace
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",      // ← replace
  messagingSenderId: "YOUR_SENDER_ID",         // ← replace
  appId:             "YOUR_APP_ID"             // ← replace
};
```

> ⚠️ **Security Note:** Firebase API keys for web apps are safe to include in public client-side code — they are **not secret credentials**. Firebase security is enforced by **Firestore Security Rules** (see Section 7). Do NOT embed service account credentials.

### Step 4 — Create Firestore Database

1. In Firebase Console, click **"Firestore Database"** in the left sidebar.
2. Click **"Create database"**.
3. Select **"Start in production mode"** (you will configure rules next).
4. Choose your nearest server location (e.g., `asia-southeast1` for Philippines).
5. Click **"Enable"**.

---

## 6. Firestore Collection Initialization

After creating the Firestore database, you need to seed the initial document structure. You can do this via the **Firebase Console** (manually) or via the **Admin Panel** (`manage.html`).

### Collection: `portfolio_data` (Document: `about`)

Navigate to Firestore Console → **"Start collection"** → ID: `portfolio_data`  
Add document with ID: `about`

| Field | Type | Example Value |
|---|---|---|
| `headline` | string | `Engineer. Creator. Innovator.` |
| `bio` | string | Your full biography text (multi-line) |
| `resume_url` | string | `https://drive.google.com/uc?export=download&id=FILE_ID` |
| `updated_at` | timestamp | *(auto-set by manage.html)* |

### Collection: `experience`

Auto-generated document IDs. Each document:

| Field | Type | Example Value |
|---|---|---|
| `role` | string | `Senior Systems Engineer` |
| `organization` | string | `TechCorp International` |
| `date_range` | string | `Jan 2022 — Present` |
| `description` | string | Full description paragraph |
| `icon` | string | `fa-microchip` |
| `order` | number | `1` |
| `created_at` | timestamp | *(auto-set)* |

### Collection: `portfolio`

Auto-generated document IDs. Each document:

| Field | Type | Example Value |
|---|---|---|
| `title` | string | `Smart Campus System` |
| `description` | string | Brief project description |
| `type` | string | `Site` \| `URL` \| `Image` \| `PDF` \| `PPT` |
| `link` | string | Target URL for the content |
| `thumbnail` | string | URL to a preview/thumbnail image |
| `order` | number | `1` |
| `created_at` | timestamp | *(auto-set)* |

**Type Behavior in Modal:**
- `Image` → Renders as a direct `<img>` tag
- `PDF` → Embeds via `<iframe>` with the PDF URL as `src`
- `Site` / `URL` → Loads URL in a sandboxed `<iframe>`
- `PPT` → Uses Microsoft Office Online Viewer: `https://view.officeapps.live.com/op/embed.aspx?src={ENCODED_URL}` — the `.pptx` file must be publicly accessible

### Collection: `apps`

Auto-generated document IDs. Each document:

| Field | Type | Example Value |
|---|---|---|
| `name` | string | `VS Code` |
| `icon` | string | `fa-code` |
| `color` | string | `#60a5fa` |
| `category` | string | `IDE` |
| `created_at` | timestamp | *(auto-set)* |

### Collection: `messages`

Written automatically by the contact form on `index.html`. Read-only in `manage.html`.

| Field | Type | Set By |
|---|---|---|
| `name` | string | Contact form input |
| `email` | string | Contact form input |
| `message` | string | Contact form textarea |
| `submitted_at` | timestamp | `serverTimestamp()` |
| `read` | boolean | `false` (default) |

---

## 7. Firestore Security Rules

Navigate to **Firestore → Rules** and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── PUBLIC: Portfolio content (read-only for all visitors) ──────────────
    match /portfolio_data/{docId} {
      allow read: if true;
      allow write: if false; // Write only via manage.html with correct origin
    }

    match /experience/{docId} {
      allow read: if true;
      allow write: if false;
    }

    match /portfolio/{docId} {
      allow read: if true;
      allow write: if false;
    }

    match /apps/{docId} {
      allow read: if true;
      allow write: if false;
    }

    // ── SEMI-RESTRICTED: Contact form submissions ─────────────────────────
    match /messages/{docId} {
      allow create: if request.resource.data.keys().hasAll(['name','email','message'])
                    && request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.message is string
                    && request.resource.data.name.size() <= 100
                    && request.resource.data.email.size() <= 254
                    && request.resource.data.message.size() <= 2000;
      allow read:   if false; // Only readable via Admin SDK or Console
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

> ⚠️ **Important:** The rules above lock down writes to content collections. If you need to use `manage.html` to write content, you have two options:
>
> **Option A (Recommended for Personal Use):** Temporarily set `allow write: if true;` for the collections you need to update, make your changes via `manage.html`, then revert the rules back to `if false;`.
>
> **Option B (Better Security):** Implement Firebase Authentication. Wrap all write rules with `allow write: if request.auth != null && request.auth.uid == 'YOUR_UID';` and add a login form to `manage.html`.

---

## 8. Operational Instructions

### Accessing the Admin Panel

The `manage.html` file is **intentionally not linked** from `index.html`. It is a "security through obscurity" first layer.

To access it:
```
https://engraglinao.github.io/manage.html
```

Bookmark this URL for your own reference. Do not share it publicly.

### Updating the About / Hero Section

1. Navigate to `manage.html`.
2. Scroll to **"About / Hero Segment"**.
3. Click **"Load Current"** to populate the fields with existing Firestore data.
4. Edit the **Headline**, **Biography**, or **Resume URL** fields.
5. Click **"Commit to Firebase"**.
6. Reload `index.html` — the content will update immediately.

**Biography formatting note:** Each new line in the biography textarea creates a new paragraph on the public site. The first ~220 characters appear in the hero section; the full text appears in the About section below.

### Adding Portfolio Items

1. Navigate to `manage.html` → **"Portfolio Caravan"**.
2. Fill in the **Title**, **Type**, **Description**, **Link**, and **Thumbnail URL**.
3. Set an **Order** number to control display position (lower = appears first).
4. Click **"Add to Caravan"**.
5. The item immediately appears in the Firestore `portfolio` collection.
6. Refresh `index.html` to see the new card in the carousel.

**Type Guide:**
- **Site** → Use for a live website URL (loads in iframe modal)
- **URL** → Use for any external hyperlink (loads in iframe modal)
- **Image** → Use for direct `.jpg`, `.png`, `.webp` image URLs (renders as `<img>`)
- **PDF** → Use for direct `.pdf` file URLs (renders in iframe)
- **PPT** → Use for publicly hosted `.pptx` files (renders via Office Online Viewer — the file **must** be publicly accessible, e.g., on Google Drive with sharing set to "Anyone with the link")

### Deleting Items

In both the Portfolio and Experience tables in `manage.html`, each row has a **Delete** button. Clicking it prompts a confirmation dialog before permanently removing the document from Firestore.

### Viewing Contact Messages

1. Navigate to `manage.html` → **"Messages Inbox"**.
2. The inbox auto-loads on page open. Click **"Refresh"** to fetch new submissions.
3. You can also reply directly by clicking the email link in the table.

### Data Flow Timing

- Changes committed via `manage.html` are **immediately written** to Firestore.
- Visitors who refresh `index.html` will see the new content on their next page load.
- There is no cache invalidation needed — the site always fetches fresh data on load.

---

## 9. Dynamic Resume Generator

The **"Generate Live Resume"** button in the navigation bar triggers `generateLiveResume()`, a client-side JavaScript function that:

### How It Works

1. **Reads Live Data:** The function accesses `window.__portfolioData`, the global object populated by Firebase fetches, containing the current state of `about`, `experience`, `portfolio`, and `apps` data.

2. **Builds a Print-Optimized DOM:** It dynamically constructs a **"Minimalist Swiss"** resume layout inside a hidden `<div id="resume-workspace">`. The Swiss design uses:
   - Asymmetrical two-column layout (dark sidebar + white main content area)
   - Tight typographic tracking and uppercase section labels
   - A sharp `#f59e0b` (amber) accent color for section dividers
   - 8pt–20pt font scale hierarchy for visual weight
   - Grid-based sections for clean information architecture

3. **Injects CSS Print Rules:** The `<style>` block in `<head>` contains comprehensive `@media print` rules that:
   - Hide every `body > *` element **except** `#resume-workspace`
   - Set `@page` dimensions to A4 (210mm × 297mm) with zero margins
   - Force `background-color: exact` for the dark sidebar
   - Apply optimal line heights, font sizes, and spacing for print fidelity

4. **Triggers Native Print Dialog:** After a 100ms timeout (to allow DOM render), `window.print()` is called. The user can then:
   - Save as PDF using their browser's built-in "Save as PDF" printer
   - Print to a physical printer

### Content Populated in the Resume

| Resume Section | Data Source |
|---|---|
| Name & Role | Hardcoded / `about.headline` |
| Contact Info | Hardcoded placeholder fields |
| Biography | `about.bio` (first 500 chars) |
| Professional Experience | `experience` collection (all entries) |
| Portfolio Highlights | `portfolio` collection (first 3 items) |
| Core Skills | `apps` collection (first 24 tools) |
| Education | Hardcoded placeholder |
| Technical Domains | Hardcoded list |
| Generation Date | Dynamic `new Date()` |

---

## 10. Technology Reference

| Technology | Version | Usage |
|---|---|---|
| HTML5 | — | Semantic markup structure |
| Tailwind CSS | Browser Build v4 | Utility-first styling |
| FontAwesome | 6.5.1 | Icons throughout the UI |
| Google Fonts | — | Inter + JetBrains Mono typefaces |
| Firebase SDK | 10.12.2 (ESM/CDN) | Firestore read/write |
| Vanilla JS | ES6+ | All interactivity, no frameworks |

### Firebase SDK CDN Endpoints Used

```javascript
// App initialization
'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'

// Firestore
'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
```

These are loaded via `<script type="module">` in both HTML files.

---

## 11. Troubleshooting

### "Firebase connection failed" / Content shows fallback data

- Ensure your `firebaseConfig` values in **both** `index.html` and `manage.html` are correctly populated.
- Check that your Firestore database has been created and is in an **active** state.
- Verify your Firestore **Security Rules** allow reads for the `portfolio_data`, `experience`, `portfolio`, and `apps` collections.
- Open browser DevTools → Console and look for `[Firebase]` error messages.

### Carousel shows skeleton but never loads cards

- Verify the `portfolio` collection exists in Firestore with at least one document.
- Ensure documents have the required fields: `title`, `type`, `link`, `order`.

### PPT modal shows blank or error

- The `.pptx` file URL must be **publicly accessible** (no login required).
- Google Drive files must have sharing set to **"Anyone with the link can view"**.
- Use the direct download/export URL format, not the Google Drive preview URL.

### Contact form submission fails

- Check Firestore rules — the `messages` collection must `allow create`.
- Open browser DevTools → Network tab and check for any failed Firestore requests.

### Resume generates but prints incorrectly

- Use Chrome or Edge for best print-to-PDF output.
- In the print dialog, ensure **"Background graphics"** is enabled.
- Set paper size to **A4** and margins to **"None"** or **"Minimum"**.
- If content is cut off, the browser's print preview will show page breaks automatically.

### manage.html cannot write to Firestore

- Your Firestore Security Rules may have `allow write: if false;`.
- Temporarily change the rule to `allow write: if true;` for the collection you need to update, commit your changes, then revert the rule.

---

## License

This project is for personal portfolio use. All code is written by and for **Engr. Aglinao**.

---

*Documentation generated for `engraglinao.github.io` · Powered by Firebase + GitHub Pages*
