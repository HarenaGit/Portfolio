let portfolioData = null;

function setStaticTexts() {
  setElText('nav-home', "Home");
  setElText('nav-about', "About");
  setElText('nav-works', "Works");
  setElText('nav-skills', "Skills");
  setElText('nav-contact', "Contact");
  setElText('nav-resume', "Resume");
}

async function fetchPortfolioData() {
  console.log('Fetching portfolio data...');
  setStaticTexts(); // Load static texts immediately
  
  try {
    const response = await fetch('PortfolioData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    portfolioData = await response.json();
    console.log('Portfolio data received:', portfolioData);
    
    applyPortfolioData();
    console.log('Portfolio data applied successfully.');
    hideLoader();
  } catch (error) {
    console.error('Error loading portfolio data:', error);
    if (window.location.protocol === 'file:') {
      console.error('Detected file:// protocol. Fetch will fail due to CORS. Please use a local server.');
    }
    hideLoader();
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text || '';
  } else {
    // console.warn(`Element with id "${id}" not found.`);
  }
}

function applyPortfolioData() {
  if (!portfolioData) return;

  // Hero Section
  if (portfolioData.hero) {
    setElText('nav-brand-name', portfolioData.hero.brand_name);
    setElText('hero-eyebrow', portfolioData.hero.eyebrow);
    setElText('hero-title', portfolioData.hero.title);
    setElText('hero-description', portfolioData.hero.description);
    setElText('hero-cta-primary', portfolioData.hero.cta_primary);
    setElText('hero-cta-secondary', portfolioData.hero.cta_secondary);
  }

  // About Section
  if (portfolioData.about) {
    setElText('about-title', portfolioData.about.title);
    setElText('about-tooltip', portfolioData.about.tooltip);
  }

  // Works Section
  if (portfolioData.works) {
    setElText('works-title', portfolioData.works.section_title);
    if (portfolioData.works.selection) {
      setElText('works-selection-eyebrow', portfolioData.works.selection.eyebrow);
      setElText('works-selection-title', portfolioData.works.selection.title);
      setElText('works-pro-tag', portfolioData.works.selection.pro_tag);
      setElText('works-pro-label', portfolioData.works.selection.pro_label);
      setElText('works-pro-explore', portfolioData.works.selection.explore);
      setElText('works-perso-tag', portfolioData.works.selection.perso_tag);
      setElText('works-perso-label', portfolioData.works.selection.perso_label);
      setElText('works-perso-explore', portfolioData.works.selection.explore);
    }
    if (portfolioData.works.tabs) {
      setElText('tab-pro-btn', portfolioData.works.tabs.pro);
      setElText('tab-perso-btn', portfolioData.works.tabs.perso);
    }

    // Professional - Etech
    if (portfolioData.works.professional) {
      const etech = portfolioData.works.professional.find(p => p.id === 'etech');
      if (etech) {
        setElText('etech-period', etech.period);
        setElText('etech-company', etech.company);
        setElText('etech-company-subtitle', etech.company_subtitle);
        setElText('etech-role', etech.role);
        setElText('etech-role-subtitle', etech.role_subtitle);
        
        const branchCards = document.querySelectorAll('#professional-content .branch-card');
        if (etech.branches) {
          etech.branches.forEach((branch, idx) => {
            if (branchCards[idx]) {
              const h4 = branchCards[idx].querySelector('h4');
              const p = branchCards[idx].querySelector('p');
              if (h4) h4.textContent = branch.title;
              if (p) p.textContent = branch.description;
            }
          });
        }
      }

      // Professional - ASECNA
      const asecna = portfolioData.works.professional.find(p => p.id === 'asecna');
      if (asecna) {
        setElText('asecna-period', asecna.period);
        setElText('asecna-company', asecna.company);
        setElText('asecna-company-subtitle', asecna.company_subtitle);
        setElText('asecna-role', asecna.role);
        setElText('asecna-role-subtitle', asecna.role_subtitle);

        const asecnaCards = document.querySelectorAll('.asecna-graph .branch-card');
        if (asecna.branches) {
          asecna.branches.forEach((branch, idx) => {
            if (asecnaCards[idx]) {
              const h4 = asecnaCards[idx].querySelector('h4');
              const p = asecnaCards[idx].querySelector('p');
              if (h4) h4.textContent = branch.title;
              if (p) p.textContent = branch.description;
            }
          });
        }
      }
    }

    // Personal Projects
    if (portfolioData.works.personal) {
      const persoGrid = document.getElementById('personal-projects-grid');
      if (persoGrid) {
        persoGrid.innerHTML = portfolioData.works.personal.map(p => `
          <article class="card reveal">
            <h3>${p.title}</h3>
            <p class="meta">${p.meta}</p>
            <a href="${p.link}" target="_blank" rel="noreferrer">${p.label}</a>
          </article>
        `).join('');
      }
    }
  }

  // Skills Section
  if (portfolioData.skills) {
    setElText('skills-title', portfolioData.skills.section_title);
    if (portfolioData.skills.education) {
      setElText('edu-degree', portfolioData.skills.education.degree);
      setElText('edu-period', portfolioData.skills.education.period);
      setElText('edu-desc', portfolioData.skills.education.description);
    }
  }

  // Contact Section
  if (portfolioData.contact) {
    setElText('contact-title', portfolioData.contact.section_title);
    setElText('contact-subtitle', portfolioData.contact.section_subtitle);
    setElText('contact-location-title', portfolioData.contact.location_title);
    setElText('contact-email', portfolioData.contact.email);
    setElText('contact-phone', portfolioData.contact.phone);
    setElText('contact-status', portfolioData.contact.status);
    setElText('contact-availability', portfolioData.contact.availability);
    setElText('contact-cta', portfolioData.contact.cta);
  }

  // Footer
  if (portfolioData.footer) {
    setElText('footer-copyright', portfolioData.footer.copyright);
  }
}

function hideLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.classList.add('is-hidden');
    setTimeout(() => {
      loader.style.display = 'none';
      // Re-trigger reveal animations for visible elements
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 800);
  }
}

