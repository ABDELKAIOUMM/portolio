/* Hero entrance: static content remains readable if motion is unavailable. */
(function () {
  const hero = document.querySelector(".hero");
  const title = document.getElementById("hero-title");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactScreen = window.matchMedia("(max-width: 860px)");
  if (!hero || !title || reduceMotion.matches || !window.gsap) return;

  const originalTitle = title.textContent.trim();
  const eyebrow = hero.querySelector(".eyebrow");
  const role = hero.querySelector(".role");
  const lead = hero.querySelector(".lead");
  const cta = hero.querySelector(".cta");
  const portrait = hero.querySelector(".portrait");
  const navItems = Array.prototype.slice.call(
    document.querySelectorAll(".site-header .nav-links a, .site-header .language-switch")
  );
  if (!eyebrow || !role || !lead || !cta || !portrait) return;

  const leadLines = Array.prototype.slice.call(lead.querySelectorAll(".line"));
  const motionTargets = navItems.concat(
    [eyebrow, role, lead, cta, portrait, title], leadLines
  );

  let timeline;
  try {
    title.setAttribute("aria-label", originalTitle);
    title.replaceChildren();
    originalTitle.split(/(\s+)/).forEach(function (part) {
      if (!part.trim()) {
        title.appendChild(document.createTextNode(part));
        return;
      }
      const mask = document.createElement("span");
      const word = document.createElement("span");
      mask.className = "hero-title-mask";
      mask.setAttribute("aria-hidden", "true");
      word.className = "hero-title-word";
      word.textContent = part;
      mask.appendChild(word);
      title.appendChild(mask);
    });

    const words = title.querySelectorAll(".hero-title-word");
    motionTargets.push.apply(motionTargets, Array.prototype.slice.call(words));
    timeline = gsap.timeline({
      paused: true,
      onComplete: function () {
        hero.classList.remove("is-animated", "is-typing");
        gsap.set(leadLines, { clearProps: "all" });
      }
    });
    timeline.fromTo(navItems, { autoAlpha: 0, y: -8 }, {
      autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.055,
      ease: "power2.out", clearProps: "transform,opacity,visibility"
    }, 0);
    if (!compactScreen.matches) timeline.set(words, { yPercent: 110 });
    timeline.fromTo(eyebrow, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out"
    }, 0.16);
    if (compactScreen.matches) {
      timeline.fromTo(title, {
        autoAlpha: 0, y: 14, filter: "blur(7px)"
      }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)",
        duration: 0.9, ease: "power3.out"
      }, 0.24);
    } else {
      timeline.to(words, {
        yPercent: 0, duration: 0.78, stagger: 0.045, ease: "power3.out"
      }, 0.24);
    }
    timeline.fromTo(role, { autoAlpha: 0, y: 10 }, {
      autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out"
    }, ">+=0.06");

    const copyStart = timeline.duration();
    const rtl = window.getComputedStyle(lead).direction === "rtl";
    const hiddenCopyClip = rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    timeline.call(function () {
      hero.classList.add("is-typing");
      gsap.set(leadLines, { animation: "none", borderRight: "0" });
    }, null, copyStart);
    timeline.fromTo(leadLines, {
      autoAlpha: 0, y: 8, clipPath: hiddenCopyClip
    }, {
      autoAlpha: 1, y: 0, clipPath: "inset(0 0 0 0)",
      duration: 0.62, stagger: 0.16, ease: "power2.out"
    }, copyStart);
    timeline.fromTo(portrait, { autoAlpha: 0, y: 16 }, {
      autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out"
    }, ">+=0.12");
    timeline.fromTo(cta, { autoAlpha: 0, y: 8 }, {
      autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out"
    }, ">-0.2");

    hero.classList.add("is-animated");
    timeline.play(0);

    const disableHeroMotion = function (event) {
      if (!event.matches) return;
      timeline.kill();
      hero.classList.remove("is-animated", "is-typing");
      const titleText = window.siteI18n ? window.siteI18n.t("hero.title") : originalTitle;
      title.textContent = titleText;
      title.setAttribute("aria-label", titleText);
      gsap.set(motionTargets, { clearProps: "all" });
    };
    document.addEventListener("site-language-change", function () {
      timeline.kill();
      hero.classList.remove("is-animated", "is-typing");
      gsap.set(motionTargets, { clearProps: "all" });
    });
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", disableHeroMotion);
    } else if (reduceMotion.addListener) {
      reduceMotion.addListener(disableHeroMotion);
    }
  } catch (error) {
    if (timeline) timeline.kill();
    const titleText = window.siteI18n ? window.siteI18n.t("hero.title") : originalTitle;
    title.textContent = titleText;
    title.setAttribute("aria-label", titleText);
    hero.classList.remove("is-animated", "is-typing");
    gsap.set(motionTargets, { clearProps: "all" });
  }
})();

