/* =============================================
   DragDrop Builder - Component Definitions
   ============================================= */

// ============================================
// SIDEBAR COMPONENTS (Draggable items)
// ============================================

const COMPONENT_CATEGORIES = [
    {
        id: 'layout',
        name: 'Layout',
        icon: 'bi-grid-3x3-gap',
        items: [
            {
                id: 'section',
                name: 'Section',
                icon: 'bi-square',
                type: 'layout',
                html: '<section class="py-5"><div class="container"><!-- Section content --></div></section>',
                description: 'A full-width section container'
            },
            {
                id: 'container',
                name: 'Container',
                icon: 'bi-box',
                type: 'layout',
                html: '<div class="container py-3"><!-- Container content --></div>'
            },
            {
                id: 'container-fluid',
                name: 'Container Fluid',
                icon: 'bi-arrows-fullscreen',
                type: 'layout',
                html: '<div class="container-fluid py-3"><!-- Full-width container --></div>'
            },
            {
                id: 'div',
                name: 'Div',
                icon: 'bi-square',
                type: 'layout',
                html: '<div class="p-3"><!-- Custom div --></div>'
            },
            {
                id: 'row',
                name: 'Row',
                icon: 'bi-distribute-horizontal',
                type: 'layout',
                html: '<div class="row"><div class="col-md-6"><p>Column 1</p></div><div class="col-md-6"><p>Column 2</p></div></div>'
            },
            {
                id: 'col-1',
                name: '1 Column',
                icon: 'bi-distribute-vertical',
                type: 'layout',
                html: '<div class="row"><div class="col-12"><p>Full width column</p></div></div>'
            },
            {
                id: 'col-2',
                name: '2 Columns',
                icon: 'bi-columns',
                type: 'layout',
                html: '<div class="row"><div class="col-md-6"><p>Column 1</p></div><div class="col-md-6"><p>Column 2</p></div></div>'
            },
            {
                id: 'col-3',
                name: '3 Columns',
                icon: 'bi-grid-3x3',
                type: 'layout',
                html: '<div class="row"><div class="col-md-4"><p>Column 1</p></div><div class="col-md-4"><p>Column 2</p></div><div class="col-md-4"><p>Column 3</p></div></div>'
            },
            {
                id: 'col-4',
                name: '4 Columns',
                icon: 'bi-grid',
                type: 'layout',
                html: '<div class="row"><div class="col-md-3"><p>Col 1</p></div><div class="col-md-3"><p>Col 2</p></div><div class="col-md-3"><p>Col 3</p></div><div class="col-md-3"><p>Col 4</p></div></div>'
            },
            {
                id: 'col-sidebar',
                name: 'Sidebar Layout',
                icon: 'bi-layout-sidebar',
                type: 'layout',
                html: '<div class="row"><div class="col-md-3"><p>Sidebar</p></div><div class="col-md-9"><p>Main Content</p></div></div>'
            },
            {
                id: 'spacer',
                name: 'Spacer',
                icon: 'bi-distribute-vertical',
                type: 'layout',
                html: '<div style="height: 40px;"></div>'
            },
            {
                id: 'divider',
                name: 'Divider',
                icon: 'bi-dash-lg',
                type: 'layout',
                html: '<hr class="my-4">'
            }
        ]
    },
    {
        id: 'typography',
        name: 'Typography',
        icon: 'bi-fonts',
        items: [
            {
                id: 'heading-h1',
                name: 'Heading H1',
                icon: 'bi-type-h1',
                type: 'text',
                html: '<h1 contenteditable="true">Heading 1</h1>'
            },
            {
                id: 'heading-h2',
                name: 'Heading H2',
                icon: 'bi-type-h2',
                type: 'text',
                html: '<h2 contenteditable="true">Heading 2</h2>'
            },
            {
                id: 'heading-h3',
                name: 'Heading H3',
                icon: 'bi-type-h3',
                type: 'text',
                html: '<h3 contenteditable="true">Heading 3</h3>'
            },
            {
                id: 'heading-h4',
                name: 'Heading H4',
                icon: 'bi-type',
                type: 'text',
                html: '<h4 contenteditable="true">Heading 4</h4>'
            },
            {
                id: 'heading-h5',
                name: 'Heading H5',
                icon: 'bi-type',
                type: 'text',
                html: '<h5 contenteditable="true">Heading 5</h5>'
            },
            {
                id: 'heading-h6',
                name: 'Heading H6',
                icon: 'bi-type',
                type: 'text',
                html: '<h6 contenteditable="true">Heading 6</h6>'
            },
            {
                id: 'paragraph',
                name: 'Paragraph',
                icon: 'bi-text-paragraph',
                type: 'text',
                html: '<p contenteditable="true">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'
            },
            {
                id: 'lead-text',
                name: 'Lead Text',
                icon: 'bi-text-left',
                type: 'text',
                html: '<p class="lead" contenteditable="true">This is a lead paragraph. It stands out from regular paragraphs.</p>'
            },
            {
                id: 'blockquote',
                name: 'Blockquote',
                icon: 'bi-chat-square-quote',
                type: 'text',
                html: '<blockquote class="blockquote"><p contenteditable="true">"A well-known quote, contained in a blockquote element."</p><footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer></blockquote>'
            },
            {
                id: 'display-text',
                name: 'Display Heading',
                icon: 'bi-badge-hd',
                type: 'text',
                html: '<h1 class="display-1" contenteditable="true">Display 1</h1>'
            },
            {
                id: 'small-text',
                name: 'Small Text',
                icon: 'bi-type-underline',
                type: 'text',
                html: '<p><small contenteditable="true">This is small text for fine print or disclaimers.</small></p>'
            },
            {
                id: 'mark-text',
                name: 'Highlighted Text',
                icon: 'bi-highlighter',
                type: 'text',
                html: '<p contenteditable="true">Use the mark tag to <mark>highlight</mark> text.</p>'
            },
            {
                id: 'text-muted',
                name: 'Muted Text',
                icon: 'bi-water',
                type: 'text',
                html: '<p class="text-muted" contenteditable="true">This is muted text, often used for secondary information.</p>'
            },
            {
                id: 'text-center',
                name: 'Centered Text',
                icon: 'bi-text-center',
                type: 'text',
                html: '<p class="text-center" contenteditable="true">This text is center-aligned.</p>'
            },
            {
                id: 'text-right',
                name: 'Right Text',
                icon: 'bi-text-right',
                type: 'text',
                html: '<p class="text-end" contenteditable="true">This text is right-aligned.</p>'
            },
            {
                id: 'initialism',
                name: 'Abbreviation',
                icon: 'bi-alphabet-uppercase',
                type: 'text',
                html: '<p><abbr title="attribute" class="initialism" contenteditable="true">attr</abbr></p>'
            },
            {
                id: 'list-unstyled',
                name: 'Unstyled List',
                icon: 'bi-list-ul',
                type: 'text',
                html: '<ul class="list-unstyled"><li contenteditable="true">Item 1</li><li contenteditable="true">Item 2</li><li contenteditable="true">Item 3</li></ul>'
            },
            {
                id: 'list-inline',
                name: 'Inline List',
                icon: 'bi-list-nested',
                type: 'text',
                html: '<ul class="list-inline"><li class="list-inline-item" contenteditable="true">Item 1</li><li class="list-inline-item" contenteditable="true">Item 2</li><li class="list-inline-item" contenteditable="true">Item 3</li></ul>'
            }
        ]
    },
    {
        id: 'buttons',
        name: 'Buttons',
        icon: 'bi-hand-index-thumb',
        items: [
            {
                id: 'btn-primary',
                name: 'Primary Button',
                icon: 'bi-square-fill',
                type: 'button',
                html: '<button class="btn btn-primary" contenteditable="true">Primary Button</button>'
            },
            {
                id: 'btn-secondary',
                name: 'Secondary Button',
                icon: 'bi-square',
                type: 'button',
                html: '<button class="btn btn-secondary" contenteditable="true">Secondary Button</button>'
            },
            {
                id: 'btn-success',
                name: 'Success Button',
                icon: 'bi-check-circle',
                type: 'button',
                html: '<button class="btn btn-success" contenteditable="true">Success Button</button>'
            },
            {
                id: 'btn-danger',
                name: 'Danger Button',
                icon: 'bi-x-circle',
                type: 'button',
                html: '<button class="btn btn-danger" contenteditable="true">Danger Button</button>'
            },
            {
                id: 'btn-warning',
                name: 'Warning Button',
                icon: 'bi-exclamation-triangle',
                type: 'button',
                html: '<button class="btn btn-warning" contenteditable="true">Warning Button</button>'
            },
            {
                id: 'btn-info',
                name: 'Info Button',
                icon: 'bi-info-circle',
                type: 'button',
                html: '<button class="btn btn-info" contenteditable="true">Info Button</button>'
            },
            {
                id: 'btn-light',
                name: 'Light Button',
                icon: 'bi-brightness-high',
                type: 'button',
                html: '<button class="btn btn-light" contenteditable="true">Light Button</button>'
            },
            {
                id: 'btn-dark',
                name: 'Dark Button',
                icon: 'bi-moon',
                type: 'button',
                html: '<button class="btn btn-dark" contenteditable="true">Dark Button</button>'
            },
            {
                id: 'btn-outline-primary',
                name: 'Outline Primary',
                icon: 'bi-square',
                type: 'button',
                html: '<button class="btn btn-outline-primary" contenteditable="true">Outline Primary</button>'
            },
            {
                id: 'btn-lg',
                name: 'Large Button',
                icon: 'bi-plus-square',
                type: 'button',
                html: '<button class="btn btn-primary btn-lg" contenteditable="true">Large Button</button>'
            },
            {
                id: 'btn-sm',
                name: 'Small Button',
                icon: 'bi-dash-square',
                type: 'button',
                html: '<button class="btn btn-primary btn-sm" contenteditable="true">Small Button</button>'
            },
            {
                id: 'btn-group',
                name: 'Button Group',
                icon: 'bi-segmented-nav',
                type: 'button',
                html: '<div class="btn-group"><button class="btn btn-primary" contenteditable="true">Left</button><button class="btn btn-primary" contenteditable="true">Middle</button><button class="btn btn-primary" contenteditable="true">Right</button></div>'
            },
            {
                id: 'btn-icon',
                name: 'Icon Button',
                icon: 'bi-hand-index',
                type: 'button',
                html: '<button class="btn btn-primary"><i class="bi bi-heart me-1"></i><span contenteditable="true">Like</span></button>'
            },
            {
                id: 'btn-link',
                name: 'Link Button',
                icon: 'bi-link-45deg',
                type: 'button',
                html: '<button class="btn btn-link" contenteditable="true">Link Button</button>'
            },
            {
                id: 'btn-toolbar',
                name: 'Button Toolbar',
                icon: 'bi-ui-checks',
                type: 'button',
                html: '<div class="btn-toolbar"><div class="btn-group me-2"><button class="btn btn-outline-secondary btn-sm">1</button><button class="btn btn-outline-secondary btn-sm">2</button><button class="btn btn-outline-secondary btn-sm">3</button></div><div class="btn-group me-2"><button class="btn btn-outline-secondary btn-sm">4</button><button class="btn btn-outline-secondary btn-sm">5</button></div><button class="btn btn-outline-secondary btn-sm">6</button></div>'
            }
        ]
    },
    {
        id: 'forms',
        name: 'Forms & Inputs',
        icon: 'bi-ui-checks',
        items: [
            {
                id: 'text-input',
                name: 'Text Input',
                icon: 'bi-input-cursor-text',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Text Input</label><input type="text" class="form-control" placeholder="Enter text..."></div>'
            },
            {
                id: 'email-input',
                name: 'Email Input',
                icon: 'bi-envelope',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Email</label><input type="email" class="form-control" placeholder="name@example.com"></div>'
            },
            {
                id: 'password-input',
                name: 'Password Input',
                icon: 'bi-lock',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Password</label><input type="password" class="form-control" placeholder="Password"></div>'
            },
            {
                id: 'textarea',
                name: 'Textarea',
                icon: 'bi-textarea-resize',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Textarea</label><textarea class="form-control" rows="3" placeholder="Write something..."></textarea></div>'
            },
            {
                id: 'select',
                name: 'Select Dropdown',
                icon: 'bi-menu-button-wide',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Select</label><select class="form-select"><option selected>Choose...</option><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option></select></div>'
            },
            {
                id: 'checkbox',
                name: 'Checkbox',
                icon: 'bi-check-square',
                type: 'form',
                html: '<div class="form-check"><input class="form-check-input" type="checkbox" id="check1"><label class="form-check-label" for="check1" contenteditable="true">Check this option</label></div>'
            },
            {
                id: 'radio',
                name: 'Radio Buttons',
                icon: 'bi-record-circle',
                type: 'form',
                html: '<div><div class="form-check"><input class="form-check-input" type="radio" name="radioGroup" id="radio1" checked><label class="form-check-label" for="radio1" contenteditable="true">Option 1</label></div><div class="form-check"><input class="form-check-input" type="radio" name="radioGroup" id="radio2"><label class="form-check-label" for="radio2" contenteditable="true">Option 2</label></div><div class="form-check"><input class="form-check-input" type="radio" name="radioGroup" id="radio3"><label class="form-check-label" for="radio3" contenteditable="true">Option 3</label></div></div>'
            },
            {
                id: 'switch',
                name: 'Switch Toggle',
                icon: 'bi-toggle-on',
                type: 'form',
                html: '<div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="switch1"><label class="form-check-label" for="switch1" contenteditable="true">Toggle switch</label></div>'
            },
            {
                id: 'range',
                name: 'Range Slider',
                icon: 'bi-sliders',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Range</label><input type="range" class="form-range" min="0" max="100"></div>'
            },
            {
                id: 'file-input',
                name: 'File Upload',
                icon: 'bi-upload',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">File upload</label><input class="form-control" type="file"></div>'
            },
            {
                id: 'input-group',
                name: 'Input Group',
                icon: 'bi-input-cursor',
                type: 'form',
                html: '<div class="mb-3"><div class="input-group"><span class="input-group-text">@</span><input type="text" class="form-control" placeholder="Username"></div></div>'
            },
            {
                id: 'form-floating',
                name: 'Floating Label',
                icon: 'bi-input-cursor-text',
                type: 'form',
                html: '<div class="form-floating mb-3"><input type="text" class="form-control" id="floatingInput" placeholder="Name"><label for="floatingInput" contenteditable="true">Name</label></div>'
            },
            {
                id: 'search-input',
                name: 'Search Input',
                icon: 'bi-search',
                type: 'form',
                html: '<div class="mb-3"><div class="input-group"><input type="text" class="form-control" placeholder="Search..."><button class="btn btn-primary" type="button"><i class="bi bi-search"></i></button></div></div>'
            },
            {
                id: 'date-input',
                name: 'Date Input',
                icon: 'bi-calendar',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Date</label><input type="date" class="form-control"></div>'
            },
            {
                id: 'number-input',
                name: 'Number Input',
                icon: 'bi-123',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Quantity</label><input type="number" class="form-control" value="1" min="0" max="100"></div>'
            },
            {
                id: 'color-input',
                name: 'Color Picker',
                icon: 'bi-palette',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Color</label><input type="color" class="form-control form-control-color" value="#0d6efd"></div>'
            },
            {
                id: 'validation-input',
                name: 'Validated Input',
                icon: 'bi-check-circle',
                type: 'form',
                html: '<div class="mb-3"><label class="form-label" contenteditable="true">Valid Input</label><input type="text" class="form-control is-valid" value="Looks good!"><div class="valid-feedback">Looks good!</div></div>'
            },
            {
                id: 'form-horizontal',
                name: 'Horizontal Form',
                icon: 'bi-layout-text-sidebar',
                type: 'form',
                html: '<div class="row mb-3"><label class="col-sm-3 col-form-label" contenteditable="true">Email</label><div class="col-sm-9"><input type="email" class="form-control" placeholder="email@example.com"></div></div>'
            }
        ]
    },
    {
        id: 'navbars',
        name: 'Navigation',
        icon: 'bi-menu-button-wide',
        items: [
            {
                id: 'navbar-basic',
                name: 'Basic Navbar',
                icon: 'bi-menu-app',
                type: 'navigation',
                html: '<nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded"><div class="container-fluid"><a class="navbar-brand" href="#" contenteditable="true">Brand</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBasic"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navBasic"><ul class="navbar-nav me-auto"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Home</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">About</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Contact</a></li></ul></div></div></nav>',
                css: '',
                js: ''
            },
            {
                id: 'navbar-brand-primary',
                name: 'Primary Navbar',
                icon: 'bi-menu-app-fill',
                type: 'navigation',
                html: '<nav class="navbar navbar-expand-lg navbar-dark bg-primary rounded"><div class="container-fluid"><a class="navbar-brand fw-bold" href="#" contenteditable="true">BrandName</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navPrimary"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navPrimary"><ul class="navbar-nav me-auto"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Home</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Features</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Pricing</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">About</a></li></ul><form class="d-flex"><input class="form-control form-control-sm me-2" type="search" placeholder="Search"><button class="btn btn-outline-light btn-sm" type="submit">Search</button></form></div></div></nav>'
            },
            {
                id: 'navbar-light',
                name: 'Light Navbar',
                icon: 'bi-brightness-high',
                type: 'navigation',
                html: '<nav class="navbar navbar-expand-lg navbar-light bg-light rounded"><div class="container-fluid"><a class="navbar-brand fw-bold" href="#" contenteditable="true">Brand</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLight"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navLight"><ul class="navbar-nav me-auto"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Home</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Services</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Portfolio</a></li></ul><a class="btn btn-primary btn-sm" href="#" contenteditable="true">Sign Up</a></div></div></nav>'
            },
            {
                id: 'breadcrumb',
                name: 'Breadcrumb',
                icon: 'bi-chevron-right',
                type: 'navigation',
                html: '<nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#" contenteditable="true">Home</a></li><li class="breadcrumb-item"><a href="#" contenteditable="true">Library</a></li><li class="breadcrumb-item active" aria-current="page" contenteditable="true">Data</li></ol></nav>'
            },
            {
                id: 'nav-tabs',
                name: 'Nav Tabs',
                icon: 'bi-folder',
                type: 'navigation',
                html: '<ul class="nav nav-tabs"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Active</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Link</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Link</a></li><li class="nav-item"><a class="nav-link disabled" href="#" contenteditable="true">Disabled</a></li></ul>'
            },
            {
                id: 'nav-pills',
                name: 'Nav Pills',
                icon: 'bi-capsule',
                type: 'navigation',
                html: '<ul class="nav nav-pills"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Active</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Link</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Link</a></li></ul>'
            },
            {
                id: 'pagination',
                name: 'Pagination',
                icon: 'bi-three-dots',
                type: 'navigation',
                html: '<nav aria-label="Page navigation"><ul class="pagination"><li class="page-item"><a class="page-link" href="#">Previous</a></li><li class="page-item active"><a class="page-link" href="#">1</a></li><li class="page-item"><a class="page-link" href="#">2</a></li><li class="page-item"><a class="page-link" href="#">3</a></li><li class="page-item"><a class="page-link" href="#">Next</a></li></ul></nav>'
            },
            {
                id: 'sidebar-nav',
                name: 'Sidebar Nav',
                icon: 'bi-layout-sidebar',
                type: 'navigation',
                html: '<div class="list-group"><a href="#" class="list-group-item list-group-item-action active" contenteditable="true">Dashboard</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">Orders</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">Products</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">Customers</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">Reports</a></div>'
            }
        ]
    },
    {
        id: 'cards-sections',
        name: 'Cards',
        icon: 'bi-card-heading',
        items: [
            {
                id: 'card-basic',
                name: 'Basic Card',
                icon: 'bi-card-text',
                type: 'card',
                html: '<div class="card"><div class="card-body"><h5 class="card-title" contenteditable="true">Card Title</h5><p class="card-text" contenteditable="true">Some quick example text to build on the card title and make up the bulk of the card\'s content.</p><a href="#" class="btn btn-primary" contenteditable="true">Go somewhere</a></div></div>'
            },
            {
                id: 'card-image',
                name: 'Card with Image',
                icon: 'bi-card-image',
                type: 'card',
                html: '<div class="card"><img src="https://via.placeholder.com/400x200/0d6efd/ffffff?text=Card+Image" class="card-img-top" alt="Card image"><div class="card-body"><h5 class="card-title" contenteditable="true">Card Title</h5><p class="card-text" contenteditable="true">Some quick example text for the card.</p><a href="#" class="btn btn-primary" contenteditable="true">Read More</a></div></div>'
            },
            {
                id: 'card-horizontal',
                name: 'Horizontal Card',
                icon: 'bi-card-image',
                type: 'card',
                html: '<div class="card mb-3"><div class="row g-0"><div class="col-md-4"><img src="https://via.placeholder.com/300x250/198754/ffffff?text=Image" class="img-fluid rounded-start" alt="..."></div><div class="col-md-8"><div class="card-body"><h5 class="card-title" contenteditable="true">Card Title</h5><p class="card-text" contenteditable="true">This is a wider card with supporting text below as a natural lead-in.</p><p class="card-text"><small class="text-muted" contenteditable="true">Last updated 3 mins ago</small></p></div></div></div></div>'
            },
            {
                id: 'card-group',
                name: 'Card Group',
                icon: 'bi-columns',
                type: 'card',
                html: '<div class="card-group"><div class="card"><img src="https://via.placeholder.com/300x180/0d6efd/fff?text=1" class="card-img-top"><div class="card-body"><h5 class="card-title" contenteditable="true">Card 1</h5><p class="card-text" contenteditable="true">This is a wider card with text below.</p></div></div><div class="card"><img src="https://via.placeholder.com/300x180/198754/fff?text=2" class="card-img-top"><div class="card-body"><h5 class="card-title" contenteditable="true">Card 2</h5><p class="card-text" contenteditable="true">This is a wider card with text below.</p></div></div><div class="card"><img src="https://via.placeholder.com/300x180/dc3545/fff?text=3" class="card-img-top"><div class="card-body"><h5 class="card-title" contenteditable="true">Card 3</h5><p class="card-text" contenteditable="true">This is a wider card with text below.</p></div></div></div>'
            },
            {
                id: 'card-overlay',
                name: 'Image Overlay Card',
                icon: 'bi-card-image',
                type: 'card',
                html: '<div class="card text-bg-dark"><img src="https://via.placeholder.com/400x200/333/fff?text=Background" class="card-img" alt="..."><div class="card-img-overlay"><h5 class="card-title" contenteditable="true">Card Title</h5><p class="card-text" contenteditable="true">This is a wider card with text as a natural lead-in to additional content.</p><p class="card-text"><small contenteditable="true">Last updated 3 mins ago</small></p></div></div>'
            },
            {
                id: 'card-profile',
                name: 'Profile Card',
                icon: 'bi-person',
                type: 'card',
                html: '<div class="card text-center"><div class="card-body"><img src="https://via.placeholder.com/100/0d6efd/fff?text=AV" class="rounded-circle mb-3" alt="Avatar"><h5 class="card-title" contenteditable="true">John Doe</h5><p class="text-muted" contenteditable="true">Web Developer</p><p class="card-text" contenteditable="true">Some quick example text to build on the card title.</p><div class="d-flex justify-content-center gap-2"><a href="#" class="btn btn-primary btn-sm" contenteditable="true">Follow</a><a href="#" class="btn btn-outline-primary btn-sm" contenteditable="true">Message</a></div></div></div>'
            },
            {
                id: 'card-pricing',
                name: 'Pricing Card',
                icon: 'bi-tag',
                type: 'card',
                html: '<div class="card text-center"><div class="card-header bg-primary text-white"><h5 class="my-0" contenteditable="true">Pro Plan</h5></div><div class="card-body"><h1 class="card-title pricing-card-title">$29<small class="text-muted fw-light" contenteditable="true">/mo</small></h1><ul class="list-unstyled mt-3 mb-4"><li contenteditable="true">20 users included</li><li contenteditable="true">10 GB of storage</li><li contenteditable="true">Priority email support</li><li contenteditable="true">Help center access</li></ul><button type="button" class="btn btn-lg btn-block btn-primary" contenteditable="true">Get started</button></div></div>'
            },
            {
                id: 'card-testimonial',
                name: 'Testimonial Card',
                icon: 'bi-chat-quote',
                type: 'card',
                html: '<div class="card"><div class="card-body p-4"><div class="d-flex mb-3"><img src="https://via.placeholder.com/50/0d6efd/fff?text=JD" class="rounded-circle me-3" alt="Avatar"><div><h6 class="mb-0" contenteditable="true">Jane Doe</h6><small class="text-muted" contenteditable="true">CEO, Company</small></div></div><p class="card-text" contenteditable="true"><i class="bi bi-quote text-primary"></i> This product has completely transformed how we work. Highly recommended!</p><div class="text-warning"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div></div></div>'
            }
        ]
    },
    {
        id: 'tables',
        name: 'Tables',
        icon: 'bi-table',
        items: [
            {
                id: 'table-basic',
                name: 'Basic Table',
                icon: 'bi-table',
                type: 'table',
                html: '<div class="table-responsive"><table class="table"><thead><tr><th contenteditable="true">#</th><th contenteditable="true">First</th><th contenteditable="true">Last</th><th contenteditable="true">Handle</th></tr></thead><tbody><tr><td contenteditable="true">1</td><td contenteditable="true">Mark</td><td contenteditable="true">Otto</td><td contenteditable="true">@mdo</td></tr><tr><td contenteditable="true">2</td><td contenteditable="true">Jacob</td><td contenteditable="true">Thornton</td><td contenteditable="true">@fat</td></tr><tr><td contenteditable="true">3</td><td contenteditable="true">Larry</td><td contenteditable="true">the Bird</td><td contenteditable="true">@twitter</td></tr></tbody></table></div>'
            },
            {
                id: 'table-striped',
                name: 'Striped Table',
                icon: 'bi-table',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-striped"><thead><tr><th contenteditable="true">#</th><th contenteditable="true">Name</th><th contenteditable="true">Email</th><th contenteditable="true">Role</th></tr></thead><tbody><tr><td contenteditable="true">1</td><td contenteditable="true">John Doe</td><td contenteditable="true">john@example.com</td><td contenteditable="true">Admin</td></tr><tr><td contenteditable="true">2</td><td contenteditable="true">Jane Smith</td><td contenteditable="true">jane@example.com</td><td contenteditable="true">Editor</td></tr><tr><td contenteditable="true">3</td><td contenteditable="true">Bob Wilson</td><td contenteditable="true">bob@example.com</td><td contenteditable="true">Viewer</td></tr></tbody></table></div>'
            },
            {
                id: 'table-dark',
                name: 'Dark Table',
                icon: 'bi-table',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-dark table-striped"><thead><tr><th contenteditable="true">Product</th><th contenteditable="true">Price</th><th contenteditable="true">Stock</th></tr></thead><tbody><tr><td contenteditable="true">Widget A</td><td contenteditable="true">$29.99</td><td contenteditable="true">150</td></tr><tr><td contenteditable="true">Widget B</td><td contenteditable="true">$49.99</td><td contenteditable="true">85</td></tr><tr><td contenteditable="true">Widget C</td><td contenteditable="true">$19.99</td><td contenteditable="true">300</td></tr></tbody></table></div>'
            },
            {
                id: 'table-bordered',
                name: 'Bordered Table',
                icon: 'bi-table',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-bordered"><thead><tr><th contenteditable="true">Item</th><th contenteditable="true">Quantity</th><th contenteditable="true">Price</th><th contenteditable="true">Total</th></tr></thead><tbody><tr><td contenteditable="true">Apples</td><td contenteditable="true">5</td><td contenteditable="true">$2.00</td><td contenteditable="true">$10.00</td></tr><tr><td contenteditable="true">Oranges</td><td contenteditable="true">3</td><td contenteditable="true">$3.50</td><td contenteditable="true">$10.50</td></tr></tbody><tfoot><tr><td colspan="3" class="text-end"><strong contenteditable="true">Total:</strong></td><td><strong contenteditable="true">$20.50</strong></td></tr></tfoot></table></div>'
            },
            {
                id: 'table-hover',
                name: 'Hover Table',
                icon: 'bi-cursor',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-hover"><thead class="table-light"><tr><th contenteditable="true">ID</th><th contenteditable="true">Name</th><th contenteditable="true">Department</th><th contenteditable="true">Status</th></tr></thead><tbody><tr><td contenteditable="true">001</td><td contenteditable="true">Alice Johnson</td><td contenteditable="true">Engineering</td><td><span class="badge bg-success" contenteditable="true">Active</span></td></tr><tr><td contenteditable="true">002</td><td contenteditable="true">Bob Smith</td><td contenteditable="true">Marketing</td><td><span class="badge bg-warning" contenteditable="true">Away</span></td></tr><tr><td contenteditable="true">003</td><td contenteditable="true">Carol White</td><td contenteditable="true">HR</td><td><span class="badge bg-danger" contenteditable="true">Inactive</span></td></tr></tbody></table></div>'
            },
            {
                id: 'table-small',
                name: 'Compact Table',
                icon: 'bi-table',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-sm table-bordered"><thead><tr><th contenteditable="true">#</th><th contenteditable="true">Name</th><th contenteditable="true">Value</th></tr></thead><tbody><tr><td contenteditable="true">1</td><td contenteditable="true">Metric A</td><td contenteditable="true">1,234</td></tr><tr><td contenteditable="true">2</td><td contenteditable="true">Metric B</td><td contenteditable="true">5,678</td></tr><tr><td contenteditable="true">3</td><td contenteditable="true">Metric C</td><td contenteditable="true">9,012</td></tr><tr><td contenteditable="true">4</td><td contenteditable="true">Metric D</td><td contenteditable="true">3,456</td></tr></tbody></table></div>'
            },
            {
                id: 'editable-table',
                name: 'Editable Table',
                icon: 'bi-pencil-square',
                type: 'table',
                html: '<div class="table-responsive"><table class="table table-bordered"><thead class="table-dark"><tr><th contenteditable="true">Column 1</th><th contenteditable="true">Column 2</th><th contenteditable="true">Column 3</th></tr></thead><tbody><tr><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td></tr><tr><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td></tr><tr><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td><td contenteditable="true">Click to edit</td></tr></tbody></table></div>',
                description: 'All cells are directly editable by clicking'
            }
        ]
    },
    {
        id: 'media',
        name: 'Media',
        icon: 'bi-image',
        items: [
            {
                id: 'image',
                name: 'Image',
                icon: 'bi-card-image',
                type: 'media',
                html: '<img src="https://via.placeholder.com/600x300/6c757d/ffffff?text=Image" class="img-fluid rounded" alt="Responsive image">'
            },
            {
                id: 'image-rounded',
                name: 'Rounded Image',
                icon: 'bi-image',
                type: 'media',
                html: '<img src="https://via.placeholder.com/400x300/198754/fff?text=Rounded" class="img-fluid rounded-3" alt="Rounded image">'
            },
            {
                id: 'image-circle',
                name: 'Circle Image',
                icon: 'bi-circle',
                type: 'media',
                html: '<div class="text-center"><img src="https://via.placeholder.com/200/0d6efd/fff?text=Circle" class="rounded-circle" width="150" height="150" alt="Circle image"></div>'
            },
            {
                id: 'image-thumbnail',
                name: 'Thumbnail',
                icon: 'bi-card-image',
                type: 'media',
                html: '<img src="https://via.placeholder.com/300x200/ffc107/000?text=Thumbnail" class="img-thumbnail" alt="Thumbnail">'
            },
            {
                id: 'figure',
                name: 'Figure with Caption',
                icon: 'bi-image',
                type: 'media',
                html: '<figure class="figure"><img src="https://via.placeholder.com/400x250/21252b/fff?text=Figure" class="figure-img img-fluid rounded" alt="Figure"><figcaption class="figure-caption" contenteditable="true">A caption for the above image.</figcaption></figure>'
            },
            {
                id: 'image-gallery',
                name: 'Image Gallery',
                icon: 'bi-grid-3x3',
                type: 'media',
                html: '<div class="row g-3"><div class="col-md-4"><img src="https://via.placeholder.com/300x200/0d6efd/fff?text=1" class="img-fluid rounded" alt="Gallery 1"></div><div class="col-md-4"><img src="https://via.placeholder.com/300x200/198754/fff?text=2" class="img-fluid rounded" alt="Gallery 2"></div><div class="col-md-4"><img src="https://via.placeholder.com/300x200/dc3545/fff?text=3" class="img-fluid rounded" alt="Gallery 3"></div><div class="col-md-4"><img src="https://via.placeholder.com/300x200/ffc107/000?text=4" class="img-fluid rounded" alt="Gallery 4"></div><div class="col-md-4"><img src="https://via.placeholder.com/300x200/0dcaf0/000?text=5" class="img-fluid rounded" alt="Gallery 5"></div><div class="col-md-4"><img src="https://via.placeholder.com/300x200/6f42c1/fff?text=6" class="img-fluid rounded" alt="Gallery 6"></div></div>'
            },
            {
                id: 'video-embed',
                name: 'Video Embed',
                icon: 'bi-youtube',
                type: 'media',
                html: '<div class="ratio ratio-16x9"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" allowfullscreen></iframe></div>'
            },
            {
                id: 'iframe',
                name: 'iFrame Embed',
                icon: 'bi-window',
                type: 'media',
                html: '<div class="ratio ratio-16x9"><iframe src="https://example.com" title="Embedded content"></iframe></div>'
            },
            {
                id: 'svg-placeholder',
                name: 'SVG Placeholder',
                icon: 'bi-filetype-svg',
                type: 'media',
                html: '<svg class="img-fluid" width="100%" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#6c757d"/><text x="50%" y="50%" fill="#fff" dy=".3em" text-anchor="middle" font-size="20">SVG Placeholder</text></svg>'
            }
        ]
    },
    {
        id: 'lists',
        name: 'Lists',
        icon: 'bi-list-ul',
        items: [
            {
                id: 'list-group',
                name: 'List Group',
                icon: 'bi-list',
                type: 'list',
                html: '<ul class="list-group"><li class="list-group-item" contenteditable="true">An item</li><li class="list-group-item" contenteditable="true">A second item</li><li class="list-group-item" contenteditable="true">A third item</li><li class="list-group-item" contenteditable="true">A fourth item</li><li class="list-group-item" contenteditable="true">And a fifth one</li></ul>'
            },
            {
                id: 'list-group-active',
                name: 'Active List',
                icon: 'bi-list-check',
                type: 'list',
                html: '<ul class="list-group"><li class="list-group-item active" contenteditable="true">Active item</li><li class="list-group-item" contenteditable="true">Second item</li><li class="list-group-item" contenteditable="true">Third item</li></ul>'
            },
            {
                id: 'list-group-badge',
                name: 'List with Badges',
                icon: 'bi-list-stars',
                type: 'list',
                html: '<ul class="list-group"><li class="list-group-item d-flex justify-content-between align-items-center" contenteditable="true">A list item<span class="badge bg-primary rounded-pill">14</span></li><li class="list-group-item d-flex justify-content-between align-items-center" contenteditable="true">A second list item<span class="badge bg-primary rounded-pill">2</span></li><li class="list-group-item d-flex justify-content-between align-items-center" contenteditable="true">A third list item<span class="badge bg-primary rounded-pill">1</span></li></ul>'
            },
            {
                id: 'list-group-links',
                name: 'Link List',
                icon: 'bi-link-45deg',
                type: 'list',
                html: '<div class="list-group"><a href="#" class="list-group-item list-group-item-action active" contenteditable="true">Current link item</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">A second link item</a><a href="#" class="list-group-item list-group-item-action" contenteditable="true">A third link item</a></div>'
            },
            {
                id: 'ordered-list',
                name: 'Ordered List',
                icon: 'bi-list-ol',
                type: 'list',
                html: '<ol class="list-group list-group-numbered"><li class="list-group-item" contenteditable="true">First item</li><li class="list-group-item" contenteditable="true">Second item</li><li class="list-group-item" contenteditable="true">Third item</li></ol>'
            },
            {
                id: 'checklist',
                name: 'Checklist',
                icon: 'bi-check2-square',
                type: 'list',
                html: '<ul class="list-group"><li class="list-group-item"><input class="form-check-input me-2" type="checkbox" checked><span contenteditable="true">Completed task</span></li><li class="list-group-item"><input class="form-check-input me-2" type="checkbox"><span contenteditable="true">Pending task</span></li><li class="list-group-item"><input class="form-check-input me-2" type="checkbox"><span contenteditable="true">Another task</span></li></ul>'
            }
        ]
    },
    {
        id: 'alerts-feedback',
        name: 'Alerts & Feedback',
        icon: 'bi-exclamation-triangle',
        items: [
            {
                id: 'alert-primary',
                name: 'Primary Alert',
                icon: 'bi-info-circle',
                type: 'alert',
                html: '<div class="alert alert-primary alert-dismissible fade show" role="alert"><strong contenteditable="true">Heads up!</strong> <span contenteditable="true">This is a primary alert with important info.</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>'
            },
            {
                id: 'alert-success',
                name: 'Success Alert',
                icon: 'bi-check-circle',
                type: 'alert',
                html: '<div class="alert alert-success alert-dismissible fade show" role="alert"><i class="bi bi-check-circle-fill me-2"></i><strong contenteditable="true">Success!</strong> <span contenteditable="true">Your action was completed successfully.</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>'
            },
            {
                id: 'alert-warning',
                name: 'Warning Alert',
                icon: 'bi-exclamation-triangle',
                type: 'alert',
                html: '<div class="alert alert-warning alert-dismissible fade show" role="alert"><i class="bi bi-exclamation-triangle-fill me-2"></i><strong contenteditable="true">Warning!</strong> <span contenteditable="true">Better check yourself, you\'re not looking too good.</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>'
            },
            {
                id: 'alert-danger',
                name: 'Danger Alert',
                icon: 'bi-x-circle',
                type: 'alert',
                html: '<div class="alert alert-danger alert-dismissible fade show" role="alert"><i class="bi bi-x-circle-fill me-2"></i><strong contenteditable="true">Error!</strong> <span contenteditable="true">Something went wrong. Please try again.</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>'
            },
            {
                id: 'alert-info',
                name: 'Info Alert',
                icon: 'bi-info-circle',
                type: 'alert',
                html: '<div class="alert alert-info alert-dismissible fade show" role="alert"><i class="bi bi-info-circle-fill me-2"></i><span contenteditable="true">This is an info alert — check it out!</span><button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>'
            },
            {
                id: 'toast-component',
                name: 'Toast Notification',
                icon: 'bi-bell',
                type: 'alert',
                html: '<div class="toast show" role="alert"><div class="toast-header"><strong class="me-auto" contenteditable="true">Notification</strong><small contenteditable="true">11 mins ago</small><button type="button" class="btn-close" data-bs-dismiss="toast"></button></div><div class="toast-body" contenteditable="true">Hello, world! This is a toast message.</div></div>',
                js: 'var toastEl = document.querySelector(".toast"); if(toastEl) new bootstrap.Toast(toastEl).show();'
            },
            {
                id: 'progress-bar',
                name: 'Progress Bar',
                icon: 'bi-bar-chart',
                type: 'alert',
                html: '<div class="mb-2"><label class="form-label" contenteditable="true">Progress: 65%</label><div class="progress"><div class="progress-bar" role="progressbar" style="width: 65%" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">65%</div></div></div>'
            },
            {
                id: 'progress-stacked',
                name: 'Stacked Progress',
                icon: 'bi-bar-chart-steps',
                type: 'alert',
                html: '<div class="progress-stacked"><div class="progress" role="progressbar" style="width: 15%"><div class="progress-bar bg-success">15%</div></div><div class="progress" role="progressbar" style="width: 30%"><div class="progress-bar bg-info">30%</div></div><div class="progress" role="progressbar" style="width: 20%"><div class="progress-bar bg-warning">20%</div></div></div>'
            },
            {
                id: 'spinner',
                name: 'Loading Spinner',
                icon: 'bi-arrow-repeat',
                type: 'alert',
                html: '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2 text-muted" contenteditable="true">Loading...</p></div>'
            },
            {
                id: 'badge',
                name: 'Badge',
                icon: 'bi-bookmark',
                type: 'alert',
                html: '<div><span class="badge bg-primary me-1" contenteditable="true">Primary</span><span class="badge bg-secondary me-1" contenteditable="true">Secondary</span><span class="badge bg-success me-1" contenteditable="true">Success</span><span class="badge bg-danger me-1" contenteditable="true">Danger</span><span class="badge bg-warning text-dark me-1" contenteditable="true">Warning</span><span class="badge bg-info me-1" contenteditable="true">Info</span><span class="badge bg-light text-dark me-1" contenteditable="true">Light</span><span class="badge bg-dark" contenteditable="true">Dark</span></div>'
            },
            {
                id: 'modal-trigger',
                name: 'Modal Trigger',
                icon: 'bi-window',
                type: 'alert',
                html: '<!-- Button trigger modal --><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#demoModal" contenteditable="true">Launch Demo Modal</button><!-- Modal --><div class="modal fade" id="demoModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" contenteditable="true">Modal Title</h1><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" contenteditable="true">Modal body text goes here.</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button><button type="button" class="btn btn-primary">Save changes</button></div></div></div></div>'
            },
            {
                id: 'accordion',
                name: 'Accordion',
                icon: 'bi-chevron-down',
                type: 'alert',
                html: '<div class="accordion" id="accordionDemo"><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" contenteditable="true">Accordion Item #1</button></h2><div id="collapse1" class="accordion-collapse collapse show" data-bs-parent="#accordionDemo"><div class="accordion-body" contenteditable="true"><strong>This is the first item\'s accordion body.</strong> It is shown by default.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" contenteditable="true">Accordion Item #2</button></h2><div id="collapse2" class="accordion-collapse collapse" data-bs-parent="#accordionDemo"><div class="accordion-body" contenteditable="true">This is the second item\'s accordion body.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" contenteditable="true">Accordion Item #3</button></h2><div id="collapse3" class="accordion-collapse collapse" data-bs-parent="#accordionDemo"><div class="accordion-body" contenteditable="true">This is the third item\'s accordion body.</div></div></div></div>'
            },
            {
                id: 'tooltip-popover',
                name: 'Tooltip',
                icon: 'bi-chat-dots',
                type: 'alert',
                html: '<div class="text-center"><button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip text" contenteditable="true">Hover for Tooltip</button></div>',
                js: 'var tooltipTriggerList = [].slice.call(document.querySelectorAll("[data-bs-toggle=\'tooltip\']")); tooltipTriggerList.map(function(el) { return new bootstrap.Tooltip(el); });'
            }
        ]
    },
    {
        id: 'content',
        name: 'Content Blocks',
        icon: 'bi-file-earmark-richtext',
        items: [
            {
                id: 'hero-simple',
                name: 'Simple Hero',
                icon: 'bi-badge-hd',
                type: 'content',
                html: '<div class="px-4 py-5 my-3 text-center"><h1 class="display-5 fw-bold" contenteditable="true">Centered hero</h1><div class="col-lg-6 mx-auto"><p class="lead mb-4" contenteditable="true">Quickly design and customize responsive mobile-first sites with Bootstrap.</p><div class="d-grid gap-2 d-sm-flex justify-content-sm-center"><button type="button" class="btn btn-primary btn-lg px-4 gap-3" contenteditable="true">Primary</button><button type="button" class="btn btn-outline-secondary btn-lg px-4" contenteditable="true">Secondary</button></div></div></div>'
            },
            {
                id: 'hero-image',
                name: 'Hero with Background',
                icon: 'bi-card-image',
                type: 'content',
                html: '<div class="p-5 mb-4 bg-dark text-white rounded-3" style="background: linear-gradient(135deg, #0d6efd, #6f42c1);"><div class="container py-5"><h1 class="display-5 fw-bold" contenteditable="true">Hello, world!</h1><p class="col-md-8 fs-4" contenteditable="true">Using a series of utilities, you can create this jumbotron, just like the one in previous versions of Bootstrap.</p><button class="btn btn-primary btn-lg" type="button" contenteditable="true">Learn more</button></div></div>'
            },
            {
                id: 'features-grid',
                name: 'Features Grid',
                icon: 'bi-grid-3x3',
                type: 'content',
                html: '<div class="row g-4 py-3"><div class="col-md-4"><div class="h-100 p-4 bg-light rounded-3"><div class="feature-icon display-6 text-primary mb-3"><i class="bi bi-collection"></i></div><h5 contenteditable="true">Featured title</h5><p contenteditable="true">Paragraph of text beneath the heading to explain the heading.</p></div></div><div class="col-md-4"><div class="h-100 p-4 bg-light rounded-3"><div class="feature-icon display-6 text-primary mb-3"><i class="bi bi-building"></i></div><h5 contenteditable="true">Featured title</h5><p contenteditable="true">Paragraph of text beneath the heading to explain the heading.</p></div></div><div class="col-md-4"><div class="h-100 p-4 bg-light rounded-3"><div class="feature-icon display-6 text-primary mb-3"><i class="bi bi-toggles2"></i></div><h5 contenteditable="true">Featured title</h5><p contenteditable="true">Paragraph of text beneath the heading to explain the heading.</p></div></div></div>'
            },
            {
                id: 'stats-row',
                name: 'Statistics Row',
                icon: 'bi-bar-chart',
                type: 'content',
                html: '<div class="row text-center py-4"><div class="col-md-3"><h2 class="display-4 fw-bold text-primary" contenteditable="true">500+</h2><p class="text-muted" contenteditable="true">Happy Clients</p></div><div class="col-md-3"><h2 class="display-4 fw-bold text-success" contenteditable="true">1000+</h2><p class="text-muted" contenteditable="true">Projects Done</p></div><div class="col-md-3"><h2 class="display-4 fw-bold text-warning" contenteditable="true">50+</h2><p class="text-muted" contenteditable="true">Team Members</p></div><div class="col-md-3"><h2 class="display-4 fw-bold text-danger" contenteditable="true">99%</h2><p class="text-muted" contenteditable="true">Satisfaction</p></div></div>'
            },
            {
                id: 'cta-banner',
                name: 'CTA Banner',
                icon: 'bi-megaphone',
                type: 'content',
                html: '<div class="p-5 text-center bg-primary text-white rounded-3"><h2 class="mb-3" contenteditable="true">Ready to get started?</h2><p class="mb-4" contenteditable="true">Sign up for free and start building amazing things today.</p><button class="btn btn-light btn-lg" contenteditable="true">Get Started Free</button></div>'
            },
            {
                id: 'team-section',
                name: 'Team Section',
                icon: 'bi-people',
                type: 'content',
                html: '<div class="row g-4 py-3"><div class="col-lg-4 text-center"><img src="https://via.placeholder.com/120/0d6efd/fff?text=JD" class="rounded-circle mb-3" alt="Team"><h5 contenteditable="true">John Doe</h5><p class="text-muted" contenteditable="true">CEO & Founder</p></div><div class="col-lg-4 text-center"><img src="https://via.placeholder.com/120/198754/fff?text=JS" class="rounded-circle mb-3" alt="Team"><h5 contenteditable="true">Jane Smith</h5><p class="text-muted" contenteditable="true">CTO</p></div><div class="col-lg-4 text-center"><img src="https://via.placeholder.com/120/dc3545/fff?text=BJ" class="rounded-circle mb-3" alt="Team"><h5 contenteditable="true">Bob Johnson</h5><p class="text-muted" contenteditable="true">Lead Designer</p></div></div>'
            },
            {
                id: 'footer-basic',
                name: 'Basic Footer',
                icon: 'bi-window-dock',
                type: 'content',
                html: '<footer class="py-4 mt-4 bg-dark text-white"><div class="row"><div class="col-md-4"><h5 contenteditable="true">Company Name</h5><p class="text-muted" contenteditable="true">Brief description of the company.</p></div><div class="col-md-2"><h6 contenteditable="true">Links</h6><ul class="list-unstyled"><li><a href="#" class="text-muted text-decoration-none" contenteditable="true">Home</a></li><li><a href="#" class="text-muted text-decoration-none" contenteditable="true">About</a></li><li><a href="#" class="text-muted text-decoration-none" contenteditable="true">Contact</a></li></ul></div><div class="col-md-2"><h6 contenteditable="true">Support</h6><ul class="list-unstyled"><li><a href="#" class="text-muted text-decoration-none" contenteditable="true">FAQ</a></li><li><a href="#" class="text-muted text-decoration-none" contenteditable="true">Help</a></li></ul></div><div class="col-md-4"><h6 contenteditable="true">Newsletter</h6><div class="input-group"><input type="email" class="form-control" placeholder="Email"><button class="btn btn-primary">Subscribe</button></div></div></div><hr class="my-4"><p class="text-center text-muted mb-0" contenteditable="true">© 2024 Company Name. All rights reserved.</p></footer>'
            },
            {
                id: 'footer-simple',
                name: 'Simple Footer',
                icon: 'bi-window-dock',
                type: 'content',
                html: '<footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top"><p class="col-md-4 mb-0 text-muted" contenteditable="true">© 2024 Company, Inc</p><a href="/" class="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"><span class="fs-4" contenteditable="true">Brand</span></a><ul class="nav col-md-4 justify-content-end"><li class="nav-item"><a href="#" class="nav-link px-2 text-muted" contenteditable="true">Home</a></li><li class="nav-item"><a href="#" class="nav-link px-2 text-muted" contenteditable="true">Features</a></li><li class="nav-item"><a href="#" class="nav-link px-2 text-muted" contenteditable="true">Pricing</a></li></ul></footer>'
            },
            {
                id: 'pricing-table',
                name: 'Pricing Table',
                icon: 'bi-cash',
                type: 'content',
                html: '<div class="row row-cols-1 row-cols-md-3 mb-3 text-center py-3"><div class="col"><div class="card mb-4 rounded-3 shadow-sm"><div class="card-header py-3"><h4 class="my-0 fw-normal" contenteditable="true">Free</h4></div><div class="card-body"><h1 class="card-title pricing-card-title">$0<small class="text-muted fw-light" contenteditable="true">/mo</small></h1><ul class="list-unstyled mt-3 mb-4"><li contenteditable="true">10 users included</li><li contenteditable="true">2 GB storage</li><li contenteditable="true">Email support</li><li contenteditable="true">Help center access</li></ul><button type="button" class="w-100 btn btn-lg btn-outline-primary" contenteditable="true">Sign up free</button></div></div></div><div class="col"><div class="card mb-4 rounded-3 shadow-sm border-primary"><div class="card-header py-3 text-bg-primary border-primary"><h4 class="my-0 fw-normal" contenteditable="true">Pro</h4></div><div class="card-body"><h1 class="card-title pricing-card-title">$15<small class="text-muted fw-light" contenteditable="true">/mo</small></h1><ul class="list-unstyled mt-3 mb-4"><li contenteditable="true">20 users included</li><li contenteditable="true">10 GB storage</li><li contenteditable="true">Priority email support</li><li contenteditable="true">Help center access</li></ul><button type="button" class="w-100 btn btn-lg btn-primary" contenteditable="true">Get started</button></div></div></div><div class="col"><div class="card mb-4 rounded-3 shadow-sm"><div class="card-header py-3"><h4 class="my-0 fw-normal" contenteditable="true">Enterprise</h4></div><div class="card-body"><h1 class="card-title pricing-card-title">$29<small class="text-muted fw-light" contenteditable="true">/mo</small></h1><ul class="list-unstyled mt-3 mb-4"><li contenteditable="true">30 users included</li><li contenteditable="true">15 GB storage</li><li contenteditable="true">Phone and email support</li><li contenteditable="true">Help center access</li></ul><button type="button" class="w-100 btn btn-lg btn-outline-primary" contenteditable="true">Contact us</button></div></div></div></div>'
            },
            {
                id: 'faq-section',
                name: 'FAQ Section',
                icon: 'bi-question-circle',
                type: 'content',
                html: '<div class="py-3"><h2 class="text-center mb-4" contenteditable="true">Frequently Asked Questions</h2><div class="accordion" id="faqAccordion"><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1" contenteditable="true">How does the free trial work?</button></h2><div id="faq1" class="accordion-collapse collapse show"><div class="accordion-body" contenteditable="true">When your free trial expires, you\'ll have the option to upgrade. Cancel anytime.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2" contenteditable="true">Can I change my plan later?</button></h2><div id="faq2" class="accordion-collapse collapse"><div class="accordion-body" contenteditable="true">Yes, you can upgrade or downgrade your plan at any time.</div></div></div><div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3" contenteditable="true">What payment methods do you accept?</button></h2><div id="faq3" class="accordion-collapse collapse"><div class="accordion-body" contenteditable="true">We accept all major credit cards, PayPal, and bank transfers.</div></div></div></div></div>'
            },
            {
                id: 'contact-form',
                name: 'Contact Form',
                icon: 'bi-envelope',
                type: 'content',
                html: '<div class="row py-3"><div class="col-md-6"><h3 contenteditable="true">Contact Us</h3><p class="text-muted" contenteditable="true">Have questions? We\'d love to hear from you.</p><div class="mb-3"><label class="form-label">Name</label><input type="text" class="form-control" placeholder="Your name"></div><div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" placeholder="email@example.com"></div><div class="mb-3"><label class="form-label">Message</label><textarea class="form-control" rows="4" placeholder="Your message..."></textarea></div><button class="btn btn-primary" contenteditable="true">Send Message</button></div><div class="col-md-6"><div class="bg-light p-4 rounded-3 h-100"><h5 contenteditable="true">Our Office</h5><p contenteditable="true"><i class="bi bi-geo-alt me-2"></i>123 Main Street, City, Country</p><p contenteditable="true"><i class="bi bi-telephone me-2"></i>+1 (555) 123-4567</p><p contenteditable="true"><i class="bi bi-envelope me-2"></i>contact@example.com</p><div class="mt-4"><h5 contenteditable="true">Follow Us</h5><div class="d-flex gap-2"><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-facebook"></i></a><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-twitter"></i></a><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-instagram"></i></a><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-linkedin"></i></a></div></div></div></div></div>'
            },
            {
                id: 'login-form',
                name: 'Login Form',
                icon: 'bi-box-arrow-in-right',
                type: 'content',
                html: '<div class="row justify-content-center py-3"><div class="col-md-5"><div class="card shadow"><div class="card-body p-4"><h3 class="text-center mb-4" contenteditable="true">Sign In</h3><div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" placeholder="email@example.com"></div><div class="mb-3"><label class="form-label">Password</label><input type="password" class="form-control" placeholder="Password"></div><div class="d-flex justify-content-between align-items-center mb-3"><div class="form-check"><input class="form-check-input" type="checkbox" id="remember"><label class="form-check-label" for="remember" contenteditable="true">Remember me</label></div><a href="#" contenteditable="true">Forgot password?</a></div><button class="btn btn-primary w-100" contenteditable="true">Sign In</button><hr><p class="text-center mb-0" contenteditable="true">Don\'t have an account? <a href="#">Sign up</a></p></div></div></div></div>'
            },
            {
                id: 'blog-card',
                name: 'Blog Post Card',
                icon: 'bi-newspaper',
                type: 'content',
                html: '<div class="card mb-3"><div class="row g-0"><div class="col-md-4"><img src="https://via.placeholder.com/350x250/21252b/fff?text=Blog+Post" class="img-fluid rounded-start" alt="Blog"></div><div class="col-md-8"><div class="card-body"><div class="mb-2"><span class="badge bg-primary" contenteditable="true">Technology</span><small class="text-muted ms-2" contenteditable="true">May 15, 2024</small></div><h5 class="card-title" contenteditable="true">Blog Post Title Goes Here</h5><p class="card-text" contenteditable="true">This is a wider card with supporting text below as a natural lead-in to additional content.</p><div class="d-flex align-items-center"><img src="https://via.placeholder.com/30/0d6efd/fff?text=A" class="rounded-circle me-2" width="30" height="30" alt="Author"><small class="text-muted" contenteditable="true">By John Doe · 5 min read</small></div></div></div></div></div>'
            }
        ]
    },
    {
        id: 'animations',
        name: 'Animations',
        icon: 'bi-lightning',
        items: [
            {
                id: 'anim-fadeIn',
                name: 'Fade In',
                icon: 'bi-circle-half',
                type: 'animation',
                html: '<div class="animate__animated animate__fadeIn p-4 bg-primary text-white text-center rounded"><h4 contenteditable="true">Fade In Animation</h4></div>',
                css: ''
            },
            {
                id: 'anim-fadeInUp',
                name: 'Fade In Up',
                icon: 'bi-arrow-up',
                type: 'animation',
                html: '<div class="animate__animated animate__fadeInUp p-4 bg-success text-white text-center rounded"><h4 contenteditable="true">Fade In Up</h4></div>'
            },
            {
                id: 'anim-slideInLeft',
                name: 'Slide In Left',
                icon: 'bi-arrow-left',
                type: 'animation',
                html: '<div class="animate__animated animate__slideInLeft p-4 bg-warning text-dark text-center rounded"><h4 contenteditable="true">Slide In Left</h4></div>'
            },
            {
                id: 'anim-bounceIn',
                name: 'Bounce In',
                icon: 'bi-arrow-down-up',
                type: 'animation',
                html: '<div class="animate__animated animate__bounceIn p-4 bg-danger text-white text-center rounded"><h4 contenteditable="true">Bounce In</h4></div>'
            },
            {
                id: 'anim-zoomIn',
                name: 'Zoom In',
                icon: 'bi-zoom-in',
                type: 'animation',
                html: '<div class="animate__animated animate__zoomIn p-4 bg-info text-white text-center rounded"><h4 contenteditable="true">Zoom In</h4></div>'
            },
            {
                id: 'anim-flipInX',
                name: 'Flip In X',
                icon: 'bi-arrow-repeat',
                type: 'animation',
                html: '<div class="animate__animated animate__flipInX p-4 bg-dark text-white text-center rounded"><h4 contenteditable="true">Flip In X</h4></div>'
            },
            {
                id: 'anim-pulse',
                name: 'Pulse',
                icon: 'bi-activity',
                type: 'animation',
                css: '@keyframes pulse-custom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } } .pulse-custom { animation: pulse-custom 2s ease-in-out infinite; }',
                html: '<div class="pulse-custom p-4 bg-primary text-white text-center rounded"><h4 contenteditable="true">Pulsing Element</h4></div>'
            },
            {
                id: 'anim-shake',
                name: 'Shake',
                icon: 'bi-lightning',
                type: 'animation',
                html: '<div class="animate__animated animate__shakeX p-4 bg-danger text-white text-center rounded"><h4 contenteditable="true">Shake Animation</h4></div>'
            },
            {
                id: 'anim-typing',
                name: 'Typing Effect',
                icon: 'bi-type',
                type: 'animation',
                css: '.typing-demo { width: 22ch; animation: typing 2s steps(22), blink .5s step-end infinite alternate; white-space: nowrap; overflow: hidden; border-right: 3px solid; font-family: monospace; font-size: 1.5em; } @keyframes typing { from { width: 0 } } @keyframes blink { 50% { border-color: transparent } }',
                html: '<div class="text-center py-3"><div class="typing-demo mx-auto" contenteditable="true">Hello, World!</div></div>'
            },
            {
                id: 'anim-countup',
                name: 'Count Up Number',
                icon: 'bi-123',
                type: 'animation',
                css: '.counter { font-size: 3rem; font-weight: bold; color: #0d6efd; }',
                html: '<div class="text-center py-3"><div class="counter" contenteditable="true">1,234</div><p class="text-muted" contenteditable="true">Happy Customers</p></div>',
                js: '// Count-up animation placeholder'
            }
        ]
    },
    {
        id: 'misc',
        name: 'Miscellaneous',
        icon: 'bi-grid',
        items: [
            {
                id: 'url-link',
                name: 'URL / Link',
                icon: 'bi-link-45deg',
                type: 'misc',
                html: '<a href="#" contenteditable="true" class="text-decoration-none">Click here for more information →</a>'
            },
            {
                id: 'social-links',
                name: 'Social Links',
                icon: 'bi-share',
                type: 'misc',
                html: '<div class="d-flex gap-2"><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-facebook"></i></a><a href="#" class="btn btn-outline-info btn-sm"><i class="bi bi-twitter"></i></a><a href="#" class="btn btn-outline-danger btn-sm"><i class="bi bi-instagram"></i></a><a href="#" class="btn btn-outline-primary btn-sm"><i class="bi bi-linkedin"></i></a><a href="#" class="btn btn-outline-dark btn-sm"><i class="bi bi-github"></i></a></div>'
            },
            {
                id: 'embed-map',
                name: 'Google Map Embed',
                icon: 'bi-geo-alt',
                type: 'misc',
                html: '<div class="ratio ratio-16x9"><iframe src="https://maps.google.com/maps?q=manila&t=&z=13&ie=UTF8&iwloc=&output=embed" style="border:0;" allowfullscreen></iframe></div>'
            },
            {
                id: 'code-block',
                name: 'Code Block',
                icon: 'bi-code',
                type: 'misc',
                html: '<pre class="bg-dark text-light p-3 rounded"><code>function hello() {\n  console.log("Hello, World!");\n}</code></pre>'
            },
            {
                id: 'card-img-cap',
                name: 'Card with List Group',
                icon: 'bi-card-checklist',
                type: 'misc',
                html: '<div class="card" style="width: 18rem;"><div class="card-header" contenteditable="true">Featured</div><ul class="list-group list-group-flush"><li class="list-group-item" contenteditable="true">An item</li><li class="list-group-item" contenteditable="true">A second item</li><li class="list-group-item" contenteditable="true">A third item</li></ul></div>'
            },
            {
                id: 'offcanvas-trigger',
                name: 'Offcanvas Menu',
                icon: 'bi-layout-sidebar-reverse',
                type: 'misc',
                html: '<a class="btn btn-primary" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" contenteditable="true">Open Offcanvas</a><div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample"><div class="offcanvas-header"><h5 class="offcanvas-title" contenteditable="true">Offcanvas Menu</h5><button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body"><p contenteditable="true">Content for the offcanvas goes here.</p><ul class="list-group"><li class="list-group-item" contenteditable="true">Menu Item 1</li><li class="list-group-item" contenteditable="true">Menu Item 2</li><li class="list-group-item" contenteditable="true">Menu Item 3</li></ul></div></div>'
            },
            {
                id: 'dropdown',
                name: 'Dropdown',
                icon: 'bi-menu-down',
                type: 'misc',
                html: '<div class="dropdown"><button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" contenteditable="true">Dropdown button</button><ul class="dropdown-menu"><li><a class="dropdown-item" href="#" contenteditable="true">Action</a></li><li><a class="dropdown-item" href="#" contenteditable="true">Another action</a></li><li><a class="dropdown-item" href="#" contenteditable="true">Something else here</a></li></ul></div>'
            },
            {
                id: 'carousel',
                name: 'Carousel',
                icon: 'bi-images',
                type: 'misc',
                html: '<div id="carouselDemo" class="carousel slide" data-bs-ride="carousel"><div class="carousel-indicators"><button type="button" data-bs-target="#carouselDemo" data-bs-slide-to="0" class="active"></button><button type="button" data-bs-target="#carouselDemo" data-bs-slide-to="1"></button><button type="button" data-bs-target="#carouselDemo" data-bs-slide-to="2"></button></div><div class="carousel-inner"><div class="carousel-item active"><div class="d-flex align-items-center justify-content-center text-white" style="height:200px;background:linear-gradient(135deg,#0d6efd,#6610f2);"><h3 contenteditable="true">First Slide</h3></div></div><div class="carousel-item"><div class="d-flex align-items-center justify-content-center text-white" style="height:200px;background:linear-gradient(135deg,#198754,#20c997);"><h3 contenteditable="true">Second Slide</h3></div></div><div class="carousel-item"><div class="d-flex align-items-center justify-content-center text-white" style="height:200px;background:linear-gradient(135deg,#dc3545,#fd7e14);"><h3 contenteditable="true">Third Slide</h3></div></div></div><button class="carousel-control-prev" type="button" data-bs-target="#carouselDemo" data-bs-slide="prev"><span class="carousel-control-prev-icon"></span></button><button class="carousel-control-next" type="button" data-bs-target="#carouselDemo" data-bs-slide="next"><span class="carousel-control-next-icon"></span></button></div>',
                js: 'var carouselEl = document.querySelector("#carouselDemo"); if(carouselEl) new bootstrap.Carousel(carouselEl);'
            },
            {
                id: 'collapse',
                name: 'Collapse Toggle',
                icon: 'bi-arrows-collapse',
                type: 'misc',
                html: '<p><a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" contenteditable="true">Toggle Content</a></p><div class="collapse" id="collapseExample"><div class="card card-body" contenteditable="true">This content can be toggled with the button above. Anim pariatur cliche reprehenderit.</div></div>'
            },
            {
                id: 'tabs-component',
                name: 'Tabs Component',
                icon: 'bi-folder',
                type: 'misc',
                html: '<ul class="nav nav-tabs" id="myTab" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" contenteditable="true">Home</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" contenteditable="true">Profile</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" contenteditable="true">Contact</button></li></ul><div class="tab-content p-3 border border-top-0 rounded-bottom"><div class="tab-pane fade show active" id="home-tab-pane"><p contenteditable="true">Home tab content goes here.</p></div><div class="tab-pane fade" id="profile-tab-pane"><p contenteditable="true">Profile tab content goes here.</p></div><div class="tab-pane fade" id="contact-tab-pane"><p contenteditable="true">Contact tab content goes here.</p></div></div>'
            },
            {
                id: 'scrollspy',
                name: 'Scrollspy Nav',
                icon: 'bi-text-indent-left',
                type: 'misc',
                html: '<div class="d-flex"><nav id="scrollspy-nav" class="flex-column nav-pills p-3 bg-light rounded" style="width: 180px;"><a class="nav-link active" href="#sp-sec1" contenteditable="true">First</a><a class="nav-link" href="#sp-sec2" contenteditable="true">Second</a><a class="nav-link" href="#sp-sec3" contenteditable="true">Third</a></nav><div data-bs-spy="scroll" data-bs-target="#scrollspy-nav" class="scrollspy-example p-3 flex-grow-1" tabindex="0" style="height: 200px; overflow-y: auto;"><h4 id="sp-sec1" contenteditable="true">First section</h4><p contenteditable="true">Content for the first section.</p><h4 id="sp-sec2" contenteditable="true">Second section</h4><p contenteditable="true">Content for the second section.</p><h4 id="sp-sec3" contenteditable="true">Third section</h4><p contenteditable="true">Content for the third section.</p></div></div>'
            },
            {
                id: 'placeholder-skeleton',
                name: 'Loading Skeleton',
                icon: 'bi-hourglass-split',
                type: 'misc',
                html: '<div class="card"><div class="card-body"><div class="d-flex align-items-center mb-3"><div class="placeholder-glow"><span class="placeholder col-2 rounded-circle" style="width:48px;height:48px;"></span></div><div class="ms-3 flex-grow-1"><span class="placeholder col-4"></span><br><span class="placeholder col-6"></span></div></div><span class="placeholder col-12 mb-2"></span><span class="placeholder col-12 mb-2"></span><span class="placeholder col-8"></span></div></div>'
            }
        ]
    }
];

