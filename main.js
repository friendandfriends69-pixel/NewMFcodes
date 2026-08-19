/* ===========================================================
   MUMMA FIRST — REDESIGN
   main.js — all interactive behaviour, dependency-free
   =========================================================== */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* -----------------------------------------------------------
     1. SCROLL PROGRESS BAR
  ----------------------------------------------------------- */
  const progressFill = document.getElementById("progressFill");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + "%";
  }

  /* -----------------------------------------------------------
     2. NAV: shrink on scroll + active link highlighting
  ----------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function updateNavState() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }

  function updateActiveLink() {
    let currentId = null;
    const probeY = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((section) => {
      if (section.offsetTop <= probeY) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
    updateQuickDots(currentId);
  }

  /* -----------------------------------------------------------
     3b. QUICK-NAV SIDE DOTS (a fuller scrollspy than the top nav)
  ----------------------------------------------------------- */
  const dotSections = [
    { id: "top", label: "Welcome" },
    { id: "story", label: "Our Story" },
    { id: "see-you", label: "We See You" },
    { id: "pillars", label: "Philosophy" },
    { id: "offerings", label: "Offerings" },
    { id: "product", label: "Featured" },
    { id: "faq", label: "FAQ" },
    { id: "final-cta", label: "Get Started" },
  ].filter((s) => document.getElementById(s.id));

  const quickDotsNav = document.getElementById("quickDots");
  if (quickDotsNav) {
    dotSections.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.target = s.id;
      btn.dataset.label = s.label;
      btn.setAttribute("aria-label", `Jump to ${s.label}`);
      btn.addEventListener("click", () => {
        const target = document.getElementById(s.id);
        if (!target) return;
        const navHeight = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
      quickDotsNav.appendChild(btn);
    });
  }

  function updateQuickDots(currentSectionId) {
    if (!quickDotsNav) return;
    // Find the closest dot section at or above current scroll position
    let activeId = dotSections[0]?.id;
    const probeY = window.scrollY + window.innerHeight * 0.4;
    dotSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el && el.offsetTop <= probeY) activeId = s.id;
    });
    Array.from(quickDotsNav.children).forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.target === activeId);
    });
  }

  /* -----------------------------------------------------------
     3. BACK-TO-TOP BUTTON
  ----------------------------------------------------------- */
  const toTopBtn = document.getElementById("toTop");
  function updateToTop() {
    if (!toTopBtn) return;
    toTopBtn.classList.toggle("visible", window.scrollY > 700);
  }
  toTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* -----------------------------------------------------------
     Combine scroll-driven updates into one rAF loop for perf
  ----------------------------------------------------------- */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNavState();
        updateActiveLink();
        updateToTop();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------
     4. MOBILE MENU TOGGLE
  ----------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navLinksEl = document.getElementById("navLinks");
  navToggle?.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinksEl?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navLinksEl.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    })
  );

  /* -----------------------------------------------------------
     5. SCROLL-TRIGGERED REVEALS (IntersectionObserver)
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* -----------------------------------------------------------
     6. FAQ ACCORDION (single-open, animated height)
  ----------------------------------------------------------- */
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    panel.style.maxHeight = "0px";

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // close all
      triggers.forEach((t) => {
        t.setAttribute("aria-expanded", "false");
        t.nextElementSibling.style.maxHeight = "0px";
      });

      // open this one, unless it was already open (toggle off)
      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------------------------------------
     7. HERO PARALLAX BLOBS + CURSOR GLOW (desktop only, motion-safe)
  ----------------------------------------------------------- */
  const blobA = document.querySelector(".blob-a");
  const blobB = document.querySelector(".blob-b");
  const cursorGlow = document.getElementById("cursorGlow");
  const hero = document.querySelector(".hero");

  let targetX = 0.5, targetY = 0.4, glowX = 0.5, glowY = 0.4;

  function updateParallax() {
    if (prefersReducedMotion || !hero) return;
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight) {
      const offset = scrollY * 0.15;
      if (blobA) blobA.style.transform = `translateY(${offset}px)`;
      if (blobB) blobB.style.transform = `translateY(${-offset * 0.8}px)`;
    }
  }

  if (isDesktopHover && !prefersReducedMotion && hero && cursorGlow) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
    });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      cursorGlow.style.left = glowX * 100 + "%";
      cursorGlow.style.top = glowY * 100 + "%";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* -----------------------------------------------------------
     8. ACCENT THEME TOGGLE (rose ⇄ sage), persisted
  ----------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "mf-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "sage"));
      themeToggle.setAttribute(
        "aria-label",
        theme === "sage" ? "Switch accent color to rose" : "Switch accent color to sage"
      );
    }
  }

  (function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch (err) {
      /* localStorage unavailable (private mode etc.) — fall back to default */
    }
    applyTheme(saved === "sage" ? "sage" : "rose");
  })();

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "sage" ? "rose" : "sage";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {
      /* ignore — theme just won't persist across reloads */
    }
  });

  /* -----------------------------------------------------------
     9. HERO ROTATING WORD
  ----------------------------------------------------------- */
  const rotatorWord = document.getElementById("rotatorWord");
  const rotatorWords = ["held", "seen", "supported", "cared for"];
  let rotatorIndex = 0;

  if (rotatorWord && !prefersReducedMotion) {
    setInterval(() => {
      rotatorWord.classList.add("swap");
      setTimeout(() => {
        rotatorIndex = (rotatorIndex + 1) % rotatorWords.length;
        rotatorWord.textContent = rotatorWords[rotatorIndex];
        rotatorWord.classList.remove("swap");
      }, 320);
    }, 2600);
  }

  /* -----------------------------------------------------------
     10. AMBIENT PARTICLES — populated once per container
  ----------------------------------------------------------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll(".particles").forEach((container) => {
      const count = parseInt(container.dataset.count, 10) || 12;
      for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        p.className = "particle";
        const size = 3 + Math.random() * 5;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 80}px`);
        p.style.animationDuration = `${9 + Math.random() * 10}s`;
        p.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(p);
      }
    });
  }

  /* -----------------------------------------------------------
     11. 3D TILT ON CARDS (desktop pointer only)
  ----------------------------------------------------------- */
  if (isDesktopHover && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = "box-shadow .3s ease";
        card.style.transform = `perspective(800px) rotateX(${py * -7}deg) rotateY(${px * 7}deg) translateY(-4px) translateZ(6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .5s var(--ease, ease), box-shadow .3s ease";
        card.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     12. MAGNETIC BUTTONS (desktop pointer only)
  ----------------------------------------------------------- */
  if (isDesktopHover && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     13. TESTIMONIAL CAROUSEL (autoplay, dots, arrows)
  ----------------------------------------------------------- */
  const carousel = document.getElementById("testimonialCarousel");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dotsWrap = document.getElementById("carouselDots");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goToSlide(index) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }

    prevBtn?.addEventListener("click", () => { goToSlide(current - 1); restartAutoplay(); });
    nextBtn?.addEventListener("click", () => { goToSlide(current + 1); restartAutoplay(); });

    function startAutoplay() {
      if (prefersReducedMotion) return;
      autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
    }
    function stopAutoplay() { clearInterval(autoplayTimer); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
    startAutoplay();
  }

  /* -----------------------------------------------------------
     14. CUSTOM CURSOR (desktop, motion-safe)
  ----------------------------------------------------------- */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (isDesktopHover && !prefersReducedMotion && cursorDot && cursorRing) {
    document.body.classList.add("cursor-active");
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = "a, button, .pillar-card, .offer-card, .accordion-trigger, [data-tilt]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.add("is-hovering");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) cursorRing.classList.remove("is-hovering");
    });
  }

  /* -----------------------------------------------------------
     15. PETAL BURST — a small delight on primary CTA clicks
  ----------------------------------------------------------- */
  if (!prefersReducedMotion) {
    const petalColors = ["var(--rose)", "var(--gold)", "var(--sage)"];
    function spawnPetals(x, y) {
      const count = 8;
      for (let i = 0; i < count; i++) {
        const petal = document.createElement("span");
        petal.className = "petal";
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const distance = 40 + Math.random() * 50;
        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.background = petalColors[i % petalColors.length];
        petal.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
        petal.style.setProperty("--dy", `${Math.sin(angle) * distance - 20}px`);
        petal.style.setProperty("--rot", `${Math.random() * 360}deg`);
        document.body.appendChild(petal);
        petal.addEventListener("animationend", () => petal.remove());
      }
    }
    document.querySelectorAll(".btn-primary").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        spawnPetals(e.clientX, e.clientY);
      });
    });
  }

  /* -----------------------------------------------------------
     16. SMOOTH ANCHOR SCROLL (accounts for fixed nav height)
  ----------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });
})();
