// Main JavaScript file for vanilla replication of the Next.js portfolio

// Navbar rendering & theme logic for vanilla JS
const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
];

function renderNavbar() {
  const links = NAV_LINKS.map(
    (s) => `<li><a href="#${s.id}" class="nav-link" id="nav-${s.id}">${s.label}</a></li>`
  ).join("");
  return `
    <header class="navbar">
      <div class="container navbar-inner">
        <a href="#home" class="logo">Lashata Shakya</a>
        <ul class="nav-list">${links}</ul>
        <button id="theme-toggle" class="theme-btn" aria-label="Toggle theme">🌙</button>
      </div>
    </header>
  `;
}

document.getElementById('navbar').innerHTML = renderNavbar();

// Smooth scroll animation for navbar links
function smoothScrollToSection(targetId) {
  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  const navbarHeight = 80; // Account for fixed navbar
  const targetPosition = targetSection.offsetTop - navbarHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

// Add smooth scroll to all nav links
function initSmoothScroll() {
  // Nav links
  NAV_LINKS.forEach(link => {
    const navEl = document.getElementById(`nav-${link.id}`);
    if (navEl) {
      navEl.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollToSection(link.id);
      });
    }
  });

  // Logo link
  const logoLink = document.querySelector('.logo');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('home');
    });
  }

  // Hero section buttons
  const viewProjectsBtn = document.querySelector('a[href="#projects"]');
  if (viewProjectsBtn && viewProjectsBtn.classList.contains('btn-primary')) {
    viewProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('projects');
    });
  }

  const getInTouchBtn = document.querySelector('a[href="#contact"]');
  if (getInTouchBtn && getInTouchBtn.classList.contains('btn-outline')) {
    getInTouchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('contact');
    });
  }
}

// Initialize smooth scroll after navbar is rendered
setTimeout(initSmoothScroll, 50);

// Also initialize after hero section is rendered (for hero buttons)
setTimeout(() => {
  // Hero section buttons
  const viewProjectsBtn = document.querySelector('a[href="#projects"].btn-primary');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('projects');
    });
  }

  const getInTouchBtn = document.querySelector('a[href="#contact"].btn-outline');
  if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollToSection('contact');
    });
  }
}, 150);

// Theme toggle logic
const htmlEl = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
let dark = false;

function updateThemeIcon() {
  themeBtn.textContent = dark ? '☀️' : '🌙';
}

themeBtn.onclick = function () {
  dark = !dark;
  htmlEl.classList.toggle('dark', dark);
  updateThemeIcon();
};
// load theme if stored later
updateThemeIcon();

// Highlight current nav link as section enters viewport
let currentActive = 'home';
let scrollTimeout = null;

