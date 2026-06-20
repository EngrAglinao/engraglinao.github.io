/**
 * Portfolio Data Sync Script
 * Syncs data from data.json to index.html
 */

async function loadAndSyncData() {
  try {
    let data;

    // First, try to load from localStorage (for immediate changes from manage.html)
    const localDataRaw = localStorage.getItem('portfolioData');
    if (localDataRaw) {
      try {
        const parsedLocal = JSON.parse(localDataRaw);
        const isValidLocal = Array.isArray(parsedLocal.skills) && parsedLocal.skills.every(skill => skill && typeof skill.type === 'string') && parsedLocal.skills.filter(skill => skill.type === 'App').every(skill => skill.iconUrl);

        if (isValidLocal) {
          data = parsedLocal;
          console.log('✓ Loaded data from localStorage');
        } else {
          localStorage.removeItem('portfolioData');
          console.log('⚠ Ignored stale localStorage data; loading data.json instead');
        }
      } catch (error) {
        localStorage.removeItem('portfolioData');
        console.log('⚠ Invalid localStorage content removed; loading data.json');
      }
    }

    if (!data) {
      const response = await fetch('data.json');
      data = await response.json();
      console.log('✓ Loaded data from data.json');
    }

    // Update Profile Section
    if (data.profile) {
      updateProfileSection(data.profile);
    }

    // Update Hero Section
    if (data.hero) {
      updateHeroSection(data.hero);
    }

    // Update Social Links
    if (data.social) {
      updateSocialLinks(data.social);
    }

    // Update Skills Section
    if (data.skills) {
      updateSkillsSection(data.skills);
    }

    // Update Education
    if (data.education) {
      updateEducationSection(data.education);
    }

    // Update Experience
    if (data.experience) {
      updateExperienceSection(data.experience);
    }

    console.log('✓ Data synced successfully');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function updateProfileSection(profile) {
  // Update About section title
  const titleEl = document.querySelector('.about .col-lg-8 h3');
  if (titleEl) titleEl.textContent = profile.title;

  // Update profile image
  const profileImg = document.querySelector('.about img');
  if (profileImg) profileImg.src = profile.profileImage;

  // Update profile info items
  const infoItems = document.querySelectorAll('.about ul li');
  
  // Map data to UI
  const today = new Date();
  const birthDate = new Date(profile.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  const updates = {
    'Birthday': profile.birthDate,
    'Website': `<a href="${profile.website}" target="_blank">${profile.website}</a>`,
    'Contact': profile.contact,
    'City': profile.city,
    'Age': age,
    'Degree': profile.degree,
    'Email': profile.email,
    'Freelance': profile.freelance
  };

  infoItems.forEach(item => {
    const strong = item.querySelector('strong');
    if (strong) {
      const label = strong.textContent.replace(':', '').trim();
      if (updates[label]) {
        const span = item.querySelector('span');
        if (span) {
          span.innerHTML = updates[label];
        }
      }
    }
  });
}

function updateHeroSection(hero) {
  const heroH1 = document.querySelector('#hero h1');
  if (heroH1) heroH1.textContent = hero.name;

  const typedSpan = document.querySelector('.typed');
  if (typedSpan && hero.roles && hero.roles.length > 0) {
    typedSpan.setAttribute('data-typed-items', hero.roles.join(','));
  }
}

function updateSocialLinks(social) {
  const socialLinks = document.querySelectorAll('.social-links a');
  
  socialLinks.forEach(link => {
    if (link.classList.contains('facebook') && social.facebook) {
      link.href = social.facebook;
    } else if (link.classList.contains('instagram') && social.instagram) {
      link.href = social.instagram;
    } else if (link.classList.contains('linkedin') && social.linkedin) {
      link.href = social.linkedin;
    }
  });
}

function updateSkillsSection(skills) {
  const skillsGrid = document.getElementById('skillsGrid');
  if (!skillsGrid) return;

  skillsGrid.innerHTML = '';

  const apps = skills.filter(skill => skill.type === 'App');
  const abilities = skills.filter(skill => skill.type !== 'App');

  if (apps.length > 0) {
      const appSection = document.createElement('div');
      appSection.className = 'skill-section app-section';
      appSection.innerHTML = '<h3>Apps</h3>';

      const appGrid = document.createElement('div');
      appGrid.className = 'app-grid';

      apps.forEach((skill, index) => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.setAttribute('data-aos', 'fade-up');
        skillItem.setAttribute('data-aos-delay', (index % 3) * 100);

        const iconClass = skill.icon && skill.icon.trim().split(/\s+/).some(cls => cls.startsWith('bx'))
          ? skill.icon.trim()
          : `bx ${skill.icon || 'bxs-paint'}`;

        skillItem.innerHTML = `
          <div class="app-card">
            <div class="app-icon">
              ${skill.iconUrl ? `<img src="${skill.iconUrl}" alt="${skill.name}" style="width: 100%; height: 100%; object-fit: contain;">` : `<i class="${iconClass}" style="color: ${skill.iconColor || '#149ddd'}"></i>`}
            </div>
          </div>
        `;
        appGrid.appendChild(skillItem);
      });

      appSection.appendChild(appGrid);
      skillsGrid.appendChild(appSection);
    }
  if (abilities.length > 0) {
    const abilitySection = document.createElement('div');
    abilitySection.className = 'skill-section ability-section';
    abilitySection.innerHTML = '<h3>Abilities</h3>';

    const abilityList = document.createElement('ul');
    abilityList.className = 'abilities-list';

    abilities.forEach((skill) => {
      const listItem = document.createElement('li');
      listItem.textContent = skill.name;
      abilityList.appendChild(listItem);
    });

    abilitySection.appendChild(abilityList);
    skillsGrid.appendChild(abilitySection);
  }
}

function updateEducationSection(education) {
  const resumeSection = document.querySelector('.resume .row');
  if (!resumeSection) return;

  const educationCol = resumeSection.querySelector('.col-lg-6');
  if (!educationCol) return;

  // Find or create education container
  let educationContainer = educationCol.querySelector('[data-education-list]');
  if (!educationContainer) {
    educationContainer = educationCol;
    educationContainer.innerHTML = '<h3 class="resume-title">Education</h3>';
  }

  education.forEach(edu => {
    const item = document.createElement('div');
    item.className = 'resume-item';
    item.innerHTML = `
      <h4>${edu.degree}</h4>
      <h5>${edu.years}</h5>
      <p><em>${edu.level}</em></p>
      <p>${edu.school}</p>
    `;
    educationContainer.appendChild(item);
  });
}

function updateExperienceSection(experience) {
  const resumeSection = document.querySelector('.resume .row');
  if (!resumeSection) return;

  const experienceCols = resumeSection.querySelectorAll('.col-lg-6');
  const experienceCol = experienceCols[experienceCols.length - 1];
  if (!experienceCol) return;

  // Check if experience section already has a title
  let experienceTitle = experienceCol.querySelector('.resume-title');
  let experienceContainer;

  if (experienceTitle && experienceTitle.textContent === 'Professional Experience') {
    // Title already exists, use it as container
    experienceContainer = experienceTitle.parentElement;
    // Clear everything after the title
    const titleIndex = Array.from(experienceContainer.children).indexOf(experienceTitle);
    while (experienceContainer.children.length > titleIndex + 1) {
      experienceContainer.removeChild(experienceContainer.lastChild);
    }
  } else {
    // Create new container with title
    experienceContainer = document.createElement('div');
    experienceContainer.innerHTML = '<h3 class="resume-title">Professional Experience</h3>';
    experienceCol.appendChild(experienceContainer);
  }

  experience.forEach(exp => {
    const bullets = Array.isArray(exp.description)
      ? exp.description
      : String(exp.description).split(',').map(line => line.trim()).filter(Boolean);

    const descriptionHtml = bullets.length
      ? `<ul>${bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
      : '';

    const item = document.createElement('div');
    item.className = 'resume-item';
    item.innerHTML = `
      <h4>${exp.position}</h4>
      <h5>${exp.years}</h5>
      <p><em>${exp.company}</em></p>
      ${descriptionHtml}
    `;
    experienceContainer.appendChild(item);
  });
}

// Load and sync data when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAndSyncData);
} else {
  loadAndSyncData();
}
