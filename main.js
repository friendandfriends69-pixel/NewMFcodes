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
     8. SMOOTH ANCHOR SCROLL (accounts for fixed nav height)
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
