# EA Portfolio — Dynamic Firebase-Powered Portfolio & Resume System

[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FF6D00?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FontAwesome](https://img.shields.io/badge/FontAwesome-6.5-528DD7?logo=fontawesome&logoColor=white)](https://fontawesome.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A fully zero-hardcoded, Firebase Firestore-driven single-page portfolio and resume web application with a split-pane admin dashboard, JSON portability hub, and a dynamic print-optimized resume generator engine.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Three-File Architecture](#2-three-file-architecture)
3. [Firebase Installation & Configuration](#3-firebase-installation--configuration)
4. [Firestore Database Schema](#4-firestore-database-schema)
5. [System Bootstrap & Automatic Seeding](#5-system-bootstrap--automatic-seeding)
6. [Data Portability Manual (Import / Export)](#6-data-portability-manual-import--export)
7. [Admin Dashboard Operations Guide](#7-admin-dashboard-operations-guide)
8. [Dynamic Resume Generator Engine](#8-dynamic-resume-generator-engine)
9. [Theme System & Iconography](#9-theme-system--iconography)
10. [GitHub Pages Deployment](#10-github-pages-deployment)
11. [Troubleshooting](#11-troubleshooting)
12. [License](#12-license)

---

## 1. Project Overview

This is a **fully content-managed, database-driven portfolio system** built to replace static portfolio pages with a live, dynamic experience. Every piece of textual content, every project card, every skill chip, every timeline row, and every layout configuration is stored in and retrieved from **Firebase Firestore** at runtime.

### Core Design Philosophy

| Principle | Implementation |
|---|---|
| **Zero Hardcoded Content** | `index.html` contains zero static text content. Every string is fetched from Firestore. |
| **Total CMS Control** | `manage.html` provides a complete split-pane admin dashboard for live content management. |
| **Auto-Seeding** | On first launch against an empty database, a complete polished seed dataset is automatically written to Firestore. |
| **JSON Portability** | Full database export/import via structured JSON for portable backups and migrations. |
| **Print Resume Sync** | The `generateLiveResume()` engine mirrors the live site's exact typography, icons, and colors into a print-optimized asymmetric document. |

### Dynamic Data Workflow

```
Firebase Firestore
       │
       ├── profile/main         → Hero section, contact info, education, qualifications
       ├── layout_configuration → Section order, visibility, background variants
       ├── experience           → Timeline entries (role, org, dates, description, icon)
       ├── portfolio            → Carousel cards (title, type, URL, thumbnail, tags)
       ├── applications         → Skills matrix (name, category, icon, proficiency)
       └── messages             → Contact form submissions (name, email, message)
              │
              ▼
         index.html
    (Fetches → Renders → Displays)
              │
              ▼
         manage.html
    (Reads → Edits → Writes back to Firestore → Refreshes iframe preview)
```

---

## 2. Three-File Architecture

### `index.html` — The Public Portfolio

The sole public-facing file. Contains:
- **Firebase SDK initialization** (modular v10 via CDN)
- **Auto-seeding engine** — checks if Firestore is empty on every page load
- **Data fetch layer** — parallel `Promise.all()` calls for all collections
- **Dynamic section renderer** — creates DOM sections in the order defined by `layout_configuration`
- **Portfolio carousel** — responsive horizontal slider with media type detection
- **Contact form** — pushes submissions to Firestore `messages` collection
- **`generateLiveResume()` engine** — builds and prints a styled asymmetric resume document
- **Theme system** — Light/Dark mode persisted via `localStorage`

> ⚠️ `manage.html` is **never linked** from `index.html`. It is completely disconnected from the public page.

### `manage.html` — The Admin Dashboard

A private, standalone admin control panel featuring:
- **50/50 split-screen layout** — forms panel (left) + live iframe preview (right)
- **Sidebar navigation** — switches between Profile, Experience, Portfolio, Applications, Layout, Messages, and Data Utility panels
- **Real-time preview** — iframe embedding `index.html` with auto-refresh on every save
- **CRUD operations** — Add, edit, and delete individual Firestore documents with immediate effect
- **Layout editor** — Drag-and-drop section reordering + visibility toggles + background variant selectors
- **Messages inbox** — View and manage contact form submissions
- **JSON Portability Hub** — Full export/import with schema validation and batch writes

### `README.md` — This File

System documentation for GitHub repository setup, Firebase configuration, seeding behavior, JSON migration workflows, and resume engine details.

---

## 3. Firebase Installation & Configuration

### Step 1: Create a Firebase Project

1. Navigate to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter a project name (e.g., `ea-portfolio`)
4. Disable Google Analytics if not needed → Click **"Create project"**

### Step 2: Enable Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (recommended) or "test mode" for initial setup
4. Select your preferred server region → Click **"Enable"**

### Step 3: Configure Firestore Security Rules

Navigate to **Firestore → Rules** and set the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for portfolio data
    match /profile/{doc} {
      allow read: if true;
      allow write: if false; // Only allow via admin (add auth in production)
    }

    match /layout_configuration/{doc} {
      allow read: if true;
      allow write: if false;
    }

    match /experience/{doc} {
      allow read: if true;
      allow write: if false;
    }

    match /portfolio/{doc} {
      allow read: if true;
      allow write: if false;
    }

    match /applications/{doc} {
      allow read: if true;
      allow write: if false;
    }

    // Allow public write for contact form submissions
    match /messages/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

> **Note for Development:** You may temporarily use `allow read, write: if true` during initial setup to avoid permission errors. Tighten rules before going public.

### Step 4: Register a Web App & Get Config

1. In Firebase Console, click the **gear icon** → **"Project settings"**
2. Scroll to **"Your apps"** → Click the web icon (`</>`)
3. Enter an app nickname → Click **"Register app"**
4. Copy the `firebaseConfig` object

### Step 5: Paste Config into Both Files

Open **both** `index.html` and `manage.html` and locate this block (appears in both files):

```javascript
// =============================================
// FIREBASE CONFIGURATION — REPLACE WITH YOUR OWN
// =============================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace **all six placeholder values** with your actual Firebase project credentials in **both files identically**.

```javascript
// Example (use your actual values):
const firebaseConfig = {
  apiKey: "AIzaSyD_example_key_here",
  authDomain: "ea-portfolio.firebaseapp.com",
  projectId: "ea-portfolio",
  storageBucket: "ea-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

> 🔒 **Security Note:** For a public GitHub repository, consider using environment injection or Firebase App Check rather than exposing API keys directly. The Firestore security rules above are your primary guard.

---

## 4. Firestore Database Schema

### Collection: `profile` → Document ID: `main`

```json
{
  "name": "Engr. Alex Aglinao",
  "title": "Full-Stack Engineer & UI/UX Architect",
  "tagline": "Open to Work · Available for Remote & On-Site Roles",
  "bio": "A highly driven Full-Stack Engineer...",
  "email": "alex.aglinao@email.com",
  "phone": "+63 917 123 4567",
  "location": "Manila, Philippines",
  "profileImageUrl": "https://example.com/photo.jpg",
  "resumeUrl": "https://example.com/resume.pdf",
  "github": "https://github.com/engraglinao",
  "linkedin": "https://linkedin.com/in/aglinao",
  "twitter": "https://twitter.com/aglinao",
  "yearsExperience": "7+",
  "projectsDelivered": "80+",
  "clientsSatisfied": "40+",
  "education": [
    {
      "degree": "B.S. Computer Engineering",
      "school": "Polytechnic University of the Philippines",
      "year": "2017"
    }
  ],
  "qualifications": [
    "Full-Stack web & mobile application architecture",
    "Figma to production UI/UX systems design"
  ]
}
```

### Collection: `layout_configuration` → Auto Document IDs

```json
{
  "id": "hero",
  "sectionId": "hero",
  "label": "Hero / About Me",
  "order": 1,
  "visible": true,
  "bgVariant": "default"
}
```

**`bgVariant` values:** `"default"` | `"alt"` | `"gradient"` | `"dark"`

### Collection: `experience` → Auto Document IDs

```json
{
  "role": "Lead Full-Stack Engineer",
  "organization": "TechNova Solutions Inc.",
  "dateRange": "Jan 2022 — Present",
  "description": "Full description of responsibilities...",
  "icon": "fa-solid fa-code",
  "iconColor": "#6366f1",
  "order": 1,
  "tags": ["React", "Node.js", "AWS", "PostgreSQL"]
}
```

**`icon`**: Any valid [FontAwesome 6 class string](https://fontawesome.com/icons).

### Collection: `portfolio` → Auto Document IDs

```json
{
  "title": "FinFlow — FinTech Dashboard",
  "description": "Project description...",
  "type": "Site",
  "url": "https://project-url.com",
  "thumbnailUrl": "https://image-url.com/thumb.jpg",
  "tags": ["React", "Firebase"],
  "order": 1
}
```

**`type` values:** `"Site"` | `"URL"` | `"PDF"` | `"PPT"` | `"Image"`

### Collection: `applications` → Auto Document IDs

```json
{
  "name": "React / Next.js",
  "category": "Frontend",
  "icon": "fa-brands fa-react",
  "iconBg": "#0ea5e9",
  "proficiency": 95,
  "order": 1
}
```

### Collection: `messages` → Auto Document IDs (write-only from public)

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'd like to discuss...",
  "timestamp": "<Firestore ServerTimestamp>",
  "read": false
}
```

---

## 5. System Bootstrap & Automatic Seeding

### How the Auto-Seeding Engine Works

When `index.html` loads for the first time, the following sequence executes:

```
bootstrap()
    │
    ├── 1. initTheme()          → Reads localStorage, sets CSS class
    │
    ├── 2. checkAndSeedDatabase()
    │       │
    │       ├── getDocs(layout_configuration)
    │       │
    │       ├── IF EMPTY → runSeedRoutine()
    │       │       │
    │       │       └── writeBatch():
    │       │             ├── profile/main → SEED_DATA.profile
    │       │             ├── layout_configuration → 5 section documents
    │       │             ├── experience → 4 career entries
    │       │             ├── portfolio → 6 project cards
    │       │             └── applications → 12 skill chips
    │       │
    │       └── IF POPULATED → Skip seed, log message
    │
    ├── 3. fetchAllData()       → Parallel reads of all collections
    │
    ├── 4. renderPortfolio()    → Builds DOM from fetched state
    │
    └── 5. Dismiss loader overlay
```

### Seed Data Contents

The automatic seed routine writes the following polished sample data:

| Collection | Documents | Sample Content |
|---|---|---|
| `profile` | 1 | Complete engineer profile with bio, contact, social links, education, qualifications, and stats |
| `layout_configuration` | 5 | Hero, Experience, Portfolio, Applications, Contact — ordered, visible, with bg variants |
| `experience` | 4 | Lead Engineer, Senior UX Engineer, Software Developer, Junior Developer — with icons and tags |
| `portfolio` | 6 | FinTech dashboard, Telehealth platform, GovTech portal, Design system, IoT app, EdTech LMS |
| `applications` | 12 | React, Vue, TypeScript, Node.js, Python, Firebase, AWS, Docker, Figma, PostgreSQL, Tailwind, Git |

### Seeding Trigger Condition

The seed check examines the **`layout_configuration`** collection only. If it contains zero documents, all collections are seeded. This prevents duplicate seeding on subsequent page loads.

### Manual Re-Seeding via Admin Dashboard

1. Open `manage.html`
2. Navigate to **Data Utility** in the sidebar
3. Click **"Re-seed Empty Collections"** — writes seed data only to empty collections
4. Click **"Nuke & Reseed All"** — deletes everything and writes a clean seed (requires `CONFIRM` text prompt)

---

## 6. Data Portability Manual (Import / Export)

### Exporting the Database

1. Open `manage.html`
2. Click **"Data Utility"** in the sidebar navigation
3. Click the **"Export JSON"** button
4. A file download named `portfolio-export-YYYY-MM-DD.json` is triggered
5. The JSON preview pane displays the export structure inline

**Exported JSON structure:**

```json
{
  "_exportMeta": {
    "exportedAt": "2025-01-15T10:30:00.000Z",
    "version": "1.0",
    "source": "EA Portfolio CMS"
  },
  "profile": { ... },
  "layout": [ ... ],
  "experience": [ ... ],
  "portfolio": [ ... ],
  "applications": [ ... ]
}
```

> **Note:** The `messages` collection is excluded from exports for privacy. Only content data is exported.

### Importing a JSON File

1. Open `manage.html` → **Data Utility** panel
2. Click **"Import JSON"**
3. Select a valid `.json` export file from your file system
4. The system performs **schema validation** — checks for required top-level keys:
   - `profile`, `layout`, `experience`, `portfolio`, `applications`
5. If validation passes, a **confirmation dialog** warns that existing data will be replaced
6. Upon confirmation, the system:
   - Deletes all existing documents in targeted collections
   - Runs a `writeBatch()` to write all imported records
   - Reloads the admin panel state
   - Triggers an iframe preview refresh

### Import Error Handling

| Error | Cause | Resolution |
|---|---|---|
| `Invalid JSON format` | Malformed JSON file | Use a proper JSON validator before import |
| `Invalid schema. Missing keys: X` | File missing required top-level keys | Ensure file was exported from this system |
| `Import failed: permission-denied` | Firestore rules too restrictive | Temporarily loosen Firestore security rules |
| File upload with no `.json` extension | Wrong file type | Only `.json` files are accepted |

### Migration Workflow (Server A → Server B)

```
Server A (source):
  manage.html → Export JSON → portfolio-export-2025-01-15.json

Server B (destination):
  1. Configure Firebase credentials in both files
  2. Open manage.html
  3. Data Utility → Import JSON → Select file
  4. Confirm → Wait for batch write completion
  5. Refresh preview to verify
```

---

## 7. Admin Dashboard Operations Guide

### Accessing the Dashboard

Navigate directly to `manage.html` in your browser. This file is intentionally **not linked** from `index.html` and will not appear in search results or navigation.

**For GitHub Pages:**
```
https://yourusername.github.io/your-repo/manage.html
```

### Navigation Panels

| Panel | Description |
|---|---|
| **Profile** | Edit name, title, bio, contact details, social links, hero stats, education, and qualifications |
| **Experience** | Add, edit, delete, and reorder career timeline entries |
| **Portfolio** | Manage portfolio cards (title, type, URL, thumbnail, tags, order) |
| **Applications** | Manage skill chips (name, category, icon, color, proficiency, order) |
| **Section Order** | Drag-and-drop section reordering + visibility toggles + background variant selectors |
| **Messages** | View contact form submissions, mark read, delete individual messages, or clear all |
| **Data Utility** | Export/import JSON, manual re-seeding, database nuke |

### Adding a New Experience Entry

1. Navigate to **Experience** panel
2. Click **"Add Entry"**
3. Fill in the modal form:
   - **Job Title / Role** (required)
   - **Organization** (required)
   - **Date Range** — format: `"Jan 2022 — Present"`
   - **Description** — full role description
   - **FontAwesome Icon Class** — e.g., `fa-solid fa-code` (any FA 6 class)
   - **Icon Color** — color picker for the timeline node background
   - **Tags** — comma-separated tech stack tags
   - **Display Order** — integer sort position
4. Click **"Save Changes"**
5. The experience list updates and the preview iframe refreshes

### Reordering Sections

1. Navigate to **Section Order** panel
2. Drag layout items by the grip handle (⠿) to rearrange
3. Toggle the **Visible** switch to hide/show sections
4. Select a **Background Variant** from the dropdown for each section:
   - **Default** — matches base page background
   - **Alt** — subtle card surface background
   - **Gradient** — soft accent color gradient overlay
   - **Dark** — deeper surface tone
5. Click **"Save Layout"** to persist to Firestore

### Deleting a Document

- In any list panel (Experience, Portfolio, Applications), click the **trash icon** on any item
- A browser confirmation dialog appears
- Confirming permanently deletes the Firestore document
- The list and preview refresh immediately

### Editing an Existing Document

- Click the **pencil icon** on any list item
- The edit modal opens pre-populated with current values
- Make changes and click **"Save Changes"**
- The document is overwritten via `setDoc()` in Firestore

---

## 8. Dynamic Resume Generator Engine

### Triggering the Resume

- On the public portfolio (`index.html`), click **"Generate Resume"** in the navigation bar
- The `generateLiveResume()` function fires immediately

### Engine Behavior

```javascript
generateLiveResume()
    │
    ├── Reads window.__portfolioState (live Firestore data already in memory)
    │
    ├── Builds asymmetric resume HTML into #resume-print-workspace div:
    │       ├── LEFT SIDEBAR (33%):
    │       │     ├── Circular profile photo (or icon placeholder)
    │       │     ├── Full name + professional title
    │       │     ├── Contact details with FontAwesome icons
    │       │     ├── Key Qualifications bullet list
    │       │     └── Education entries
    │       │
    │       └── RIGHT MAIN PANEL (67%):
    │             ├── Gradient header accent block (name + title)
    │             ├── Career Objective section (bio text)
    │             ├── Technical Skills grid (2-column chip layout)
    │             └── Professional Experience timeline
    │
    └── Calls window.print() after 100ms delay
```

### Print CSS Architecture

The `@media print` block in `index.html` applies the following rules on print:

1. **Hides all web content:** `body > *:not(#resume-print-workspace) { display: none !important; }`
2. **Forces color printing:** `-webkit-print-color-adjust: exact !important` on all elements
3. **Sidebar styling:** Dark slate `#1e2130` background with light text — matches the site's sidebar theme
4. **Accent colors:** `#6366f1` (indigo) and `#8b5cf6` (violet) match the site's primary gradient
5. **Typography:** `Plus Jakarta Sans` — same as the web portfolio
6. **Icons:** FontAwesome icons render identically in print as on screen
7. **Layout:** Flexbox two-column layout fills the full page width

### Font & Color Identity Matching

| Web Site Element | Resume Equivalent |
|---|---|
| Indigo gradient (`#6366f1 → #8b5cf6`) | Header accent block gradient |
| Timeline node background | `resume-exp-role i` icon color |
| App icon box colors | `resume-skill-chip i` icon colors |
| `Plus Jakarta Sans` font | Resume body font |
| Dark sidebar (`#1e2130`) | Resume sidebar background |
| Border color `#2d3554` | Sidebar section dividers |

### Saving as PDF

When `window.print()` fires, use your browser's print dialog:
- **Chrome/Edge:** Select "Save as PDF" from the destination dropdown
- **Firefox:** Select "Microsoft Print to PDF" or "Save to PDF"
- Ensure **"Background graphics"** is checked in print options for color accuracy
- Set paper size to **A4** or **Letter**
- Set margins to **None** or **Minimum** for best results

---

## 9. Theme System & Iconography

### Light / Dark Mode

Both `index.html` and `manage.html` implement the same CSS variable-based theme system:

```css
html.light { --bg-base: #f8f9fc; --text-primary: #0f1117; ... }
html.dark  { --bg-base: #0d0f18; --text-primary: #f1f5f9; ... }
```

- **Toggle:** Click the moon/sun button in the navigation bar
- **Persistence:** Theme preference stored in `localStorage` under key:
  - `portfolio-theme` (index.html)
  - `admin-theme` (manage.html)
- **Default:** Dark mode on first visit

### FontAwesome Integration

Icons are loaded via CDN:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
```

Icons are used consistently across:
- Timeline node indicators
- Application skill chip icons
- Navigation elements
- Section labels
- Resume document (same class strings, prints correctly)
- Contact info rows
- Toast notifications
- Admin dashboard UI elements

**Icon class format:** `fa-{style} fa-{icon-name}`
- Solid: `fa-solid fa-code`
- Brands: `fa-brands fa-react`
- Regular: `fa-regular fa-calendar`

---

## 10. GitHub Pages Deployment

### Repository Setup

```bash
# Clone or create repository
git init ea-portfolio
cd ea-portfolio

# Copy your three files
cp index.html manage.html README.md ./

# Commit and push
git add .
git commit -m "Initial portfolio deployment"
git branch -M main
git remote add origin https://github.com/yourusername/ea-portfolio.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **"Deploy from a branch"**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Your site will be available at: `https://yourusername.github.io/ea-portfolio/`

### Deployment Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Security rules configured
- [ ] `firebaseConfig` updated in **both** `index.html` and `manage.html`
- [ ] Firestore rules allow public `read` for portfolio collections
- [ ] Firestore rules allow public `create` for `messages` collection
- [ ] `manage.html` access restricted (consider IP allowlisting or Firebase Auth)
- [ ] Files committed and pushed to GitHub
- [ ] GitHub Pages enabled on `main` branch, root folder

### Custom Domain (Optional)

1. In GitHub Pages settings, enter your custom domain
2. Create a CNAME record pointing to `yourusername.github.io`
3. Create a `CNAME` file in the repo root containing your domain

---

## 11. Troubleshooting

### "Permission denied" errors in console

**Cause:** Firestore security rules are too restrictive.
**Fix:** Temporarily set all collections to `allow read, write: if true;` for testing. Tighten after confirming the setup works.

### Portfolio loads but shows no content

**Cause:** Firebase config credentials are incorrect or mismatched between files.
**Fix:** Double-check both `index.html` and `manage.html` contain **identical** `firebaseConfig` objects with your actual credentials.

### Seed data not appearing

**Cause:** The seed check found data already present (even partial).
**Fix:** Go to `manage.html` → **Data Utility** → **"Nuke & Reseed All"**. Type `CONFIRM` to proceed.

### Resume print shows only icons, no background colors

**Cause:** Browser print settings have "Background graphics" disabled.
**Fix:** In the print dialog, enable **"Background graphics"** / **"Print backgrounds"** option.

### iframe preview in manage.html is blank

**Cause:** Browser security policies blocking same-origin iframes, or `index.html` has errors.
**Fix:** Serve files via a local HTTP server (e.g., `npx serve .` or VS Code Live Server). File protocol (`file://`) blocks module scripts.

### Firebase module script errors

**Cause:** Attempting to open HTML files directly via `file://` protocol.
**Fix:** ES Modules require HTTP. Use a local development server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

### JSON Import fails with "Invalid schema"

**Cause:** Importing a JSON file not generated by this system.
**Fix:** Ensure the JSON file contains all required top-level keys: `profile`, `layout`, `experience`, `portfolio`, `applications`. The `_exportMeta` key is optional.

---

## 12. License

This project is open source under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 Engr. Alex Aglinao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## System Metadata

| Attribute | Detail |
|---|---|
| **Author** | Engr. Alex Aglinao |
| **Repository** | `engraglinao/engraglinao.github.io` |
| **Architecture** | 3-file SPA (index.html, manage.html, README.md) |
| **Database** | Firebase Firestore (NoSQL, real-time) |
| **Styling** | Tailwind CSS v4 (CDN) + Custom CSS Variables |
| **Icons** | FontAwesome 6.5 (CDN) |
| **Typography** | Plus Jakarta Sans (Google Fonts) |
| **JavaScript** | Vanilla ES6+ with Firebase Modular SDK v10 |
| **Deployment** | GitHub Pages (static hosting) |
| **Print Engine** | `window.print()` + `@media print` CSS |
| **Theme System** | CSS custom properties + `localStorage` persistence |
| **Data Portability** | JSON export/import with schema validation |
| **Seeding** | Automatic on empty database + manual re-seed controls |

---

*Built with Firebase · Tailwind CSS · Vanilla JavaScript · FontAwesome · Plus Jakarta Sans*