// hideLoader() call was here, removing it to move to bottom

const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

// --- Reveal Observer ---
let typewriterStarted = false;
let contactTimeout;
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        
        // Trigger typewriter for about section
        if (entry.target.id === "about" && !typewriterStarted) {
          typewriterStarted = true;
          startAboutTypewriter();
        }

        // Trigger contact animations
        if (entry.target.id === "contact") {
          const mapSvg = entry.target.querySelector(".map-svg");
          const pinCard = entry.target.querySelector(".pin-info-card");
          if (mapSvg) {
            mapSvg.classList.add("is-revealed");
            clearTimeout(contactTimeout);
            contactTimeout = setTimeout(() => {
              mapSvg.classList.add("is-breathing");
              if (pinCard) pinCard.classList.add("is-active");
            }, 800);
          }
        }
      } else {
        // Reset contact animations when leaving viewport
        if (entry.target.id === "contact") {
          const mapSvg = entry.target.querySelector(".map-svg");
          const pinCard = entry.target.querySelector(".pin-info-card");
          clearTimeout(contactTimeout);
          if (mapSvg) {
            mapSvg.classList.remove("is-revealed", "is-breathing");
          }
          if (pinCard) {
            pinCard.classList.remove("is-active");
          }
        }
      }

      // Handle works header visibility when skills section is near
      if (entry.target.id === "projects") {
        const worksWrappers = document.querySelectorAll(".works-sticky-wrapper, .works-tabs-sticky-wrapper");
        worksWrappers.forEach(wrapper => {
          if (entry.isIntersecting) {
            wrapper.style.opacity = "0";
            wrapper.style.visibility = "hidden";
            wrapper.style.pointerEvents = "none";
          } else {
            // Only show it if we are above the skills section
            const rect = entry.target.getBoundingClientRect();
            if (rect.top > 0) {
              wrapper.style.opacity = "1";
              wrapper.style.visibility = "visible";
              wrapper.style.pointerEvents = "auto";
            }
          }
        });
      }
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// --- Active Nav via viewport marker ---
function setActiveNav(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("active", isActive);
  });
}

function updateActiveNavByScroll() {
  if (!sections.length) return;

  const markerY = window.scrollY + (window.innerHeight * 0.35);
  let activeSectionId = sections[0].id;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (markerY >= top && markerY < bottom) {
      activeSectionId = section.id;
    }
  });

  setActiveNav(activeSectionId);
}

