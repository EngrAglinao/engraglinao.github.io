# engraglinao.github.io — Dynamic Portfolio & Resume System

[![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-blue?logo=github)](https://engraglinao.github.io)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20Firestore-orange?logo=firebase)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

A **fully CMS-driven, zero-hardcoded-content** portfolio and resume web application built with Semantic HTML5, Tailwind CSS, and Vanilla ES6+ JavaScript. All displayed content — including section structure, experience timeline, portfolio items, skills, and layout configuration — is served live from **Firebase Firestore**. A companion Admin Dashboard (`manage.html`) provides a complete split-pane management interface with real-time preview.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Architecture](#2-file-architecture)
3. [Firebase Installation & Database Connection](#3-firebase-installation--database-connection)
4. [Firestore Schema Reference](#4-firestore-schema-reference)
5. [System Bootstrap & Automatic Seeding Guide](#5-system-bootstrap--automatic-seeding-guide)
6. [Data Portability Manual (Import / Export)](#6-data-portability-manual-import--export)
7. [Content Operations Guide](#7-content-operations-guide)
8. [Section Order & Visibility Management](#8-section-order--visibility-management)
9. [Background Canvas Matrix](#9-background-canvas-matrix)
10. [Dynamic Resume Generator — Print Engine](#10-dynamic-resume-generator--print-engine)
11. [Deployment to GitHub Pages](#11-deployment-to-github-pages)
12. [Technology Stack](#12-technology-stack)

---

## 1. Project Overview

### Data Workflow

```
Firebase Firestore (Cloud Database)
         │
         ▼
  index.html boots → checkAndSeed()
         │
         ├── Collections empty? → runSeedRoutine() → writes all SEED_DATA to Firestore
         │
         └── Collections populated? → loadAllData() → populates window.__DB_STATE{}
                    │
                    ▼
            renderPortfolio() reads layout_configuration.sections[]
                    │
                    ├── Sorts sections by `order` field
                    ├── Filters sections where `visible === false`
                    └── Dynamically builds and injects each section into <main id="portfolio-root">
```

### Zero-Hardcoded Content Policy

The public `index.html` file contains **no static text content** in its HTML markup. Every visible string — headlines, bios, job titles, organization names, portfolio descriptions, skill names, section labels, profile images, and footer text — is rendered exclusively from live Firestore document data at runtime via JavaScript.

---

## 2. File Architecture

```
engraglinao.github.io/
├── index.html          # Public portfolio (Firebase-driven, zero hardcoded content)
├── manage.html         # Admin CMS dashboard (split-pane, Firestore CRUD operations)
└── README.md           # This documentation file
```

### File Roles

| File | Role | Firebase Access | Public |
|------|------|-----------------|--------|
| `index.html` | Public portfolio display | Read (all collections) + Write (messages) | ✅ Yes |
| `manage.html` | Admin management dashboard | Full CRUD on all collections | ❌ No (admin only) |
| `README.md` | Documentation | None | ✅ Yes (GitHub) |

> **Security Note:** `manage.html` is not linked anywhere on `index.html`. It is intentionally unindexed (`<meta name="robots" content="noindex, nofollow">`). For production deployments, it is strongly recommended to implement Firebase Authentication to protect this file, or to remove it from the public repository entirely and access it locally.

---

## 3. Firebase Installation & Database Connection

### Step 1: Create a Firebase Project

1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup wizard.
3. Give your project a name (e.g., `engraglinao-portfolio`).
4. Enable **Google Analytics** (optional).
5. Click **Create project**.

### Step 2: Register Your Web App

1. Inside your Firebase project, click the **Web** icon (`</>`) to add a web app.
2. Register the app with a nickname (e.g., `portfolio-app`).
3. Firebase will display your **configuration object**. Copy it — you need it for both files.

### Step 3: Create a Firestore Database

1. In the Firebase Console sidebar, navigate to **Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (recommended) or **test mode** for initial development.
4. Select a Firestore location closest to your target audience (e.g., `asia-southeast1` for the Philippines).
5. Click **Done**.

### Step 4: Configure Firestore Security Rules

For a portfolio site with a public contact form, use these rules:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for portfolio data
    match /layout_configuration/{docId} { allow read: if true; allow write: if false; }
    match /about/{docId}               { allow read: if true; allow write: if false; }
    match /experience/{docId}          { allow read: if true; allow write: if false; }
    match /portfolio/{docId}           { allow read: if true; allow write: if false; }
    match /apps/{docId}                { allow read: if true; allow write: if false; }

    // Public write only for messages (contact form)
    match /messages/{docId} { allow read: if false; allow create: if true; }

    // Admin access — restrict in production with Auth
    // match /{path=**} { allow read, write: if request.auth != null; }
  }
}
```

> **Production Upgrade:** Replace the public write rules with `request.auth != null` checks once Firebase Authentication is configured for the admin workflow.

### Step 5: Paste Your Firebase Config Into Both Files

Locate the following block in **both** `index.html` and `manage.html` and replace the placeholder values:

```javascript
// ============================================================
// FIREBASE CONFIGURATION — REPLACE WITH YOUR OWN PROJECT KEYS
// ============================================================
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",           // ← Replace
  authDomain:        "YOUR_AUTH_DOMAIN",        // ← Replace
  projectId:         "YOUR_PROJECT_ID",         // ← Replace
  storageBucket:     "YOUR_STORAGE_BUCKET",     // ← Replace
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",// ← Replace
  appId:             "YOUR_APP_ID"              // ← Replace
};
```

Your actual config will look like this:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyD_ExAmPlEkEy_aBcDeFgHiJ",
  authDomain:        "my-portfolio-abc12.firebaseapp.com",
  projectId:         "my-portfolio-abc12",
  storageBucket:     "my-portfolio-abc12.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abc123def456"
};
```

> **Critical:** Both `index.html` and `manage.html` must use the **identical** config block pointing to the **same** Firebase project. They share a single Firestore database as the unified source of truth.

---

## 4. Firestore Schema Reference

The application uses the following Firestore collections and document structures:

### Collection: `layout_configuration` (Single Document: `main`)

```json
{
  "site_name":     "Engr. Aglinao",
  "tagline":       "Full-Stack Engineer & Systems Architect",
  "profile_image": "https://url-to-profile-photo.jpg",
  "resume_file":   "/master-resume.pdf",
  "footer_bio":    "Short bio text for the footer section.",
  "seeded_at":     "2025-01-01T00:00:00.000Z",
  "sections": [
    {
      "id":      "hero",
      "label":   "Hero / About",
      "order":   1,
      "visible": true,
      "bg":      "hero-gradient"
    },
    {
      "id":      "experience",
      "label":   "Experience Timeline",
      "order":   2,
      "visible": true,
      "bg":      "neutral"
    },
    {
      "id":      "portfolio",
      "label":   "Portfolio Caravan",
      "order":   3,
      "visible": true,
      "bg":      "accent-subtle"
    },
    {
      "id":      "apps",
      "label":   "Application Matrix",
      "order":   4,
      "visible": true,
      "bg":      "neutral"
    },
    {
      "id":      "contact",
      "label":   "Contact Layer",
      "order":   5,
      "visible": true,
      "bg":      "accent-subtle"
    }
  ]
}
```

**Section `bg` Values:**
| Value | Effect |
|-------|--------|
| `neutral` | White (light mode) / Slate-900 (dark mode) |
| `accent-subtle` | Slate-50 tint (light) / Slate-800/50 (dark) |
| `hero-gradient` | Dark indigo linear gradient (hero use) |
| `slate-dark` | Deep Slate-900 in both modes |
| `indigo-subtle` | Soft indigo wash overlay |

---

### Collection: `about` (Single Document: `main`)

```json
{
  "headline":   "Engineering Elegant Solutions at Scale",
  "bio":        "Detailed biography paragraph displayed in the hero section.",
  "objective":  "Career objective statement used in the generated resume.",
  "cta_label":  "Download Master Resume",
  "cta_icon":   "fa-solid fa-file-arrow-down",
  "highlights": [
    { "icon": "fa-solid fa-code-branch", "label": "8+ Years Experience" },
    { "icon": "fa-solid fa-server",      "label": "Cloud-Native Systems" }
  ],
  "education": [
    {
      "degree": "B.S. Computer Engineering",
      "school": "University of the Philippines",
      "year":   "2015",
      "icon":   "fa-solid fa-graduation-cap"
    }
  ]
}
```

---

### Collection: `experience` (Multiple Documents)

Each document represents one timeline entry:

```json
{
  "order":        1,
  "role":         "Principal Systems Architect",
  "organization": "NovaTech Digital Corp.",
  "period":       "Jan 2022 — Present",
  "location":     "Manila, PH (Remote)",
  "icon":         "fa-solid fa-building-columns",
  "icon_color":   "#6366f1",
  "description":  "Lead end-to-end architecture for enterprise SaaS platforms…",
  "tags":         ["GCP", "Microservices", "Node.js", "React", "Firebase"]
}
```

---

### Collection: `portfolio` (Multiple Documents)

Each document represents one portfolio card:

```json
{
  "order":       1,
  "title":       "PhilHealth Digital Portal",
  "subtitle":    "Government Health System",
  "type":        "Site",
  "category":    "Enterprise",
  "thumbnail":   "https://url-to-thumbnail-image.jpg",
  "url":         "https://live-site-url.com",
  "description": "End-to-end digital transformation…",
  "tags":        ["React", "Node.js", "PostgreSQL"],
  "icon":        "fa-solid fa-hospital",
  "color":       "#6366f1"
}
```

**Portfolio Item `type` Values:**
| Type | Behavior on Click |
|------|-------------------|
| `Site` | Opens modal with thumbnail + "Visit Live Site" link |
| `URL`  | Opens modal with thumbnail + external link button |
| `Image`| Opens modal showing full-size thumbnail image |
| `PPT`  | Opens modal with PowerPoint download prompt |
| `PDF`  | Opens modal with PDF download prompt |

---

### Collection: `apps` (Multiple Documents)

Each document represents one skill/tool card:

```json
{
  "order":       1,
  "name":        "React / Next.js",
  "category":    "Frontend",
  "icon":        "fa-brands fa-react",
  "color":       "#06b6d4",
  "proficiency": "Expert"
}
```

**`proficiency` Values:** `Expert`, `Advanced`, `Proficient`, `Familiar`

---

### Collection: `messages` (Multiple Documents — Auto-created)

Written by the contact form on `index.html`:

```json
{
  "name":       "Visitor Name",
  "email":      "visitor@email.com",
  "message":    "Message content here.",
  "created_at": "<Firestore Timestamp>"
}
```

---

## 5. System Bootstrap & Automatic Seeding Guide

### How Auto-Seeding Works

When `index.html` first loads in a browser, it executes the following boot sequence:

```
1. initializeApp(firebaseConfig)  — Connect to Firebase
2. checkAndSeed()                 — Triggered immediately
   │
   ├── getDoc("layout_configuration/main")
   │
   ├── Document EXISTS?
   │   └── loadAllData() → fetch all collections → renderPortfolio()
   │
   └── Document DOES NOT EXIST?
       └── runSeedRoutine()
           ├── writeBatch() with complete SEED_DATA object
           │   ├── layout_configuration/main ← setDoc
           │   ├── about/main               ← setDoc
           │   ├── experience/*             ← multiple addDoc calls
           │   ├── portfolio/*              ← multiple addDoc calls
           │   └── apps/*                  ← multiple addDoc calls
           └── loadAllData() → renderPortfolio()
```

### Seed Data Properties

The seed data written to Firestore on first boot includes:

| Collection | Documents Seeded | Description |
|------------|------------------|-------------|
| `layout_configuration` | 1 (main) | Full site identity, 5 sections with order and bg settings |
| `about` | 1 (main) | Complete hero content including highlights array and education array |
| `experience` | 4 | Career timeline from Junior Developer to Principal Architect |
| `portfolio` | 5 | Mixed-type projects covering Site, Image, PPT, URL, PDF |
| `apps` | 16 | Skills across 7 categories with colors, icons, and proficiency |

### Offline / Config-Missing Fallback

If Firestore is unreachable (e.g., Firebase config not yet populated), the system catches the error and renders the seed data directly from the in-memory `SEED_DATA` object without writing to Firebase. The site remains fully functional in this demo mode.

### Re-Triggering the Seed Routine

To reset the database to seed defaults:
1. Open `manage.html`.
2. Navigate to **Data Utilities** in the sidebar.
3. In the **Danger Zone** section, click **Re-Run Seeding Routine**.
4. This deletes all current collection documents and deletes `layout_configuration/main` and `about/main`.
5. The next page load of `index.html` will detect the empty database and re-seed automatically.

---

## 6. Data Portability Manual (Import / Export)

### Exporting Your Database

**From `manage.html` → Data Utilities → Export Entire Database:**

1. Click the **Export JSON Backup** button.
2. The browser downloads a file named `portfolio-backup-YYYY-MM-DD.json`.
3. The file contains a structured JSON object with this top-level schema:

```json
{
  "_exported_at": "2025-01-15T10:30:00.000Z",
  "_version": "1.0",
  "layout_configuration": { ... },
  "about": { ... },
  "experience": [ { ... }, { ... } ],
  "portfolio":  [ { ... }, { ... } ],
  "apps":       [ { ... }, { ... } ]
}
```

4. Store this file securely as your backup. It can be re-imported at any time.

### Importing a JSON File

**From `manage.html` → Data Utilities → Import JSON File:**

#### Step-by-Step Import Process

1. Click the **drop zone area** or drag-and-drop your `.json` backup file onto it.
2. The system immediately **validates the schema**:
   - ✅ **Valid:** A green confirmation message shows detected record counts.
   - ❌ **Invalid:** A red error message lists the missing required top-level keys.
3. If valid, the **Run Import & Replace Database** button becomes active.
4. Click the button — a confirmation dialog appears warning you of data replacement.
5. Confirm the action. The import engine executes:
   ```
   a. writeBatch() opened
   b. layout_configuration/main ← overwritten with imported data
   c. about/main                ← overwritten with imported data
   d. All existing experience/* documents ← deleted
   e. All existing portfolio/*  documents ← deleted
   f. All existing apps/*       documents ← deleted
   g. New experience documents  ← batch written from import array
   h. New portfolio documents   ← batch written from import array
   i. New apps documents        ← batch written from import array
   j. batch.commit() executed
   ```
6. `loadAllData()` re-fetches the entire new dataset.
7. The preview iframe and all admin panels refresh automatically.

#### JSON Schema Validation Rules

The import validator checks for these **required top-level keys**:
- `layout_configuration` (object)
- `about` (object)
- `experience` (array)
- `portfolio` (array)
- `apps` (array)

The `_exported_at` and `_version` fields are optional metadata and are ignored during import.

#### Safe Migration Between Firebase Projects

To migrate your data to a new Firebase project:
1. Export from the old project via the Export button.
2. Update `firebaseConfig` in both `index.html` and `manage.html` with the new project credentials.
3. Open `manage.html` with the new config.
4. Import the backup JSON file via the Import section.
5. The new Firestore database is fully populated.

---

## 7. Content Operations Guide

### Editing Core Text Content (Layout & About)

1. Open `manage.html`.
2. Select **Layout & Theme** or **About / Hero** from the sidebar.
3. Modify any field in the forms.
4. Click the **Save** button at the bottom.
5. The right-panel preview iframe automatically reloads to show changes.

### Adding a New Experience Entry

1. Navigate to **Experience** in the sidebar.
2. Click **+ Add Entry** — a blank template document is created in Firestore instantly.
3. The new entry appears at the top of the list.
4. Click the **pencil icon** to expand the inline editor.
5. Fill in all fields: Role, Organization, Period, Location, Icon, Color, Description, Tags, Order.
6. Click **Save** — the document is updated via `updateDoc()`.

### Modifying an Existing Entry

1. Hover over any card in the Experience, Portfolio, or Skills tabs.
2. The **Edit** (pencil) and **Delete** (trash) buttons appear.
3. Click the pencil to expand the inline editor within the card.
4. Edit any field and click **Save**.
5. Changes are written to Firestore immediately via `updateDoc()`.
6. The preview reloads to reflect the live state.

### Deleting an Entry

1. Hover over any card and click the **trash icon**.
2. A confirmation dialog appears.
3. Confirm — the document is deleted via `deleteDoc()`.
4. The card animates out (fade + scale) and is removed from the DOM.
5. The preview refreshes to reflect the removed item.

### Managing Portfolio Items

Portfolio items support 5 display types set via the **Type** dropdown:

| Type | When to Use |
|------|-------------|
| `Site` | Project with a live URL to visit |
| `URL`  | Any external link |
| `Image`| Full-size image viewer (screenshot, design) |
| `PPT`  | PowerPoint / presentation file link |
| `PDF`  | Document / case study PDF link |

For `URL`, `Site`, `PPT`, and `PDF` types, always populate the **Link URL** field with the resource destination.

---

## 8. Section Order & Visibility Management

### Reordering Sections

1. Navigate to **Section Order** in the sidebar.
2. Each section appears as a draggable pill showing its label, ID, and current order number.
3. **Drag** a pill above or below another to change the sequence.
4. Click **Save Section Order** to write the updated `order` integers to `layout_configuration/main.sections[]` in Firestore.
5. `index.html` re-reads the sorted sections array on next load and renders them in the new sequence.

### Toggling Section Visibility

1. In the **Section Order** tab, each pill has a **toggle switch** on its right side.
2. Click the toggle:
   - **ON (purple):** Section is visible on the public portfolio.
   - **OFF (gray):** Section is hidden — not rendered at all in `index.html`.
3. Click **Save Section Order** to persist the `visible` boolean flag to Firestore.

> Visibility is checked by the `renderPortfolio()` function which filters `sections.filter(s => s.visible !== false)` before rendering.

---

## 9. Background Canvas Matrix

### Changing Section Backgrounds

1. Navigate to **Background Canvas** in the sidebar.
2. Each section is listed with a dropdown selector.
3. Select your desired background style from the options:

| Option | Visual Result |
|--------|--------------|
| Neutral White/Dark | Clean white (light) or slate-900 (dark) |
| Subtle Accent Tint | Very light slate-50 or slate-800 overlay |
| Dark Gradient (Hero) | Full dark indigo gradient — best for Hero |
| Deep Slate Dark | Always-dark slate-900 |
| Indigo Wash | Soft indigo-50 or indigo-950/30 tint |

4. Click **Apply Background Settings**.
5. The `bg` property of each section in `layout_configuration/main.sections[]` is updated.
6. The preview reloads showing the new backgrounds.

---

## 10. Dynamic Resume Generator — Print Engine

### Activating the Generator

Click the **Generate Resume** button in the top navigation bar of `index.html`. The `generateLiveResume()` function is invoked immediately.

### How the Generator Works

```
generateLiveResume()
│
├── Reads window.__DB_STATE (populated by Firestore fetch)
│   ├── layout  → site_name, tagline, profile_image
│   ├── about   → bio, objective, education, highlights
│   ├── experience[] → all role entries with icons and colors
│   └── apps[]  → all skill items with icons and colors
│
├── Builds HTML string for two-column resume layout:
│   ├── LEFT SIDEBAR (33%): Dark slate-charcoal
│   │   ├── Circular/rounded profile image (from layout.profile_image)
│   │   ├── Contact details with FontAwesome icons
│   │   ├── Qualifications bullet list
│   │   ├── Education entries (from about.education[])
│   │   └── Core Tools skill pills (from apps[], first 10)
│   │
│   └── RIGHT MAIN PANEL (67%): White background
│       ├── Header accent block (indigo gradient, name + tagline)
│       ├── Career Objective paragraph
│       ├── Technical Skills grid (grouped by category, with icons)
│       └── Work History timeline (with role icons matching live site colors)
│
├── Injects HTML into hidden #resume-workspace div
├── Sets #resume-workspace to display:block
└── window.print() triggered after 300ms delay
```

### Visual Design Sync

The resume generator enforces exact visual identity matching with the live portfolio:

- **FontAwesome Icons:** Every skill and experience entry uses the **identical icon class** stored in Firestore — the same `fa-solid fa-building-columns` that appears on the timeline node renders as the same icon beside the job title in the resume.
- **Accent Colors:** The `icon_color` hex value from each experience entry is applied to the circular timeline node icon in the resume.
- **Typography:** Plus Jakarta Sans (loaded via Google Fonts) is applied to all resume elements, matching the portfolio site font.
- **Indigo Palette:** The `#6366f1` primary accent is used for the main header block, section titles, and skill category labels — identical to the site's CSS variable `--accent`.

### Print CSS Implementation

The `@media print` rules in `index.html` accomplish:

```css
@media print {
  /* Hide everything except the resume workspace */
  body > *:not(#resume-workspace) { display: none !important; }

  /* Show the workspace as the only content */
  #resume-workspace { display: block !important; position: static !important; }

  /* Zero margins, A4 page size */
  @page { margin: 0; size: A4; }
  html, body { margin: 0; padding: 0; background: white; }
}
```

This ensures the browser's print dialog (or "Save as PDF") renders **only** the resume layout with all icons, colors, and typography perfectly preserved.

---

## 11. Deployment to GitHub Pages

### Initial Deployment

1. Push all three files to your GitHub repository:
   ```bash
   git add index.html manage.html README.md
   git commit -m "Initial portfolio deployment"
   git push origin main
   ```

2. In your GitHub repository, navigate to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose branch: `main`, folder: `/ (root)`.
5. Click **Save**.
6. Your site will be available at `https://engraglinao.github.io` within 1–2 minutes.

### Firebase CORS Configuration

If you encounter CORS issues with Firebase on GitHub Pages, add your domain to the Firebase authorized domains:

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**.
2. Add `engraglinao.github.io`.

### Environment Management

For managing multiple environments (development vs production), maintain separate Firebase projects and swap the `firebaseConfig` block accordingly. Never commit production API keys to public repositories without proper security rules in place.

---

## 12. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Markup | Semantic HTML5 | Structure and accessibility |
| Styling | Tailwind CSS v4 (CDN) | Utility-first responsive design |
| Scripting | Vanilla ES6+ JavaScript | DOM rendering, Firebase interaction, resume generator |
| Database | Firebase Firestore | Cloud CMS backend, real-time data |
| Icons | FontAwesome 6.5 | Iconography across all components |
| Typography | Plus Jakarta Sans (Google Fonts) | High-end sans-serif font system |
| Hosting | GitHub Pages | Zero-cost static site deployment |
| Admin | Custom CMS (manage.html) | Full CRUD dashboard with live preview |

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

*Built with precision — Every pixel, every data point, every interaction is intentional.*
