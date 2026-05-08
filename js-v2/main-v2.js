const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

// --- Reveal Observer ---
let typewriterStarted = false;
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
      }

      // Handle works header visibility when skills section is near
      if (entry.target.id === "projects") {
        const worksHeader = document.querySelector(".works-sticky-wrapper");
        if (worksHeader) {
          if (entry.isIntersecting) {
            worksHeader.style.opacity = "0";
            worksHeader.style.visibility = "hidden";
            worksHeader.style.pointerEvents = "none";
          } else {
            // Only show it if we are above the skills section
            const rect = entry.target.getBoundingClientRect();
            if (rect.top > 0) {
              worksHeader.style.opacity = "1";
              worksHeader.style.visibility = "visible";
              worksHeader.style.pointerEvents = "auto";
            }
          }
        }
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
  if (!container) return;

  const textLines = [
    "Senior Fullstack Engineer specializing in scalable cloud-native architectures.",
    "Deep expertise in Java, React, and high-performance system design.",
    "Specialized in Google Cloud integration and advanced mapping technologies.",
    "Driven by engineering excellence and solving complex business challenges."
  ];


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
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  roadmapItems.forEach((item, index) => {
    item.classList.remove("is-visible");
    item.style.transitionDelay = `${index * 100}ms`;
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
