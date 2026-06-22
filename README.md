# Portfolio & Resume Web Application
### `engraglinao.github.io` — Firebase-Powered CMS Portfolio

A fully dynamic, zero-hardcoded-content single-page portfolio and resume application. All visible text, structure, layout sequencing, and content arrays are driven entirely by a Firestore database. A disconnected management dashboard (`manage.html`) provides a complete admin CMS interface. A built-in resume generator engine produces a beautifully styled, print-ready PDF document that mirrors the live site's visual identity.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Three-File Architecture](#2-three-file-architecture)
3. [Firebase Installation & Data Connection](#3-firebase-installation--data-connection)
4. [Firestore Schema Reference](#4-firestore-schema-reference)
5. [Sample Data Seeding Guide](#5-sample-data-seeding-guide)
6. [Operations & Content Management](#6-operations--content-management)
7. [Dynamic Resume Generator & Print Engine](#7-dynamic-resume-generator--print-engine)
8. [Deployment to GitHub Pages](#8-deployment-to-github-pages)
9. [Theme System & Customization](#9-theme-system--customization)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

### Architecture Philosophy

This project operates on a **Total CMS Drive** principle: `index.html` contains zero hardcoded textual content. Every word displayed — the name, biography, section titles, experience entries, portfolio cards, skill items, contact details, and even section ordering — is fetched from Firestore at runtime and injected into the DOM by the rendering engine.

### Data Workflow Diagram

```
Firestore Database (Single Source of Truth)
         │
         ├──▶  index.html  (Public Portfolio)
         │         Reads: core_text, layout_configuration,
         │                experience, portfolio, skills, contact_info
         │         Writes: messages (contact form submissions)
         │
         └──▶  manage.html  (Admin Dashboard — disconnected from public)
                   Reads:  all above collections
                   Writes: all above collections (full CRUD)
                   Preview: embeds index.html in a live iframe
```

### Core Technologies

| Technology         | Role                                      |
|--------------------|-------------------------------------------|
| Firebase Firestore | Real-time NoSQL database / CMS backend    |
| Vanilla ES6+       | All rendering, interactivity, & logic     |
| Tailwind CSS (CDN) | Utility-first styling via browser build   |
| Plus Jakarta Sans  | Primary typography (Google Fonts)         |
| FontAwesome 6.5    | Icon system (navigation, skills, resume)  |
| CSS Custom Props   | Unified dark/light theme variable system  |

---

## 2. Three-File Architecture

### `index.html` — The Public Portfolio

The public-facing single-page application. Contains:

- **Zero hardcoded content** in HTML markup
- Firebase SDK initialization (v10 compat mode for CDN)
- A JavaScript rendering engine that fetches all data, then builds and injects every section into `<main id="site-main">`
- **Section renderers:** `renderHero()`, `renderExperience()`, `renderPortfolio()`, `renderSkills()`, `renderContact()`
- **Portfolio carousel** with custom Prev/Next buttons, dot indicators, and responsive column counts
- **Media preview modal** that handles Site (iframe embed), Image, PDF, PPT, URL, and Video type cards
- **Contact form** that pushes submissions directly to `messages` collection
- **`generateLiveResume()`** — the print engine function (see Section 7)
- **Light/Dark toggle** with `localStorage` persistence
- **Fallback data** — if Firebase is not yet configured, the site renders gracefully with sample data so the layout is never broken

### `manage.html` — The Admin Dashboard

A completely independent management interface. **Not linked anywhere on `index.html`**. Contains:

- A **50/50 split-screen layout**: left control panel, right live iframe preview of `index.html`
- A **sidebar navigation** with 8 management panels: Core Text, Experience, Portfolio, Skills, Contact Info, Layout Order, Backgrounds, Messages
- **Full CRUD** for all Firestore collections
- **Drag-and-drop section reordering** and per-section visibility toggles
- **Background canvas matrix** — independent color/gradient picker per section
- **Messages inbox** — read, mark-read, and delete contact form submissions
- **Toast notification system** for all save/delete/error events
- **Same Firebase config** as `index.html` — identical project connection
- **Theme toggle** with independent `localStorage` key from the public site

### `README.md` — This Documentation File

Comprehensive deployment, seeding, and operations guide for the GitHub repository.

---

## 3. Firebase Installation & Data Connection

### Step 1: Create a Firebase Project

1. Navigate to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Enter a project name (e.g., `engraglinao-portfolio`)
3. Disable Google Analytics (optional) → Click **"Create project"**

### Step 2: Enable Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (allows open read/write for development)
4. Select your preferred server region (e.g., `asia-southeast1` for Philippines)
5. Click **"Enable"**

> **⚠️ Security Note:** For production, configure Firestore Security Rules to restrict `messages` write access and lock `site_config` reads. Refer to the Firebase documentation for rule configuration.

### Step 3: Get Your Web App Configuration

1. In Firebase Console → Click the **gear icon** (Project Settings)
2. Scroll to **"Your apps"** → Click **"Add app"** → Select **Web** (`</>`)
3. Register the app (no need for Firebase Hosting if using GitHub Pages)
4. Copy the `firebaseConfig` object

### Step 4: Paste Config Into Both Files

Locate the clearly marked config block in **both** `index.html` and `manage.html` and replace the placeholder values:

**In `index.html`** (around line 330):
```javascript
// ════════════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION — Replace with your project credentials
// ════════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",           // ← Replace
  authDomain:        "YOUR_AUTH_DOMAIN",       // ← Replace
  projectId:         "YOUR_PROJECT_ID",        // ← Replace
  storageBucket:     "YOUR_STORAGE_BUCKET",    // ← Replace
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← Replace
  appId:             "YOUR_APP_ID"             // ← Replace
};
```

**In `manage.html`** (identical block, around line 400):
```javascript
// ════════════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION — IDENTICAL to index.html
// ════════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_AUTH_DOMAIN",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

Both files **must** use the **exact same** `projectId` and credentials.

---

## 4. Firestore Schema Reference

The application reads from the following Firestore structure:

### Collection: `site_config`

#### Document: `core_text`

```
site_config / core_text
├── site_title          (string)  — "Engr. Aglinao"
├── nav_logo            (string)  — "EA"  (2–4 chars for navbar brand)
├── hero_badge          (string)  — "Open to Opportunities"
├── hero_title_line1    (string)  — "Building Digital"
├── hero_title_line2    (string)  — "Experiences"
├── hero_title_accent   (string)  — "That Matter"  (rendered in gradient)
├── hero_bio            (string)  — Full biography paragraph
├── career_objective    (string)  — Paragraph used on generated resume
├── hero_resume_url     (string)  — URL to downloadable PDF resume file
├── profile_image_url   (string)  — Direct URL to profile photo (circular)
├── footer_tagline      (string)  — "Crafted with precision and passion."
├── footer_tech         (string)  — "Firebase · Tailwind CSS · Vanilla JS"
├── social_github       (string)  — "https://github.com/engraglinao"
├── social_linkedin     (string)  — "https://linkedin.com/in/..."
├── social_email        (string)  — "hello@engraglinao.dev"
├── education           (array)   — Array of education objects:
│   └── { degree: string, school: string, year: string }
└── resume_summary_bullets (array) — Array of strings for resume sidebar bullets
```

#### Document: `layout_configuration`

```
site_config / layout_configuration
└── sections  (array)  — Array of section config objects:
    └── {
          id:      string  — "hero" | "experience" | "portfolio" | "skills" | "contact"
          label:   string  — Human-readable section name
          visible: boolean — true = rendered on site, false = completely hidden
          order:   number  — Rendering sequence (1 = first)
          bg:      string  — Background style key (see Theme section)
        }
```

**Background style keys:**
| Key             | Visual Result                      |
|-----------------|------------------------------------|
| `solid-neutral` | `--bg-page` (default page bg)      |
| `solid-surface` | `--bg-surface` (card/navbar color) |
| `solid-alt`     | `--bg-alt` (light alternate shade) |
| `accent-subtle` | Soft indigo gradient (6% opacity)  |
| `accent-medium` | Medium indigo gradient (12%)       |
| `dark-deep`     | Pure `#0f172a` deep dark           |

#### Document: `contact_info`

```
site_config / contact_info
├── email        (string)  — "hello@engraglinao.dev"
├── phone        (string)  — "+63 912 345 6789"
├── location     (string)  — "Cebu City, Philippines"
└── availability (string)  — "Available for freelance & full-time roles"
```

---

### Collection: `experience`

Each document represents one job entry in the timeline:

```
experience / {auto-id}
├── role          (string)  — "Senior Full-Stack Engineer"
├── organization  (string)  — "TechVision Corp"
├── date_range    (string)  — "2021 – Present"
├── description   (string)  — Detailed role description paragraph
├── icon          (string)  — FontAwesome icon class, e.g. "fa-code"
└── order         (number)  — Sort order (ascending, 1 = first/top)
```

---

### Collection: `portfolio`

Each document represents one card in the carousel:

```
portfolio / {auto-id}
├── title         (string)  — "Analytics Dashboard"
├── description   (string)  — Brief project description
├── type          (string)  — "Site" | "URL" | "PDF" | "PPT" | "Image" | "Video" | "Doc"
├── url           (string)  — Direct link to the resource
├── thumbnail     (string)  — Direct URL to thumbnail image (optional)
├── tags          (array)   — ["React", "Firebase", "Tailwind"]
└── order         (number)  — Carousel display order (ascending)
```

**Type Behavior in Modal:**
| Type    | Modal Behavior                          | Icon Color  |
|---------|-----------------------------------------|-------------|
| `Site`  | Embedded `<iframe>` preview             | Cyan        |
| `URL`   | Embedded `<iframe>` preview             | Indigo      |
| `PDF`   | Embedded `<iframe>` PDF viewer          | Red         |
| `Image` | Direct `<img>` display                  | Purple      |
| `PPT`   | Icon placeholder + external link button | Orange      |
| `Video` | Icon placeholder + external link button | Pink        |
| `Doc`   | Icon placeholder + external link button | Blue        |

---

### Collection: `skills`

Each document represents one skill card in the matrix grid:

```
skills / {auto-id}
├── name      (string)  — "React.js"
├── category  (string)  — "Frontend" | "Backend" | "Design" | "DevOps" | "Database"
├── icon      (string)  — Full FontAwesome class string, e.g. "fa-brands fa-react"
└── order     (number)  — Grid display order (ascending)
```

---

### Collection: `messages` (Write-only from public site)

Contact form submissions:

```
messages / {auto-id}
├── name       (string)    — Sender's full name
├── email      (string)    — Sender's email address
├── message    (string)    — Message body text
├── timestamp  (Timestamp) — Server-side Firestore timestamp
└── read       (boolean)   — false on creation, true after admin marks it
```

---

## 5. Sample Data Seeding Guide

Use the `manage.html` dashboard to seed your initial data, or use the Firebase Console's **"Add document"** feature. Below are complete sample payloads.

### Seeding via manage.html (Recommended)

1. Open `manage.html` in your browser
2. Ensure Firebase config is correctly set
3. Navigate to each panel in the sidebar and use the **"Add Entry"** / **"Save"** buttons

### Seeding via Firebase Console (Manual)

Navigate to **Firestore Database → Start collection** and use these sample documents:

#### `site_config / core_text` (single document, use "Set document"):

```json
{
  "site_title": "Engr. Aglinao",
  "nav_logo": "EA",
  "hero_badge": "Open to Opportunities",
  "hero_title_line1": "Building Digital",
  "hero_title_line2": "Experiences",
  "hero_title_accent": "That Matter",
  "hero_bio": "A passionate Full-Stack Engineer and creative problem-solver with over 8 years of experience designing and developing scalable web applications, interactive tools, and data-driven platforms. I bridge the gap between technical excellence and elegant design.",
  "career_objective": "To leverage my full-stack engineering expertise and creative design sensibility to build impactful digital solutions that solve real-world problems at scale.",
  "hero_resume_url": "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
  "profile_image_url": "https://your-cdn.com/profile-photo.jpg",
  "footer_tagline": "Crafted with precision and passion.",
  "footer_tech": "Firebase · Tailwind CSS · Vanilla JS",
  "social_github": "https://github.com/engraglinao",
  "social_linkedin": "https://linkedin.com/in/engraglinao",
  "social_email": "hello@engraglinao.dev",
  "education": [
    {
      "degree": "B.S. Computer Engineering",
      "school": "University of the Philippines",
      "year": "2016"
    }
  ],
  "resume_summary_bullets": [
    "Full-Stack Web Development",
    "UI/UX Design & Prototyping",
    "Cloud Architecture & DevOps",
    "Agile Project Management",
    "Technical Leadership & Mentoring"
  ]
}
```

#### `site_config / layout_configuration` (single document):

```json
{
  "sections": [
    { "id": "hero",       "label": "Hero / About Me",    "visible": true, "order": 1, "bg": "solid-neutral" },
    { "id": "experience", "label": "Experience Timeline", "visible": true, "order": 2, "bg": "solid-surface" },
    { "id": "portfolio",  "label": "Portfolio Carousel",  "visible": true, "order": 3, "bg": "accent-subtle" },
    { "id": "skills",     "label": "Application Matrix",  "visible": true, "order": 4, "bg": "solid-surface" },
    { "id": "contact",    "label": "Contact Layer",        "visible": true, "order": 5, "bg": "solid-alt"     }
  ]
}
```

#### `site_config / contact_info` (single document):

```json
{
  "email": "hello@engraglinao.dev",
  "phone": "+63 912 345 6789",
  "location": "Cebu City, Philippines",
  "availability": "Available for freelance & full-time roles"
}
```

#### `experience` collection (add 3 documents):

**Document 1:**
```json
{
  "role": "Senior Full-Stack Engineer",
  "organization": "TechVision Corp",
  "date_range": "2021 – Present",
  "description": "Led architecture and development of a flagship SaaS platform serving 50,000+ users. Spearheaded migration from monolithic to microservices, reducing load times by 60%. Mentored a team of 4 junior developers.",
  "icon": "fa-code",
  "order": 1
}
```

**Document 2:**
```json
{
  "role": "Frontend Engineering Lead",
  "organization": "Creative Digital Agency",
  "date_range": "2018 – 2021",
  "description": "Directed a 6-person frontend team to deliver 30+ client projects across various industries. Established design systems, component libraries, and performance benchmarking protocols that reduced QA time by 40%.",
  "icon": "fa-laptop-code",
  "order": 2
}
```

**Document 3:**
```json
{
  "role": "Web Developer",
  "organization": "StartupHub Philippines",
  "date_range": "2016 – 2018",
  "description": "Built responsive web applications for early-stage startups using React and Node.js. Contributed to product ideation, rapid prototyping, and user testing cycles. Shipped 12 products in 2 years.",
  "icon": "fa-rocket",
  "order": 3
}
```

#### `portfolio` collection (add 4 documents):

**Document 1:**
```json
{
  "title": "Analytics Dashboard",
  "description": "A real-time data visualization platform with interactive charts, custom date filters, CSV export, and role-based access control for enterprise clients.",
  "type": "Site",
  "url": "https://your-project-url.com",
  "thumbnail": "https://your-cdn.com/portfolio/dashboard-thumb.jpg",
  "tags": ["React", "D3.js", "Firebase", "Tailwind"],
  "order": 1
}
```

**Document 2:**
```json
{
  "title": "Brand Identity Deck",
  "description": "Comprehensive 40-slide brand identity presentation covering logo design rationale, color system, typography hierarchy, and usage guidelines for print and digital.",
  "type": "PPT",
  "url": "https://docs.google.com/presentation/d/YOUR_ID/view",
  "thumbnail": "",
  "tags": ["Branding", "Design", "PowerPoint"],
  "order": 2
}
```

**Document 3:**
```json
{
  "title": "E-Commerce Platform",
  "description": "Full-featured online store with cart, wishlist, checkout flow, admin inventory panel, and Stripe payment gateway integration. Processes 500+ orders monthly.",
  "type": "Site",
  "url": "https://your-ecommerce.com",
  "thumbnail": "https://your-cdn.com/portfolio/ecommerce-thumb.jpg",
  "tags": ["Vue.js", "Node.js", "MongoDB", "Stripe"],
  "order": 3
}
```

**Document 4:**
```json
{
  "title": "UX Research Report",
  "description": "In-depth UX audit and research report featuring heuristic evaluation, user journey maps, wireframes, and actionable improvement recommendations for a fintech mobile app.",
  "type": "PDF",
  "url": "https://drive.google.com/file/d/YOUR_ID/view",
  "thumbnail": "",
  "tags": ["UX Research", "Figma", "User Testing"],
  "order": 4
}
```

#### `skills` collection (add sample documents):

```json
{ "name": "React.js",    "category": "Frontend", "icon": "fa-brands fa-react",    "order": 1 }
{ "name": "Vue.js",      "category": "Frontend", "icon": "fa-brands fa-vuejs",     "order": 2 }
{ "name": "JavaScript",  "category": "Frontend", "icon": "fa-brands fa-js",        "order": 3 }
{ "name": "TypeScript",  "category": "Frontend", "icon": "fa-solid fa-code",       "order": 4 }
{ "name": "Node.js",     "category": "Backend",  "icon": "fa-brands fa-node-js",   "order": 5 }
{ "name": "Python",      "category": "Backend",  "icon": "fa-brands fa-python",    "order": 6 }
{ "name": "Firebase",    "category": "Backend",  "icon": "fa-solid fa-fire",       "order": 7 }
{ "name": "PostgreSQL",  "category": "Database", "icon": "fa-solid fa-database",   "order": 8 }
{ "name": "MongoDB",     "category": "Database", "icon": "fa-solid fa-leaf",       "order": 9 }
{ "name": "Figma",       "category": "Design",   "icon": "fa-solid fa-pen-ruler",  "order": 10 }
{ "name": "Docker",      "category": "DevOps",   "icon": "fa-brands fa-docker",    "order": 11 }
{ "name": "Git",         "category": "DevOps",   "icon": "fa-brands fa-git-alt",   "order": 12 }
```

---

## 6. Operations & Content Management

### Using the Admin Dashboard

Open `manage.html` directly in your browser. This file is **not deployed publicly** — it is accessed locally (or via a secure private URL you control).

### Content Update Workflow

```
1. Open manage.html in browser
2. Select a panel from the left sidebar
3. Edit/add/delete entries using the forms
4. Click Save — changes write to Firestore instantly
5. The right iframe automatically refreshes, showing the updated live site
```

### Reordering Sections (Layout Panel)

1. Open **Layout Order** panel
2. Drag rows by their grip handle (`⠿`) to reorder
3. Section numbers update visually
4. Click **"Save Layout"** to persist to Firestore
5. `index.html` will render sections in the new order on next load

### Hiding a Section

1. Open **Layout Order** panel
2. Toggle the visibility switch on the desired section row to **Off**
3. Click **"Save Layout"**
4. The hidden section will be completely absent from `index.html`'s DOM on next render

### Changing Section Backgrounds

1. Open **Backgrounds** panel
2. Click any colored swatch for a section to preview the change
3. Click **"Save Backgrounds"** to persist

### Managing Experience Timeline Order

- In the **Experience** panel, use ↑ / ↓ arrow buttons on each row
- Each click performs a Firestore batch write, swapping `order` values for the two affected documents
- The preview iframe refreshes automatically

### Deleting Any Entry

Every data table row (Experience, Portfolio, Skills, Messages) has a **red trash icon button**. Clicking it:
1. Triggers a browser `confirm()` dialog
2. On confirmation, calls `db.collection(...).doc(id).delete()`
3. Removes the document permanently from Firestore
4. Re-fetches and re-renders the local table
5. Refreshes the preview iframe

### Reading Contact Messages

The **Messages** panel fetches the 50 most recent submissions from the `messages` collection, ordered by timestamp descending. Actions available:
- **Mark as Read** — updates `read: true` on the document
- **Delete** — permanently removes the message from Firestore

---

## 7. Dynamic Resume Generator & Print Engine

### Invocation

Click **"Generate Resume"** in the top navigation bar of `index.html`. This calls `generateLiveResume()`.

### Engine Behavior

The function reads the **current in-memory state** — the exact same data arrays populated by the Firebase fetch — and constructs a complete resume layout inside `#print-workspace`, a `display:none` container div that only becomes visible during `@media print`.

### Layout Architecture

The generated resume uses an **asymmetric two-column layout**:

```
┌────────────────────────────────────────────────────────────────┐
│                    RESUME DOCUMENT (A4)                        │
├──────────────────┬─────────────────────────────────────────────┤
│  SIDEBAR (33%)   │  MAIN PANEL (67%)                           │
│  bg: #1e293b     │  bg: #ffffff                                │
│  text: #f1f5f9   │  text: #0f172a                              │
│                  │                                             │
│  Circular Photo  │  ▌ Name Header Accent Block                 │
│  Full Name       │                                             │
│  Role Badge      │  Career Objective                           │
│                  │  ─────────────────────                      │
│  ── Contact ──   │  Professional Skills (grouped by category)  │
│  Email           │  ─────────────────────                      │
│  Phone           │  Work History Timeline                      │
│  Location        │  (each entry separated by thin hr)          │
│                  │                                             │
│  ── Summary ──   │                                             │
│  • Bullet items  │                                             │
│                  │                                             │
│  ── Education ── │                                             │
│  Degree          │                                             │
│  School          │                                             │
│  Year            │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

### Visual Identity Synchronization

The resume generator replicates the live site's design identity precisely:

| Site Element               | Resume Equivalent                                |
|----------------------------|--------------------------------------------------|
| Indigo gradient accent     | Exact `#6366f1` color on all accent elements     |
| Skill category icon boxes  | Same FontAwesome icon + indigo background chip   |
| Experience timeline icons  | Same FA icons in work history role headers       |
| Plus Jakarta Sans font     | Identical font family injected via HTML          |
| Badge/tag components       | Reproduced as inline skill chips in main panel   |
| Contact icon boxes         | Same icon style reproduced in sidebar            |

### Print CSS Protocol

`@media print` rules in the document `<head>` perform the following transformations:

1. **Hides all web UI elements:** `body > *:not(#print-workspace) { display: none !important; }`
2. **Forces print-workspace visible:** Only this container is shown to the print renderer
3. **Preserves background colors:** `-webkit-print-color-adjust: exact !important` ensures the dark sidebar and colored chips print correctly
4. **Removes page margins:** `margin: 0; padding: 0` on the document body
5. **Forces white base:** `background: #fff; color: #0f172a` on the workspace root

### Saving as PDF

After clicking "Generate Resume":
1. The browser's native print dialog opens
2. Select **"Save as PDF"** as the destination printer
3. Set paper size to **A4** or **Letter**
4. Set margins to **"None"** or **"Minimum"**
5. Enable **"Background graphics"** (critical for the dark sidebar to render)
6. Click **"Save"**

---

## 8. Deployment to GitHub Pages

### Initial Setup

```bash
# Clone or initialize your repository
git clone https://github.com/engraglinao/engraglinao.github.io.git
cd engraglinao.github.io

# Ensure your three files are in the root directory
ls
# index.html  manage.html  README.md
```

### Configure Firebase First

Before deploying, ensure Firebase config is populated in both HTML files (see Section 3). The deployed `index.html` must connect to a live Firestore database.

### Firestore Security Rules (Production)

Navigate to **Firestore → Rules** and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for site content
    match /site_config/{document} {
      allow read: true;
      allow write: false;
    }

    match /experience/{document} {
      allow read: true;
      allow write: false;
    }

    match /portfolio/{document} {
      allow read: true;
      allow write: false;
    }

    match /skills/{document} {
      allow read: true;
      allow write: false;
    }

    // Public write for contact form
    match /messages/{document} {
      allow read: false;
      allow create: if request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.message is string;
      allow update, delete: false;
    }
  }
}
```

> The `manage.html` file is never deployed publicly. Run it **locally** for admin operations, where Firebase auth rules do not block your write access (or add Firebase Authentication for an added layer of security).

### Deploy to GitHub Pages

```bash
git add index.html manage.html README.md
git commit -m "feat: deploy portfolio with Firebase CMS"
git push origin main
```

GitHub Pages automatically serves `index.html` at `https://engraglinao.github.io`.

> `manage.html` is committed to the repository but since it requires your Firebase credentials and is not linked from the public page, it remains an admin-only utility accessed locally.

---

## 9. Theme System & Customization

### CSS Custom Properties

All design tokens are defined as CSS Custom Properties on the `:root` with overrides under `html.light` and `html.dark`. Modify colors by editing the `:root` block:

```css
:root {
  --accent:    #6366f1;   /* Primary indigo accent */
  --accent-2:  #8b5cf6;   /* Secondary purple accent */
  --accent-grd: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}
```

### Theme Persistence

- `index.html` stores preference under localStorage key: `portfolio_theme`
- `manage.html` stores preference under localStorage key: `admin_theme`
- Both keys are independent so admin theme choice doesn't affect public site

### Adding New Sections

To add a custom section (e.g., "Testimonials"):
1. Add a new entry to `layout_configuration.sections` in Firestore
2. Create a matching renderer function in `index.html`'s JavaScript
3. Add a case to the `switch` statement in `renderSite()`
4. Add the panel to `manage.html`'s sidebar and panel area

---

## 10. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Blank portfolio page | Firebase config not set | Paste correct config from Firebase Console |
| "Permission denied" error | Firestore rules blocking | Use test mode rules during development |
| Sections not rendering | `layout_configuration` missing | Seed the layout doc via manage.html or Console |
| Images not loading | Incorrect URL / CORS | Use direct CDN URLs; ensure no hotlink protection |
| Resume PDF has no dark sidebar | "Background graphics" not enabled | Enable it in the browser print dialog |
| manage.html can't write to Firestore | Still in production rules mode | Temporarily switch Firestore to test mode for seeding |
| Preview iframe blank | `index.html` Firebase error | Open browser console in the iframe for error details |
| Skills filter not working | Firestore skills doc missing `category` field | Ensure all skill documents have the `category` string field |

---

## License

MIT License — Free to use, modify, and distribute for personal and commercial projects.

---

*Generated with ❤️ for `engraglinao.github.io` — Powered by Firebase · Tailwind CSS · Vanilla JS*
