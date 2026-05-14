/**
* Template Name: iPortfolio
* Updated: Sep 18 2023 with Bootstrap v5.3.2
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  const siteDataFallback = {
    hero: {
      name: "Danny Aglinao",
      typedItems: ["Computer Engineer", "Graphics Specialist"]
    },
    about: {
      title: "Computer Engineer & Graphics Specialist.",
      description: "Computer Engineering Graduate at Universidad de Manila Batch 2020 & currently working as Graphics Specialist at Integreon Managed Solutions Manila",
      birthday: "22 May 1997",
      website: "https://engraglinao.github.io/",
      phone: "+63 945 264 8770",
      city: "Metro Manila",
      degree: "Bachelors Degree",
      email: "buenavistaaglinaodanny@gmail.com",
      freelance: "Available"
    },
    skills: {
      designTools: ["Canva", "Figma", "Adobe Illustration", "Adobe InDesign"],
      officeSoftware: ["Microsoft PowerPoint", "Microsoft Excel"],
      technicalSkills: ["Computer Literate", "Basic Troubleshooting", "Basic Networking", "Web Design", "HTML, CSS, JS, WordPress"]
    },
    resume: {
      education: [
        {
          title: "Tertiary",
          date: "2014-2020",
          degree: "Bachelor of Science in Computer Engineering",
          school: "Universidad de Manila | One Mehan Garden, Manila City, Ph 1000"
        },
        {
          title: "Secondary",
          date: "2010 - 2014",
          degree: "Manila High School",
          school: "Intramuros Manila, 1002 Metro Manila"
        },
        {
          title: "Primary",
          date: "2004 - 2010",
          degree: "Apolinario Mabini Elementary School",
          school: "Quiapo Manila, 1001 Metro Manila"
        }
      ],
      experience: [
        {
          title: "Advanced Graphics Specialist",
          date: "Oct 28, 2022 - Present",
          company: "Integreon Managed Solutions",
          description: ["Produces advanced lay-out business presentation and documents, Also creates blog post using Adobe Illustrator and Indesign"]
        },
        {
          title: "Dev/Quality Assurance",
          date: "June 2022 - September 2022",
          company: "Integreon Managed Solutions",
          description: ["Training for QA Position"]
        },
        {
          title: "Graphics Specialist",
          date: "May 21, 2021 - May 14, 2022",
          company: "Integreon Managed Solutions",
          description: ["Produces, re-creates, edits, formats and lay-out business presentations and documents according to the client's specifications using MS Office applications, specifically PowerPoint, trained to work with effeciency and ensuring task and jobs are delivered in a timely manner with high quality output."]
        },
        {
          title: "Document Specialist",
          date: "Nov 17, 2020 - May 16, 2021",
          company: "Integreon Managed Solutions",
          description: ["Create, Re-create, Alterate and Proof read all the contents of client's business documents and fix all errors wherener needed. Knowledgeable in using XML and HTML Document tags, making sure documents received by client passed the quality check."]
        },
        {
          title: "Game Developer",
          date: "Nov 17, 2020 - May 16, 2021",
          company: "PCI Tech Innovations Center",
          description: ["Creates 3D Models for our Marine Clients, This Model/Objects will be used for our AR and VR Projects that will serve as a training station of our Marine Clients. We also create a Educational Game, Website and Programs."]
        }
      ]
    },
    portfolio: [
      {
        title: "Oppo Emcor Business Review",
        description: "Actual PPT sample from your portfolio. Open the file to view the presentation content.",
        link: "assets/my-portfolio/Oppo%20Emcor%20Business%20Review_d1.pptx",
        thumbnail: "assets/img/placeholder.png"
      }
    ],
    contact: {
      location: "452 Cabildo St. Intramuros Manila",
      email: "buenavistaaglinaodanny@gmail.com",
      phone: "+63 945 264 8770",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.1486954144443!2d120.97278637465767!3d14.590601577322332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cb09bdd117e7%3A0x46aac34ea001317!2sAglinao%20Family!5e0!3m2!1sen!2sph!4v1699881360474!5m2!1sen!2sph"
    }
  };

  const appIconMap = {
    "Canva": "bxl-canva",
    "Figma": "bxl-figma",
    "Microsoft PowerPoint": "bi bi-filetype-ppt",
    "Microsoft Excel": "bi bi-filetype-xls",
    "Adobe Illustration": "bxl-adobe",
    "Adobe InDesign": "bxl-adobe"
  };

  const createAppIconCard = (name) => {
    const iconClass = appIconMap[name] || 'bi bi-app';
    return `
      <div class="app-icon-card" title="${name}">
        <i class="${iconClass}"></i>
        <span>${name}</span>
      </div>
    `;
  };

  const formatListItem = (text) => `
    <li><i class="bi bi-check-circle-fill"></i> ${text}</li>
  `;

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const populateFromData = (data) => {
    const heroName = select('#hero-name');
    const heroTyped = select('.typed');
    if (heroName) heroName.textContent = data.hero.name || '';
    if (heroTyped) {
      const typedItems = data.hero.typedItems || [];
      heroTyped.setAttribute('data-typed-items', typedItems.join(','));
      if (window.heroTypedInstance && typeof window.heroTypedInstance.destroy === 'function') {
        window.heroTypedInstance.destroy();
      }
      if (typedItems.length && typeof Typed !== 'undefined') {
        window.heroTypedInstance = new Typed('.typed', {
          strings: typedItems,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000
        });
      } else if (heroTyped) {
        heroTyped.textContent = typedItems.join(', ');
      }
    }

    const aboutFields = {
      '#about-title': data.about.title,
      '#about-description': data.about.description,
      '#about-birthday': data.about.birthday,
      '#about-phone': data.about.phone,
      '#about-city': data.about.city,
      '#about-degree': data.about.degree,
      '#about-email': data.about.email,
      '#about-freelance': data.about.freelance
    };

    Object.entries(aboutFields).forEach(([selector, value]) => {
      const el = select(selector);
      if (el) el.textContent = value || '';
    });

    const websiteLink = select('#about-website');
    if (websiteLink) {
      websiteLink.textContent = data.about.website || data.about.website;
      websiteLink.href = data.about.website || '#';
    }

    const ageElement = select('#age');
    if (ageElement) {
      ageElement.textContent = calculateAge(data.about.birthday || '1997-05-22');
    }

    const skillsAppText = select('#skills-app-text');
    if (skillsAppText) {
      skillsAppText.textContent = `Currently using: ${[...data.skills.designTools, ...data.skills.officeSoftware].join(', ')}`;
    }

    const appIconList = select('#app-icon-list');
    if (appIconList) {
      appIconList.innerHTML = [...data.skills.designTools, ...data.skills.officeSoftware].map(createAppIconCard).join('');
    }

    const techSkillsList = select('#tech-skills-list');
    if (techSkillsList) {
      techSkillsList.innerHTML = (data.skills.technicalSkills || []).map(formatListItem).join('');
    }

    const portfolioGrid = select('#portfolio-grid');
    if (portfolioGrid) {
      portfolioGrid.innerHTML = (data.portfolio || []).map(item => `
        <div class="portfolio-card">
          <img src="${item.thumbnail || 'assets/img/placeholder.png'}" alt="${item.title}">
          <div class="portfolio-card-content">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="portfolio-card-actions">
              ${item.link ? `<a href="${item.link}" target="_blank" class="portfolio-btn">View Project</a>` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }

    const contactFields = {
      '#contact .address p': data.contact.location,
      '#contact .email p': data.contact.email,
      '#contact .phone p': data.contact.phone
    };
    Object.entries(contactFields).forEach(([selector, value]) => {
      const el = select(selector);
      if (el) el.textContent = value || '';
    });

    const mapFrame = select('#contact iframe');
    if (mapFrame && data.contact.mapUrl) {
      mapFrame.src = data.contact.mapUrl;
    }

    const educationList = select('#education-list');
    if (educationList) {
      educationList.innerHTML = (data.resume.education || []).map(item => `
        <div class="resume-item">
          <h4>${item.title}</h4>
          <h5>${item.date}</h5>
          <p><em>${item.degree}</em></p>
          <p>${item.school}</p>
        </div>
      `).join('');
    }

    const experienceList = select('#experience-list');
    if (experienceList) {
      experienceList.innerHTML = (data.resume.experience || []).map(item => `
        <div class="resume-item">
          <h4>${item.title}</h4>
          <h5>${item.date}</h5>
          <p><em>${item.company}</em></p>
          <ul>${(item.description || []).map(desc => `<li>${desc}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  };

  const loadJsonWithXHR = (url) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200 || (window.location.protocol === 'file:' && xhr.status === 0)) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error(`XHR status ${xhr.status}`));
        }
      };
      xhr.onerror = reject;
      xhr.send();
    });
  };

  const loadData = () => {
    const tryFallback = () => {
      if (window.siteData) {
        console.warn('Using embedded siteData fallback.');
        return Promise.resolve(window.siteData);
      }
      if (siteDataFallback) {
        console.warn('Using internal siteData fallback.');
        return Promise.resolve(siteDataFallback);
      }
      const stored = localStorage.getItem('siteData');
      if (stored) {
        console.warn('Using saved localStorage siteData fallback.');
        return Promise.resolve(JSON.parse(stored));
      }
      return Promise.reject(new Error('Unable to load data.json and no fallback data available.'));
    };

    const tryXhr = () => {
      if (window.location.protocol !== 'file:') {
        return Promise.reject(new Error('XHR fallback only used for file protocol.'));
      }
      return loadJsonWithXHR('data.json');
    };

    return fetch('data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .catch(() => fetch('./data.json'))
      .then(response => {
        if (response && typeof response.json === 'function') {
          return response.json();
        }
        return response;
      })
      .catch(() => tryXhr())
      .catch(() => tryFallback());
  };

  loadData()
    .then(data => {
      try {
        populateFromData(data);
        localStorage.setItem('siteData', JSON.stringify(data));
        console.log('site data loaded', data);
      } catch (error) {
        console.error('Failed to render site data:', error);
        const heroName = select('#hero-name');
        if (heroName) heroName.textContent = 'Unable to render content';
      }
    })
    .catch(error => {
      console.error('Failed to load site data:', error);
      const heroName = select('#hero-name');
      const aboutTitle = select('#about-title');
      if (heroName) heroName.textContent = 'Unable to load content';
      if (aboutTitle) aboutTitle.textContent = 'Unable to load content';
    });

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });

  /**
   * Testimonials slider
   */
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Calculate and display age
   */
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const ageElement = select('#age');
  if (ageElement) {
    ageElement.textContent = calculateAge('1997-05-22');
  }

  /**
   * Initiate Pure Counter 
   */
  new PureCounter();

  /**
   * Contact form required validation
   */
  const contactForm = select('.php-email-form');
  if (contactForm) {
    const emailField = select('#email');
    const subjectField = select('#subject');
    const messageField = select('#message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const updateSubmitState = () => {
      const emailValid = emailField ? emailField.checkValidity() : false;
      const fieldsFilled = [emailField, subjectField, messageField].every(field => field && field.value.trim() !== '');
      const canSubmit = emailValid && fieldsFilled;

      if (submitButton) {
        submitButton.disabled = !canSubmit;
        submitButton.classList.toggle('disabled', !canSubmit);
      }
    };

    [emailField, subjectField, messageField].forEach(field => {
      if (field) {
        field.addEventListener('input', updateSubmitState);
      }
    });

    updateSubmitState();

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (submitButton && submitButton.disabled) {
        if (emailField) {
          emailField.reportValidity();
        }
        return;
      }

      const email = emailField ? emailField.value.trim() : '';
      const subject = subjectField ? subjectField.value.trim() : '';
      const message = messageField ? messageField.value.trim() : '';
      const mailTo = `mailto:buenavistaaglinaodanny@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `From: ${email}\n\n${message}`
      )}`;

      window.location.href = mailTo;
      contactForm.querySelector('.sent-message').classList.add('d-block');
      contactForm.reset();
      updateSubmitState();
    });
  }

})()