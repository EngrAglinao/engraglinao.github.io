/* =============================================
   DragDrop Builder - Main Application
   ============================================= */

// ============================================
// GLOBAL STATE
// ============================================

const AppState = {
    currentTab: 'web',
    currentDevice: 'desktop',
    currentCodeTab: 'html',
    codePanelVisible: false,
    zoom: 100,
    sections: [],
    myComponents: [],
    undoStack: [],
    redoStack: [],
    selectedSection: null,
    selectedComponent: null,
    editingComponentId: null,
    editingSectionId: null,
    dragData: null,
    sectionCounter: 0,
    componentCounter: 0
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    renderSidebarComponents();
    renderLibraryComponents();
    renderMyComponents();
    initCanvasDropZone();
    initSidebarResize();
    initCanvasSortable();
    updateCodePanel();

    // Load project if exists
    const savedProject = localStorage.getItem('ddBuilder_project');
    if (savedProject) {
        try {
            const project = JSON.parse(savedProject);
            if (project.sections && project.sections.length > 0) {
                loadProjectFromData(project);
            }
        } catch (e) {
            console.log('No saved project found');
        }
    }
});

// ============================================
// SIDEBAR COMPONENTS RENDERING
// ============================================

function renderSidebarComponents() {
    const container = document.getElementById('componentsList');
    container.innerHTML = '';

    COMPONENT_CATEGORIES.forEach(category => {
        const catEl = document.createElement('div');
        catEl.className = 'component-category';
        catEl.dataset.categoryId = category.id;

        catEl.innerHTML = `
            <div class="category-header" onclick="toggleCategory('${category.id}')">
                <i class="bi ${category.icon} me-2"></i>
                <span>${category.name}</span>
                <i class="bi bi-chevron-down ms-auto"></i>
            </div>
            <div class="category-items" id="cat-items-${category.id}">
                ${category.items.map(item => `
                    <div class="component-item"
                         draggable="true"
                         data-component-id="${item.id}"
                         data-component-type="${item.type || 'generic'}"
                         data-component-html="${escapeAttr(item.html)}"
                         data-component-css="${escapeAttr(item.css || '')}"
                         data-component-js="${escapeAttr(item.js || '')}"
                         ondragstart="handleSidebarDragStart(event)"
                         ondblclick="addComponentToCanvas('${item.id}')">
                        <div class="comp-icon">
                            <i class="bi ${item.icon}"></i>
                        </div>
                        <span class="comp-name">${item.name}</span>
                        <div class="comp-actions">
                            <button class="btn btn-sm btn-outline-info" onclick="event.stopPropagation(); previewComponent('${escapeAttr(item.html)}')" title="Preview">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(catEl);
    });
}

function toggleCategory(catId) {
    const items = document.getElementById(`cat-items-${catId}`);
    const header = items.previousElementSibling;
    items.classList.toggle('collapsed');
    header.classList.toggle('collapsed');
}

function filterComponents(query) {
    query = query.toLowerCase().trim();
    const items = document.querySelectorAll('.component-item');
    const categories = document.querySelectorAll('.component-category');

    items.forEach(item => {
        const name = item.querySelector('.comp-name').textContent.toLowerCase();
        item.style.display = name.includes(query) || !query ? '' : 'none';
    });

    categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll('.component-item:not([style*="display: none"])');
        cat.style.display = visibleItems.length > 0 || !query ? '' : 'none';
    });
}

// ============================================
// DRAG & DROP
// ============================================

function handleSidebarDragStart(e) {
    const item = e.target.closest('.component-item');
    if (!item) return;

    const data = {
        source: 'sidebar',
        id: item.dataset.componentId,
        type: item.dataset.componentType,
        html: item.dataset.componentHtml,
        css: item.dataset.componentCss || '',
        js: item.dataset.componentJs || ''
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
    AppState.dragData = data;

    item.style.opacity = '0.5';
    setTimeout(() => item.style.opacity = '', 200);
}

function handleLibraryDragStart(e, compId) {
    const comp = LIBRARY_COMPONENTS.find(c => c.id === compId) ||
                 AppState.myComponents.find(c => c.id === compId);
    if (!comp) return;

    const data = {
        source: 'library',
        id: comp.id,
        type: 'library',
        html: comp.html,
        css: comp.css || '',
        js: comp.js || ''
    };

    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'copy';
    AppState.dragData = data;
}

function initCanvasDropZone() {
    const canvas = document.getElementById('canvas');

    canvas.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        canvas.classList.add('drag-over');
    });

    canvas.addEventListener('dragleave', (e) => {
        if (!canvas.contains(e.relatedTarget)) {
            canvas.classList.remove('drag-over');
        }
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        canvas.classList.remove('drag-over');

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.source === 'sidebar' || data.source === 'library') {
                // If dropping on empty canvas, create a section first
                if (AppState.sections.length === 0) {
                    const section = createSection(1);
                    addComponentToColumn(section.id, section.columns[0].id, data);
                }
            }
        } catch (err) {
            // Ignore
        }
    });
}