/* ============================================================
   0) Global Smooth Scrolling (Lenis) + GSAP ScrollTrigger sync
      Runs first so every later module can rely on `window.lenis`.
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGSAP = typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  /* Exposed to the rest of the page. Stays a no-op when Lenis is
     unavailable or the user prefers reduced motion. */
  const api = {
    instance: null,
    enabled: false,
    scrollTo: function () { },
    stop: function () { },
    start: function () { },
    resize: function () { }
  };
  window.lenisAPI = api;

  if (typeof window.Lenis === "undefined" || reduce.matches) return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: function (t) {
      return Math.min(1, 1.001 - Math.pow(2, -10 * t));
    },
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5
  });

  api.instance = lenis;
  api.enabled = true;
  api.scrollTo = function (target, options) {
    lenis.scrollTo(target, options);
  };
  api.stop = function () { lenis.stop(); };
  api.start = function () { lenis.start(); };
  api.resize = function () { lenis.resize(); };

  /* Keep the legacy global for anything that still looks for it. */
  window.lenis = lenis;

  /* Single authoritative scroll writer used by every pinned section.
     Routing through Lenis keeps its internal target/animated position in
     sync with the value we write, so it never fights the tween and never
     has to be stopped and restarted (which used to reset its velocity and
     stall the page at pin boundaries). */
  window.writeScroll = function (y) {
    if (api.enabled && api.instance) {
      api.instance.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo(0, y);
    }
  };

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    /* ScrollTrigger reads the real scroll position, so it must be told
       about every Lenis frame Ã¢â‚¬— including pinned sections. */
    lenis.on("scroll", ScrollTrigger.update);

    /* One single rAF loop: GSAP's ticker drives Lenis. */
    gsap.ticker.add(function (time) {
      if (!lenis.isStopped) lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    /* No GSAP on the page Ã¢â‚¬— drive Lenis with its own rAF loop. */
    let rafId = 0;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
  }

  /* --- Selective desktop entry settling (Lenis owns all movement) --- */
  const snapMedia = window.matchMedia(
    "(min-width: 900px) and (hover: hover) and (pointer: fine)"
  );
  const snapTargets = [
    document.querySelector(".hero"),
    document.querySelector("#about > .section-head:first-of-type"),
    document.querySelector("#highlights")
  ].filter(Boolean);
  const snapHeader = document.getElementById("siteHeader");
  const workStage = document.getElementById("workStage");
  const journeySection = document.getElementById("journey");
  const snapProximity = 80;
  let snapIdleTimer = 0;
  let snapCooldownUntil = 0;
  let touchInputDetected = false;
  let anchorSuppressedUntil = 0;
  let snapSettling = false;
  let anchorNavigation = false;

  function clearSnapIdle() {
    window.clearTimeout(snapIdleTimer);
    snapIdleTimer = 0;
  }

  function cancelSnapSettle(interrupted) {
    clearSnapIdle();
    if (!snapSettling) return;
    snapSettling = false;
    if (interrupted) snapCooldownUntil = performance.now() + 260;

    /* Lenis 1.1.14 reset() stops its current tween at the actual position. */
    lenis.reset();
  }

  function isProtectedRegionVisible() {
    const coverflow = hasGSAP && ScrollTrigger.getById("workCoverflow");
    if (coverflow && coverflow.isActive) return true;

    if (workStage) {
      const workRect = workStage.getBoundingClientRect();
      if (workRect.bottom > -snapProximity && workRect.top < window.innerHeight + snapProximity) return true;
    }

    if (journeySection) {
      const journeyRect = journeySection.getBoundingClientRect();
      return journeyRect.top <= 1 && journeyRect.bottom >= window.innerHeight - 1;
    }
    return false;
  }

  function canSettle() {
    return snapMedia.matches && !reduce.matches && !anchorNavigation &&
      performance.now() >= anchorSuppressedUntil &&
      !touchInputDetected && !lenis.isLocked && !lenis.isStopped &&
      !isProtectedRegionVisible();
  }

  function getLayoutTop(element) {
    let top = 0;
    let node = element;
    while (node && node !== document.body && node !== document.documentElement) {
      top += node.offsetTop;
      node = node.offsetParent;
    }
    return top;
  }

  function settleNearestEntry() {
    snapIdleTimer = 0;
    if (!canSettle() || performance.now() < snapCooldownUntil) return;

    const headerHeight = snapHeader ? snapHeader.getBoundingClientRect().height : 0;
    let candidate = null;
    let candidateY = 0;
    let candidateDistance = Infinity;

    snapTargets.forEach(function (target) {
      const targetY = Math.max(0, getLayoutTop(target) - headerHeight);
      const delta = targetY - lenis.scroll;
      const distance = Math.abs(delta);
      if (distance < 5 || distance > snapProximity) return;
      /* Never pull a visitor backward after they've passed a section entry. */
      if (lenis.direction && Math.sign(delta) !== lenis.direction && distance > 24) return;
      if (distance < candidateDistance) {
        candidate = target;
        candidateY = targetY;
        candidateDistance = distance;
      }
    });

    if (!candidate) return;
    snapSettling = true;
    lenis.scrollTo(candidateY, {
      duration: 0.42,
      userData: { selectiveEntrySnap: true },
      onComplete: function () {
        snapSettling = false;
        snapCooldownUntil = performance.now() + 220;
      }
    });
  }

  lenis.on("scroll", function () {
    if (snapSettling) return;
    clearSnapIdle();
    if (canSettle()) snapIdleTimer = window.setTimeout(settleNearestEntry, 180);
  });

  /* Use Lenis' input notification to cancel a settle without another wheel listener. */
  lenis.on("virtual-scroll", function (input) {
    if (input.event && input.event.type.indexOf("touch") !== -1) {
      touchInputDetected = true;
      cancelSnapSettle(true);
    }
    clearSnapIdle();
    if (snapSettling) cancelSnapSettle(true);
  });

  window.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse") touchInputDetected = false;
    if (event.pointerType === "touch") touchInputDetected = true;
    if (snapSettling || snapIdleTimer) cancelSnapSettle(true);
  }, { passive: true, capture: true });
  window.addEventListener("keydown", function (event) {
    if (["ArrowDown", "PageDown", " ", "ArrowUp", "PageUp", "Home", "End"].includes(event.key) &&
      (snapSettling || snapIdleTimer)) cancelSnapSettle(true);
  }, true);
  snapMedia.addEventListener("change", function () {
    if (!snapMedia.matches) cancelSnapSettle(true);
  });
  reduce.addEventListener("change", function (event) {
    if (event.matches) cancelSnapSettle(true);
  });
  window.addEventListener("resize", function () {
    cancelSnapSettle(true);
  }, { passive: true });

  /* --- In-page anchors: hand them to Lenis so the easing is identical
         to wheel scrolling and the sticky navbar offset is respected. --- */
  const NAV_OFFSET = 72;

  document.addEventListener("click", function (event) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    event.preventDefault();
    cancelSnapSettle(false);
    anchorNavigation = true;

    lenis.scrollTo(target, {
      offset: -NAV_OFFSET,
      duration: 1.2,
      lock: true,
      onComplete: function () {
        anchorNavigation = false;
        anchorSuppressedUntil = performance.now() + 500;
        /* Keep the URL shareable without triggering a native jump. */
        if (history.replaceState) history.replaceState(null, "", hash);
      }
    });
  });

  /* --- Keep Lenis' measurements in sync with layout changes --- */
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      lenis.resize();
      if (hasGSAP) ScrollTrigger.refresh();
    }, 200);
  });

  /* --- Fonts / images can change the page height after first paint --- */
  window.addEventListener("load", function () {
    lenis.resize();
    if (hasGSAP) ScrollTrigger.refresh();
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      lenis.resize();
      if (hasGSAP) ScrollTrigger.refresh();
    });
  }
})();

