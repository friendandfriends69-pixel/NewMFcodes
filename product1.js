/* ===========================================================
   MUMMA FIRST — PRODUCT PAGE (PDP) INTERACTIONS
   Loads alongside main.js (which still runs the shared nav, cursor,
   reveal-on-scroll, accordion, carousel, theme toggle, back-to-top,
   aurora particles, etc.). This file only handles the widgets that
   are specific to a product page: the image gallery, the quantity
   stepper, and the sticky "Buy Now" bar.

   Everything here is guarded with null-checks, so it's safe to reuse
   this same file on future product pages even if a section is missing.
   =========================================================== */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     1. IMAGE GALLERY — click a thumbnail (or swipe on touch) to
     switch the main photo. Works on the placeholder panels as-is,
     and keeps working once you swap them for real <img> photos.
  ----------------------------------------------------------- */
  const galleryMain = document.getElementById("galleryMain");
  const galleryThumbs = document.getElementById("galleryThumbs");
  if (galleryMain && galleryThumbs) {
    const panels = Array.from(galleryMain.querySelectorAll("[data-gallery-panel]"));
    const thumbs = Array.from(galleryThumbs.querySelectorAll("[data-gallery-target]"));
    let current = 0;

    function showPanel(index) {
      current = ((index % panels.length) + panels.length) % panels.length;
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.galleryPanel === String(current)));
      thumbs.forEach((t) => t.classList.toggle("is-active", t.dataset.galleryTarget === String(current)));
    }

    thumbs.forEach((t) => {
      t.addEventListener("click", () => showPanel(parseInt(t.dataset.galleryTarget, 10)));
    });

    // Touch swipe support on the main image
    let touchStartX = 0, touchDeltaX = 0;
    galleryMain.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    galleryMain.addEventListener("touchmove", (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    galleryMain.addEventListener("touchend", () => {
      if (Math.abs(touchDeltaX) > 40) {
        showPanel(current + (touchDeltaX < 0 ? 1 : -1));
      }
    });
  }

  /* -----------------------------------------------------------
     2. QUANTITY STEPPER
  ----------------------------------------------------------- */
  const qtyValue = document.getElementById("qtyValue");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  if (qtyValue && qtyMinus && qtyPlus) {
    const MIN_QTY = 1;
    const MAX_QTY = 5;
    let qty = MIN_QTY;
    qtyMinus.addEventListener("click", () => {
      qty = Math.max(MIN_QTY, qty - 1);
      qtyValue.textContent = String(qty);
    });
    qtyPlus.addEventListener("click", () => {
      qty = Math.min(MAX_QTY, qty + 1);
      qtyValue.textContent = String(qty);
    });
  }

  /* -----------------------------------------------------------
     3. STICKY BUY BAR — shows once you've scrolled past the main
     buy box, hides again near the final CTA so it isn't redundant
  ----------------------------------------------------------- */
  const buyBar = document.getElementById("pdpBuyBar");
  const buyBox = document.getElementById("buy");
  const finalCta = document.getElementById("final-cta");
  if (buyBar && "IntersectionObserver" in window) {
    let buyBoxVisible = true;
    let finalVisible = false;
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === buyBox) buyBoxVisible = entry.isIntersecting;
          if (entry.target === finalCta) finalVisible = entry.isIntersecting;
        });
        buyBar.classList.toggle("visible", !buyBoxVisible && !finalVisible);
      },
      { threshold: 0.1 }
    );
    if (buyBox) barObserver.observe(buyBox);
    if (finalCta) barObserver.observe(finalCta);
  }
})();