window.addEventListener("scroll", updateActiveNavByScroll, { passive: true });
window.addEventListener("resize", updateActiveNavByScroll);

// --- Avatar Scroll Animation ---
const avatar = document.getElementById("main-avatar");
const avatarTarget = document.getElementById("about-avatar-target");
const orbitScene = document.querySelector(".orbit-scene");

function handleAvatarScroll() {
  if (!avatar || !avatarTarget || !orbitScene) return;
  const worksTarget = document.getElementById("works-avatar-target");
  if (!worksTarget) return;

  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  
  // Locations
  const aboutTitle = document.querySelector("#about h2");
  const worksTitle = document.querySelector("#works h2");
  if (!aboutTitle || !worksTitle) return;
  
  const aboutTargetTop = avatarTarget.getBoundingClientRect().top + scrollY;
  const worksTargetTop = worksTarget.getBoundingClientRect().top + scrollY;

  // Segment 1: Hero -> About
  const s1Start = Math.max(0, (aboutTitle.getBoundingClientRect().top + scrollY) - vh);
  const s1End = aboutTargetTop - vh * 0.5;

  // Segment 2: About -> Works
  const s2Start = Math.max(s1End, (worksTitle.getBoundingClientRect().top + scrollY) - vh);
  const s2End = worksTargetTop - vh * 0.5;


  // Helper for easing
  const ease = (p) => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

  if (scrollY <= s1Start) {
    // State: Hero
    avatar.style.position = "absolute";
    avatar.style.width = "54%";
    avatar.style.height = "54%";
    avatar.style.top = "23%";
    avatar.style.left = "23%";
    avatar.style.transform = "none";
    if (avatar.parentElement !== orbitScene) orbitScene.prepend(avatar);
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");

  } else if (scrollY <= s1End) {
    // Transition: Hero -> About
    if (avatar.parentElement !== document.body) document.body.appendChild(avatar);
    avatar.style.position = "fixed";
    avatar.style.zIndex = "100";
    
    const p = ease((scrollY - s1Start) / (s1End - s1Start));
    const orbitRect = orbitScene.getBoundingClientRect();
    const targetRect = avatarTarget.getBoundingClientRect();

    const curW = (orbitRect.width * 0.54) + (targetRect.width - orbitRect.width * 0.54) * p;
    const curX = (orbitRect.left + orbitRect.width * 0.23) + (targetRect.left - (orbitRect.left + orbitRect.width * 0.23)) * p;
    const curY = (orbitRect.top + orbitRect.height * 0.23) + (targetRect.top - (orbitRect.top + orbitRect.height * 0.23)) * p;

    avatar.style.width = `${curW}px`;
    avatar.style.height = `${curW}px`;
    avatar.style.left = `${curX}px`;
    avatar.style.top = `${curY}px`;
    avatar.style.transform = `rotate(${p * 15}deg)`;
    
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");

  } else if (scrollY <= s2Start) {
    // State: Docked at About
    avatar.style.position = "relative";
    avatar.style.width = "100%";
    avatar.style.height = "100%";
    avatar.style.top = "0";
    avatar.style.left = "0";
    avatar.style.transform = "none";
    if (avatar.parentElement !== avatarTarget) avatarTarget.appendChild(avatar);
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.add("is-active");

  } else if (scrollY <= s2End) {
    // Transition: About -> Works
    if (avatar.parentElement !== document.body) document.body.appendChild(avatar);
    avatar.style.position = "fixed";
    avatar.style.zIndex = "100";

    const p = ease((scrollY - s2Start) / (s2End - s2Start));
    const targetRect = avatarTarget.getBoundingClientRect();
    const worksRect = worksTarget.getBoundingClientRect();

    const curW = targetRect.width + (worksRect.width - targetRect.width) * p;
    const curX = targetRect.left + (worksRect.left - targetRect.left) * p;
    const curY = targetRect.top + (worksRect.top - targetRect.top) * p;

    avatar.style.width = `${curW}px`;
    avatar.style.height = `${curW}px`;
    avatar.style.left = `${curX}px`;
    avatar.style.top = `${curY}px`;
    avatar.style.transform = `rotate(${15 + p * 15}deg)`;
    
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");
    
    const worksHeader = worksTarget.closest(".works-header");
    if (worksHeader) worksHeader.classList.remove("is-active");

  } else {
    // State: Docked at Works
    avatar.style.position = "relative";
    avatar.style.width = "100%";
    avatar.style.height = "100%";
    avatar.style.top = "0";
    avatar.style.left = "0";
    avatar.style.transform = "none";
    if (avatar.parentElement !== worksTarget) worksTarget.appendChild(avatar);
    
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");

    const worksHeader = worksTarget.closest(".works-header");
    if (worksHeader) worksHeader.classList.add("is-active");
  }

}


