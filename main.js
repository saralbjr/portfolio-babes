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
window.addEventListener('scroll', setActiveNav);
function setActiveNav() {
    let best = 'home', bestTop = Infinity;
    NAV_LINKS.forEach(link => {
        const section = document.getElementById(link.id);
        if (!section) return;
        const top = Math.abs(section.getBoundingClientRect().top - 60);
        if (top < bestTop) {
            best = link.id; bestTop = top;
        }
    });
    NAV_LINKS.forEach(link => {
        const el = document.getElementById(`nav-${link.id}`);
        el && el.classList.toggle('active', link.id === best);
    });
}
setActiveNav();

// HERO
document.getElementById('home').innerHTML = `
  <section class="hero-section">
    <div class="container">
      <p class="hero-eyebrow reveal">Digital Marketing</p>
      <h1 class="hero-title reveal">Lashata Shakya</h1>
      <p class="hero-desc reveal">
        I craft impactful strategies that connect brands with the right audience.
      </p>
      <div class="hero-actions reveal">
        <a href="#projects" class="btn-primary">View Projects</a>
        <a href="#contact" class="btn-outline">Get in touch</a>
      </div>
    </div>
  </section>
`;

// ABOUT
document.getElementById('about').innerHTML = `
  <section class="about-section">
    <div class="container">
      <h2 class="section-title reveal">About</h2>
      <div class="timeline">
        <div class="timeline-item card reveal">
          <div class="timeline-date">2018 – 2022</div>
          <div class="timeline-role">Bachelor of Information Management</div>
          <div class="timeline-desc">Studied business, analytics, and information systems.</div>
        </div>
        <div class="timeline-item card reveal">
          <div class="timeline-date">2022 – Present</div>
          <div class="timeline-role">Digital Marketing Specialist</div>
          <div class="timeline-desc">Driving growth through content, SEO, and paid media.</div>
        </div>
      </div>
    </div>
  </section>
`;

// PROJECTS
const PROJECTS = [
    {
        title: "Portfolio Website",
        description: "This website. Built with Next.js App Router and Tailwind CSS.",
        tech: ["Next.js", "TypeScript", "Tailwind"],
        github: "https://github.com/yourname/portfolio",
        demo: "https://example.com"
    },
    {
        title: "Dashboard UI",
        description: "Responsive dashboard with charts and dark mode.",
        tech: ["React", "Framer Motion", "Tailwind"],
        github: "https://github.com/yourname/dashboard"
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
      <a href="mailto:lashatashakya9@example.com" class="btn-primary reveal">✉️ lashatashakya9@example.com</a>
    </div>
  </section>
`;

// FOOTER
document.getElementById('footer').innerHTML = `
  <footer class="footer-section">
    <div class="container">
      <a href="mailto:you@example.com" class="footer-link">✉️ Email</a>
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
