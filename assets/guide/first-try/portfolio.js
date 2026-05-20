/* ======================================================
   Dan Aglinao — Portfolio JS
   ====================================================== */

/* ── Default data ── */
const DEFAULT_DATA = {
  profile: {
    name: "Danny Aglinao",
    shortName: "Dan A.",
    title: "Computer Engineer & Graphics Specialist",
    bio: "Computer Engineering Graduate at Universidad de Manila Batch 2020 & currently working as Graphics Specialist at Integreon Managed Solutions Manila.",
    profileImage: "assets/img/profile-img.jpg",
    birthDate: "22 May 1997",
    website: "https://engraglinao.github.io/",
    contact: "+63 945 264 8770",
    email: "buenavistaaglinaodanny@gmail.com",
    city: "Metro Manila",
    degree: "Bachelors Degree",
    freelance: "Available"
  },
  social: {
    facebook: "https://www.facebook.com/Buenavista.Aglinao/",
    instagram: "https://www.instagram.com/_buenavista.dan/",
    linkedin: "https://www.linkedin.com/in/danny-aglinao-2493511ab"
  },
  skills: [
    { name: "Canva", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg", color: "#00C4CC", description: "Quick graphic design for social media, presentations, and marketing materials." },
    { name: "Figma", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", color: "#F24E1E", description: "UI/UX design, prototyping, and component libraries for web and mobile projects." },
    { name: "PowerPoint", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", color: "#B7472A", description: "Professional presentation design and storytelling." },
    { name: "Excel", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", color: "#217346", description: "Data analysis, tables, and spreadsheet automation." },
    { name: "Adobe Illustrator", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg", color: "#FF9A00", description: "Vector illustration, logo design, and print-ready artwork." },
    { name: "Adobe InDesign", type: "App", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg", color: "#DD006F", description: "Layout and page design for print and digital publications." },
    { name: "Computer Literate", type: "Ability", color: "#149ddd", description: "Full proficiency across operating systems, office software, and productivity tools." },
    { name: "Basic Troubleshooting", type: "Ability", color: "#50c878", description: "Diagnosing and resolving software and hardware issues efficiently." },
    { name: "Basic Networking", type: "Ability", color: "#f0c060", description: "Network setup, troubleshooting, and maintenance for small office environments." },
    { name: "Web Design", type: "Ability", color: "#e05f5f", description: "HTML, CSS, JavaScript &amp; WordPress — building responsive, accessible websites." }
  ],
  education: [
    { level: "Tertiary", years: "2014-2020", degree: "Bachelor of Science in Computer Engineering", school: "Universidad de Manila | One Mehan Garden, Manila City, Ph 1000" },
    { level: "Secondary", years: "2010 - 2014", degree: "Manila High School", school: "Intramuros Manila, 1002 Metro Manila" },
    { level: "Primary", years: "2004 - 2010", degree: "Apolinario Mabini Elementary School", school: "Quiapo Manila, 1001 Metro Manila" }
  ],
  experience: [
    { position: "Graphics Specialist", years: "2021 - Present", company: "Integreon Managed Solutions Manila", description: ["Design graphics and layouts for digital and print materials.","Collaborate with team members on creative campaigns.","Ensure brand consistency across all deliverables."] }
  ],
  projects: [
    { category: "Graphic Design", title: "Brand Identity Project", desc: "Full brand identity design including logo, color palette, and typography guidelines.", tags: ["Canva","Print"], year: "2023", icon: "fa-palette" },
    { category: "Web Design", title: "Portfolio Website", desc: "Personal portfolio built with HTML, CSS, Bootstrap — fully responsive across all devices.", tags: ["HTML/CSS","Bootstrap"], year: "2023", icon: "fa-laptop-code" },
    { category: "Illustration", title: "Vector Artwork Series", desc: "Collection of vector illustrations created in Adobe Illustrator for various client projects.", tags: ["Illustrator","Vector"], year: "2022", icon: "fa-vector-square" },
    { category: "Presentation", title: "Corporate Deck Design", desc: "Professional PowerPoint presentation template designed for executive-level business meetings.", tags: ["PowerPoint","Corporate"], year: "2022", icon: "fa-file-powerpoint" },
    { category: "UI/UX Design", title: "App Wireframes", desc: "Low and high-fidelity wireframes for a mobile app, prototyped and tested in Figma.", tags: ["Figma","UX"], year: "2024", icon: "fa-magnifying-glass" }
  ],
  contact: {
    location: "452 Cabildo St. Intramuros Manila",
    email: "buenavistaaglinaodanny@gmail.com",
    phone: "+63 945 264 8770"
  },
  layout: {
    theme: "dark",
    sidebarPosition: "left",
    sectionOrder: ["hero","about","skills","background","contact"],
    hero: { textSide: "center" },
    about: { imageSide: "right" },
    background: { imageSide: "left" },
    navbar: { position: "sidebar", side: "left" }
  }
};

/* ── Load data ── */
let DATA = null;
async function loadData() {
  try {
    const resp = await fetch('data.json');
    if (resp.ok) {
      DATA = await resp.json();
      return;
    }
  } catch(e) { /* use default */ }
  DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/* ── Theme / Sidebar ── */
const html = document.documentElement;
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const main = document.getElementById('mainContent');

function applyLayout() {
  // Theme
  html.dataset.theme = DATA?.layout?.theme || 'dark';

  // Sidebar position
  sidebar.classList.remove('sidebar--right', 'sidebar--hidden');
  main.classList.remove('main--sidebar-left','main--sidebar-right','main--no-sidebar');
  sidebar.className = 'sidebar';

  const pos = DATA?.layout?.sidebarPosition || 'left';
  if (pos === 'right') {
    sidebar.classList.add('sidebar--right');
    main.classList.add('main--sidebar-right');
  } else if (pos === 'hidden') {
    sidebar.classList.add('sidebar--hidden');
    main.classList.add('main--no-sidebar');
  } else {
    main.classList.add('main--sidebar-left');
  }
}

/* ── Sidebar toggle mobile ── */
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('visible');
  document.getElementById('mobileToggle').innerHTML = '<i class="fas fa-times"></i>';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  document.getElementById('mobileToggle').innerHTML = '<i class="fas fa-bars"></i>';
}
document.getElementById('mobileToggle').addEventListener('click', () =>
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
overlay.addEventListener('click', closeSidebar);

/* ── Theme toggle ── */
document.getElementById('themeToggle').addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  if (DATA?.layout) DATA.layout.theme = html.dataset.theme;
});

/* ── Active nav on scroll ── */
const sectionIds = [];
function setupScrollSpy() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.sidebar__nav a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

/* ── Render Skills (Showcase Cards) ── */
function renderSkills() {
  const container = document.getElementById('skillsShowcase');
  if (!container || !DATA?.skills) return;
  container.innerHTML = '';

  DATA.skills.forEach(skill => {
    if (skill.type !== 'App') return;
    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `
      <div class="showcase-card__body">
        <div class="showcase-card__icon">
          ${skill.iconUrl ? `<img src="${skill.iconUrl}" alt="${skill.name}">` : `<i class="fas fa-star"></i>`}
        </div>
        <div class="showcase-card__title">${skill.name}</div>
        <div class="showcase-card__desc">${skill.description || ''}</div>
      </div>`;
    container.appendChild(card);
  });
}

/* ── Render Abilities (Showcase Stat Cards) ── */
function renderAbilities() {
  const container = document.getElementById('abilitiesShowcase');
  if (!container || !DATA?.skills) return;
  container.innerHTML = '';

  DATA.skills.forEach(skill => {
    if (skill.type !== 'Ability') return;
    const card = document.createElement('div');
    card.className = 'showcase-card showcase-card--stat';
    card.innerHTML = `
      <div class="showcase-card__body" style="text-align:center;">
        <div class="stat-value" style="color:${skill.color || 'var(--accent)'};"><i class="fas fa-check"></i></div>
        <div class="stat-label">${skill.name}</div>
        <div class="stat-meta">${skill.description || ''}</div>
      </div>`;
    container.appendChild(card);
  });
}

/* ── Render Projects (Media Cards) ── */
function renderProjects() {
  const container = document.getElementById('projectsShowcase');
  if (!container || !DATA?.projects) return;
  container.innerHTML = '';

  DATA.projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <div class="media-card__image placeholder">
        <i class="fas ${proj.icon || 'fa-image'}"></i>
      </div>
      <div class="media-card__body">
        <div class="media-card__category">${proj.category}</div>
        <div class="media-card__title">${proj.title}</div>
        <div class="media-card__desc">${proj.desc}</div>
        <div class="media-card__footer">
          <div class="media-card__tags">
            ${(proj.tags || []).map(t => `<span class="tag tag--accent">${t}</span>`).join('')}
          </div>
          <span>${proj.year || ''}</span>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

/* ── Render Education ── */
function renderEducation() {
  const col = document.getElementById('resumeEducation');
  if (!col || !DATA?.education) return;
  col.innerHTML = '<h3 class="resume-col-title">Education</h3>';
  DATA.education.forEach(edu => {
    const item = document.createElement('div');
    item.className = 'resume-item';
    item.innerHTML = `<h4>${edu.degree}</h4><h5>${edu.years}</h5><em>${edu.level}</em><p>${edu.school}</p>`;
    col.appendChild(item);
  });
}

/* ── Render Experience ── */
function renderExperience() {
  const col = document.getElementById('resumeExperience');
  if (!col || !DATA?.experience) return;
  col.innerHTML = '<h3 class="resume-col-title">Professional Experience</h3>';
  DATA.experience.forEach(exp => {
    const bullets = Array.isArray(exp.description)
      ? exp.description
      : String(exp.description || '').split(',').map(l => l.trim()).filter(Boolean);
    const item = document.createElement('div');
    item.className = 'resume-item';
    item.innerHTML = `
      <h4>${exp.position}</h4>
      <h5>${exp.years}</h5>
      <em>${exp.company}</em>
      ${bullets.length ? `<ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    `;
    col.appendChild(item);
  });
}

/* ── Contact info ── */
function renderContact() {
  if (DATA?.contact) {
    const info = document.getElementById('contactInfo');
    if (info && DATA.contact) {
      info.querySelectorAll('.contact-item p').forEach((el, i) => {
        const vals = [DATA.contact.location, DATA.contact.email, DATA.contact.phone];
        if (vals[i]) el.textContent = vals[i];
      });
    }
  }
}

/* ── Typing effect ── */
function startTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const items = DATA?.profile?.title ? [DATA.profile.title] : ["Computer Engineer","Graphics Specialist","Web Designer"];
  let i = 0, j = 0, deleting = false;
  function type() {
    const cur = items[i];
    if (deleting) {
      el.textContent = cur.substring(0, j - 1);
      j--;
      if (!j) { deleting = false; i = (i + 1) % items.length; setTimeout(type, 400); return; }
    } else {
      el.textContent = cur.substring(0, j + 1);
      j++;
      if (j === cur.length) { deleting = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

/* ── Section ordering ── */
function applySectionOrder() {
  const main = document.getElementById('mainContent');
  if (!main || !DATA?.layout?.sectionOrder) return;
  const order = DATA.layout.sectionOrder;
  order.forEach(id => {
    const el = document.getElementById(id);
    if (el) main.appendChild(el);
  });
}

/* ── Dashboard variables ── */
let customSections = [];
const DB_TABS = ['layout','sections','colors','buttons','newsection'];

function getData() {
  // Load from localStorage or data.json
  const stored = localStorage.getItem('portfolioConfig');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* ignore */ }
  }
  // Load data.json
  if (typeof window._rawData === 'object') return window._rawData;
  return DEFAULT_DATA;
}

function saveData(d) {
  localStorage.setItem('portfolioConfig', JSON.stringify(d));
  window._rawData = d;
}

/* ── Dashboard visible sections ── */
function renderDbSections() {
  const list = document.getElementById('dbSectionList');
  if (!list) return;
  list.innerHTML = '';
  const coreSections = [
    { id: 'hero',     label: 'Hero' },
    { id: 'about',    label: 'About Me' },
    { id: 'skills',   label: 'Skills' },
    { id: 'background', label: 'Background' },
    { id: 'contact',  label: 'Contact' },
  ];
  // Determine which are visible from section order
  const order = (getData().layout || {}).sectionOrder || coreSections.map(s => s.id);

  coreSections.forEach(sec => {
    const visible = order.includes(sec.id);
    const item = document.createElement('div');
    item.className = 'db-section-item';
    item.innerHTML = `
      <span class="sec-label">${sec.label}</span>
      <button class="sec-toggle ${visible ? '' : 'off'}" onclick="toggleSection('${sec.id}',this)" aria-label="Toggle ${sec.label}"></button>
      <button class="sec-del" onclick="deleteCoreSection('${sec.id}')" title="Remove"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
  });
}

function toggleSection(id, btn) {
  const d = getData();
  if (!d.layout) d.layout = {};
  if (!d.layout.sectionOrder) d.layout.sectionOrder = ['hero','about','skills','background','contact'];
  const idx = d.layout.sectionOrder.indexOf(id);
  if (idx > -1) {
    d.layout.sectionOrder.splice(idx, 1);
    btn.classList.add('off');
  } else {
    d.layout.sectionOrder.push(id);
    btn.classList.remove('off');
  }
  saveData(d);
}

function deleteCoreSection(id) {
  if (!confirm('Hide this section from the portfolio?')) return;
  const d = getData();
  if (d.layout?.sectionOrder) {
    d.layout.sectionOrder = d.layout.sectionOrder.filter(s => s !== id);
  }
  saveData(d);
  renderDbSections();
}

function addSection() {
  this.$todo = 'Add section form (opens modal) — use NewSection tab';
}

/* ── New / Custom Section ── */
function createCustomSection() {
  const name = document.getElementById('newSectionName').value.trim();
  const layout = document.getElementById('newSectionLayout').value;
  const textSide = document.getElementById('newSectionTextSide').value;
  const content = document.getElementById('newSectionContent').value.trim();
  if (!name) { alert('Please enter a section name.'); return; }

  const secId = 'custom-' + Date.now();
  const section = { id: secId, name, layout, textSide, content, createdAt: new Date().toISOString() };
  customSections.push(section);

  // Update section order
  const d = getData();
  if (!d.layout) d.layout = {};
  if (!d.layout.sectionOrder) d.layout.sectionOrder = [];
  d.layout.sectionOrder.push(secId);
  d.customSections = customSections;
  saveData(d);

  // Inject HTML into main
  injectCustomSection(section);

  document.getElementById('newSectionName').value = '';
  document.getElementById('newSectionContent').value = '';
  renderCustomSectionsList();
  alert('Section "' + name + '" created!');
}

function injectCustomSection(section) {
  const main = document.getElementById('mainContent');
  const el = document.createElement('section');
  el.className = 'section custom-section';
  el.id = section.id;
  el.dataset.l10n = section.name;

  let inner = `<h2 class="section-heading">${section.name}</h2>`;

  if (section.layout === 'showcase-cards') {
    inner += `<div class="showcase-row" id="${section.id}Row"></div>`;
    el.innerHTML = inner;
    main.appendChild(el);
    renderCustomShowcase(section);
  } else if (section.layout === 'media-cards') {
    inner += `<div class="showcase-row" id="${section.id}Row"></div>`;
    el.innerHTML = inner;
    main.appendChild(el);
    renderCustomMedia(section);
  } else if (section.layout === 'grid-cards') {
    inner += `<div class="showcase-row" id="${section.id}Row"></div>`;
    el.innerHTML = inner;
    main.appendChild(el);
    renderCustomGrid(section);
  } else if (section.layout === 'text-block') {
    inner += `<p style="color:var(--text-secondary);font-size:15px;line-height:1.8;max-width:720px;margin-top:var(--sp-4);">${section.content || ''}</p>`;
    el.innerHTML = inner;
    main.appendChild(el);
  } else if (section.layout === 'two-col') {
    inner += `<div class="about-grid" style="margin-top:var(--sp-6);"><div><p style="color:var(--text-secondary);font-size:15px;line-height:1.8;">${section.content || ''}</p></div><div><div class="media-card__image placeholder"><i class="fas fa-image"></i></div></div></div>`;
    el.innerHTML = inner;
    main.appendChild(el);
  }

  setupScrollSpy();
}

function parseContentItems(content) {
  try {
    return JSON.parse(content);
  } catch(e) {
    return [{ title: content.substring(0, 40), desc: content }];
  }
}

function renderCustomShowcase(section) {
  const row = document.getElementById(section.id + 'Row');
  if (!row) return;
  const items = parseContentItems(section.content || '[]');
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `
      <div class="showcase-card__body">
        <div class="showcase-card__icon"><i class="fas ${item.icon || 'fa-star'}"></i></div>
        <div class="showcase-card__title">${item.title || ''}</div>
        <div class="showcase-card__desc">${item.desc || ''}</div>
      </div>`;
    row.appendChild(card);
  });
}

function renderCustomMedia(section) {
  const row = document.getElementById(section.id + 'Row');
  if (!row) return;
  const items = parseContentItems(section.content || '[]');
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card';
    card.innerHTML = `
      <div class="media-card__image placeholder"><i class="fas ${item.icon || 'fa-image'}"></i></div>
      <div class="media-card__body">
        <div class="media-card__category">${item.category || ''}</div>
        <div class="media-card__title">${item.title || ''}</div>
        <div class="media-card__desc">${item.desc || ''}</div>
      </div>`;
    row.appendChild(card);
  });
}

function renderCustomGrid(section) {
  const row = document.getElementById(section.id + 'Row');
  if (!row) return;
  row.style.display = 'grid';
  row.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
  row.style.gap = 'var(--sp-4)';
  const items = parseContentItems(section.content || '[]');
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `
      <div class="showcase-card__body">
        <div class="showcase-card__icon"><i class="fas ${item.icon || 'fa-star'}"></i></div>
        <div class="showcase-card__title">${item.title || ''}</div>
        <div class="showcase-card__desc">${item.desc || ''}</div>
      </div>`;
    row.appendChild(card);
  });
}

