/* ======================================================
   Portfolio Dashboard — manage.html
   ====================================================== */

/* ── Defaults ── */
const DEFAULTS = {
  profile: {
    name:"Danny Aglinao", title:"Computer Engineer & Graphics Specialist",
    bio:"Computer Engineering Graduate at Universidad de Manila Batch 2020 & currently working as Graphics Specialist at Integreon Managed Solutions Manila.",
    birthDate:"22 May 1997", website:"https://engraglinao.github.io/",
    contact:"+63 945 264 8770", email:"buenavistaaglinaodanny@gmail.com",
    city:"Metro Manila", degree:"Bachelors Degree", freelance:"Available"
  },
  social:{
    facebook:"https://www.facebook.com/Buenavista.Aglinao/",
    instagram:"https://www.instagram.com/_buenavista.dan/",
    linkedin:"https://www.linkedin.com/in/danny-aglinao-2493511ab"
  },
  skills:[
    {name:"Canva",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",color:"#00C4CC",description:"Quick graphic design for social media, presentations, and marketing materials."},
    {name:"Figma",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",color:"#F24E1E",description:"UI/UX design, prototyping, and component libraries for web and mobile projects."},
    {name:"PowerPoint",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",color:"#B7472A",description:"Professional presentation design and storytelling."},
    {name:"Excel",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",color:"#217346",description:"Data analysis, tables, and spreadsheet automation."},
    {name:"Adobe Illustrator",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",color:"#FF9A00",description:"Vector illustration, logo design, and print-ready artwork."},
    {name:"Adobe InDesign",type:"App",iconUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg",color:"#DD006F",description:"Layout and page design for print and digital publications."},
    {name:"Computer Literate",type:"Ability",color:"#149ddd",description:"Full proficiency across operating systems, office software, and productivity tools."},
    {name:"Basic Troubleshooting",type:"Ability",color:"#50c878",description:"Diagnosing and resolving software and hardware issues efficiently."},
    {name:"Basic Networking",type:"Ability",color:"#f0c060",description:"Network setup, troubleshooting, and maintenance for small office environments."},
    {name:"Web Design",type:"Ability",color:"#e05f5f",description:"HTML, CSS, JavaScript & WordPress — building responsive, accessible websites."}
  ],
  education:[
    {level:"Tertiary",years:"2014-2020",degree:"Bachelor of Science in Computer Engineering",school:"Universidad de Manila | One Mehan Garden, Manila City, Ph 1000"},
    {level:"Secondary",years:"2010 - 2014",degree:"Manila High School",school:"Intramuros Manila, 1002 Metro Manila"},
    {level:"Primary",years:"2004 - 2010",degree:"Apolinario Mabini Elementary School",school:"Quiapo Manila, 1001 Metro Manila"}
  ],
  experience:[
    {position:"Graphics Specialist",years:"2021 - Present",company:"Integreon Managed Solutions Manila",description:["Design graphics and layouts for digital and print materials.","Collaborate with team members on creative campaigns.","Ensure brand consistency across all deliverables."]}
  ],
  projects:[
    {category:"Graphic Design",title:"Brand Identity Project",desc:"Full brand identity design including logo, color palette, and typography guidelines.",tags:["Canva","Print"],year:"2023",icon:"fa-palette"},
    {category:"Web Design",title:"Portfolio Website",desc:"Personal portfolio built with HTML, CSS, Bootstrap — fully responsive across all devices.",tags:["HTML/CSS","Bootstrap"],year:"2023",icon:"fa-laptop-code"},
    {category:"Illustration",title:"Vector Artwork Series",desc:"Collection of vector illustrations created in Adobe Illustrator for various client projects.",tags:["Illustrator","Vector"],year:"2022",icon:"fa-vector-square"},
    {category:"Presentation",title:"Corporate Deck Design",desc:"Professional PowerPoint presentation template designed for executive-level business meetings.",tags:["PowerPoint","Corporate"],year:"2022",icon:"fa-file-powerpoint"},
    {category:"UI/UX Design",title:"App Wireframes",desc:"Low and high-fidelity wireframes for a mobile app, prototyped and tested in Figma.",tags:["Figma","UX"],year:"2024",icon:"fa-magnifying-glass"}
  ],
  contact:{location:"452 Cabildo St. Intramuros Manila",email:"buenavistaaglinaodanny@gmail.com",phone:"+63 945 264 8770"},
  layout:{
    theme:"dark", sidebarPosition:"left",
    sectionOrder:["hero","about","skills","background","contact"],
    hero:{textSide:"center",showAvatar:true},
    about:{imageSide:"right"},
    skills:{displayMode:"both"},
    background:{showEducation:true,showExperience:true}
  },
  colors:{
    accent:"#149ddd", accentHover:"#37b3ed",
    sidebarBg:"#040b14", pageBg:"#0c0f16", surface:"#111827"
  },
  buttons:{
    style:"primary", radius:"4px", size:"md"
  },
  sections:{
    hero:{visible:true,headingAlign:"left"},
    about:{visible:true,headingAlign:"left",imageSide:"right"},
    skills:{visible:true,headingAlign:"left"},
    background:{visible:true,headingAlign:"left"},
    contact:{visible:true,headingAlign:"left"}
  }
};

/* ── Storage helpers ── */
function getData(){
  try {
    const s = localStorage.getItem('portfolioConfigMgmt');
    if(s) return JSON.parse(s);
  } catch(e){}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function saveData(d){
  localStorage.setItem('portfolioConfigMgmt', JSON.stringify(d));
}

/* ── Tab switch ── */
function switchTab(id,btn){
  document.querySelectorAll('.db-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.db-tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}
document.querySelectorAll('.db-tab-btn').forEach(btn =>
  btn.addEventListener('click', function(){ switchTab(this.dataset.tab||'tab-general', this); })
);
// Fix: add onclick handler for correct tab IDs
document.querySelectorAll('.db-tab-btn').forEach(btn => {
  const tabId = btn.getAttribute('onclick')?.match(/switchTab\('([^']+)'/)?.[1];
  if(tabId) btn.dataset.tab = tabId;
});

/* ── Status toast ── */
function showStatus(msg, isError){
  const el = document.getElementById('dbStatus');
  el.textContent = msg;
  el.className = 'db-status show' + (isError?' error':'');
  setTimeout(()=> el.classList.remove('show'), 3000);
}

/* ═══════════════════ GENERAL ═══════════════════ */
function applyTheme(){
  const v = document.getElementById('cfgTheme').value;
  document.documentElement.dataset.theme = v;
}
function syncColorInput(colorId, textId){
  const c = document.getElementById(colorId);
  const t = document.getElementById(textId);
  if(c && t) t.value = c.value;
}
function syncColorText(colorId, textId){
  const c = document.getElementById(colorId);
  const t = document.getElementById(textId);
  if(c && t && /^#[0-9a-fA-F]{3,6}$/.test(t.value)) c.value = t.value;
}
function updateThemeColor(key, val){
  document.documentElement.style.setProperty(key === 'accent' ? '--accent' : '--accent-hover', val);
  if(key === 'accent-hover') document.documentElement.style.setProperty('--accent-hover', val);
}
function saveGeneral(){
  const d = getData();
  const name = document.getElementById('cfgHeroName')?.value;
  const typing = document.getElementById('cfgTyping')?.value;
  if(name) d.profile = {...d.profile,...{name}};
  if(typing) d.typingText = typing;
  d.colors = d.colors || {};
  d.colors.accent = document.getElementById('cfgAccent')?.value || d.colors.accent;
  d.colors.accentHover = document.getElementById('cfgAccentHover')?.value || d.colors.accentHover;
  saveData(d);
  showStatus('General settings saved!');
}
function resetGeneral(){
  document.getElementById('cfgTheme').value='dark';
  document.getElementById('cfgHeroName').value='';
  document.getElementById('cfgTyping').value='';
  document.getElementById('cfgAccent').value='#149ddd';
  document.getElementById('cfgAccentText').value='#149ddd';
  document.getElementById('cfgAccentHover').value='#37b3ed';
  document.getElementById('cfgAccentHoverText').value='#37b3ed';
  showStatus('Reset to default.');
}

/* ═══════════════════ LAYOUT ═══════════════════ */
function previewLayout(){
  const v = document.getElementById('cfgSidebarPos')?.value;
  const align = document.getElementById('cfgHeadingAlign')?.value;
  if(!v) return;
  // Apply locally
  document.documentElement.dataset.previewSidebar = v;
  document.querySelectorAll('.section-heading').forEach(h=>{
    h.classList.toggle('section-heading--center', align==='center');
  });
}
function saveLayout(){
  const d = getData();
  d.layout = d.layout || {};
  d.layout.sidebarPosition = document.getElementById('cfgSidebarPos')?.value || 'left';
  d.layout.navbarPosition = document.getElementById('cfgNavbarPos')?.value || 'sidebar';
  d.layout.sectionHeadingAlign = document.getElementById('cfgHeadingAlign')?.value || 'left';
  d.layout.hero = {...(d.layout.hero||{}), textSide:document.getElementById('cfgHeroSide')?.value||'center'};
  d.layout.about = {...(d.layout.about||{}), imageSide:document.getElementById('cfgAboutImageSide')?.value||'right'};
  d.buttons = d.buttons || {};
  d.buttons.sidebarIcons = document.getElementById('cfgSidebarIcons')?.value || 'fontawesome';
  saveData(d);
  showStatus('Layout saved!');
}

/* ═══════════════════ COLORS ═══════════════════ */
function clrSync(colorId, textId){
  const c = document.getElementById(colorId);
  const t = document.getElementById(textId);
  if(c && t) t.value = c.value;
}
function applyPaletteNow(){
  const map = {clrAccent:'--accent', clrAccentHover:'--accent-hover', clrSidebar:'--sidebar-bg', clrPageBg:'--bg-base', clrSurface:'--bg-surface', clrText:'--text-primary', clrTextSec:'--text-secondary'};
  Object.entries(map).forEach(([id, varName])=>{
    const el = document.getElementById(id);
    if(el) document.documentElement.style.setProperty(varName, el.value);
  });
}
function loadPalettePreset(val){
  if(val==='custom') return;
  const presets = {
    dark:{accent:'#149ddd',hover:'#37b3ed',sidebar:'#040b14',page:'#0c0f16',surface:'#111827',text:'#eaf0ff',textSec:'#a8b8d0'},
    light:{accent:'#1177bb',hover:'#149ddd',sidebar:'#12304a',page:'#f4f6fb',surface:'#ffffff',text:'#1a2638',textSec:'#4a6080'},
    ocean:{accent:'#0077b6',hover:'#00b4d8',sidebar:'#023e8a',page:'#03045e',surface:'#90e0ef',text:'#eaf0ff',textSec:'#a8d8ea'},
    forest:{accent:'#2d6a4f',hover:'#40916c',sidebar:'#1b4332',page:'#081c15',surface:'#b7e4c7',text:'#eaf0ff',textSec:'#a8d8c8'},
    sunset:{accent:'#e85d04',hover:'#f48c06',sidebar:'#370617',page:'#100b06',surface:'#faa307',text:'#fff3e0',textSec:'#ffb347'},
    purple:{accent:'#7b2cbf',hover:'#9d4edd',sidebar:'#240046',page:'#10002b',surface:'#e0aaff',text:'#e0e0ff',textSec:'#b8b8e0'},
    midnight:{accent:'#00b4d8',hover:'#0096c7',sidebar:'#03045e',page:'#001233',surface:'#034078',text:'#caf0f8',textSec:'#90e0ef'},
  };
  const p = presets[val];
  if(!p) return;
  document.getElementById('clrAccent').value = p.accent; document.getElementById('clrAccentTxt').value = p.accent;
  document.getElementById('clrAccentHover').value = p.hover; document.getElementById('clrAccentHoverTxt').value = p.hover;
  document.getElementById('clrSidebar').value = p.sidebar; document.getElementById('clrSidebarTxt').value = p.sidebar;
  document.getElementById('clrPageBg').value = p.page; document.getElementById('clrPageBgTxt').value = p.page;
  document.getElementById('clrSurface').value = p.surface; document.getElementById('clrSurfaceTxt').value = p.surface;
  document.getElementById('clrText').value = p.text; document.getElementById('clrTextTxt').value = p.text;
  document.getElementById('clrTextSec').value = p.textSec; document.getElementById('clrTextSecTxt').value = p.textSec;
  applyPaletteNow();
}
function saveColors(){
  const d = getData();
  d.colors = {
    accent: document.getElementById('clrAccent')?.value,
    accentHover: document.getElementById('clrAccentHover')?.value,
    sidebarBg: document.getElementById('clrSidebar')?.value,
    pageBg: document.getElementById('clrPageBg')?.value,
    surface: document.getElementById('clrSurface')?.value,
    textPrimary: document.getElementById('clrText')?.value,
    textSecondary: document.getElementById('clrTextSec')?.value
  };
  saveData(d);
  showStatus('Color palette saved!');
}
function resetPalette(){
  loadPalettePreset('dark');
  document.getElementById('cfgPalette').value='custom';
  showStatus('Palette reset to Dark.');
}

/* ═══════════════════ BUTTONS ═══════════════════ */
function previewButtons(){
  const style = document.getElementById('cfgBtnStyle')?.value || 'primary';
  const radius = document.getElementById('cfgBtnRadius')?.value || '4px';
  ['pvPrimary','pvOutline','pvGhost','pvSurface'].forEach(id=>{
    const btn = document.getElementById(id);
    if(!btn) return;
    const base = id.replace('pv','').toLowerCase();
    btn.className = `btn btn--${base} btn--md`;
    btn.style.borderRadius = radius;
  });
  document.getElementById('pvPrimary').className = `btn btn--${style} btn--md`;
  document.getElementById('pvPrimary').style.borderRadius = radius;
}
function saveButtons(){
  const d = getData();
  d.buttons = {
    ...(d.buttons||{}),
    style: document.getElementById('cfgBtnStyle')?.value,
    radius: document.getElementById('cfgBtnRadius')?.value,
    size: document.getElementById('cfgBtnSize')?.value,
    sidebarIcons: document.getElementById('cfgSidebarIcons')?.value
  };
  saveData(d);
  showStatus('Button settings saved!');
}

/* ═══════════════════ SECTIONS ═══════════════════ */
const SECTION_DEFS = [
  { id:'hero',      label:'Hero',             edit:'content' },
  { id:'about',     label:'About Me',         edit:'content' },
  { id:'skills',    label:'Skills',           edit:'content' },
  { id:'background',label:'Background',       edit:'content' },
  { id:'contact',   label:'Contact',          edit:'content' },
];
function renderSections(){
  const d = getData();
  const list = document.getElementById('secList');
  if(!list) return;
  list.innerHTML = '';
  SECTION_DEFS.forEach(sec=>{
    const s = d.sections?.[sec.id] || {visible:true, headingAlign:'left'};
    const item = document.createElement('div');
    item.className = 'sec-item';
    item.innerHTML = `
      <span class="sec-label">${sec.label}</span>
      <div class="sec-side">
        <button class="${s.headingAlign==='left'?'active':''}" onclick="setHeadingAlign('${sec.id}','left',this)">≡ Left</button>
        <button class="${s.headingAlign==='center'?'active':''}" onclick="setHeadingAlign('${sec.id}','center',this)">≡ Center</button>
      </div>
      <button class="toggle ${s.visible?'':'off'}" onclick="toggleSection('${sec.id}',this)" title="Toggle visibility"></button>
      <button onclick="editSectionContent('${sec.id}')" title="Edit text"><i class="fas fa-pen" style="color:var(--accent);background:none;border:none;cursor:pointer;font-size:14px;padding:4px;"></i></button>
    `;
    list.appendChild(item);
  });
}
function toggleSection(id, btn){
  const d = getData();
  d.sections = d.sections || {};
  if(!d.sections[id]) d.sections[id] = {visible:true, headingAlign:'left'};
  d.sections[id].visible = !d.sections[id].visible;
  btn.classList.toggle('off', !d.sections[id].visible);
  saveData(d);
  showStatus(d.sections[id].visible ? 'Section shown.' : 'Section hidden.');
}
function setHeadingAlign(id, val, btn){
  const d = getData();
  d.sections = d.sections || {};
  if(!d.sections[id]) d.sections[id] = {visible:true, headingAlign:'left'};
  d.sections[id].headingAlign = val;
  btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  saveData(d);
}
function editSectionContent(id){
  const d = getData();
  const sec = d.sections?.[id];
  const label = SECTION_DEFS.find(s=>s.id===id)?.label || id;
  // Build editor per section
  let html = `<h4 style="margin-bottom:12px;">Edit "${label}" Content</h4><div class="db-grid">`;
  if(id==='hero'){
    html += buildField('Hero Name',(d.profile?.name||''),'cfgHeroName');
    html += buildField('Typing Comma-separated',(d.profile?.title||''),'cfgTyping2');
  } else if(id==='about'){
    html += buildField('About Title',(d.profile?.title||''),'cfgAboutTitle','full');
    html += buildField('Bio',(d.profile?.bio||''),'cfgAboutBio','full','textarea');
  } else if(id==='skills'){
    html += `<p style="color:var(--text-muted);font-size:13px;">Use the Skills &amp; Projects tab below to manage skills content.</p>`;
  } else if(id==='background'){
    html += `<p style="color:var(--text-muted);font-size:13px;">Use the Skills &amp; Projects tab below to manage experience and education.</p>`;
  } else if(id==='contact'){
    html += buildField('Location',d.contact?.location||'','cfgLoc');
    html += buildField('Email',d.contact?.email||'','cfgEmail');
    html += buildField('Phone',d.contact?.phone||'','cfgPhone');
  }
  html += `</div>
    <div class="btn-row">
      <button class="btn btn--primary btn--sm" onclick="saveSectionContent('${id}')"><i class="fas fa-save"></i> Save</button>
      <button class="btn btn--surface btn--sm" onclick="closeAllModals()">Cancel</button>
    </div>`;
  showModal('Content Editor', html);
}
function buildField(label, value, id, full, type='text', rows=2){
  const f = full?' db-field full':' db-field';
  const inp = type==='textarea'
    ? `<textarea id="${id}" rows="${rows}">${value}</textarea>`
    : `<input type="${type}" id="${id}" value="${value}">`;
  return `<div class="${f}"><label>${label}</label>${inp}</div>`;
}
function saveSectionContent(id){
  const d = getData();
  if(id==='hero'){
    d.profile = d.profile || {};
    const name = document.getElementById('cfgHeroName')?.value;
    if(name) d.profile.name = name;
    const typing = document.getElementById('cfgTyping2')?.value;
    if(typing) d.profile.title = typing;
  } else if(id==='about'){
    d.profile = d.profile || {};
    const title = document.getElementById('cfgAboutTitle')?.value;
    if(title) d.profile.title = title;
    const bio = document.getElementById('cfgAboutBio')?.value;
    if(bio) d.profile.bio = bio;
  } else if(id==='contact'){
    d.contact = d.contact || {};
    d.contact.location = document.getElementById('cfgLoc')?.value || d.contact.location;
    d.contact.email = document.getElementById('cfgEmail')?.value || d.contact.email;
    d.contact.phone = document.getElementById('cfgPhone')?.value || d.contact.phone;
  }
  saveData(d);
  closeAllModals();
  showStatus('Content saved!');
}

/* ═══════════════════ SKILLS ═══════════════════ */
let editingSkillIdx = -1;
function renderSkillsList(){
  const d = getData();
  const list = document.getElementById('skillsList');
  if(!list) return;
  list.innerHTML = '';
  (d.skills||[]).forEach((s,i)=>{
    const item = document.createElement('div');
    item.className='sec-item';
    item.innerHTML=`
      <span class="sec-label"><i class="fas fa-star" style="color:${s.color||'var(--accent)'};margin-right:6px;"></i>${s.name} <small style="color:var(--text-muted);font-weight:400;">${s.type}</small></span>
      <button onclick="editSkill(${i})" title="Edit" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:4px 8px;"><i class="fas fa-pen"></i></button>
      <button onclick="deleteSkill(${i})" title="Delete" style="background:none;border:none;color:#e05f5f;cursor:pointer;font-size:12px;padding:4px 8px;"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
  });
}
function addSkillModal(){
  editingSkillIdx=-1;
  document.getElementById('skillModalTitle').textContent='Add Skill';
  document.getElementById('skName').value='';
  document.getElementById('skType').value='App';
  document.getElementById('skIcon').value='';
  document.getElementById('skDesc').value='';
  toggleSkillFields();
  document.getElementById('skillModal').classList.add('open');
}
function editSkill(i){
  editingSkillIdx=i;
  const d=getData(), s=d.skills?.[i]; if(!s) return;
  document.getElementById('skillModalTitle').textContent='Edit Skill';
  document.getElementById('skName').value=s.name;
  document.getElementById('skType').value=s.type;
  document.getElementById('skIcon').value=s.iconUrl||'';
  document.getElementById('skDesc').value=s.description||'';
  toggleSkillFields();
  document.getElementById('skillModal').classList.add('open');
}
function toggleSkillFields(){
  const type=document.getElementById('skType').value;
  document.getElementById('skIconField').style.display = type==='App'?'block':'none';
}
function saveSkill(){
  const name=document.getElementById('skName').value.trim();
  const type=document.getElementById('skType').value;
  const icon=document.getElementById('skIcon').value.trim();
  const desc=document.getElementById('skDesc').value.trim();
  if(!name){showStatus('Name required.',true);return;}
  const d=getData(); d.skills=d.skills||[];
  const obj={name,type,description:desc};
  if(type==='App') obj.iconUrl=icon;
  if(editingSkillIdx>-1) d.skills[editingSkillIdx]=obj; else d.skills.push(obj);
  saveData(d); renderSkillsList(); renderSkillsEditable();
  closeModal('skillModal'); showStatus(editingSkillIdx>-1?'Skill updated!':'Skill added!');
}
function deleteSkill(i){
  if(!confirm('Delete this skill?')) return;
  const d=getData(); d.skills=d.skills||[];
  d.skills.splice(i,1); saveData(d); renderSkillsList(); renderSkillsEditable();
  showStatus('Skill deleted.');
}

/* ═══════════════════ PROJECTS ═══════════════════ */
let editingProjIdx = -1;
function renderProjectsList(){
  const d = getData();
  const list = document.getElementById('projectsList');
  if(!list) return;
  list.innerHTML = '';
  (d.projects||[]).forEach((p,i)=>{
    const item = document.createElement('div');
    item.className='sec-item';
    item.innerHTML=`
      <span class="sec-label"><i class="fas fa-image" style="color:var(--accent);margin-right:6px;"></i>${p.title} <small style="color:var(--text-muted);font-weight:400;">${p.category}</small></span>
      <button onclick="editProject(${i})" title="Edit" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px;padding:4px 8px;"><i class="fas fa-pen"></i></button>
      <button onclick="deleteProject(${i})" title="Delete" style="background:none;border:none;color:#e05f5f;cursor:pointer;font-size:12px;padding:4px 8px;"><i class="fas fa-trash"></i></button>
    `;
    list.appendChild(item);
  });
}
function addProjectModal(){
  editingProjIdx=-1;
  document.getElementById('projectModalTitle').textContent='Add Project';
  document.getElementById('pjTitle').value='';
  document.getElementById('pjCat').value='';
  document.getElementById('pjDesc').value='';
  document.getElementById('pjYear').value='';
  document.getElementById('pjIcon').value='fa-palette';
  document.getElementById('pjTags').value='';
  document.getElementById('projectModal').classList.add('open');
}
function editProject(i){
  editingProjIdx=i;
  const d=getData(), p=d.projects?.[i]; if(!p) return;
  document.getElementById('projectModalTitle').textContent='Edit Project';
  document.getElementById('pjTitle').value=p.title;
  document.getElementById('pjCat').value=p.category;
  document.getElementById('pjDesc').value=p.desc;
  document.getElementById('pjYear').value=p.year||'';
  document.getElementById('pjIcon').value=p.icon||'';
  document.getElementById('pjTags').value=(p.tags||[]).join(', ');
  document.getElementById('projectModal').classList.add('open');
}
function saveProject(){
  const title=document.getElementById('pjTitle').value.trim();
  if(!title){showStatus('Title required.',true);return;}
  const d=getData(); d.projects=d.projects||[];
  const obj={
    title,
    category:document.getElementById('pjCat').value.trim(),
    desc:document.getElementById('pjDesc').value.trim(),
    year:document.getElementById('pjYear').value.trim(),
    icon:document.getElementById('pjIcon').value.trim(),
    tags:document.getElementById('pjTags').value.split(',').map(t=>t.trim()).filter(Boolean)
  };
  if(editingProjIdx>-1) d.projects[editingProjIdx]=obj; else d.projects.push(obj);
  saveData(d); renderProjectsList(); renderProjectsEditable();
  closeModal('projectModal'); showStatus(editingProjIdx>-1?'Project updated!':'Project added!');
}
function deleteProject(i){
  if(!confirm('Delete this project?')) return;
  const d=getData(); d.projects=d.projects||[];
  d.projects.splice(i,1); saveData(d); renderProjectsList(); renderProjectsEditable();
  showStatus('Project deleted.');
}

/* ═══════════════════ CONTENT EDITOR (text tab) ═══════════════════ */
function renderContentEditor(){
  const d = getData();
  const editor = document.getElementById('contentEditor');
  if(!editor) return;
  let html = '';
  // Profile
  html += `<h4 style="font-size:13px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">Profile</h4>`;
  html += `
    <div class="db-grid">
      <div class="db-field"><label>Display Name</label><input type="text" id="ceName" value="${d.profile?.name||''}"></div>
      <div class="db-field"><label>Title / Role</label><input type="text" id="ceTitle" value="${d.profile?.title||''}"></div>
      <div class="db-field full"><label>Bio</label><textarea id="ceBio" rows="3">${d.profile?.bio||''}</textarea></div>
      <div class="db-field"><label>Birth Date</label><input type="text" id="ceBirth" value="${d.profile?.birthDate||''}"></div>
      <div class="db-field"><label>Website</label><input type="url" id="ceWebsite" value="${d.profile?.website||''}"></div>
      <div class="db-field"><label>Contact / Phone</label><input type="text" id="ceContact" value="${d.profile?.contact||''}"></div>
      <div class="db-field"><label>Email</label><input type="email" id="ceEmail" value="${d.profile?.email||''}"></div>
      <div class="db-field"><label>City</label><input type="text" id="ceCity" value="${d.profile?.city||''}"></div>
      <div class="db-field"><label>Degree</label><input type="text" id="ceDegree" value="${d.profile?.degree||''}"></div>
      <div class="db-field"><label>Freelance Status</label><input type="text" id="ceFreelance" value="${d.profile?.freelance||''}"></div>
    </div>`;
  // Social
  html += `<h4 style="font-size:13px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;margin:20px 0 10px;">Social Links</h4>`;
  html += `<div class="db-grid">
    <div class="db-field"><label>Facebook URL</label><input type="url" id="ceFb" value="${d.social?.facebook||''}"></div>
    <div class="db-field"><label>Instagram URL</label><input type="url" id="ceIg" value="${d.social?.instagram||''}"></div>
    <div class="db-field"><label>LinkedIn URL</label><input type="url" id="ceLi" value="${d.social?.linkedin||''}"></div>
  </div>`;
  // Contact
  html += `<h4 style="font-size:13px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em;margin:20px 0 10px;">Contact Info</h4>`;
  html += `<div class="db-grid">
    <div class="db-field"><label>Location</label><input type="text" id="ceCLoc" value="${d.contact?.location||''}"></div>
    <div class="db-field"><label>Contact Email</label><input type="email" id="ceCEmail" value="${d.contact?.email||''}"></div>
    <div class="db-field"><label>Phone</label><input type="text" id="ceCPhone" value="${d.contact?.phone||''}"></div>
  </div>`;
  html += `<div class="btn-row" style="margin-top:16px;">
    <button class="btn btn--primary btn--sm" onclick="saveAllContent()"><i class="fas fa-save"></i> Save All Content</button>
  </div>`;
  editor.innerHTML = html;
}

function saveAllContent(){
  const d = getData();
  d.profile = d.profile || {};
  const assign = (id, key, path) => {
    const el = document.getElementById(id);
    if(el) d[path] = {...(d[path]||{}), [key]: el.value};
  };
  const profile = d.profile;
  profile.name = document.getElementById('ceName')?.value || profile.name;
  profile.title = document.getElementById('ceTitle')?.value || profile.title;
  profile.bio = document.getElementById('ceBio')?.value || profile.bio;
  profile.birthDate = document.getElementById('ceBirth')?.value || profile.birthDate;
  profile.website = document.getElementById('ceWebsite')?.value || profile.website;
  profile.contact = document.getElementById('ceContact')?.value || profile.contact;
  profile.email = document.getElementById('ceEmail')?.value || profile.email;
  profile.city = document.getElementById('ceCity')?.value || profile.city;
  profile.degree = document.getElementById('ceDegree')?.value || profile.degree;
  profile.freelance = document.getElementById('ceFreelance')?.value || profile.freelance;
  d.social = d.social || {};
  d.social.facebook = document.getElementById('ceFb')?.value || '';
  d.social.instagram = document.getElementById('ceIg')?.value || '';
  d.social.linkedin = document.getElementById('ceLi')?.value || '';
  d.contact = d.contact || {};
  d.contact.location = document.getElementById('ceCLoc')?.value || '';
  d.contact.email = document.getElementById('ceCEmail')?.value || '';
  d.contact.phone = document.getElementById('ceCPhone')?.value || '';
  saveData(d);
  showStatus('All content saved!');
}

/* ═══════════════════ EXPORT SAVED CONFIG ═══════════════════ */
function exportSavedConfig(){
  const d = getData();
  const blob = new Blob([JSON.stringify(d,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'portfolio-config.json';
  a.click();
  showStatus('Config exported!');
}
// Add export button on init
function addExportBtn(){
  const btns = document.querySelector('.btn-row');
  if(!btns) return;
  const btn = document.createElement('button');
  btn.className='btn btn--surface btn--sm';
  btn.style.marginLeft='8px';
  btn.innerHTML='<i class="fas fa-download"></i> Export Config';
  btn.onclick = exportSavedConfig;
  // Add to General and Layout panels
  ['tab-general','tab-layout'].forEach(id=>{
    const panel = document.getElementById(id);
    if(panel){
      const rows = panel.querySelectorAll('.btn-row');
      rows.forEach(r=>{
        const b2=document.createElement('button');
        b2.className='btn btn--surface btn--sm'; b2.style.marginLeft='8px';
        b2.innerHTML='<i class="fas fa-download"></i> Export';
        b2.onclick=exportSavedConfig;
        r.appendChild(b2);
      });
    }
  });
}

/* ═══════════════════ MODAL ═══════════════════ */
function closeModal(id){ document.getElementById(id)?.classList.remove('open'); }
function closeAllModals(){ document.querySelectorAll('.db-modal').forEach(m=>m.classList.remove('open')); }

/* ═══════════════════ INIT ═══════════════════ */
function init(){
  // Load config from localStorage (prefer existing) or DEFAULTS
  const d = getData();
  d.layout = d.layout || { theme:'dark', sidebarPosition:'left' };

  // General tab
  if(document.getElementById('cfgTheme')) document.getElementById('cfgTheme').value = d.layout.theme || 'dark';
  if(document.getElementById('cfgHeroName')) document.getElementById('cfgHeroName').value = d.profile?.name || '';
  const typ = d.profile?.title || d.typingText || '';
  if(document.getElementById('cfgTyping')) document.getElementById('cfgTyping').value = typ;
  const cl = d.colors || {};
  if(document.getElementById('cfgAccent')) document.getElementById('cfgAccent').value = cl.accent || '#149ddd';
  if(document.getElementById('cfgAccentText')) document.getElementById('cfgAccentText').value = cl.accent || '#149ddd';
  if(document.getElementById('cfgAccentHover')) document.getElementById('cfgAccentHover').value = cl.accentHover || '#37b3ed';
  if(document.getElementById('cfgAccentHoverText')) document.getElementById('cfgAccentHoverText').value = cl.accentHover || '#37b3ed';

  applyTheme();

  // Layout tab
  if(document.getElementById('cfgSidebarPos')) document.getElementById('cfgSidebarPos').value = d.layout.sidebarPosition || 'left';
  if(document.getElementById('cfgNavbarPos')) document.getElementById('cfgNavbarPos').value = d.layout.navbarPosition || 'sidebar';
  if(document.getElementById('cfgHeadingAlign')) document.getElementById('cfgHeadingAlign').value = d.layout.sectionHeadingAlign || 'left';
  if(document.getElementById('cfgHeroSide')) document.getElementById('cfgHeroSide').value = (d.layout.hero||{}).textSide || 'center';
  if(document.getElementById('cfgAboutImageSide')) document.getElementById('cfgAboutImageSide').value = (d.layout.about||{}).imageSide || 'right';

  // Colors tab
  if(document.getElementById('clrAccent')) document.getElementById('clrAccent').value = cl.accent || '#149ddd';
  if(document.getElementById('clrAccentTxt')) document.getElementById('clrAccentTxt').value = cl.accent || '#149ddd';
  if(document.getElementById('clrAccentHover')) document.getElementById('clrAccentHover').value = cl.accentHover || '#37b3ed';
  if(document.getElementById('clrAccentHoverTxt')) document.getElementById('clrAccentHoverTxt').value = cl.accentHover || '#37b3ed';
  if(document.getElementById('clrSidebar')) document.getElementById('clrSidebar').value = cl.sidebarBg || '#040b14';
  if(document.getElementById('clrSidebarTxt')) document.getElementById('clrSidebarTxt').value = cl.sidebarBg || '#040b14';
  if(document.getElementById('clrPageBg')) document.getElementById('clrPageBg').value = cl.pageBg || '#0c0f16';
  if(document.getElementById('clrPageBgTxt')) document.getElementById('clrPageBgTxt').value = cl.pageBg || '#0c0f16';
  if(document.getElementById('clrSurface')) document.getElementById('clrSurface').value = cl.surface || '#111827';
  if(document.getElementById('clrSurfaceTxt')) document.getElementById('clrSurfaceTxt').value = cl.surface || '#111827';

  // Buttons tab
  if(document.getElementById('cfgBtnStyle')) document.getElementById('cfgBtnStyle').value = d.buttons?.style || 'primary';
  if(document.getElementById('cfgBtnRadius')) document.getElementById('cfgBtnRadius').value = d.buttons?.radius || '4px';
  if(document.getElementById('cfgBtnSize')) document.getElementById('cfgBtnSize').value = d.buttons?.size || 'md';

  // Sections
  renderSections();
  // Content
  renderContentEditor();
  // Skills & Projects
  renderSkillsList();
  renderProjectsList();
  // Export button
  addExportBtn();
}

window.addEventListener('DOMContentLoaded', init);