/* ============================================================
   1) Ã˜Â®Ã™â€žÃ™ÂÃ™Å Ã˜Â© Ã˜Â§Ã™â€žÃ™â€¦Ã™Ë†Ã˜Â¬Ã˜Â© (Canvas)
   ============================================================ */
(function () {
  const canvas = document.getElementById("wave");
  if (!canvas) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, raf = 0, t = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Ã™â€¦Ã™Ë†Ã˜Â¬Ã˜Â© Ã™Ë†Ã˜Â§Ã˜Â­Ã˜Â¯Ã˜Â©: Ã˜Â®Ã˜Â· Ã˜Â±Ã™â€šÃ™Å Ã™â€š + Ã™â€ Ã™â€šÃ˜Â§Ã˜Â· Ã˜Â¹Ã™â€ Ã˜Â¯ Ã˜Â§Ã™â€žÃ˜Â¹Ã™ÂÃ™â€šÃ˜Â¯
  function drawWave(offset, amp, speed, alpha, step) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) {
      const y =
        h * 0.62 +
        Math.sin(x * 0.0032 + t * speed + offset) * amp +
        Math.sin(x * 0.0011 - t * speed * 0.6 + offset) * amp * 0.45;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(255,255,255," + alpha + ")";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let x = 0; x <= w; x += step * 6) {
      const y =
        h * 0.62 +
        Math.sin(x * 0.0032 + t * speed + offset) * amp +
        Math.sin(x * 0.0011 - t * speed * 0.6 + offset) * amp * 0.45;
      ctx.beginPath();
      ctx.arc(x, y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255," + alpha * 1.6 + ")";
      ctx.fill();
    }
  }

  function frame() {
    t += 0.006;
    ctx.clearRect(0, 0, w, h);
    drawWave(0.0, 26, 1.0, 0.16, 14);
    drawWave(1.6, 18, 1.35, 0.10, 18);
    drawWave(3.1, 34, 0.75, 0.06, 22);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    if (reduce.matches) {
      // Ã™â€žÃ™â€šÃ˜Â·Ã˜Â© Ã˜Â«Ã˜Â§Ã˜Â¨Ã˜ÂªÃ˜Â© Ã˜Â£Ã™â€ Ã™Å Ã™â€šÃ˜Â© Ã˜Â¨Ã˜Â¯Ã™Ë†Ã™â€  Ã˜Â­Ã˜Â±Ã™Æ’Ã˜Â©
      ctx.clearRect(0, 0, w, h);
      drawWave(0.0, 26, 1.0, 0.16, 14);
      drawWave(1.6, 18, 1.35, 0.10, 18);
      return;
    }
    frame();
  }

  let rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(start, 150);
  });

  if (reduce.addEventListener) reduce.addEventListener("change", start);
  start();
})();

