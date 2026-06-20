# Portfolio CMS — engraglinao.github.io

A fully dynamic, Firebase-powered portfolio and resume web application. Zero hardcoded content — every character displayed on the public page is fetched from a Firestore database and managed exclusively through the admin control panel.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    3-FILE ARCHITECTURE                        │
├────────────────┬────────────────┬────────────────────────────┤
│  index.html    │  manage.html   │  README.md                 │
│  (Public Site) │  (Admin Panel) │  (Documentation)           │
│                │                │                            │
│  • Fetches ALL │  • Full CRUD   │  • Setup guide             │
│    content from│    for all     │  • Schema reference        │
│    Firestore   │    Firestore   │  • Seed data docs          │
│  • Renders     │    collections │  • Print engine docs       │
│    sections    │  • Split-pane  │                            │
│    dynamically │    live preview│                            │
│  • Live resume │  • Seed button │                            │
│    generator   │    resets all  │                            │
└────────────────┴────────────────┴────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Firebase Firestore │
              │   (Centralized CMS) │
              ├─────────────────────┤
              │  config/hero        │
              │  config/socials     │
              │  config/stats       │
              │  config/layout      │
              │  config/coreText    │
              │  experience/ [col]  │
              │  portfolio/  [col]  │
              │  skills/     [col]  │
              │  messages/   [col]  │
              └─────────────────────┘
```

### Data Flow

1. A visitor opens `index.html` → Firebase SDK boots → parallel Firestore reads fire across all 8 data nodes simultaneously.
2. The boot function assembles all fetched data into `window.__state` and calls each render function.
3. Layout visibility rules from `config/layout` determine which sections render and with what background style.
4. The "Generate Live Resume" button reads `window.__state` in-memory and injects a fully styled print document into a hidden workspace div, then triggers `window.print()`.
5. `manage.html` provides a split-screen interface — left panel mutates Firestore data, right panel embeds `index.html` in an iframe and reloads on every save.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Tailwind CSS v4 (Browser CDN) + Inline CSS Variables |
| Interactivity | Vanilla ES6+ JavaScript (ES Modules) |
| Database / CMS | Firebase Firestore v10 |
| Icons | FontAwesome 6.5 |
| Typography | Plus Jakarta Sans (Google Fonts) |
| Hosting | GitHub Pages |

---

## Firebase Installation & Configuration

### Step 1 — Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → enter a project name → complete the wizard.
3. In the left sidebar, click **"Build"** → **"Firestore Database"**.
4. Click **"Create database"** → choose **"Start in test mode"** (update security rules before going live).
5. Select a server region closest to your users → click **"Enable"**.

### Step 2 — Register a Web App

1. In the Firebase console, click the gear icon → **"Project settings"**.
2. Scroll to **"Your apps"** → click **"<\/>"** (Web) icon.
3. Give the app a nickname (e.g., `portfolio-web`) → click **"Register app"**.
4. Copy the `firebaseConfig` object that appears.

### Step 3 — Paste Config Into Both Files

Open both `index.html` and `manage.html`. Find the clearly labeled **FIREBASE CONFIGURATION** block in each file and replace the placeholder values:

```javascript
// ─── FIREBASE CONFIGURATION ──────────────────────────────────
// Replace these placeholder values with your actual credentials.
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",            // ← paste here
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",         // ← paste here
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",          // ← paste here
  appId:             "YOUR_APP_ID"              // ← paste here
};
```

> ⚠️ **Both files must contain the identical `firebaseConfig` object.** They share one Firestore database — `index.html` reads from it, `manage.html` writes to it.

### Step 4 — Firestore Security Rules (Production)

Replace the default test-mode rules in your Firebase console with the following to protect the `messages` write endpoint while allowing public reads:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read for all config and content
    match /config/{doc} { allow read: true; allow write: false; }
    match /experience/{doc} { allow read: true; allow write: false; }
    match /portfolio/{doc} { allow read: true; allow write: false; }
    match /skills/{doc} { allow read: true; allow write: false; }
    // Allow public write to messages (contact form)
    match /messages/{doc} { allow write: true; allow read: false; }
    // All write operations require authentication (manage.html usage)
    // For local/trusted use, you can temporarily allow all writes:
    // match /{document=**} { allow read, write: true; }
  }
}
```