function renderCustomSectionsList() {
  const list = document.getElementById('customSectionsList');
  if (!list) return;
  list.innerHTML = '';
  customSections.forEach((sec, i) => {
    const div = document.createElement('div');
    div.className = 'db-section-item';
    div.innerHTML = `
      <span class="sec-label">${sec.name} <small style="color:var(--text-muted);font-weight:400;margin-left:8px;">${sec.layout}</small></span>
      <button class="sec-del" onclick="deleteCustomSection(${i})" title="Delete"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(div);
  });
}

function deleteCustomSection(i) {
  if (!confirm('Delete this section?')) return;
  const sec = customSections[i];
  const d = getData();
  if (d.layout?.sectionOrder) {
    d.layout.sectionOrder = d.layout.sectionOrder.filter(s => s !== sec.id);
  }
  customSections.splice(i, 1);
  d.customSections = customSections;
  saveData(d);
  const el = document.getElementById(sec.id);
  if (el) el.remove();
  renderCustomSectionsList();
}

/* ── Apply config from dashboard ── */
function applyConfig() {
  const d = getData();
  if (!d.layout) d.layout = {};
  d.layout.theme = document.getElementById('cfgTheme')?.value || 'dark';
  d.layout.sidebarPosition = document.getElementById('cfgSidebar')?.value || 'left';
  d.navbarPosition = document.getElementById('cfgNavbar')?.value || 'sidebar';
  d.sectionHeadingAlign = document.getElementById('cfgHeadingAlign')?.value || 'left';
  saveData(d);

  applyLayout();
  // Heading alignment
  document.querySelectorAll('.section-heading').forEach(h => {
    h.classList.remove('section-heading--center');
    if (d.sectionHeadingAlign === 'center') h.classList.add('section-heading--center');
  });
}

function applyColors() {
  const accent        = document.getElementById('cfgAccent')?.value;
  const accentHover   = document.getElementById('cfgAccentHover')?.value;
  const sidebarBg     = document.getElementById('cfgSidebarBg')?.value;
  const pageBg        = document.getElementById('cfgPageBg')?.value;
  const surfaceBg     = document.getElementById('cfgSurfaceBg')?.value;

  if (accent)        { document.getElementById('cfgAccentText').value = accent;        setVar('--accent', accent); }
  if (accentHover)   { document.getElementById('cfgAccentHoverText').value = accentHover; setVar('--accent-hover', accentHover); }
  if (sidebarBg)     { document.getElementById('cfgSidebarBgText').value = sidebarBg;     setVar('--sidebar-bg', sidebarBg); }
  if (pageBg)        { document.getElementById('cfgPageBgText').value = pageBg;           setVar('--bg-base', pageBg); }
  if (surfaceBg)     { document.getElementById('cfgSurfaceBgText').value = surfaceBg;     setVar('--bg-surface', surfaceBg); }

  const d = getData();
  if (!d.colors) d.colors = {};
  d.colors.accent = accent; d.colors.accentHover = accentHover;
  d.colors.sidebarBg = sidebarBg; d.colors.pageBg = pageBg; d.colors.surface = surfaceBg;
  saveData(d);
}

function syncColorFromText(key) {
  const map = { accent: 'cfgAccent', accentHover: 'cfgAccentHover', sidebarBg: 'cfgSidebarBg', pageBg: 'cfgPageBg', surfaceBg: 'cfgSurfaceBg' };
  const colorInput = document.getElementById(map[key]);
  const textInput   = document.getElementById(map[key] + 'Text');
  if (!colorInput || !textInput) return;
  const val = textInput.value;
  if (/^#[0-9a-fA-F]{3,6}$/.test(val)) {
    colorInput.value = val;
    setVar('--' + key.replace(/([A-Z])/g,'-$1').toLowerCase(), val);
  }
}

function applyPalette() {
  const val = document.getElementById('cfgPalette').value;
  const presets = {
    dark:    { accent:'#149ddd', hover:'#37b3ed', sidebar:'#040b14', page:'#0c0f16', surface:'#111827' },
    light:   { accent:'#1177bb', hover:'#149ddd', sidebar:'#12304a', page:'#f4f6fb', surface:'#ffffff' },
    ocean:   { accent:'#0077b6', hover:'#00b4d8', sidebar:'#023e8a', page:'#03045e', surface:'#0077b633' },
    forest:  { accent:'#2d6a4f', hover:'#40916c', sidebar:'#1b4332', page:'#081c15', surface:'#2d6a4f22' },
    sunset:  { accent:'#e85d04', hover:'#f48c06', sidebar:'#370617', page:'#100b06', surface:'#e85d0422' },
  };
  const p = presets[val];
  if (!p || val === 'custom') return;
  document.getElementById('cfgAccent').value = p.accent;
  document.getElementById('cfgAccentText').value = p.accent;
  document.getElementById('cfgAccentHover').value = p.hover;
  document.getElementById('cfgAccentHoverText').value = p.hover;
  document.getElementById('cfgSidebarBg').value = p.sidebar;
  document.getElementById('cfgSidebarBgText').value = p.sidebar;
  document.getElementById('cfgPageBg').value = p.page;
  document.getElementById('cfgPageBgText').value = p.page;
  document.getElementById('cfgSurfaceBg').value = p.surface;
  document.getElementById('cfgSurfaceBgText').value = p.surface;
  applyColors();
}

function applyButtons() {
  const primary = document.getElementById('cfgBtnPrimary')?.value || 'primary';
  const radius  = document.getElementById('cfgBtnRadius')?.value || '4px';
  const size    = document.getElementById('cfgBtnSize')?.value || 'md';
  const root = document.documentElement;
  root.style.setProperty('--btn-radius', radius);
  // Preview buttons
  const preview = document.getElementById('btnPreview');
  if (preview) {
    const btns = preview.querySelectorAll('.btn');
    btns[0].className = `btn btn--${primary} btn--${size}`;
  }
}

function setVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

/* ── Save / Export Config ── */
function saveConfig() {
  const d = getData();
  d.layout.theme = document.getElementById('cfgTheme')?.value || 'dark';
  d.layout.sidebarPosition = document.getElementById('cfgSidebar')?.value || 'left';
  localStorage.setItem('portfolioConfig', JSON.stringify(d));
  applyLayout();
  alert('Config saved to localStorage.');
}

function exportConfig() {
  const d = getData();
  d.customSections = customSections;
  const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-config.json';
  a.click();
  alert('Config exported as portfolio-config.json');
}

function resetConfig() {
  if (!confirm('Reset to default config?')) return;
  localStorage.removeItem('portfolioConfig');
  location.reload();
}

/* ── Contact form handler ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('sendBtn');
  const status = document.getElementById('formStatus');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = '';

  setTimeout(() => {
    status.textContent = 'Your message has been sent. Thank you! 🎉';
    status.className = 'form-status show sent';
    btn.disabled = false;
    btn.textContent = 'Send Message';
    e.target.reset();
    setTimeout(() => status.classList.remove('show'), 5000);
  }, 1500);
}

/* ── Dashboard panel open / close ── */
document.getElementById('dashboardToggle').addEventListener('click', () => {
  document.getElementById('dashboardPanel').classList.toggle('open');
});
document.getElementById('dashboardClose').addEventListener('click', () => {
  document.getElementById('dashboardPanel').classList.remove('open');
});

/* ── Dashboard tab switching ── */
document.querySelectorAll('.db-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.db-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab.id.split('-')[1])?.classList.add('active');
  });
});

/* ── Init ── */
async function init() {
  // Load data
  let raw;
  try {
    const r = await fetch('data.json');
    raw = r.ok ? await r.json() : null;
  } catch(e) { raw = null; }

  if (!raw) raw = JSON.parse(JSON.stringify(DEFAULT_DATA));
  saveData(raw);
  DATA = raw;

  // Hydrate layout
  applyLayout();
  applySectionOrder();

  // Load heading alignment from config
  const d = getData();
  if (d.sectionHeadingAlign === 'center') {
    document.querySelectorAll('.section-heading').forEach(h => h.classList.add('section-heading--center'));
  }

  // Render content
  renderSkills();
  renderAbilities();
  renderProjects();
  renderEducation();
  renderExperience();
  renderContact();
  renderDbSections();
  customSections = (d.customSections || []);
  renderCustomSectionsList();

  // Typing effect
  setTimeout(startTyping, 500);

  // Scroll spy
  sectionIds.length = 0;
  document.querySelectorAll('.section[id]').forEach(s => sectionIds.push(s.id));
  setupScrollSpy();
}

window.addEventListener('DOMContentLoaded', init);