/* ============================================================
   2) Ã˜Â­Ã˜Â±Ã™Æ’Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â¸Ã™â€¡Ã™Ë†Ã˜Â± Ã˜Â¹Ã™â€ Ã˜Â¯ Ã˜Â§Ã™â€žÃ˜ÂªÃ™â€¦Ã˜Â±Ã™Å Ã˜Â± + Ã˜Â§Ã™â€žÃ˜Â¹Ã˜Â¯Ã™â€˜Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª + Ã˜Â´Ã˜Â±Ã™Å Ã˜Â· Ã˜Â§Ã™â€žÃ˜ÂªÃ™â€šÃ˜Â¯Ã™â€¦
   ============================================================ */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const supportsIO = "IntersectionObserver" in window;

  /* --- Ã˜ÂªÃ™Ë†Ã˜Â²Ã™Å Ã˜Â¹ Ã˜Â§Ã™â€žÃ˜ÂªÃ˜Â£Ã˜Â®Ã™Å Ã˜Â± Ã˜Â¯Ã˜Â§Ã˜Â®Ã™â€ž Ã™Æ’Ã™â€ž Ã™â€¦Ã˜Â¬Ã™â€¦Ã™Ë†Ã˜Â¹Ã˜Â© (Stagger) --- */
  document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
    const items = group.querySelectorAll(":scope > [data-reveal]");
    items.forEach(function (item, i) {
      // Ã˜Â³Ã™â€šÃ™Â 8 Ã˜Â¹Ã™â€ Ã˜Â§Ã˜ÂµÃ˜Â± Ã™â€¦Ã˜ÂªÃ˜ÂªÃ˜Â§Ã™â€žÃ™Å Ã˜Â© Ã˜Â­Ã˜ÂªÃ™â€° Ã™â€žÃ˜Â§ Ã˜ÂªÃ˜ÂªÃ˜Â£Ã˜Â®Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€ Ã˜Â§Ã˜ÂµÃ˜Â± Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â®Ã™Å Ã˜Â±Ã˜Â© Ã™Æ’Ã˜Â«Ã™Å Ã˜Â±Ã™â€¹Ã˜Â§
      item.style.setProperty("--reveal-delay", Math.min(i, 8) * 70 + "ms");
    });
  });

  /* --- Ã˜Â¥Ã˜Â¸Ã™â€¡Ã˜Â§Ã˜Â± Ã˜Â§Ã™â€žÃ˜Â¹Ã™â€ Ã˜Â§Ã˜ÂµÃ˜Â± Ã˜Â¹Ã™â€ Ã˜Â¯ Ã˜Â¯Ã˜Â®Ã™Ë†Ã™â€žÃ™â€¡Ã˜Â§ Ã˜Â§Ã™â€žÃ˜Â´Ã˜Â§Ã˜Â´Ã˜Â© --- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  function showAll() {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible", "is-settled");
    });
  }

  if (reduce.matches || !supportsIO) {
    showAll();
  } else {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          io.unobserve(el);
          // Ã˜Â¥Ã˜Â²Ã˜Â§Ã™â€žÃ˜Â© will-change Ã˜Â¨Ã˜Â¹Ã˜Â¯ Ã˜Â§Ã™â€ Ã˜ÂªÃ™â€¡Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â­Ã˜Â±Ã™Æ’Ã˜Â©
          setTimeout(function () {
            el.classList.add("is-settled");
          }, 900);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* --- Ã˜Â¹Ã˜Â¯Ã™â€˜Ã˜Â§Ã˜Â¯Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ˜Â£Ã˜Â±Ã™â€šÃ˜Â§Ã™â€¦ Ã™ÂÃ™Å  Ã™â€šÃ˜Â³Ã™â€¦ Highlights --- */
  const counters = document.querySelectorAll("[data-count]");

  function runCounter(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (isNaN(target)) return;

    if (reduce.matches) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      // easeOutExpo Ã™â€žÃ˜ÂªÃ˜Â¨Ã˜Â¯Ã™Ë† Ã˜Â§Ã™â€žÃ˜Â­Ã˜Â±Ã™Æ’Ã˜Â© Ã˜Â³Ã˜Â±Ã™Å Ã˜Â¹Ã˜Â© Ã˜Â«Ã™â€¦ Ã˜ÂªÃ™â€¡Ã˜Â¯Ã˜Â£
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (supportsIO && !reduce.matches) {
    const counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterIO.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* --- Ã˜Â´Ã˜Â±Ã™Å Ã˜Â· Ã˜ÂªÃ™â€šÃ˜Â¯Ã™â€¦ Ã˜Â§Ã™â€žÃ™â€šÃ˜Â±Ã˜Â§Ã˜Â¡Ã˜Â© + Ã˜Â­Ã˜Â§Ã™â€žÃ˜Â© Ã˜Â§Ã™â€žÃ™â€ Ã˜Â§Ã™ÂÃ˜Â¨Ã˜Â§Ã˜Â± + Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â§Ã˜Â¨Ã˜Â· Ã˜Â§Ã™â€žÃ™â€ Ã˜Â´Ã˜Â· --- */
  const progress = document.getElementById("progress");
  const header = document.getElementById("siteHeader");
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a")
  );
  const sections = navLinks
    .map(function (a) {
      const id = a.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    }

    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }

    // Ã˜Â§Ã™â€žÃ˜Â±Ã˜Â§Ã˜Â¨Ã˜Â· Ã˜Â§Ã™â€žÃ™â€ Ã˜Â´Ã˜Â·: Ã˜Â¢Ã˜Â®Ã˜Â± Ã™â€šÃ˜Â³Ã™â€¦ Ã˜Â¨Ã˜Â¯Ã˜Â£ Ã™â€šÃ˜Â¨Ã™â€ž Ã™â€¦Ã™â€ Ã˜ÂªÃ˜ÂµÃ™Â Ã˜Â§Ã™â€žÃ˜Â´Ã˜Â§Ã˜Â´Ã˜Â©
    let activeIndex = -1;
    sections.forEach(function (sec, i) {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        activeIndex = i;
      }
    });

    navLinks.forEach(function (a, i) {
      a.classList.toggle("is-active", i === activeIndex);
    });

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* --- Ã˜ÂµÃ™Ë†Ã˜Â± Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â´Ã˜Â§Ã˜Â±Ã™Å Ã˜Â¹: Ã˜Â¨Ã˜Â¯Ã™Å Ã™â€ž Ã˜Â£Ã™â€ Ã™Å Ã™â€š Ã˜Â¹Ã™â€ Ã˜Â¯ Ã™ÂÃ˜Â´Ã™â€ž Ã˜ÂªÃ˜Â­Ã™â€¦Ã™Å Ã™â€ž Ã˜Â§Ã™â€žÃ™â€žÃ™â€šÃ˜Â·Ã˜Â© --- */
  document.querySelectorAll(".project").forEach(function (project) {
    const img = project.querySelector(".project-media img");
    if (!img) return;

    const url = project.getAttribute("data-url") || "";
    const shot = project.getAttribute("data-shot");

    // data-shot Ã™Å Ã˜ÂªÃ™Å Ã˜Â­ Ã˜Â§Ã˜Â³Ã˜ÂªÃ˜Â¨Ã˜Â¯Ã˜Â§Ã™â€ž Ã˜Â§Ã™â€žÃ™â€¦Ã˜Â¹Ã˜Â§Ã™Å Ã™â€ Ã˜Â© Ã˜Â§Ã™â€žÃ˜ÂªÃ™â€žÃ™â€šÃ˜Â§Ã˜Â¦Ã™Å Ã˜Â© Ã˜Â¨Ã˜ÂµÃ™Ë†Ã˜Â±Ã˜Â© Ã™â€¦Ã˜Â­Ã™â€žÃ™Å Ã˜Â©
    if (shot) img.src = shot;

    function fallback() {
      const media = img.parentElement;
      if (!media || media.classList.contains("is-fallback")) return;
      media.classList.add("is-fallback");
      img.remove();
      media.style.backgroundImage =
        "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))," +
        "radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.10), transparent 60%)";
      const label = document.createElement("span");
      label.className = "project-badge";
      label.style.top = "auto";
      label.style.bottom = "0.85rem";
      label.style.left = "0.85rem";
      label.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      media.appendChild(label);
    }

    img.addEventListener("error", fallback);
    // Ã˜ÂµÃ™Ë†Ã˜Â±Ã˜Â© Ã™â€¦Ã˜Â­Ã™â€¦Ã™â€˜Ã™â€žÃ˜Â© Ã™â€žÃ™Æ’Ã™â€  Ã™ÂÃ˜Â§Ã˜Â±Ã˜ÂºÃ˜Â© (Ã˜Â¨Ã˜Â¹Ã˜Â¶ Ã˜Â®Ã˜Â¯Ã™â€¦Ã˜Â§Ã˜Âª Ã˜Â§Ã™â€žÃ™â€žÃ™â€šÃ˜Â·Ã˜Â§Ã˜Âª Ã˜ÂªÃ™ÂÃ˜Â±Ã˜Â¬Ã˜Â¹ 1Ãƒâ€”1)
    img.addEventListener("load", function () {
      if (img.naturalWidth <= 2 || img.naturalHeight <= 2) fallback();
    });
  });

})();