---

## Firestore Data Schema

### `config/hero` — Document

```json
{
  "name":      "Engraham Raglinao",
  "initials":  "ENG",
  "role":      "Full-Stack Frontend Engineer",
  "headline":  "Crafting <span class=\"accent\">Digital</span> Experiences",
  "bio":       "Long biography paragraph text...",
  "objective": "Career objective for resume sidebar...",
  "summary":   "Bullet point 1 | Bullet point 2 | Bullet point 3",
  "pill":      "Available for Work",
  "avatar":    "https://your-image-url.com/photo.jpg",
  "tagline":   "Engineering excellence, one component at a time.",
  "email":     "you@email.com",
  "phone":     "+1 555 000 0000",
  "location":  "City, Country",
  "website":   "https://engraglinao.github.io",
  "resumeUrl": "https://link-to-your-static-pdf.com/resume.pdf",
  "education": [
    { "degree": "B.S. Computer Science", "school": "University Name", "year": "2018" }
  ]
}
```

> **Note on `summary`:** Use pipe `|` characters to separate bullet points. The resume generator will split on `|` and render each as a sidebar bullet.

> **Note on `headline`:** Supports raw HTML. Use `<span class="accent">word</span>` to apply the indigo accent color.

---

### `config/socials` — Document

```json
{
  "items": [
    { "label": "GitHub",   "url": "https://github.com/engraglinao", "icon": "fa-brands fa-github" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/...",    "icon": "fa-brands fa-linkedin" },
    { "label": "Twitter",  "url": "https://twitter.com/...",        "icon": "fa-brands fa-x-twitter" }
  ]
}
```

---

### `config/stats` — Document

```json
{
  "items": [
    { "value": "6+",  "label": "Years of Experience" },
    { "value": "50+", "label": "Projects Delivered" },
    { "value": "12",  "label": "Technologies Mastered" }
  ]
}
```

---

### `config/layout` — Document

```json
{
  "lastUpdated": "2024-12-01",
  "sections": [
    { "id": "hero",       "label": "Hero / About",        "visible": true, "bg": "hero",    "icon": "fa-solid fa-user" },
    { "id": "experience", "label": "Experience Timeline", "visible": true, "bg": "alt",     "icon": "fa-solid fa-briefcase" },
    { "id": "portfolio",  "label": "Portfolio Carousel",  "visible": true, "bg": "default", "icon": "fa-solid fa-layer-group" },
    { "id": "skills",     "label": "Application Matrix",  "visible": true, "bg": "alt",     "icon": "fa-solid fa-microchip" },
    { "id": "contact",    "label": "Contact Layer",        "visible": true, "bg": "accent",  "icon": "fa-solid fa-envelope" }
  ]
}
```

**`bg` values:**
- `"default"` — inherits base background (white / dark slate)
- `"alt"` — subtle neutral alternate background (`#f1f5f9` / `#13161f`)
- `"accent"` — indigo gradient accent background

**`visible` field:** Setting to `false` completely hides the section from the rendered DOM.

---

### `config/coreText` — Document

```json
{
  "expHeading":          "Experience",
  "expSubheading":       "Professional journey & career milestones",
  "portfolioHeading":    "Portfolio",
  "portfolioSubheading": "Selected projects, case studies & deliverables",
  "skillsHeading":       "Application Matrix",
  "skillsSubheading":    "Tools, platforms & technical fluencies",
  "contactHeading":      "Get In Touch",
  "contactSubheading":   "Have a project in mind? I respond within 24 hours."
}
```

---

### `experience/` — Collection (Documents)