function initColumnDropZone(colEl, sectionId, colId) {
    colEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        colEl.classList.add('drag-over');
    });

    colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
            colEl.classList.remove('drag-over');
        }
    });

    colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        colEl.classList.remove('drag-over');

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.source === 'sidebar' || data.source === 'library') {
                addComponentToColumn(sectionId, colId, data);
            }
        } catch (err) {
            // Ignore
        }
    });
}

// ============================================
// SECTION MANAGEMENT
// ============================================

function addSection() {
    const modal = new bootstrap.Modal(document.getElementById('columnModal'));
    const options = document.getElementById('columnOptions');

    const layouts = [
        { cols: 1, label: '1 Column', widths: [12] },
        { cols: 2, label: '2 Columns', widths: [6, 6] },
        { cols: 2, label: 'Sidebar Left', widths: [4, 8] },
        { cols: 2, label: 'Sidebar Right', widths: [8, 4] },
        { cols: 3, label: '3 Columns', widths: [4, 4, 4] },
        { cols: 3, label: '3-2-1', widths: [6, 4, 2] },
        { cols: 4, label: '4 Columns', widths: [3, 3, 3, 3] },
        { cols: 4, label: '4-3-3-2', widths: [2, 3, 3, 4] }
    ];

    options.innerHTML = layouts.map((l, i) => `
        <div class="col-6 col-md-3 mb-2">
            <div class="col-option" onclick="selectColumnLayout(${i})">
                <div class="col-preview">
                    ${l.widths.map(w => `<span style="flex:${w}"></span>`).join('')}
                </div>
                <div class="col-label">${l.label}</div>
            </div>
        </div>
    `).join('');

    options.dataset.layouts = JSON.stringify(layouts);
    modal.show();
}

function selectColumnLayout(index) {
    const layouts = JSON.parse(document.getElementById('columnOptions').dataset.layouts);
    const layout = layouts[index];
    bootstrap.Modal.getInstance(document.getElementById('columnModal')).hide();
    createSection(layout.cols, layout.widths);
}

function addSectionWithColumns(cols) {
    if (cols === 'custom') {
        addSection();
        return;
    }

    const widths = [];
    const colWidth = Math.floor(12 / cols);
    for (let i = 0; i < cols; i++) {
        widths.push(i === cols - 1 ? 12 - colWidth * (cols - 1) : colWidth);
    }
    createSection(cols, widths);
}

function createSection(numCols, widths) {
    saveUndoState();

    const sectionId = `section-${++AppState.sectionCounter}`;
    const columns = [];

    for (let i = 0; i < numCols; i++) {
        columns.push({
            id: `col-${sectionId}-${i}`,
            width: widths ? widths[i] : Math.floor(12 / numCols),
            components: []
        });
    }

    const section = {
        id: sectionId,
        columns: columns,
        bgColor: '#ffffff',
        bgImage: '',
        paddingTop: 40,
        paddingBottom: 40,
        customClass: '',
        customId: '',
        saved: false
    };

    AppState.sections.push(section);
    renderCanvas();
    return section;
}