/* ============================================================
   2b) Services — Scroll-Driven Timeline
       GSAP ScrollTrigger: line draw + card reveal + dot activation
   ============================================================ */
(function () {
  const timeline = document.querySelector("[data-services-timeline]");
  const line = document.querySelector("[data-services-line]");
  if (!timeline || !line) return;

  const milestones = Array.prototype.slice.call(
    timeline.querySelectorAll(".service-milestone")
  );
  if (!milestones.length) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* --- Reduced-motion / no-GSAP fallback: show everything immediately --- */
  function showAll() {
    line.style.height = "100%";
    milestones.forEach(function (m) {
      m.classList.add("is-active");
      const card = m.querySelector(".service-card");
      if (card) card.classList.add("is-visible");
    });
  }

  if (reduce.matches || typeof gsap === "undefined" || !window.ScrollTrigger) {
    showAll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(function () {
    /* --- 1) Draw the progress line as the timeline scrolls --- */
    gsap.fromTo(
      line,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 72%",
          end: "bottom 68%",
          scrub: 0.6
        }
      }
    );

    /* --- 2) Reveal each card + activate its dot --- */
    milestones.forEach(function (m) {
      const card = m.querySelector(".service-card");

      ScrollTrigger.create({
        trigger: m,
        start: "top 78%",
        end: "bottom 30%",
        onEnter: function () {
          m.classList.add("is-active");
          if (card) card.classList.add("is-visible");
        },
        onEnterBack: function () {
          m.classList.add("is-active");
          if (card) card.classList.add("is-visible");
        },
        onLeaveBack: function () {
          m.classList.remove("is-active");
        }
      });

      /* Reveal + subtle lift owned by GSAP (avoids CSS/GSAP transform clash) */
      if (card) {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.7,
            scrollTrigger: {
              trigger: m,
              start: "top 82%",
              end: "top 52%",
              scrub: 0.5
            },
            onComplete: function () {
              gsap.set(card, { clearProps: "transform,opacity,visibility" });
            }
          }
        );
      }
    });
  }, timeline);

  /* --- Recalculate on resize / font load --- */
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();

/* ============================================================
   3) Scroll-Driven 3D Coverflow Slider
      Lenis (smooth scroll) + GSAP ScrollTrigger (pin + snap)
   ============================================================ */