Each document in this collection represents one timeline entry:

```json
{
  "order":       1,
  "role":        "Senior Frontend Engineer",
  "org":         "TechNova Inc.",
  "dateRange":   "Jan 2022 – Present",
  "icon":        "fa-solid fa-rocket",
  "description": "Led the migration of a monolithic legacy system to a micro-frontend architecture...",
  "tags":        ["React", "TypeScript", "AWS"]
}
```

**Field Reference:**
- `order` — Integer. Lower numbers render at the top of the timeline.
- `icon` — Any valid FontAwesome class string. Applied inside the timeline node dot and in the resume generator.
- `tags` — Array of strings. Rendered as accent-colored pills.

---

### `portfolio/` — Collection (Documents)

```json
{
  "order":       1,
  "title":       "E-Commerce Redesign",
  "type":        "Site",
  "description": "Full redesign of a high-traffic fashion e-commerce platform...",
  "url":         "https://example.com",
  "thumbnail":   "https://your-thumbnail.com/image.jpg"
}
```

**`type` values and their behaviors:**

| Type | Modal Behavior |
|---|---|
| `Site` | Opens a button linking to the URL in a new tab |
| `URL` | Opens a button linking to the URL in a new tab |
| `Image` | Renders the `url` as a full `<img>` inside the modal |
| `PDF` | Opens a download button targeting the `url` |
| `PPT` | Opens a download button targeting the `url` |
| `Video` | Embeds the `url` in an `<iframe>` (use YouTube embed URL format) |

---

### `skills/` — Collection (Documents)

```json
{
  "order":    1,
  "name":     "React.js",
  "category": "Frontend",
  "icon":     "fa-brands fa-react",
  "color":    "#61dafb",
  "level":    "Expert"
}
```

Skills are automatically grouped by `category` on the rendered Application Matrix grid. Categories appear in the order of their first occurrence within the ordered collection.

---

### `messages/` — Collection (Auto-generated)

Written by the contact form in `index.html`. Auto-structured by Firestore:

```json
{
  "name":      "Visitor Name",
  "email":     "visitor@email.com",
  "message":   "Message body text...",
  "timestamp": "Firestore ServerTimestamp"
}
```

Read and deleted from the Messages tab in `manage.html`.

---

## Sample Data Seeding Guide

The fastest way to populate all data is to use the **"Seed All Sample Data"** button in `manage.html`.

### What the Seed Function Does

1. **Overwrites** `config/hero`, `config/socials`, `config/stats`, `config/coreText`, `config/layout` using `setDoc` (full replace).
2. **Deletes all existing documents** in the `experience`, `portfolio`, and `skills` collections.
3. **Re-adds** a complete set of sample entries to each collection using `addDoc`.
4. Triggers an iframe preview reload upon completion.

### Manual Seeding (Firebase Console)

You can also seed data directly from the Firebase Console → Firestore:

1. Open your Firestore database.
2. Create a collection called `config`.
3. Add a document with ID `hero` — paste the hero schema fields.
4. Repeat for `socials`, `stats`, `layout`, `coreText`.
5. Create collections `experience`, `portfolio`, `skills` and add individual documents following their schemas above.

---

## Operations Manual

### Content Management Workflow

| Task | Action |
|---|---|
| Edit biography / headline | Hero tab → update fields → Save Hero Config |
| Add work experience | Experience tab → "Add Entry" → fill form → Save |
| Edit existing experience | Experience tab → click pen icon on an entry |
| Delete experience entry | Experience tab → click trash icon → confirm |
| Add portfolio item | Portfolio tab → "Add Asset" → fill form → Save |
| Reorder portfolio items | Portfolio tab → edit each item's `order` number field |
| Toggle section visibility | Layout tab → click toggle switch beside section |
| Change section background | Layout tab → select BG dropdown beside section |
| Reorder sections | Layout tab → use up/down chevron buttons |
| Read contact messages | Messages tab → entries sorted newest first |
| Delete a message | Messages tab → trash button on the message card |

