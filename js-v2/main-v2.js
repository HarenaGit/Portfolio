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
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// --- Active Nav Observer ---
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -45% 0px", threshold: 0.1 }
);
sections.forEach((s) => sectionObserver.observe(s));

// --- Avatar Scroll Animation ---
const avatar = document.getElementById("main-avatar");
const avatarTarget = document.getElementById("about-avatar-target");
const orbitScene = document.querySelector(".orbit-scene");

function handleAvatarScroll() {
  if (!avatar || !avatarTarget || !orbitScene) return;

  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  
  // Get the absolute top position of the target
  const targetRect = avatarTarget.getBoundingClientRect();
  const targetAbsoluteTop = targetRect.top + scrollY;
  
  // Animation bounds
  // Start animation exactly when the About H2 title enters the viewport
  const aboutTitle = document.querySelector("#about h2");
  const titleTop = aboutTitle ? aboutTitle.getBoundingClientRect().top + scrollY : 0;
  const startScroll = Math.max(0, titleTop - vh);
  
  // Dock slightly before the placeholder reaches the middle of the screen
  const endScroll = targetAbsoluteTop - (vh * 0.6) + (targetRect.height / 2);
  const range = endScroll - startScroll;



  
  let progress = range > 0 ? Math.min(Math.max((scrollY - startScroll) / range, 0), 1) : (scrollY > 0 ? 1 : 0);

  const orbitRect = orbitScene.getBoundingClientRect();

  if (progress <= 0) {
    // Reset to Hero
    avatar.style.position = "absolute";
    avatar.style.width = "54%";
    avatar.style.height = "54%";
    avatar.style.top = "23%";
    avatar.style.left = "23%";
    avatar.style.transform = "none";
    if (avatar.parentElement !== orbitScene) {
      orbitScene.prepend(avatar);
    }
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");
  } else if (progress >= 1) {
    // Dock to About
    avatar.style.position = "relative";
    avatar.style.width = "100%";
    avatar.style.height = "100%";
    avatar.style.top = "0";
    avatar.style.left = "0";
    avatar.style.transform = "none";
    if (avatar.parentElement !== avatarTarget) {
      avatarTarget.appendChild(avatar);
    }
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.add("is-active");
  } else {
    // Transitioning (Fixed positioning)
    const tooltip = avatarTarget.querySelector(".avatar-tooltip");
    if (tooltip) tooltip.classList.remove("is-active");
    
    if (avatar.parentElement !== document.body) {
      document.body.appendChild(avatar);
    }
    
    avatar.style.position = "fixed";
    avatar.style.zIndex = "100";

    // Calculate current positions of start and end points relative to viewport
    const sW = orbitRect.width * 0.54;
    const sX = orbitRect.left + (orbitRect.width * 0.23);
    const sY = orbitRect.top + (orbitRect.height * 0.23);

    const eW = targetRect.width;
    const eX = targetRect.left;
    const eY = targetRect.top;

    // Interpolate
    const curW = sW + (eW - sW) * progress;
    const curX = sX + (eX - sX) * progress;
    const curY = sY + (eY - sY) * progress;

    avatar.style.width = `${curW}px`;
    avatar.style.height = `${curW}px`;
    avatar.style.left = `${curX}px`;
    avatar.style.top = `${curY}px`;
    // Add a slight rotation for flair
    avatar.style.transform = `rotate(${progress * 15}deg)`;
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

// Run once on load
window.addEventListener("load", handleAvatarScroll);
handleAvatarScroll();