// ============================================
// LIBRARY COMPONENTS (Suggested from web)
// ============================================

const LIBRARY_COMPONENTS = [
    {
        id: 'lib-hero-gradient',
        name: 'Gradient Hero Section',
        category: 'hero',
        tags: ['hero', 'gradient', 'landing', 'modern'],
        description: 'A modern hero section with gradient background and CTA buttons.',
        html: '<section class="py-5 text-white text-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"><div class="container py-5"><h1 class="display-3 fw-bold mb-3" contenteditable="true">Build Something Amazing</h1><p class="lead mb-4" contenteditable="true">Create beautiful websites with our drag-and-drop builder. No coding required.</p><div class="d-flex gap-3 justify-content-center"><a href="#" class="btn btn-light btn-lg px-4" contenteditable="true">Get Started</a><a href="#" class="btn btn-outline-light btn-lg px-4" contenteditable="true">Learn More</a></div></div></section>',
        css: '',
        js: ''
    },
    {
        id: 'lib-hero-video',
        name: 'Video Background Hero',
        category: 'hero',
        tags: ['hero', 'video', 'background', 'immersive'],
        description: 'Hero section with a video-style gradient background overlay.',
        html: '<section class="position-relative text-white text-center" style="min-height: 500px; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);"><div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"><div class="container"><h1 class="display-2 fw-bold mb-4" contenteditable="true">Welcome to the Future</h1><p class="lead mb-4 mx-auto" style="max-width: 600px;" contenteditable="true">Experience next-generation web design with our intuitive platform.</p><a href="#" class="btn btn-lg btn-primary px-5" contenteditable="true">Start Building</a></div></div></section>'
    },
    {
        id: 'lib-nav-transparent',
        name: 'Transparent Navbar',
        category: 'navigation',
        tags: ['navbar', 'transparent', 'modern', 'overlay'],
        description: 'A modern transparent navbar that overlays on content.',
        html: '<nav class="navbar navbar-expand-lg navbar-dark"><div class="container"><a class="navbar-brand fw-bold fs-4" href="#" contenteditable="true">BrandName</a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#transNav"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="transNav"><ul class="navbar-nav ms-auto me-4"><li class="nav-item"><a class="nav-link active" href="#" contenteditable="true">Home</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">About</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Services</a></li><li class="nav-item"><a class="nav-link" href="#" contenteditable="true">Contact</a></li></ul><a href="#" class="btn btn-outline-light btn-sm" contenteditable="true">Sign Up</a></div></div></nav>',
        css: ''
    },
    {
        id: 'lib-features-icons',
        name: 'Feature Icons Grid',
        category: 'features',
        tags: ['features', 'icons', 'grid', 'services'],
        description: 'A clean features section with icon circles and descriptions.',
        html: '<section class="py-5"><div class="container"><div class="text-center mb-5"><h2 class="fw-bold" contenteditable="true">Our Features</h2><p class="text-muted" contenteditable="true">Discover what makes us different</p></div><div class="row g-4"><div class="col-md-4 text-center"><div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:80px;height:80px;"><i class="bi bi-lightning-charge text-primary fs-2"></i></div><h5 contenteditable="true">Lightning Fast</h5><p class="text-muted" contenteditable="true">Optimized for speed and performance.</p></div><div class="col-md-4 text-center"><div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:80px;height:80px;"><i class="bi bi-shield-check text-success fs-2"></i></div><h5 contenteditable="true">Secure</h5><p class="text-muted" contenteditable="true">Enterprise-grade security built in.</p></div><div class="col-md-4 text-center"><div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:80px;height:80px;"><i class="bi bi-gear text-warning fs-2"></i></div><h5 contenteditable="true">Customizable</h5><p class="text-muted" contenteditable="true">Tailor everything to your needs.</p></div></div></div></section>'
    },
    {
        id: 'lib-testimonial-slider',
        name: 'Testimonials Carousel',
        category: 'testimonials',
        tags: ['testimonials', 'carousel', 'reviews', 'social proof'],
        description: 'A testimonials section with star ratings.',
        html: '<section class="py-5 bg-light"><div class="container"><h2 class="text-center fw-bold mb-5" contenteditable="true">What Our Clients Say</h2><div class="row g-4"><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body p-4"><div class="text-warning mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div><p class="card-text" contenteditable="true">"Absolutely amazing product! Changed the way we work."</p><div class="d-flex align-items-center mt-3"><img src="https://via.placeholder.com/40/0d6efd/fff?text=A" class="rounded-circle me-3"><div><strong contenteditable="true">Alice M.</strong><br><small class="text-muted" contenteditable="true">CEO, TechCorp</small></div></div></div></div></div><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body p-4"><div class="text-warning mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i></div><p class="card-text" contenteditable="true">"Great customer support and fantastic features."</p><div class="d-flex align-items-center mt-3"><img src="https://via.placeholder.com/40/198754/fff?text=B" class="rounded-circle me-3"><div><strong contenteditable="true">Bob K.</strong><br><small class="text-muted" contenteditable="true">Designer, StudioXYZ</small></div></div></div></div></div><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body p-4"><div class="text-warning mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></div><p class="card-text" contenteditable="true">"Best investment we made this year."</p><div class="d-flex align-items-center mt-3"><img src="https://via.placeholder.com/40/dc3545/fff?text=C" class="rounded-circle me-3"><div><strong contenteditable="true">Carol S.</strong><br><small class="text-muted" contenteditable="true">CTO, StartupInc</small></div></div></div></div></div></div></div></section>'
    },
    {
        id: 'lib-pricing-3col',
        name: 'Pricing 3 Columns',
        category: 'pricing',
        tags: ['pricing', 'plans', 'subscription', 'compare'],
        description: 'Three-column pricing table with featured middle plan.',
        html: '<section class="py-5"><div class="container"><h2 class="text-center fw-bold mb-2" contenteditable="simple">Choose Your Plan</h2><p class="text-center text-muted mb-5" contenteditable="true">Select the perfect plan for your needs</p><div class="row g-4 justify-content-center"><div class="col-lg-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body p-4 text-center"><h5 class="text-muted" contenteditable="true">Starter</h5><div class="my-3"><span class="display-5 fw-bold" contenteditable="true">$9</span><span class="text-muted" contenteditable="true">/month</span></div><ul class="list-unstyled mb-4"><li class="py-2" contenteditable="true">✓ 5 Projects</li><li class="py-2" contenteditable="true">✓ 10GB Storage</li><li class="py-2" contenteditable="true">✓ Email Support</li><li class="py-2 text-muted" contenteditable="true">✗ Advanced Analytics</li><li class="py-2 text-muted" contenteditable="true">✗ Priority Support</li></ul><button class="btn btn-outline-primary w-100" contenteditable="true">Choose Starter</button></div></div></div><div class="col-lg-4"><div class="card h-100 border-primary shadow"><div class="card-header bg-primary text-white text-center py-2"><span class="badge bg-white text-primary" contenteditable="true">Most Popular</span></div><div class="card-body p-4 text-center"><h5 contenteditable="true">Professional</h5><div class="my-3"><span class="display-5 fw-bold" contenteditable="true">$29</span><span class="text-muted" contenteditable="true">/month</span></div><ul class="list-unstyled mb-4"><li class="py-2" contenteditable="true">✓ Unlimited Projects</li><li class="py-2" contenteditable="true">✓ 100GB Storage</li><li class="py-2" contenteditable="true">✓ Priority Support</li><li class="py-2" contenteditable="true">✓ Advanced Analytics</li><li class="py-2" contenteditable="true">✓ Custom Domain</li></ul><button class="btn btn-primary w-100" contenteditable="true">Choose Pro</button></div></div></div><div class="col-lg-4"><div class="card h-100 border-0 shadow-sm"><div class="card-body p-4 text-center"><h5 class="text-muted" contenteditable="true">Enterprise</h5><div class="my-3"><span class="display-5 fw-bold" contenteditable="true">$99</span><span class="text-muted" contenteditable="true">/month</span></div><ul class="list-unstyled mb-4"><li class="py-2" contenteditable="true">✓ Everything in Pro</li><li class="py-2" contenteditable="true">✓ Unlimited Storage</li><li class="py-2" contenteditable="true">✓ 24/7 Phone Support</li><li class="py-2" contenteditable="true">✓ White Label</li><li class="py-2" contenteditable="true">✓ API Access</li></ul><button class="btn btn-outline-primary w-100" contenteditable="true">Contact Sales</button></div></div></div></div></div></section>'
    },
    {
        id: 'lib-cta-newsletter',
        name: 'Newsletter CTA',
        category: 'cta',
        tags: ['newsletter', 'cta', 'subscribe', 'email'],
        description: 'Newsletter signup call-to-action section.',
        html: '<section class="py-5 bg-primary text-white"><div class="container text-center"><h2 class="fw-bold mb-2" contenteditable="true">Stay Updated</h2><p class="mb-4" contenteditable="true">Subscribe to our newsletter for the latest updates.</p><div class="row justify-content-center"><div class="col-md-6"><div class="input-group input-group-lg"><input type="email" class="form-control" placeholder="Enter your email"><button class="btn btn-light" type="button" contenteditable="true">Subscribe</button></div><small class="d-block mt-2 opacity-75" contenteditable="true">No spam. Unsubscribe anytime.</small></div></div></div></section>'
    },
    {
        id: 'lib-team-grid',
        name: 'Team Grid',
        category: 'team',
        tags: ['team', 'people', 'about', 'staff'],
        description: 'A responsive team member grid with social links.',
        html: '<section class="py-5"><div class="container"><div class="text-center mb-5"><h2 class="fw-bold" contenteditable="true">Meet Our Team</h2><p class="text-muted" contenteditable="true">The people behind our success</p></div><div class="row g-4"><div class="col-lg-3 col-md-6"><div class="card border-0 text-center h-100"><img src="https://via.placeholder.com/200/0d6efd/fff?text=JD" class="card-img-top rounded-circle mx-auto mt-3" style="width:120px;height:120px;" alt=""><div class="card-body"><h6 class="mb-0" contenteditable="true">John Doe</h6><small class="text-muted" contenteditable="true">CEO</small><div class="mt-2"><a href="#" class="text-muted me-2"><i class="bi bi-twitter"></i></a><a href="#" class="text-muted me-2"><i class="bi bi-linkedin"></i></a><a href="#" class="text-muted"><i class="bi bi-github"></i></a></div></div></div></div><div class="col-lg-3 col-md-6"><div class="card border-0 text-center h-100"><img src="https://via.placeholder.com/200/198754/fff?text=JS" class="card-img-top rounded-circle mx-auto mt-3" style="width:120px;height:120px;" alt=""><div class="card-body"><h6 class="mb-0" contenteditable="true">Jane Smith</h6><small class="text-muted" contenteditable="true">CTO</small><div class="mt-2"><a href="#" class="text-muted me-2"><i class="bi bi-twitter"></i></a><a href="#" class="text-muted me-2"><i class="bi bi-linkedin"></i></a><a href="#" class="text-muted"><i class="bi bi-github"></i></a></div></div></div></div><div class="col-lg-3 col-md-6"><div class="card border-0 text-center h-100"><img src="https://via.placeholder.com/200/dc3545/fff?text=BJ" class="card-img-top rounded-circle mx-auto mt-3" style="width:120px;height:120px;" alt=""><div class="card-body"><h6 class="mb-0" contenteditable="true">Bob Johnson</h6><small class="text-muted" contenteditable="true">Designer</small><div class="mt-2"><a href="#" class="text-muted me-2"><i class="bi bi-twitter"></i></a><a href="#" class="text-muted me-2"><i class="bi bi-linkedin"></i></a><a href="#" class="text-muted"><i class="bi bi-dribbble"></i></a></div></div></div></div><div class="col-lg-3 col-md-6"><div class="card border-0 text-center h-100"><img src="https://via.placeholder.com/200/ffc107/000?text=AW" class="card-img-top rounded-circle mx-auto mt-3" style="width:120px;height:120px;" alt=""><div class="card-body"><h6 class="mb-0" contenteditable="true">Alice Wilson</h6><small class="text-muted" contenteditable="true">Marketing</small><div class="mt-2"><a href="#" class="text-muted me-2"><i class="bi bi-twitter"></i></a><a href="#" class="text-muted me-2"><i class="bi bi-linkedin"></i></a><a href="#" class="text-muted"><i class="bi bi-instagram"></i></a></div></div></div></div></div></div></section>'
    },
    {
        id: 'lib-stats-counter',
        name: 'Stats Counter Section',
        category: 'stats',
        tags: ['stats', 'counter', 'numbers', 'achievements'],
        description: 'Statistics counter section with large numbers.',
        html: '<section class="py-5 bg-dark text-white"><div class="container"><div class="row text-center g-4"><div class="col-md-3"><div class="p-3"><i class="bi bi-people fs-1 text-primary mb-2 d-block"></i><h2 class="fw-bold mb-0" contenteditable="true">10,000+</h2><p class="text-muted mb-0" contenteditable="true">Active Users</p></div></div><div class="col-md-3"><div class="p-3"><i class="bi bi-globe fs-1 text-success mb-2 d-block"></i><h2 class="fw-bold mb-0" contenteditable="true">50+</h2><p class="text-muted mb-0" contenteditable="true">Countries</p></div></div><div class="col-md-3"><div class="p-3"><i class="bi bi-award fs-1 text-warning mb-2 d-block"></i><h2 class="fw-bold mb-0" contenteditable="true">99.9%</h2><p class="text-muted mb-0" contenteditable="true">Uptime</p></div></div><div class="col-md-3"><div class="p-3"><i class="bi bi-chat-dots fs-1 text-info mb-2 d-block"></i><h2 class="fw-bold mb-0" contenteditable="true">24/7</h2><p class="text-muted mb-0" contenteditable="true">Support</p></div></div></div></div></section>'
    },
    {
        id: 'lib-e-commerce-card',
        name: 'Product Card',
        category: 'ecommerce',
        tags: ['ecommerce', 'product', 'shop', 'store'],
        description: 'A product card with image, price, and add to cart button.',
        html: '<div class="card h-100 border-0 shadow-sm"><img src="https://via.placeholder.com/300x300/f8f9fa/333?text=Product" class="card-img-top" alt="Product"><div class="card-body"><span class="badge bg-danger" contenteditable="true">-20%</span><h5 class="card-title mt-2" contenteditable="true">Premium Widget</h5><p class="text-muted small" contenteditable="true">High-quality widget with premium features.</p><div class="text-warning small mb-2"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-half"></i> <span class="text-muted">(4.5)</span></div><div class="d-flex justify-content-between align-items-center"><div><span class="text-decoration-line-through text-muted me-2" contenteditable="true">$99</span><span class="fw-bold text-primary fs-5" contenteditable="true">$79</span></div><button class="btn btn-primary btn-sm" contenteditable="true"><i class="bi bi-cart-plus me-1"></i>Add</button></div></div></div>',
        category: 'ecommerce'
    },
    {
        id: 'lib-blog-grid',
        name: 'Blog Grid',
        category: 'blog',
        tags: ['blog', 'articles', 'news', 'posts'],
        description: 'A responsive blog post grid layout.',
        html: '<section class="py-5"><div class="container"><h2 class="fw-bold mb-4" contenteditable="true">Latest Blog Posts</h2><div class="row g-4"><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><img src="https://via.placeholder.com/400x250/0d6efd/fff?text=Blog+1" class="card-img-top"><div class="card-body"><small class="text-muted" contenteditable="true">May 15, 2024</small><h5 class="mt-1" contenteditable="true">Getting Started with Web Design</h5><p class="text-muted" contenteditable="true">Learn the basics of modern web design...</p><a href="#" class="text-decoration-none" contenteditable="true">Read More →</a></div></div></div><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><img src="https://via.placeholder.com/400x250/198754/fff?text=Blog+2" class="card-img-top"><div class="card-body"><small class="text-muted" contenteditable="true">May 10, 2024</small><h5 class="mt-1" contenteditable="true">10 Tips for Better UX</h5><p class="text-muted" contenteditable="true">Improve your user experience with...</p><a href="#" class="text-decoration-none" contenteditable="true">Read More →</a></div></div></div><div class="col-md-4"><div class="card h-100 border-0 shadow-sm"><img src="https://via.placeholder.com/400x250/dc3545/fff?text=Blog+3" class="card-img-top"><div class="card-body"><small class="text-muted" contenteditable="true">May 5, 2024</small><h5 class="mt-1" contenteditable="true">Future of Frontend Dev</h5><p class="text-muted" contenteditable="true">What\'s coming next in frontend...</p><a href="#" class="text-decoration-none" contenteditable="true">Read More →</a></div></div></div></div></div></section>'
    },
    {
        id: 'lib-gallery-masonry',
        name: 'Image Gallery',
        category: 'gallery',
        tags: ['gallery', 'images', 'portfolio', 'masonry'],
        description: 'A responsive image gallery with hover effects.',
        html: '<section class="py-5"><div class="container"><h2 class="fw-bold text-center mb-5" contenteditable="true">Our Portfolio</h2><div class="row g-3"><div class="col-md-4"><div class="position-relative overflow-hidden rounded"><img src="https://via.placeholder.com/400x300/0d6efd/fff?text=Project+1" class="img-fluid w-100"><div class="position-absolute bottom-0 start-0 w-100 p-3 text-white" style="background:linear-gradient(transparent,rgba(0,0,0,0.8));"><h6 class="mb-0" contenteditable="true">Project One</h6><small contenteditable="true">Web Design</small></div></div></div><div class="col-md-4"><div class="position-relative overflow-hidden rounded"><img src="https://via.placeholder.com/400x300/198754/fff?text=Project+2" class="img-fluid w-100"><div class="position-absolute bottom-0 start-0 w-100 p-3 text-white" style="background:linear-gradient(transparent,rgba(0,0,0,0.8));"><h6 class="mb-0" contenteditable="true">Project Two</h6><small contenteditable="true">Branding</small></div></div></div><div class="col-md-4"><div class="position-relative overflow-hidden rounded"><img src="https://via.placeholder.com/400x300/dc3545/fff?text=Project+3" class="img-fluid w-100"><div class="position-absolute bottom-0 start-0 w-100 p-3 text-white" style="background:linear-gradient(transparent,rgba(0,0,0,0.8));"><h6 class="mb-0" contenteditable="true">Project Three</h6><small contenteditable="true">Development</small></div></div></div></div></div></section>'
    },
    {
        id: 'lib-contact-split',
        name: 'Split Contact Section',
        category: 'contact',
        tags: ['contact', 'form', 'map', 'split'],
        description: 'A split layout with contact form and info side.',
        html: '<section class="py-5"><div class="container"><div class="row g-0 shadow rounded-4 overflow-hidden"><div class="col-lg-5 bg-primary text-white p-5 d-flex flex-column justify-content-center"><h3 class="fw-bold mb-3" contenteditable="true">Get in Touch</h3><p class="mb-4" contenteditable="true">We\'d love to hear from you. Here\'s how you can reach us.</p><div class="mb-3"><i class="bi bi-geo-alt me-2"></i><span contenteditable="true">123 Main Street, City, Country</span></div><div class="mb-3"><i class="bi bi-telephone me-2"></i><span contenteditable="true">+1 (555) 123-4567</span></div><div class="mb-4"><i class="bi bi-envelope me-2"></i><span contenteditable="true">hello@example.com</span></div><div class="d-flex gap-2"><a href="#" class="text-white"><i class="bi bi-facebook fs-5"></i></a><a href="#" class="text-white"><i class="bi bi-twitter fs-5"></i></a><a href="#" class="text-white"><i class="bi bi-instagram fs-5"></i></a></div></div><div class="col-lg-7 p-5"><form><div class="row g-3"><div class="col-md-6"><label class="form-label">First Name</label><input type="text" class="form-control" placeholder="John"></div><div class="col-md-6"><label class="form-label">Last Name</label><input type="text" class="form-control" placeholder="Doe"></div><div class="col-12"><label class="form-label">Email</label><input type="email" class="form-control" placeholder="john@example.com"></div><div class="col-12"><label class="form-label">Message</label><textarea class="form-control" rows="4" placeholder="Your message..."></textarea></div><div class="col-12"><button class="btn btn-primary px-4" contenteditable="true">Send Message</button></div></div></form></div></div></div></section>'
    },
    {
        id: 'lib-footer-extended',
        name: 'Extended Footer',
        category: 'footers',
        tags: ['footer', 'extended', 'links', 'social'],
        description: 'A comprehensive footer with multiple columns and social links.',
        html: '<footer class="bg-dark text-light pt-5 pb-3"><div class="container"><div class="row g-4"><div class="col-lg-4"><h5 class="mb-3" contenteditable="true">BrandName</h5><p class="text-muted" contenteditable="true">Building amazing digital experiences since 2020. Our mission is to make web development accessible to everyone.</p><div class="d-flex gap-2 mt-3"><a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-facebook"></i></a><a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-twitter"></i></a><a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-instagram"></i></a><a href="#" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-linkedin"></i></a></div></div><div class="col-lg-2 col-md-4"><h6 class="text-uppercase mb-3" contenteditable="true">Product</h6><ul class="list-unstyled"><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Features</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Pricing</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Templates</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Integrations</a></li></ul></div><div class="col-lg-2 col-md-4"><h6 class="text-uppercase mb-3" contenteditable="true">Company</h6><ul class="list-unstyled"><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">About</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Blog</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Careers</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Contact</a></li></ul></div><div class="col-lg-2 col-md-4"><h6 class="text-uppercase mb-3" contenteditable="true">Support</h6><ul class="list-unstyled"><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Help Center</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Documentation</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">API Status</a></li></ul></div><div class="col-lg-2"><h6 class="text-uppercase mb-3" contenteditable="true">Legal</h6><ul class="list-unstyled"><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Privacy</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Terms</a></li><li class="mb-2"><a href="#" class="text-muted text-decoration-none" contenteditable="true">Cookie Policy</a></li></ul></div></div><hr class="my-4"><div class="d-flex justify-content-between align-items-center"><p class="text-muted mb-0" contenteditable="true">© 2024 BrandName. All rights reserved.</p><p class="text-muted mb-0" contenteditable="true">Made with ❤️</p></div></div></footer>'
    }
];

// ============================================
// INITIAL LIBRARY COMPONENTS (bundled with app)
// ============================================

const INITIAL_MY_COMPONENTS = [];