### Reset to Sample Data

Click **"Seed All Sample Data"** (yellow button in header). All existing content is permanently replaced.

---

## Live Resume Generator — Print Engine Documentation

### Activation

Click the **"Generate Live Resume"** button in the top-right of `index.html`. No page navigation occurs — the entire operation happens in-memory.

### Engine Process

1. Reads `window.__state` — the in-memory JavaScript object populated during the initial Firebase fetch.
2. Groups skills by category to mirror the Application Matrix display.
3. Injects a complete self-contained HTML resume document (styles included) into `#resume-workspace` — a hidden `div` positioned off-screen.
4. After a 400ms render delay (to ensure fonts and icons load), calls `window.print()`.
5. After printing completes, the workspace div is cleared and hidden again.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      RESUME DOCUMENT (A4)                    │
├──────────────────────────┬──────────────────────────────────┤
│   LEFT SIDEBAR (33%)     │   RIGHT PANEL (66%)              │
│   bg: #1e2433 (dark)     │   bg: #ffffff (light)            │
│                          │                                   │
│   ┌────────────────────┐ │  ┌─────────────────────────────┐ │
│   │   Circular Avatar  │ │  │  Name Header (indigo grad.) │ │
│   │   Name + Role      │ │  └─────────────────────────────┘ │
│   └────────────────────┘ │                                   │
│   Contact Details        │  Career Objective (accent left   │
│   (icons + text)         │  border block)                   │
│                          │                                   │
│   Summary Bullets        │  Work History Timeline           │
│   (accent arrow ▸)       │  (role, org, date, description, │
│                          │   tag pills per entry)           │
│   Education Records      │                                   │
│   (degree, school, year) │                                   │
│                          │                                   │
│   Skills Matrix          │                                   │
│   (by category, icons)   │                                   │
└──────────────────────────┴──────────────────────────────────┘
```

### Visual Identity Bridge

The resume generator replicates the live site's visual identity by:

- **Typography:** Imports `Plus Jakarta Sans` via Google Fonts inside the print workspace, matching the site's global font.
- **Accent Color:** Uses the same `#6366f1` indigo accent for all icon colors, tag pills, header block gradients, and sidebar labels.
- **FontAwesome Icons:** Every skill icon (`sk.icon`), experience icon (`e.icon`), and contact detail icon is pulled directly from the `window.__state` objects — the exact same icon classes used on the live page appear in the printed document.
- **Color Palette:** The sidebar uses `#1e2433` (the same `--sidebar-bg` CSS variable referenced in the site theme). The right panel uses clean `#ffffff` to create the asymmetric contrast.

### Print CSS Rules

```css
@media print {
  body > *:not(#resume-workspace) { display: none !important; }
  #resume-workspace { display: block !important; position: static !important; width: 100% !important; }
  #resume-workspace * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  @page { margin: 0; size: A4; }
}
```

These rules ensure that when the browser's print dialog opens, only the `#resume-workspace` content renders. Background colors, icon colors, and gradient headers are forced to print using `print-color-adjust: exact`.

---

## GitHub Pages Deployment

1. Push all three files to the root of your GitHub repository.
2. Go to **Settings → Pages** in your repository.
3. Set **Source** to `Deploy from a branch` → select `main` → folder `/root`.
4. GitHub Pages will serve `index.html` as the default page.
5. `manage.html` is accessible at `https://yourusername.github.io/yourrepo/manage.html` — share this URL only with trusted administrators.

> ⚠️ **`manage.html` is not linked anywhere from the public `index.html`** by design. It is a completely disconnected administrative interface.

---

## License

MIT License — free to fork, modify, and deploy for personal and commercial portfolio use.

---

*Built with Semantic HTML5 · Tailwind CSS · Vanilla ES6+ · Firebase Firestore · FontAwesome · Plus Jakarta Sans*