function renderCanvas() {
    const canvas = document.getElementById('canvas');
    const emptyState = document.getElementById('canvasEmptyState');

    if (AppState.sections.length === 0) {
        canvas.innerHTML = '';
        canvas.appendChild(emptyState);
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';

    // Keep empty state but hidden
    let html = '';
    AppState.sections.forEach(section => {
        html += renderSection(section);
    });

    // We need to preserve emptyState element
    canvas.innerHTML = html;
    canvas.appendChild(emptyState);

    // Init Sortable for each column
    AppState.sections.forEach(section => {
        section.columns.forEach(col => {
            const colEl = document.querySelector(`[data-col-id="${col.id}"]`);
            if (colEl) {
                initColumnDropZone(colEl, section.id, col.id);
                initSortableForColumn(colEl, section.id, col.id);
            }
        });
    });
}

function renderSection(section) {
    const colsHtml = section.columns.map((col, i) => `
        <div class="builder-col col-md-${col.width}" data-col-id="${col.id}" data-section-id="${section.id}">
            <span class="col-label">${col.width}/12</span>
            ${col.components.map(comp => renderComponent(comp)).join('')}
        </div>
    `).join('');

    const bgStyle = [
        section.bgColor && section.bgColor !== '#ffffff' ? `background-color: ${section.bgColor}` : '',
        section.bgImage ? `background-image: url(${section.bgImage}); background-size: cover; background-position: center` : ''
    ].filter(Boolean).join('; ');

    return `
        <div class="builder-section" data-section-id="${section.id}"
             style="padding-top: ${section.paddingTop}px; padding-bottom: ${section.paddingBottom}px; ${bgStyle}"
             ${section.customClass ? `class="builder-section ${section.customClass}"` : ''}
             ${section.customId ? `id="${section.customId}"` : ''}>
            <span class="section-label">Section ${AppState.sections.indexOf(section) + 1}</span>
            <div class="section-controls">
                <button class="btn" onclick="moveSection('${section.id}', 'up')" title="Move Up"><i class="bi bi-chevron-up"></i></button>
                <button class="btn" onclick="moveSection('${section.id}', 'down')" title="Move Down"><i class="bi bi-chevron-down"></i></button>
                <button class="btn" onclick="openSectionSettings('${section.id}')" title="Settings"><i class="bi bi-gear"></i></button>
                <button class="btn" onclick="duplicateSection('${section.id}')" title="Duplicate"><i class="bi bi-copy"></i></button>
                <button class="btn" onclick="deleteSection('${section.id}')" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
            <div class="section-drop-zone ${section.columns.every(c => c.components.length === 0) ? 'empty' : ''}">
                <div class="builder-row row">
                    ${colsHtml}
                </div>
            </div>
        </div>
    `;
}

function renderComponent(comp) {
    const compDef = findComponentDef(comp.originalId);

    return `
        <div class="builder-component" data-comp-id="${comp.id}" data-section-id="${comp.sectionId}" data-col-id="${comp.colId}"
             draggable="true"
             ondragstart="handleComponentDragStart(event, '${comp.id}')">
            <span class="comp-type-label">${comp.name || compDef?.name || 'Component'}</span>
            <div class="comp-controls">
                <button class="btn" onclick="editComponentInline('${comp.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
                <button class="btn" onclick="moveComponent('${comp.id}', 'up')" title="Move Up"><i class="bi bi-chevron-up"></i></button>
                <button class="btn" onclick="moveComponent('${comp.id}', 'down')" title="Move Down"><i class="bi bi-chevron-down"></i></button>
                <button class="btn" onclick="duplicateComponent('${comp.id}')" title="Duplicate"><i class="bi bi-copy"></i></button>
                <button class="btn" onclick="saveComponentAsCustom('${comp.id}')" title="Save as Custom"><i class="bi bi-bookmark"></i></button>
                <button class="btn" onclick="deleteComponent('${comp.id}')" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
            <div class="component-content">
                ${comp.html}
            </div>
        </div>
    `;
}

function handleComponentDragStart(e, compId) {
    e.stopPropagation();
    const data = {
        source: 'canvas',
        compId: compId
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
}

// ============================================
// COMPONENT MANAGEMENT
// ============================================

function addComponentToColumn(sectionId, colId, data) {
    saveUndoState();

    const section = AppState.sections.find(s => s.id === sectionId);
    if (!section) return;

    const col = section.columns.find(c => c.id === colId);
    if (!col) return;

    const compId = `comp-${++AppState.componentCounter}`;
    let html = decodeAttr(data.html);

    // Unescape newlines
    html = html.replace(/\\n/g, '\n');

    const component = {
        id: compId,
        originalId: data.id,
        name: findComponentDef(data.id)?.name || 'Custom',
        html: html,
        css: decodeAttr(data.css || ''),
        js: decodeAttr(data.js || ''),
        sectionId: sectionId,
        colId: colId
    };

    col.components.push(component);
    renderCanvas();
    updateCodePanel();
}

function addComponentToCanvas(componentId) {
    const comp = findComponentDef(componentId);
    if (!comp) return;

    // Find or create a section
    if (AppState.sections.length === 0) {
        createSection(1);
    }

    const lastSection = AppState.sections[AppState.sections.length - 1];
    const firstCol = lastSection.columns[0];

    addComponentToColumn(lastSection.id, firstCol.id, {
        id: componentId,
        html: comp.html,
        css: comp.css || '',
        js: comp.js || ''
    });
}

function findComponentDef(id) {
    for (const cat of COMPONENT_CATEGORIES) {
        const item = cat.items.find(i => i.id === id);
        if (item) return item;
    }
    return LIBRARY_COMPONENTS.find(c => c.id === id) ||
           AppState.myComponents.find(c => c.id === id);
}

function findComponentInState(compId) {
    for (const section of AppState.sections) {
        for (const col of section.columns) {
            const comp = col.components.find(c => c.id === compId);
            if (comp) return { component: comp, section, column: col };
        }
    }
    return null;
}

function deleteComponent(compId) {
    saveUndoState();
    for (const section of AppState.sections) {
        for (const col of section.columns) {
            const idx = col.components.findIndex(c => c.id === compId);
            if (idx !== -1) {
                col.components.splice(idx, 1);
                renderCanvas();
                updateCodePanel();
                return;
            }
        }
    }
}

function duplicateComponent(compId) {
    saveUndoState();
    const result = findComponentInState(compId);
    if (!result) return;

    const newComp = {
        ...result.component,
        id: `comp-${++AppState.componentCounter}`
    };
    const idx = result.column.components.indexOf(result.component);
    result.column.components.splice(idx + 1, 0, newComp);
    renderCanvas();
    updateCodePanel();
}

function moveComponent(compId, direction) {
    saveUndoState();
    const result = findComponentInState(compId);
    if (!result) return;

    const idx = result.column.components.indexOf(result.component);
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;

    if (newIdx < 0 || newIdx >= result.column.components.length) return;

    result.column.components.splice(idx, 1);
    result.column.components.splice(newIdx, 0, result.component);
    renderCanvas();
    updateCodePanel();
}

function editComponentInline(compId) {
    const result = findComponentInState(compId);
    if (!result) return;

    AppState.editingComponentId = compId;

    document.getElementById('editCompName').value = result.component.name || '';
    document.getElementById('editCompHTML').value = result.component.html || '';
    document.getElementById('editCompCSS').value = result.component.css || '';
    document.getElementById('editCompJS').value = result.component.js || '';

    const modal = new bootstrap.Modal(document.getElementById('editComponentModal'));
    modal.show();
    previewEditComponent();
}

function previewEditComponent() {
    const html = document.getElementById('editCompHTML').value;
    const css = document.getElementById('editCompCSS').value;
    const preview = document.getElementById('editCompPreview');

    preview.innerHTML = `<style>${css}</style>${html}`;
}

function saveEditedComponent() {
    saveUndoState();

    const result = findComponentInState(AppState.editingComponentId);
    if (!result) return;

    result.component.name = document.getElementById('editCompName').value;
    result.component.html = document.getElementById('editCompHTML').value;
    result.component.css = document.getElementById('editCompCSS').value;
    result.component.js = document.getElementById('editCompJS').value;

    bootstrap.Modal.getInstance(document.getElementById('editComponentModal')).hide();
    renderCanvas();
    updateCodePanel();
    showToast('Component updated!', 'success');
}

function saveComponentAsCustom(compId) {
    const result = findComponentInState(compId);
    if (!result) return;

    const newComp = {
        id: `custom-${Date.now()}`,
        name: result.component.name || 'Custom Component',
        category: 'custom',
        tags: ['custom'],
        description: 'Custom saved component',
        html: result.component.html,
        css: result.component.css || '',
        js: result.component.js || ''
    };

    AppState.myComponents.push(newComp);
    saveMyComponents();
    renderMyComponents();
    showToast('Component saved to My Components!', 'success');
}

// ============================================
// SECTION MANAGEMENT
// ============================================

function deleteSection(sectionId) {
    saveUndoState();
    AppState.sections = AppState.sections.filter(s => s.id !== sectionId);
    renderCanvas();
    updateCodePanel();
}

function duplicateSection(sectionId) {
    saveUndoState();
    const section = AppState.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newSection = JSON.parse(JSON.stringify(section));
    newSection.id = `section-${++AppState.sectionCounter}`;
    newSection.columns.forEach((col, i) => {
        col.id = `col-${newSection.id}-${i}`;
        col.components.forEach(comp => {
            comp.id = `comp-${++AppState.componentCounter}`;
            comp.sectionId = newSection.id;
            comp.colId = col.id;
        });
    });

    const idx = AppState.sections.indexOf(section);
    AppState.sections.splice(idx + 1, 0, newSection);
    renderCanvas();
    updateCodePanel();
}

function moveSection(sectionId, direction) {
    saveUndoState();
    const idx = AppState.sections.findIndex(s => s.id === sectionId);
    if (idx === -1) return;

    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= AppState.sections.length) return;

    const temp = AppState.sections[idx];
    AppState.sections[idx] = AppState.sections[newIdx];
    AppState.sections[newIdx] = temp;
    renderCanvas();
    updateCodePanel();
}

function openSectionSettings(sectionId) {
    const section = AppState.sections.find(s => s.id === sectionId);
    if (!section) return;

    AppState.editingSectionId = sectionId;

    document.getElementById('sectionBgColor').value = section.bgColor || '#ffffff';
    document.getElementById('sectionBgImage').value = section.bgImage || '';
    document.getElementById('sectionPaddingTop').value = section.paddingTop || 40;
    document.getElementById('sectionPaddingBottom').value = section.paddingBottom || 40;
    document.getElementById('sectionCustomClass').value = section.customClass || '';
    document.getElementById('sectionId').value = section.customId || '';

    const modal = new bootstrap.Modal(document.getElementById('sectionSettingsModal'));
    modal.show();
}

function applySectionSettings() {
    saveUndoState();
    const section = AppState.sections.find(s => s.id === AppState.editingSectionId);
    if (!section) return;

    section.bgColor = document.getElementById('sectionBgColor').value;
    section.bgImage = document.getElementById('sectionBgImage').value;
    section.paddingTop = parseInt(document.getElementById('sectionPaddingTop').value) || 0;
    section.paddingBottom = parseInt(document.getElementById('sectionPaddingBottom').value) || 0;
    section.customClass = document.getElementById('sectionCustomClass').value;
    section.customId = document.getElementById('sectionId').value;

    bootstrap.Modal.getInstance(document.getElementById('sectionSettingsModal')).hide();
    renderCanvas();
    updateCodePanel();
    showToast('Section settings applied!', 'success');
}

// ============================================
// SORTABLE FOR COLUMNS
// ============================================

function initSortableForColumn(colEl, sectionId, colId) {
    if (colEl._sortable) {
        colEl._sortable.destroy();
    }

    colEl._sortable = new Sortable(colEl, {
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        handle: '.builder-component',
        draggable: '.builder-component',
        group: {
            name: 'components',
            pull: true,
            put: true
        },
        onEnd: function (evt) {
            handleSortableEnd(evt, sectionId, colId);
        }
    });
}

function handleSortableEnd(evt, targetSectionId, targetColId) {
    saveUndoState();

    const compId = evt.item.dataset.compId;
    const fromSectionId = evt.from.dataset.sectionId;
    const fromColId = evt.from.dataset.colId;

    // Find the component
    let component = null;
    for (const section of AppState.sections) {
        for (const col of section.columns) {
            const idx = col.components.findIndex(c => c.id === compId);
            if (idx !== -1) {
                component = col.components.splice(idx, 1)[0];
                break;
            }
        }
        if (component) break;
    }

    if (!component) return;

    // Update component's section/col references
    component.sectionId = targetSectionId;
    component.colId = targetColId;

    // Find target column and insert at correct position
    const targetSection = AppState.sections.find(s => s.id === targetSectionId);
    if (!targetSection) return;

    const targetCol = targetSection.columns.find(c => c.id === targetColId);
    if (!targetCol) return;

    const newIndex = evt.newIndex;
    targetCol.components.splice(newIndex, 0, component);

    renderCanvas();
    updateCodePanel();
}

// ============================================
// SIDEBAR RESIZE
// ============================================

function initSidebarResize() {
    const handle = document.getElementById('resizeHandle');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
            sidebar.style.width = newWidth + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// ============================================
// CODE PANEL
// ============================================

function toggleCodePanel() {
    const panel = document.getElementById('codePanel');
    const toggleText = document.getElementById('codePanelToggleText');
    const arrow = document.getElementById('codePanelArrow');

    AppState.codePanelVisible = !AppState.codePanelVisible;

    if (AppState.codePanelVisible) {
        panel.classList.add('visible');
        toggleText.textContent = 'Hide Code';
        arrow.classList.replace('bi-chevron-up', 'bi-chevron-down');
        updateCodePanel();
    } else {
        panel.classList.remove('visible');
        toggleText.textContent = 'Show Code';
        arrow.classList.replace('bi-chevron-down', 'bi-chevron-up');
    }
}

function switchCodeTab(tab) {
    AppState.currentCodeTab = tab;
    document.querySelectorAll('[id^="code-"][id$="-tab"]').forEach(el => el.classList.remove('active'));
    document.getElementById(`code-${tab}-tab`).classList.add('active');
    updateCodePanel();
}

function updateCodePanel() {
    if (!AppState.codePanelVisible) return;

    const output = document.getElementById('codeOutput');
    let code = '';

    switch (AppState.currentCodeTab) {
        case 'html':
            code = generateHTML();
            break;
        case 'css':
            code = generateCSS();
            break;
        case 'js':
            code = generateJS();
            break;
    }

    output.textContent = code;
}

function generateHTML() {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '    <meta charset="UTF-8">\n';
    html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '    <title>My Website</title>\n';
    html += '    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">\n';
    html += '    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" rel="stylesheet">\n';
    html += '    <link rel="stylesheet" href="style.css">\n';
    html += '</head>\n<body>\n';

    AppState.sections.forEach(section => {
        const bgStyle = [];
        if (section.bgColor && section.bgColor !== '#ffffff') {
            bgStyle.push(`background-color: ${section.bgColor}`);
        }
        if (section.bgImage) {
            bgStyle.push(`background-image: url(${section.bgImage})`);
            bgStyle.push('background-size: cover');
            bgStyle.push('background-position: center');
        }
        bgStyle.push(`padding-top: ${section.paddingTop}px`);
        bgStyle.push(`padding-bottom: ${section.paddingBottom}px`);

        const idAttr = section.customId ? ` id="${section.customId}"` : '';
        const classAttr = section.customClass ? ` ${section.customClass}` : '';

        html += `    <section${idAttr} class="${classAttr.trim()}" style="${bgStyle.join('; ')}">\n`;
        html += '        <div class="container">\n';
        html += '            <div class="row">\n';

        section.columns.forEach(col => {
            html += `                <div class="col-md-${col.width}">\n`;
            col.components.forEach(comp => {
                html += `                    ${comp.html}\n`;
            });
            html += '                </div>\n';
        });

        html += '            </div>\n';
        html += '        </div>\n';
        html += '    </section>\n';
    });

    html += '\n    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"><\/script>\n';
    html += '    <script src="script.js"><\/script>\n';
    html += '</body>\n</html>';

    return html;
}

function generateCSS() {
    let css = '/* Generated by DragDrop Builder */\n\n';
    css += 'body {\n    margin: 0;\n    padding: 0;\n}\n\n';

    AppState.sections.forEach(section => {
        section.columns.forEach(col => {
            col.components.forEach(comp => {
                if (comp.css) {
                    css += `/* Component: ${comp.name || comp.id} */\n`;
                    css += comp.css + '\n\n';
                }
            });
        });
    });

    return css;
}

function generateJS() {
    let js = '// Generated by DragDrop Builder\n\n';
    js += 'document.addEventListener("DOMContentLoaded", function() {\n';

    AppState.sections.forEach(section => {
        section.columns.forEach(col => {
            col.components.forEach(comp => {
                if (comp.js) {
                    js += `    // Component: ${comp.name || comp.id}\n`;
                    js += `    ${comp.js}\n\n`;
                }
            });
        });
    });

    js += '});\n';
    return js;
}

function copyCode() {
    const code = document.getElementById('codeOutput').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Code copied!', 'success');
    });
}