(function () {
  const stage = document.getElementById("workStage");
  const grid = document.getElementById("workGrid");
  const pagination = document.getElementById("workPagination");
  if (!stage || !grid) return;

  const cards = Array.prototype.slice.call(
    grid.querySelectorAll(":scope > .project")
  );
  if (cards.length < 2) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hasGSAP = typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  /* --- Fallback: no GSAP, reduced motion, or small screens --- */
  function goStatic() {
    stage.classList.add("is-static");
    grid.classList.add("is-static");
    cards.forEach(function (card) {
      card.style.transform = "";
      card.style.opacity = "";
      card.style.filter = "";
      card.style.zIndex = "";
    });
  }

  function goLive() {
    stage.classList.remove("is-static");
    grid.classList.remove("is-static");
  }

  if (!hasGSAP || reduce.matches) {
    goStatic();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* --- Scrollbar width: keeps the full-bleed stage perfectly centered --- */
  function syncScrollbarWidth() {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", sbw + "px");
  }
  syncScrollbarWidth();

  /* --- Coverflow geometry --- */
  const SPREAD = 0.42;
  const DEPTH = 180;     // gentler depth so transforms stay stable during initial scroll-in
  const ROTATE = 24;
  const SIDE_SCALE = 0.92;
  const SIDE_OPACITY = 0.6;

  /* --- Pagination dots --- */
  const dots = [];
  const translate = function (key, values) {
    return window.siteI18n ? window.siteI18n.t(key, values) : key;
  };
  const localizedNumber = function (value) {
    return window.siteI18n ? window.siteI18n.localizeDigits(value) : String(value);
  };
  if (pagination) {
    cards.forEach(function (card, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "work-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", translate("project.goTo", { number: localizedNumber(i + 1) }));
      dot.addEventListener("click", function () {
        stepTo(i);
      });
      pagination.appendChild(dot);
      dots.push(dot);
    });
  }

  document.addEventListener("site-language-change", function () {
    dots.forEach(function (dot, i) {
      dot.setAttribute("aria-label", translate("project.goTo", { number: localizedNumber(i + 1) }));
    });
  });

  let activeIndex = -1;

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
  }
  /* --- Per-card transform for a given progress (0 Ã¢â€ â€™ 1) --- */
  function applyCoverflow(progress) {
    const pos = progress * (cards.length - 1);
    const isVertical = stage.classList.contains("is-vertical");

    cards.forEach(function (card, i) {
      const offset = i - pos;
      const dist = Math.abs(offset);
      const clamped = Math.min(dist, 1);
      const dir = offset < 0 ? -1 : 1;

      const x = isVertical ? 0 : offset * SPREAD * 100;
      const y = isVertical ? offset * SPREAD * 100 : 0;
      const z = -DEPTH * clamped;
      const rotate = -dir * ROTATE * clamped;
      const scale = 1 - (1 - SIDE_SCALE) * clamped;
      const opacity = 1 - (1 - SIDE_OPACITY) * clamped;
      const blur = clamped * 2;

      card.style.transform =
        "translate3d(" + x.toFixed(3) + "%, " + y.toFixed(3) + "%, " + z.toFixed(2) + "px) " +
        (isVertical ? "rotateX(" : "rotateY(") + rotate.toFixed(3) + "deg) " +
        "scale(" + scale.toFixed(4) + ")";
      card.style.opacity = opacity.toFixed(4);
      card.style.filter = blur > 0.05
        ? "blur(" + blur.toFixed(2) + "px) brightness(" + (1 - clamped * 0.35).toFixed(3) + ")"
        : "";
      const zIndex = String(10 - Math.round(dist * 5));
      if (card.style.zIndex !== zIndex) card.style.zIndex = zIndex;
    });

    setActive(Math.round(pos));
  }

  /* --- Lenis is created once, globally (module 0). This module only
         mutes/unmutes it while the pin owns the scroll. --- */
  const lenisAPI = window.lenisAPI || null;

  /* --- Pin timeline --- */
  const steps = cards.length - 1;

  /* Distance scrolled per card. Kept short so a normal wheel gesture
     advances exactly one card instead of snapping back. */
  const STEP_DISTANCE = Math.round(window.innerHeight * 0.34);

  let st = null;
  let stepTween = null;
  let gestureLock = false;
  let gestureTimer = null;
  let gestureCapTimer = null;
  let gestureDir = 0;

  /* A gesture ends after this much quiet time. While it is open, extra
     wheel events only extend it Ã¢â‚¬— they never queue another card. */
  const GESTURE_IDLE = 140;   // ms of silence that closes a gesture
  const GESTURE_MAX = 900;    // ms hard cap so a long spin can't lock the page

  function currentIndex() {
    return st ? Math.round(st.progress * steps) : 0;
  }

  function cardScrollTop(index) {
    return st.start + (index / steps) * (st.end - st.start);
  }

  /* Drive the scroll with GSAP rather than Lenis. Lenis' own `scrollTo`
     defers to native scrolling once its wheel input is muted, which
     leaves the tween stalled for several hundred ms. A GSAP tween on a
     proxy object is immediate and always lands exactly on the boundary. */
  function stepTo(index, duration) {
    if (!st) return;
    const clamped = Math.max(0, Math.min(steps, index));
    const to = cardScrollTop(clamped);

    /* Already settled on this card Ã¢â‚¬— nothing to do. */
    if (Math.abs(window.scrollY - to) < 2 && !stepTween) return;

    const proxy = { y: window.scrollY };

    if (stepTween) stepTween.kill();

    stepTween = gsap.to(proxy, {
      y: to,
      duration: duration || 0.55,
      ease: "power3.out",
      overwrite: true,
      onUpdate: function () {
        writeScroll(proxy.y);
      },
      onComplete: function () {
        writeScroll(to);
        stepTween = null;
        /* Landing on the first or last card means the next gesture should
           leave the slider. Releasing the lock here (instead of waiting for
           the idle timer) removes the pause at the pin boundary that made
           the handoff to the next section feel like a stutter. */
        if (clamped <= 0 || clamped >= steps) endGesture();
      }
    });
  }

  /* --- Card stepping ---
     ScrollTrigger's own `snap` writes scrollTop directly, which Lenis
     reads back as a native scroll and cancels out. Instead we take the
     wheel over entirely while the pin is active: Lenis is stopped so it
     cannot start a competing animation, and every gesture is handed to
     `stepTo`, which lands exactly on a card boundary.

     One gesture = one card. A gesture stays open while wheel events keep
     arriving (a fast flick emits dozens of them) and only closes after a
     short idle gap, so a fast scroll can never flip two cards in a row. */
  function onWheel(event) {
    if (!st || !st.isActive) return;
    if (event.ctrlKey) return;

    const delta = event.deltaY;
    if (Math.abs(delta) < 1) return;

    const dir = delta > 0 ? 1 : -1;
    const index = currentIndex();

    /* Release the page once the gesture would leave the slider. */
    if (dir > 0 && index >= steps) return;
    if (dir < 0 && index <= 0) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    /* Same gesture still running: swallow the event, just keep it alive. */
    if (gestureLock) {
      if (dir === gestureDir) {
        clearTimeout(gestureTimer);
        gestureTimer = setTimeout(endGesture, GESTURE_IDLE);
      }
      return;
    }

    gestureLock = true;
    gestureDir = dir;
    clearTimeout(gestureTimer);
    gestureTimer = setTimeout(endGesture, GESTURE_IDLE);
    clearTimeout(gestureCapTimer);
    gestureCapTimer = setTimeout(endGesture, GESTURE_MAX);

    /* Re-entering the pin from a native scroll can leave the slider
       between two cards. Settle onto the nearest one, but never drag the
       page backwards against the direction the user is scrolling. */
    const nearest = Math.round(st.progress * steps);
    const onBoundary = Math.abs(window.scrollY - cardScrollTop(nearest)) < 2;
    if (onBoundary) {
      stepTo(nearest + dir);
    } else {
      const settle = dir > 0 ? Math.ceil(st.progress * steps) : Math.floor(st.progress * steps);
      stepTo(settle);
    }
  }

  function endGesture() {
    clearTimeout(gestureTimer);
    clearTimeout(gestureCapTimer);
    gestureTimer = null;
    gestureCapTimer = null;
    gestureLock = false;
    gestureDir = 0;
  }

  window.addEventListener("wheel", onWheel, { passive: false, capture: true });

  /* --- Build / tear down the slider so it survives resizing --- */
  function buildSlider() {
    if (st) return;

    goLive();
    syncScrollbarWidth();

    const tl = gsap.timeline({
      scrollTrigger: {
        id: "workCoverflow",
        trigger: stage,
        start: "top top",
        end: "+=" + steps * STEP_DISTANCE,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          applyCoverflow(self.progress);
        }
      }
    });

    tl.to({}, { duration: 1 });

    st = ScrollTrigger.getById("workCoverflow");
    activeIndex = -1;
    applyCoverflow(0);
  }

  function destroySlider() {
    if (!st) return;
    st.kill(true);
    st = null;
    endGesture();
    if (stepTween) {
      stepTween.kill();
      stepTween = null;
    }
    goStatic();
  }

  function syncMode() {
    const isVertical = window.matchMedia("(max-width: 899px)").matches;
    stage.classList.toggle("is-vertical", isVertical);
    buildSlider();
    if (st) applyCoverflow(st.progress);
  }

  syncMode();

  ScrollTrigger.refresh();

  /* --- Re-evaluate the mode on resize --- */
  let rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      syncScrollbarWidth();
      syncMode();
      if (lenisAPI) lenisAPI.resize();
      ScrollTrigger.refresh();
    }, 200);
  });
})();