function setActiveNav() {
  const navbarHeight = 80;
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Check if at the very bottom - activate contact
  const isAtBottom = scrollY + windowHeight >= documentHeight - 20;

  let best = null;
  let bestScore = 0;

  // Get all sections and their visibility
  const sections = NAV_LINKS.map(link => {
    const section = document.getElementById(link.id);
    if (!section) return null;

    const rect = section.getBoundingClientRect();
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;

    // Calculate how much of section is in viewport (above navbar line)
    const viewportTop = scrollY + navbarHeight;
    const viewportBottom = scrollY + windowHeight;

    // Visible area calculation
    const visibleTop = Math.max(viewportTop, sectionTop);
    const visibleBottom = Math.min(viewportBottom, sectionBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibleRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

    // Distance from navbar (positive = below, negative = above)
    const distanceFromNavbar = rect.top - navbarHeight;

    // Calculate score: prioritize sections that are visible and near navbar
    let score = 0;

    // If at bottom, prioritize contact section
    if (isAtBottom && link.id === 'contact' && rect.top <= viewportBottom) {
      score = 1000;
      return { id: link.id, score, visibleRatio, distanceFromNavbar, section };
    }

    // For other sections, calculate based on visibility and position
    if (visibleHeight > 0) {
      score = visibleRatio * 100;

      // Heavy bonus if section top is at or just past navbar (optimal position)
      if (distanceFromNavbar >= -30 && distanceFromNavbar <= 150) {
        const proximityScore = 150 - Math.abs(distanceFromNavbar - 60);
        score += Math.max(0, proximityScore) * 2;
      }

      // Penalty if section is mostly scrolled past (top is above viewport)
      if (rect.top < scrollY) {
        score *= 0.3;
      }

      // Penalty if section hasn't reached navbar yet (too far below)
      if (rect.top > navbarHeight + 200) {
        score *= 0.5;
      }
    }

    return { id: link.id, score, visibleRatio, distanceFromNavbar, section };
  }).filter(Boolean);

  // Find the section with highest score
  sections.forEach(section => {
    if (section.score > bestScore) {
      bestScore = section.score;
      best = section.id;
    }
  });

  // Fallback to home if nothing found
  if (!best) {
    best = 'home';
  }

  // Only update if changed to prevent flickering
  if (best !== currentActive) {
    currentActive = best;

    // Update all nav links - use remove/add instead of toggle for reliability
    NAV_LINKS.forEach(link => {
      const el = document.getElementById(`nav-${link.id}`);
      if (el) {
        if (link.id === best) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }
    });
  }
}

// Use throttled scroll listener for better performance
function handleScroll() {
  if (scrollTimeout) {
    cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = requestAnimationFrame(setActiveNav);
}

window.addEventListener('scroll', handleScroll, { passive: true });
setActiveNav();

// HERO
document.getElementById('home').innerHTML = `
  <section class="hero-section">
    <div class="container">
      <p class="hero-eyebrow reveal">Digital Marketer<span class="typewriter-cursor">|</span></p>
      <h1 class="hero-title reveal">Lashata Shakya</h1>
      <div class="hero-actions reveal">
        <a href="#projects" class="btn-primary">View Projects</a>
        <a href="#contact" class="btn-outline">Get in touch</a>
      </div>
    </div>
  </section>
`;

// Typewriter effect for hero eyebrow
(function initTypewriter() {
  const words = ['Digital Marketer', 'Content Creator', 'Social Media Strategist', 'Learner', 'Marketing Enthusiast'];
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  if (!heroEyebrow) {
    // If element not ready, try again after a short delay
    setTimeout(initTypewriter, 100);
    return;
  }

  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  const pauseDuration = 2000;

  function typeWriter() {
    const currentWord = words[currentWordIndex];
    const textBefore = heroEyebrow.textContent.split('|')[0].trim();

    if (isDeleting) {
      // Delete characters
      heroEyebrow.innerHTML = currentWord.substring(0, currentCharIndex - 1) + '<span class="typewriter-cursor">|</span>';
      currentCharIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Type characters
      heroEyebrow.innerHTML = currentWord.substring(0, currentCharIndex + 1) + '<span class="typewriter-cursor">|</span>';
      currentCharIndex++;
      typingSpeed = 100; // Normal speed when typing
    }

    if (!isDeleting && currentCharIndex === currentWord.length) {
      // Word is complete, pause then start deleting
      typingSpeed = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      // Word is deleted, move to next word
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
      typingSpeed = 500; // Pause before starting next word
    }

    setTimeout(typeWriter, typingSpeed);
  }

  // Start the typewriter effect
  typeWriter();
})();

// ABOUT
document.getElementById('about').innerHTML = `
  <section class="about-section">
    <div class="container">
      <h2 class="section-title reveal">About</h2>
      <div class="timeline">
        <div class="timeline-item card reveal">
          <div class="timeline-date">2021 – Present</div>
          <div class="timeline-role">Bachelor of Information Management</div>
          <div class="timeline-desc">Studying business, analytics, and information systems. Currently in my last semester.</div>
        </div>
      </div>
    </div>
  </section>
`;

// PROJECTS
const PROJECTS = [
  {
    title: "Social Media Growth Campaign",
    description: "Executed a 3-month Instagram and Facebook campaign that increased engagement by 60% and followers by 35%.",
    tech: ["Content Strategy", "Canva", "Meta Business Suite"],
    link: "https://www.behance.net/yourname/social-media-campaign"
  },
  {
    title: "Email Marketing Funnel",
    description: "Designed and automated a 5-step email funnel that increased customer retention by 25%.",
    tech: ["Mailchimp", "A/B Testing", "Customer Segmentation"],
    link: "https://www.behance.net/yourname/email-marketing"
  },
  {
    title: "Content Marketing Strategy",
    description: "Developed a content strategy including blogs, reels, and infographics that boosted website traffic by 70%.",
    tech: ["SEO", "Copywriting", "Storytelling"],
    link: "https://www.behance.net/yourname/content-strategy"
  }
];

document.getElementById('projects').innerHTML = `
  <section class="projects-section">
    <div class="container">
      <h2 class="section-title reveal">Projects</h2>
      <div class="projects-grid">
        ${PROJECTS.map(proj => `
          <div class="project-card card reveal">
            <div class="project-title">${proj.title}</div>
            <div class="project-desc">${proj.description}</div>
            <div class="project-techs">
              ${proj.tech.map(t => `<span class="project-tech">${t}</span>`).join('')}
            </div>
            <div class="project-links">
              ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noreferrer" class="project-link">Code</a>` : ''}
              ${proj.demo ? `<a href="${proj.demo}" target="_blank" rel="noreferrer" class="project-link">Live</a>` : ''}
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>
`;

// CONTACT (email only)
document.getElementById('contact').innerHTML = `
  <section class="contact-section">
    <div class="container">
      <h2 class="section-title reveal">Contact</h2>
      <p class="reveal" style="margin-bottom:1.2em;color:var(--muted);max-width:38ch;">
        Feel free to reach out via email. I usually respond quickly.
      </p>
      <a href="mailto:lashatashakya9@gmail.com" class="btn-primary reveal">✉️ lashatashakya9@gmail.com</a>
    </div>
  </section>
`;

// FOOTER
document.getElementById('footer').innerHTML = `
  <footer class="footer-section">
    <div class="container">
      <a href="https://github.com/yourname" class="footer-link" target="_blank" rel="noreferrer">🐙 GitHub</a>
      <a href="https://linkedin.com/in/yourname" class="footer-link" target="_blank" rel="noreferrer">💼 LinkedIn</a>
      <a href="https://twitter.com/yourname" class="footer-link" target="_blank" rel="noreferrer">🐦 Twitter</a>
      <span class="footer-spacer"></span>
      <span class="footer-year">© ${new Date().getFullYear()} Lashata Shakya</span>
    </div>
  </footer>
`;

// Reveal-on-scroll observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: "-10% 0% -10% 0%", threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Create scroll-to-top button
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scroll-top';
scrollBtn.className = 'scroll-top';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
scrollBtn.textContent = '↑';
document.body.appendChild(scrollBtn);

function updateScrollTopVisibility() {
  const scrollY = window.scrollY || window.pageYOffset;
  const nearBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 200);
  const beyondThreshold = scrollY > 600;
  const shouldShow = nearBottom || beyondThreshold;
  scrollBtn.classList.toggle('visible', shouldShow);
}

window.addEventListener('scroll', updateScrollTopVisibility, { passive: true });
updateScrollTopVisibility();

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