// ============================================
// EXPORT & SAVE
// ============================================

function exportToHTML() {
    const html = generateHTML();
    const css = generateCSS();
    const js = generateJS();

    // Export main HTML file
    downloadFile('index.html', html, 'text/html');

    // Also export CSS and JS
    setTimeout(() => downloadFile('style.css', css, 'text/css'), 500);
    setTimeout(() => downloadFile('script.js', js, 'text/javascript'), 1000);

    showToast('Website exported! Check your downloads.', 'success');
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveProject() {
    const project = {
        sections: AppState.sections,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('ddBuilder_project', JSON.stringify(project));
    showToast('Project saved!', 'success');
}

function saveAllUnsaved() {
    let count = 0;
    AppState.sections.forEach(section => {
        section.columns.forEach(col => {
            col.components.forEach(comp => {
                if (!comp.savedToLibrary) {
                    const exists = AppState.myComponents.find(c => c.id === comp.originalId);
                    if (!exists) {
                        const newComp = {
                            id: `custom-${Date.now()}-${count}`,
                            name: comp.name || 'Unsaved Component',
                            category: 'custom',
                            tags: ['unsaved', 'custom'],
                            description: 'Saved from canvas',
                            html: comp.html,
                            css: comp.css || '',
                            js: comp.js || ''
                        };
                        AppState.myComponents.push(newComp);
                        comp.savedToLibrary = true;
                        count++;
                    }
                }
            });
        });
    });

    saveMyComponents();
    renderMyComponents();
    showToast(`${count} component(s) saved to My Components!`, 'success');
}

function loadProjectFromData(project) {
    AppState.sections = project.sections;
    AppState.sectionCounter = project.sections.length;

    // Fix component counters
    let maxComp = 0;
    project.sections.forEach(section => {
        section.columns.forEach(col => {
            col.components.forEach(comp => {
                const num = parseInt(comp.id.replace('comp-', ''));
                if (num > maxComp) maxComp = num;
            });
        });
    });
    AppState.componentCounter = maxComp;

    renderCanvas();
    updateCodePanel();
}

function clearCanvas() {
    if (AppState.sections.length === 0) return;
    if (!confirm('Are you sure you want to clear the canvas? This cannot be undone.')) return;

    saveUndoState();
    AppState.sections = [];
    renderCanvas();
    updateCodePanel();
    showToast('Canvas cleared!', 'warning');
}

// ============================================
// TABS
// ============================================

function switchTab(tab) {
    AppState.currentTab = tab;

    // Update nav
    document.getElementById('tab-web-creation').classList.toggle('active', tab === 'web');
    document.getElementById('tab-components').classList.toggle('active', tab === 'components');
    document.getElementById('tab-my-components').classList.toggle('active', tab === 'mycomponents');

    // Show/hide panels
    document.getElementById('web-creation-panel').style.display = tab === 'web' ? 'flex' : 'none';
    document.getElementById('components-panel').style.display = tab === 'components' ? 'block' : 'none';
    document.getElementById('mycomponents-panel').style.display = tab === 'mycomponents' ? 'block' : 'none';

    // Refresh library if switching to it
    if (tab === 'components') renderLibraryComponents();
    if (tab === 'mycomponents') renderMyComponents();
}

// ============================================
// DEVICE PREVIEW
// ============================================

function setPreviewDevice(device) {
    AppState.currentDevice = device;

    document.getElementById('btn-desktop').classList.toggle('active', device === 'desktop');
    document.getElementById('btn-tablet').classList.toggle('active', device === 'tablet');
    document.getElementById('btn-mobile').classList.toggle('active', device === 'mobile');

    const content = document.getElementById('canvas');
    content.className = `canvas device-${device}`;
}

// ============================================
// ZOOM
// ============================================

function zoomIn() {
    if (AppState.zoom >= 150) return;
    AppState.zoom += 10;
    applyZoom();
}

function zoomOut() {
    if (AppState.zoom <= 50) return;
    AppState.zoom -= 10;
    applyZoom();
}

function applyZoom() {
    document.getElementById('canvas').style.transform = `scale(${AppState.zoom / 100})`;
    document.getElementById('canvas').style.transformOrigin = 'top center';
    document.getElementById('zoomLevel').textContent = `${AppState.zoom}%`;
}

// ============================================
// UNDO / REDO
// ============================================

function saveUndoState() {
    AppState.undoStack.push(JSON.stringify(AppState.sections));
    if (AppState.undoStack.length > 50) {
        AppState.undoStack.shift();
    }
    AppState.redoStack = [];
}

function undoAction() {
    if (AppState.undoStack.length === 0) return;
    AppState.redoStack.push(JSON.stringify(AppState.sections));
    AppState.sections = JSON.parse(AppState.undoStack.pop());
    renderCanvas();
    updateCodePanel();
    showToast('Undo!', 'info');
}

function redoAction() {
    if (AppState.redoStack.length === 0) return;
    AppState.undoStack.push(JSON.stringify(AppState.sections));
    AppState.sections = JSON.parse(AppState.redoStack.pop());
    renderCanvas();
    updateCodePanel();
    showToast('Redo!', 'info');
}

// ============================================
// LIBRARY COMPONENTS
// ============================================

function renderLibraryComponents() {
    const container = document.getElementById('libraryComponentsList');
    const search = document.getElementById('librarySearch')?.value?.toLowerCase() || '';
    const category = document.getElementById('libraryCategory')?.value || 'all';
    const tags = document.getElementById('libraryTags')?.value?.toLowerCase().split(',').map(t => t.trim()).filter(Boolean) || [];

    let filtered = LIBRARY_COMPONENTS;

    if (search) {
        filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search) ||
            c.tags.some(t => t.includes(search))
        );
    }

    if (category !== 'all') {
        filtered = filtered.filter(c => c.category === category);
    }

    if (tags.length > 0) {
        filtered = filtered.filter(c =>
            tags.some(tag => c.tags.includes(tag))
        );
    }

    container.innerHTML = filtered.map(comp => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="library-card"
                 draggable="true"
                 ondragstart="handleLibraryDragStart(event, '${comp.id}')">
                <div class="card-preview">
                    <iframe srcdoc="<html><head><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet'><style>body{margin:0;padding:8px;font-size:10px;transform:scale(0.5);transform-origin:top left;width:200%;}</style></head><body>${escapeAttr(comp.html)}</body></html>" sandbox="allow-scripts"></iframe>
                    <div class="preview-overlay"></div>
                </div>
                <div class="card-body">
                    <div class="card-tags">
                        ${comp.tags.slice(0, 3).map(t => `<span class="badge bg-secondary">${t}</span>`).join('')}
                    </div>
                    <h6 class="card-title">${comp.name}</h6>
                    <p class="card-text">${comp.description}</p>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="useLibraryComponent('${comp.id}')">
                            <i class="bi bi-plus-circle me-1"></i>Use
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="editLibraryComponent('${comp.id}')">
                            <i class="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="saveLibraryToMy('${comp.id}')">
                            <i class="bi bi-bookmark me-1"></i>Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterLibrary(query) {
    renderLibraryComponents();
}

function filterByCategory(category) {
    renderLibraryComponents();
}

function filterByTags(tags) {
    renderLibraryComponents();
}

function useLibraryComponent(compId) {
    const comp = LIBRARY_COMPONENTS.find(c => c.id === compId);
    if (!comp) return;

    switchTab('web');

    if (AppState.sections.length === 0) {
        createSection(1);
    }

    const lastSection = AppState.sections[AppState.sections.length - 1];
    const firstCol = lastSection.columns[0];

    addComponentToColumn(lastSection.id, firstCol.id, {
        id: comp.id,
        html: comp.html,
        css: comp.css || '',
        js: comp.js || ''
    });
}

function editLibraryComponent(compId) {
    const comp = LIBRARY_COMPONENTS.find(c => c.id === compId);
    if (!comp) return;

    AppState.editingComponentId = compId;

    document.getElementById('editCompName').value = comp.name || '';
    document.getElementById('editCompHTML').value = comp.html || '';
    document.getElementById('editCompCSS').value = comp.css || '';
    document.getElementById('editCompJS').value = comp.js || '';

    const modal = new bootstrap.Modal(document.getElementById('editComponentModal'));
    modal.show();
    previewEditComponent();
}

function saveLibraryToMy(compId) {
    const comp = LIBRARY_COMPONENTS.find(c => c.id === compId);
    if (!comp) return;

    const exists = AppState.myComponents.find(c => c.id === comp.id);
    if (exists) {
        showToast('Already in your components!', 'warning');
        return;
    }

    AppState.myComponents.push({ ...comp });
    saveMyComponents();
    renderMyComponents();
    showToast('Added to My Components!', 'success');
}

// ============================================
// MY COMPONENTS
// ============================================

function renderMyComponents() {
    const container = document.getElementById('myComponentsList');

    if (AppState.myComponents.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-bookmark display-1 text-muted"></i>
                <h4 class="text-muted mt-3">No Saved Components</h4>
                <p class="text-muted">Create a new component or save one from the library.</p>
                <button class="btn btn-primary" onclick="openCreateComponentModal()">
                    <i class="bi bi-plus-circle me-1"></i>Create Component
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = AppState.myComponents.map(comp => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="library-card"
                 draggable="true"
                 ondragstart="handleLibraryDragStart(event, '${comp.id}')">
                <div class="card-preview">
                    <iframe srcdoc="<html><head><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css' rel='stylesheet'><style>body{margin:0;padding:8px;font-size:10px;transform:scale(0.5);transform-origin:top left;width:200%;}</style></head><body>${escapeAttr(comp.html)}</body></html>" sandbox="allow-scripts"></iframe>
                    <div class="preview-overlay"></div>
                </div>
                <div class="card-body">
                    <div class="card-tags">
                        ${(comp.tags || []).slice(0, 3).map(t => `<span class="badge bg-secondary">${t}</span>`).join('')}
                    </div>
                    <h6 class="card-title">${comp.name}</h6>
                    <p class="card-text">${comp.description || 'Custom component'}</p>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="useMyComponent('${comp.id}')">
                            <i class="bi bi-plus-circle me-1"></i>Use
                        </button>
                        <button class="btn btn-sm btn-outline-info" onclick="editMyComponent('${comp.id}')">
                            <i class="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteMyComponent('${comp.id}')">
                            <i class="bi bi-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function useMyComponent(compId) {
    const comp = AppState.myComponents.find(c => c.id === compId);
    if (!comp) return;

    switchTab('web');

    if (AppState.sections.length === 0) {
        createSection(1);
    }

    const lastSection = AppState.sections[AppState.sections.length - 1];
    const firstCol = lastSection.columns[0];

    addComponentToColumn(lastSection.id, firstCol.id, {
        id: comp.id,
        html: comp.html,
        css: comp.css || '',
        js: comp.js || ''
    });
}

function editMyComponent(compId) {
    const comp = AppState.myComponents.find(c => c.id === compId);
    if (!comp) return;

    AppState.editingComponentId = compId;

    document.getElementById('editCompName').value = comp.name || '';
    document.getElementById('editCompCategory').value = comp.category || 'custom';
    document.getElementById('editCompTags').value = (comp.tags || []).join(', ');
    document.getElementById('editCompHTML').value = comp.html || '';
    document.getElementById('editCompCSS').value = comp.css || '';
    document.getElementById('editCompJS').value = comp.js || '';

    const modal = new bootstrap.Modal(document.getElementById('editComponentModal'));
    modal.show();
    previewEditComponent();
}

function deleteMyComponent(compId) {
    if (!confirm('Delete this component?')) return;
    AppState.myComponents = AppState.myComponents.filter(c => c.id !== compId);
    saveMyComponents();
    renderMyComponents();
    showToast('Component deleted!', 'warning');
}

function openCreateComponentModal() {
    document.getElementById('newCompName').value = '';
    document.getElementById('newCompCategory').value = 'custom';
    document.getElementById('newCompTags').value = '';
    document.getElementById('newCompHTML').value = '';
    document.getElementById('newCompCSS').value = '';
    document.getElementById('newCompJS').value = '';
    document.getElementById('newCompPreview').innerHTML = '';

    const modal = new bootstrap.Modal(document.getElementById('createComponentModal'));
    modal.show();
}

function previewNewComponent() {
    const html = document.getElementById('newCompHTML').value;
    const css = document.getElementById('newCompCSS').value;
    const preview = document.getElementById('newCompPreview');

    preview.innerHTML = `<style>${css}</style>${html}`;
}

function saveNewComponent() {
    const name = document.getElementById('newCompName').value.trim();
    const category = document.getElementById('newCompCategory').value;
    const tags = document.getElementById('newCompTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const html = document.getElementById('newCompHTML').value.trim();
    const css = document.getElementById('newCompCSS').value.trim();
    const js = document.getElementById('newCompJS').value.trim();

    if (!name || !html) {
        showToast('Name and HTML are required!', 'danger');
        return;
    }

    const newComp = {
        id: `custom-${Date.now()}`,
        name,
        category,
        tags,
        description: `Custom ${category} component`,
        html,
        css,
        js
    };

    AppState.myComponents.push(newComp);
    saveMyComponents();
    renderMyComponents();

    bootstrap.Modal.getInstance(document.getElementById('createComponentModal')).hide();
    showToast('Component created and saved!', 'success');
}

function importComponents() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const components = JSON.parse(ev.target.result);
                if (Array.isArray(components)) {
                    AppState.myComponents.push(...components);
                    saveMyComponents();
                    renderMyComponents();
                    showToast(`Imported ${components.length} components!`, 'success');
                }
            } catch (err) {
                showToast('Invalid file!', 'danger');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function exportComponents() {
    if (AppState.myComponents.length === 0) {
        showToast('No components to export!', 'warning');
        return;
    }
    downloadFile('my-components.json', JSON.stringify(AppState.myComponents, null, 2), 'application/json');
    showToast('Components exported!', 'success');
}

// ============================================
// PERSISTENCE
// ============================================

function saveMyComponents() {
    localStorage.setItem('ddBuilder_myComponents', JSON.stringify(AppState.myComponents));
}

function loadSavedState() {
    const saved = localStorage.getItem('ddBuilder_myComponents');
    if (saved) {
        try {
            AppState.myComponents = JSON.parse(saved);
        } catch (e) {
            AppState.myComponents = [];
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeAttr(str) {
    return str.replace(/"/g, '"').replace(/'/g, ''').replace(/\n/g, '\\n');
}

function decodeAttr(str) {
    return str.replace(/"/g, '"').replace(/'/g, "'").replace(/\\n/g, '\n');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const id = `toast-${Date.now()}`;

    const toastHtml = `
        <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', toastHtml);
    const toastEl = document.getElementById(id);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

function previewComponent(html) {
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Component Preview</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" rel="stylesheet">
        </head>
        <body class="p-4">
            ${html}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"><\/script>
        </body>
        </html>
    `);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoAction();
    }
    // Ctrl+Shift+Z for redo
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        redoAction();
    }
    // Ctrl+S for save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveProject();
    }
    // Delete selected component
    if (e.key === 'Delete' && AppState.selectedComponent) {
        deleteComponent(AppState.selectedComponent);
        AppState.selectedComponent = null;
    }
});