(() => {
  const steps = [
    { key: "discovery" },
    { key: "plan" },
    { key: "build" },
    { key: "optimize" },
    { key: "launch" }
  ];
  const translate = (key, values) => window.siteI18n ? window.siteI18n.t(key, values) : key;
  const localizedNumber = (value) => window.siteI18n ? window.siteI18n.localizeDigits(value) : String(value);
  const stepContent = (step) => ({
    title: translate(`step.${step.key}.title`),
    description: translate(`step.${step.key}.description`),
    phase: translate(`step.${step.key}.phase`)
  });
  const sceneViewport = document.getElementById("sceneViewport");
  if (!sceneViewport) return;
  const worldTrack = document.getElementById("worldTrack");
  const stations = [...worldTrack.querySelectorAll(".station")];
  const textStages = [...document.querySelectorAll(".scene-text-layer .text-stage")];
  const copy = document.getElementById("stepCopy");
  const title = document.getElementById("stepTitle");
  const description = document.getElementById("stepDescription");
  const current = document.getElementById("currentStep");
  const phase = document.getElementById("phaseLabel");
  const sceneCount = document.getElementById("sceneCount");
  const fill = document.getElementById("progressFill");
  const dotsWrap = document.getElementById("progressDots");
  const mobileRail = document.getElementById("mobileRail");
  const previousButton = document.getElementById("prevStep");
  const nextButton = document.getElementById("nextStep");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeStep = -1;
  let targetProgress = 0;
  let renderedProgress = 0;
  let rafId = 0;
  let previousFrameTime = 0;
  let copyToken = 0;
  let firstFrame = true;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const mix = (a, b, t) => a + (b - a) * t;
  function fitCanvas() {
    const rect = sceneViewport.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const designWidth = mobile ? 300 : 560;
    const designHeight = mobile ? 245 : 445;
    const scale = clamp(Math.min(rect.width / designWidth, rect.height / designHeight), mobile ? .72 : .72, 1.05);
    sceneViewport.style.setProperty("--canvas-scale", scale.toFixed(3));
  }
  function goToStep(index) {
    targetProgress = clamp(index, 0, steps.length - 1) / (steps.length - 1);
    if (!rafId) rafId = requestAnimationFrame(renderFrame);
  }
  function makeDot(index, extraClass = "") {
    const button = document.createElement("button");
    button.type = "button"; button.className = `progress-dot ${extraClass}`.trim();
    const item = stepContent(steps[index]);
    button.setAttribute("aria-label", translate("process.goToStep", {
      number: localizedNumber(String(index + 1).padStart(2, "0")),
      title: item.title
    }));
    button.addEventListener("click", () => goToStep(index));
    return button;
  }
  steps.forEach((_, index) => { dotsWrap.appendChild(makeDot(index)); mobileRail.appendChild(makeDot(index, "rail-dot")); });
  const allDots = [...dotsWrap.querySelectorAll("button"), ...mobileRail.querySelectorAll("button")];
  previousButton.addEventListener("click", () => goToStep(activeStep - 1));
  nextButton.addEventListener("click", () => goToStep(activeStep + 1));

  function paintStep(index, force) {
    if (index === activeStep && !force) return;
    activeStep = index;
    const item = stepContent(steps[index]);
    copy.classList.toggle("is-last-step", index === steps.length - 1);
    const token = ++copyToken;
    copy.classList.add("is-changing");
    worldTrack.dataset.step = String(index);
    current.textContent = localizedNumber(String(index + 1).padStart(2, "0"));
    title.textContent = item.title;
    description.textContent = item.description;
    phase.textContent = item.phase;
    sceneCount.textContent = translate("process.station", {
      current: localizedNumber(String(index + 1).padStart(2, "0")),
      total: localizedNumber(String(steps.length).padStart(2, "0"))
    });
    stations.forEach((station, i) => station.dataset.active = String(i === index));
    textStages.forEach((stage, i) => stage.dataset.active = String(i === index));
    allDots.forEach((dot, i) => { if (i === index) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current"); });
    previousButton.disabled = index === 0;
    nextButton.disabled = index === steps.length - 1;
    if (reduceMotion.matches) copy.classList.remove("is-changing");
    else requestAnimationFrame(() => requestAnimationFrame(() => { if (token === copyToken) copy.classList.remove("is-changing"); }));
  }
  document.addEventListener("site-language-change", () => {
    paintStep(activeStep < 0 ? 0 : activeStep, true);
    allDots.forEach((dot, index) => {
      const item = stepContent(steps[index]);
      dot.setAttribute("aria-label", translate("process.goToStep", {
        number: localizedNumber(String(index + 1).padStart(2, "0")),
        title: item.title
      }));
    });
  });
  function renderScene(progress) {
    fill.style.width = `${(progress * 100).toFixed(2)}%`;
    const position = progress * (steps.length - 1);
    paintStep(clamp(Math.round(progress * (steps.length - 1)), 0, steps.length - 1));
    const x = position * 20;
    const y = -Math.sin(position * Math.PI) * 8;
    const z = mix(-10, 20, progress);
    worldTrack.style.transform = `translate3d(-${x.toFixed(3)}%,${y.toFixed(2)}px,${z.toFixed(2)}px)`;
    worldTrack.style.setProperty("--travel-progress", progress.toFixed(4));
  }
  function renderFrame(time) {
    rafId = 0;
    const elapsed = previousFrameTime ? Math.min(50, time - previousFrameTime) : 16.7;
    previousFrameTime = time;
    if (firstFrame) { renderedProgress = targetProgress; firstFrame = false; }
    else {
      const follow = reduceMotion.matches ? 1 : 1 - Math.exp(-elapsed / 52);
      renderedProgress += (targetProgress - renderedProgress) * follow;
      if (Math.abs(targetProgress - renderedProgress) < .00045) renderedProgress = targetProgress;
    }
    renderScene(renderedProgress);
    if (Math.abs(targetProgress - renderedProgress) >= .00045) rafId = requestAnimationFrame(renderFrame);
    else previousFrameTime = 0;
  }
  window.addEventListener("resize", fitCanvas, { passive: true });
  if ("ResizeObserver" in window) {
    const sizeObserver = new ResizeObserver(fitCanvas);
    sizeObserver.observe(sceneViewport);
  }
  fitCanvas();
  renderScene(0);
})();

/* Product storyline: vertical scrolling/touch drives horizontal card progression. */
(() => {
  const section = document.getElementById("storyline");
  const viewport = document.querySelector("[data-storyline-viewport]");
  const track = document.querySelector("[data-storyline-track]");
  const progress = document.querySelector("[data-storyline-progress]");
  if (!section || !viewport || !track || !progress) return;

  const items = [...track.querySelectorAll(".storyline-item")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!items.length) return;

  const showAll = () => {
    items.forEach((item) => item.classList.add("is-active"));
    progress.style.transform = "scaleX(1)";
  };

  if (reducedMotion.matches || !window.gsap || !window.ScrollTrigger) {
    showAll();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    viewport.classList.add("is-animated");
    const alignedX = (item, itemEdge, viewportEdge) => {
      const rect = item.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const styles = window.getComputedStyle(viewport);
      const left = viewportRect.left + parseFloat(styles.borderLeftWidth) + parseFloat(styles.paddingLeft);
      const right = viewportRect.right - parseFloat(styles.borderRightWidth) - parseFloat(styles.paddingRight);
      const target = viewportEdge === "center" ? (left + right) / 2 : viewportEdge === "left" ? left : right;
      const current = itemEdge === "center" ? (rect.left + rect.right) / 2 : itemEdge === "left" ? rect.left : rect.right;
      const currentX = Number.parseFloat(gsap.getProperty(track, "x")) || 0;
      return currentX + target - current;
    };
    const endpoints = () => {
      const rtl = document.documentElement.dir === "rtl";
      return rtl
        ? {
          start: alignedX(items[0], "center", "center"),
          end: alignedX(items[items.length - 1], "left", "left"),
        }
        : {
          start: alignedX(items[0], "center", "center"),
          end: alignedX(items[items.length - 1], "right", "right"),
        };
    };
    const distance = () => {
      const { start, end } = endpoints();
      return Math.abs(end - start);
    };
    const travelDuration = 0.78;
    const scrollMultiplier = 2.3;
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max((distance() * scrollMultiplier) / travelDuration, window.innerHeight * 1.25)}`,
        pin: section,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    timeline.fromTo(
      track,
      { x: () => endpoints().start },
      { x: () => endpoints().end, ease: "none", duration: travelDuration },
      0,
    );
    timeline.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: travelDuration }, 0);
    gsap.set(items[0], { autoAlpha: 1, y: 0 });
    items[0].classList.add("is-active");
    items.forEach((item, index) => {
      if (index === 0) return;
      const revealSpan = 0.56;
      const revealSteps = Math.max(1, items.length - 2);
      const position = 0.08 + ((index - 1) / revealSteps) * revealSpan;
      timeline.fromTo(
        item,
        { autoAlpha: 0, y: 8, scale: 0.99 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.14,
          ease: "power2.out",
          onStart: () => item.classList.add("is-active"),
        },
        position,
      );
    });
    return () => viewport.classList.remove("is-animated");
  });

  document.addEventListener("site-language-change", () => {
    ScrollTrigger.refresh();
    const sectionTrigger = ScrollTrigger.getAll().find((trigger) => trigger.trigger === section);
    if (sectionTrigger?.isActive) {
      if (typeof window.writeScroll === "function") window.writeScroll(sectionTrigger.start);
      else sectionTrigger.scroll(sectionTrigger.start);
      ScrollTrigger.update();
    }
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