// Optimization: Use a scroll listener with requestAnimationFrame
window.addEventListener("scroll", () => {
  requestAnimationFrame(handleAvatarScroll);
});
window.addEventListener("resize", handleAvatarScroll);

// --- Typewriter Implementation ---
function startAboutTypewriter() {
  const container = document.getElementById("about-typewriter");
  if (!container || !portfolioData) return;

  const textLines = portfolioData.about.typewriter;


  const fullText = textLines.join("\n\n");
  let i = 0;
  
  // Add cursor
  container.innerHTML = '<span class="typewriter-cursor"></span>';
  const cursor = container.querySelector(".typewriter-cursor");

  function type() {
    if (i < fullText.length) {
      const char = fullText.charAt(i);
      const textNode = document.createTextNode(char);
      container.insertBefore(textNode, cursor);
      i++;
      
      // Significantly faster speed
      let delay = char === "\n" ? 150 : (char === "," ? 50 : 15);
      setTimeout(type, delay);

    }
  }

  type();
}

// --- Works Selection Logic ---
const selectionBtns = document.querySelectorAll(".selection-btn");
const worksSection = document.getElementById("works");

selectionBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.dataset.choice;
    
    // Fade out and remove selection state
    if (worksSection) {
      worksSection.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      const selectionContainer = worksSection.querySelector(".works-selection-container");
      if (selectionContainer) {
        selectionContainer.style.opacity = "0";
        selectionContainer.style.transform = "translateY(-20px)";
        
        setTimeout(() => {
          worksSection.classList.remove("is-selecting");
        }, 500);
      } else {
        worksSection.classList.remove("is-selecting");
      }
    }
    
    // Find the matching tab button and click it
    const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${choice}"]`);
    if (targetTabBtn) {
      targetTabBtn.click();
    }
  });
});

// --- Works Tab Switcher ---
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetTab = btn.dataset.tab;
    
    // Toggle buttons
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    
    // Toggle content
    tabContents.forEach((content) => {
      content.classList.toggle("active", content.id === `${targetTab}-content`);
    });

    if (targetTab === "professional") {
      observeRoadmapItems();
    }
  });
});

// --- Roadmap reveal on page scroll ---
let roadmapObserver;

function observeRoadmapItems() {
  const roadmapItems = Array.from(
    document.querySelectorAll(".roadmap-item, .mountain-milestone, .podium-step, .stair-milestone, .target-item, .target-center, .branch-item, .branch-hub, .zigzag-milestone, .branch-card")
  );
  if (!roadmapItems.length) return;

  if (roadmapObserver) {
    roadmapObserver.disconnect();
  }

  roadmapObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -2% 0px" }
  );

  roadmapItems.forEach((item, index) => {
    item.classList.remove("is-visible");
    item.style.transitionDelay = `${(index % 4) * 40}ms`;
    roadmapObserver.observe(item);
  });
}

// Run once on load
window.addEventListener("load", () => {
  handleAvatarScroll();
  observeRoadmapItems();
  updateActiveNavByScroll();
});
handleAvatarScroll();
updateActiveNavByScroll();



// --- Madagascar Real-time Clock ---
function updateMadagascarTime() {
  const timeElement = document.querySelector("#local-time");
  if (!timeElement) return;

  const now = new Date();
  const options = {
    timeZone: 'Indian/Antananarivo',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  timeElement.textContent = formatter.format(now);
}

setInterval(updateMadagascarTime, 1000);
updateMadagascarTime();

// Initialize Portfolio Data & Loader
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  fetchPortfolioData();
});
