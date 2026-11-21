/**
 * ============================================================================
 * KYODO — CLOUDFLARE PAGES STATIC LANDING SITE CONTROLLER (app.js)
 * ============================================================================
 * Easy Placeholder & Production Action Configuration:
 */
const DMG_DOWNLOAD_URL = "https://github.com/GlenEchoes/kyodo-releases/releases/latest/download/Kyodo.dmg";
const WEB_EXTENSION_DOWNLOAD_URL = "#kyodo-web-extension-placeholder";
const CLOSED_BETA_FORM_URL = "#closed-beta-tally-placeholder";
const DISCORD_INVITE_URL = "https://discord.gg/ccwNMaqSz";
const WHATSAPP_INVITE_URL = "https://chat.whatsapp.com/JPINRPY8Kc78sTun9oneuV";
const FOUNDER_LINKEDIN_URLS = {
  apoorva: "https://www.linkedin.com",
  gunjit: "https://www.linkedin.com",
  nalina: "https://www.linkedin.com",
  shruthi: "https://www.linkedin.com"
};
const DEMO_VIDEO_MP4_URL = ""; // Optional global fallback .mp4 URL
const DEMO_VIDEO_URLS = {
  claimGrounding: "",
  citationAudit: "",
  styleTransmuter: "",
  spatialVault: "",
  zoteroAndIpad: ""
};
const COMPANION_TASK_VIDEO_URLS = {
  grounding: "assets/videos/live-claim-grounding.mp4",
  audit: "assets/videos/in-paper-citation-audit.mp4",
  transmutation: "assets/videos/style-transmutation.mp4"
};
const KYODO_WORKER_BASE_URL = "https://kyodo-trial-proxy.gunjit-glen.workers.dev";

/* ============================================================================
   1. BIND PLACEHOLDER URLS TO DOM LINKS & DIRECT DMG DOWNLOAD HELPER
   ============================================================================ */
function startDirectDmgDownload() {
  if (!DMG_DOWNLOAD_URL || DMG_DOWNLOAD_URL.startsWith("#")) return;
  try {
    let dlFrame = document.getElementById("kyodo-dmg-download-iframe");
    if (!dlFrame) {
      dlFrame = document.createElement("iframe");
      dlFrame.id = "kyodo-dmg-download-iframe";
      dlFrame.style.display = "none";
      dlFrame.setAttribute("aria-hidden", "true");
      document.body.appendChild(dlFrame);
    }
    dlFrame.src = DMG_DOWNLOAD_URL;
  } catch (_) {
    const autoAnchor = document.createElement("a");
    autoAnchor.href = DMG_DOWNLOAD_URL;
    autoAnchor.rel = "noopener";
    autoAnchor.style.display = "none";
    document.body.appendChild(autoAnchor);
    autoAnchor.click();
    autoAnchor.remove();
  }
}

function initPlaceholderLinks() {
  const dmgLink = document.getElementById("direct-dmg-link");
  if (dmgLink && DMG_DOWNLOAD_URL) {
    dmgLink.setAttribute("href", DMG_DOWNLOAD_URL);
  }

  document.querySelectorAll("[data-dmg-download-link]").forEach((el) => {
    if (DMG_DOWNLOAD_URL) {
      el.setAttribute("href", DMG_DOWNLOAD_URL);
    }
  });

  // Automatically start downloading Kyodo.dmg whenever any "Download .dmg" trigger opens #download-modal
  document.querySelectorAll('button[commandfor="download-modal"][command="show-modal"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      startDirectDmgDownload();
    });
  });

  document.querySelectorAll("[data-extension-download-link]").forEach((el) => {
    if (WEB_EXTENSION_DOWNLOAD_URL) {
      el.setAttribute("href", WEB_EXTENSION_DOWNLOAD_URL);
    }
  });

  document.querySelectorAll("[data-discord-invite-link]").forEach((el) => {
    if (DISCORD_INVITE_URL) {
      el.setAttribute("href", DISCORD_INVITE_URL);
    }
  });

  document.querySelectorAll("[data-whatsapp-invite-link]").forEach((el) => {
    if (WHATSAPP_INVITE_URL) {
      el.setAttribute("href", WHATSAPP_INVITE_URL);
    }
  });

  document.querySelectorAll("[data-founder-linkedin]").forEach((el) => {
    const key = (el.getAttribute("data-founder-linkedin") || "").trim().toLowerCase();
    const url = FOUNDER_LINKEDIN_URLS && FOUNDER_LINKEDIN_URLS[key];
    if (url) {
      el.setAttribute("href", url);
    }
  });
}

/* ============================================================================
   2. ADAPTIVE DUAL THEME ENGINE (modern-web-guidance: dark-mode-toggle)
   ============================================================================ */
function initThemeToggle() {
  const metaScheme = document.querySelector('meta[name="color-scheme"]');
  const toggleBtn = document.getElementById("theme-toggle");
  if (!metaScheme || !toggleBtn) return;

  function getSystemScheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function getRenderedScheme() {
    const content = metaScheme.content;
    if (content === "light" || content === "dark") {
      return content;
    }
    return "dark";
  }

  toggleBtn.addEventListener("click", () => {
    const currentRendered = getRenderedScheme();
    const targetScheme = currentRendered === "dark" ? "light" : "dark";
    const systemScheme = getSystemScheme();

    try {
      if (targetScheme === systemScheme && systemScheme === "dark") {
        localStorage.removeItem("color-scheme");
        metaScheme.content = "light dark";
      } else {
        localStorage.setItem("color-scheme", targetScheme);
        metaScheme.content = targetScheme;
      }
    } catch (_) {
      metaScheme.content = targetScheme;
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "color-scheme") {
      metaScheme.content = event.newValue ?? "light dark";
    }
  });
}

/* ============================================================================
   3. HERO PITCH DECK SLIDE 1 INTERACTIVE MICRO-DEMO
   ============================================================================ */
function initHeroSlide1Demo() {
  const insertBtn = document.getElementById("slide1-insert-btn");
  const ignoreBtn = document.getElementById("slide1-ignore-btn");
  const discoveryCard = document.getElementById("slide1-discovery-card");
  const confirmPill = document.getElementById("slide1-confirm-pill");
  const insertedCite = document.getElementById("slide1-inserted-cite");
  const claimSpan = document.getElementById("slide1-claim-span");
  const bibBlock = document.getElementById("slide1-bib-block");
  const pillStatus = document.getElementById("slide1-pill-status");
  const confirmBtn = document.getElementById("slide1-confirm-btn");
  const replayBtn = document.getElementById("slide1-replay-btn");
  const review3Btn = document.getElementById("slide1-review3-btn");

  if (!insertBtn || !discoveryCard || !confirmPill) return;

  function triggerInsertCitation() {
    if (insertedCite) insertedCite.hidden = false;
    if (claimSpan) claimSpan.classList.add("claim-grounded");
    if (bibBlock) bibBlock.hidden = false;
    discoveryCard.hidden = true;
    confirmPill.hidden = false;
    if (pillStatus) {
      pillStatus.textContent = "Auto-Inserted";
    }
    if (confirmBtn) {
      confirmBtn.textContent = "Confirm";
      confirmBtn.disabled = false;
    }
  }

  function resetSlide1Demo() {
    if (insertedCite) insertedCite.hidden = true;
    if (claimSpan) claimSpan.classList.remove("claim-grounded");
    if (bibBlock) bibBlock.hidden = true;
    confirmPill.hidden = true;
    discoveryCard.hidden = false;
  }

  insertBtn.addEventListener("click", triggerInsertCitation);

  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      if (pillStatus) {
        pillStatus.textContent = "✓ Grounded in Vault";
      }
      confirmBtn.textContent = "Confirmed";
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", resetSlide1Demo);
  }

  if (ignoreBtn) {
    ignoreBtn.addEventListener("click", () => {
      discoveryCard.hidden = true;
      confirmPill.hidden = false;
      if (pillStatus) pillStatus.textContent = "Dismissed (Click ↺ Replay Demo)";
    });
  }

  if (review3Btn) {
    review3Btn.addEventListener("click", () => {
      const featuresSec = document.getElementById("features");
      const tab1Btn = document.getElementById("orb-tab-btn-1");
      if (tab1Btn) tab1Btn.click();
      if (featuresSec) featuresSec.scrollIntoView({ behavior: "smooth" });
    });
  }
}

/* ============================================================================
   4. HORIZONTAL SCROLLABLE FEATURE VIDEO CAROUSEL (#18)
   Center card plays/loops; neighboring off-center cards pause automatically!
   ============================================================================ */
function initVideoCarousel() {
  const track = document.getElementById("video-carousel-track");
  const cards = Array.from(document.querySelectorAll(".video-carousel-card"));
  const pills = Array.from(document.querySelectorAll(".carousel-pill"));
  const prevBtn = document.getElementById("carousel-prev-btn");
  const nextBtn = document.getElementById("carousel-next-btn");

  if (!track || !cards.length) return;

  let activeIndex = 0;

  // Bind optional MP4 URLs if configured
  cards.forEach((card) => {
    const key = card.getAttribute("data-video-key") || "";
    const videoEl = card.querySelector(".carousel-video-el");
    const canvasEl = card.querySelector(".carousel-live-canvas");
    const configuredUrl = (DEMO_VIDEO_URLS && DEMO_VIDEO_URLS[key]) || DEMO_VIDEO_MP4_URL || "";

    if (videoEl && configuredUrl.trim() !== "") {
      videoEl.src = configuredUrl.trim();
      videoEl.hidden = false;
      if (canvasEl) canvasEl.hidden = true;
    }
  });

  function setActiveCarouselCard(newIndex) {
    activeIndex = Math.max(0, Math.min(cards.length - 1, newIndex));

    cards.forEach((card, idx) => {
      const isCenter = idx === activeIndex;
      card.classList.toggle("is-playing", isCenter);
      card.classList.toggle("is-paused", !isCenter);

      const videoEl = card.querySelector(".carousel-video-el");
      if (videoEl && !videoEl.hidden) {
        if (isCenter) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      }
    });

    pills.forEach((pill, idx) => {
      const isCenter = idx === activeIndex;
      pill.classList.toggle("active", isCenter);
      pill.setAttribute("aria-selected", isCenter ? "true" : "false");
    });
  }

  function scrollToCard(index) {
    const targetIndex = Math.max(0, Math.min(cards.length - 1, index));
    const targetCard = cards[targetIndex];
    if (!targetCard) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = targetCard.getBoundingClientRect();
    const scrollOffset =
      track.scrollLeft +
      (cardRect.left - trackRect.left) -
      (trackRect.width / 2 - cardRect.width / 2);

    track.scrollTo({ left: scrollOffset, behavior: "smooth" });
    setActiveCarouselCard(targetIndex);
  }

  // Detect which card is closest to the horizontal center of the scrollport
  let scrollTicking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closestIdx = activeIndex;
        let minDistance = Infinity;

        cards.forEach((card, idx) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const dist = Math.abs(cardCenter - trackCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        if (closestIdx !== activeIndex) {
          setActiveCarouselCard(closestIdx);
        }
        scrollTicking = false;
      });
    },
    { passive: true }
  );

  // Clicking an off-center paused card centers and plays it
  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      if (idx !== activeIndex) {
        scrollToCard(idx);
      }
    });
  });

  // Clicking feature pills above the carousel centers that card
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetIdx = parseInt(pill.getAttribute("data-carousel-target") || "0", 10);
      scrollToCard(targetIdx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const nextIdx = (activeIndex - 1 + cards.length) % cards.length;
      scrollToCard(nextIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIdx = (activeIndex + 1) % cards.length;
      scrollToCard(nextIdx);
    });
  }

  setActiveCarouselCard(0);
}

/* ============================================================================
   5. SECTION 2A: INTERACTIVE 3-TAB SPATIAL ORB STAGE
   ============================================================================ */
const TAB1_CANDIDATES = [
  {
    inline: "(Lytvyn & Bjornstad, 2017)",
    ref: "Lytvyn, Y., & Bjornstad, P. (2017). Sodium Glucose Cotransporter-2 Inhibition in Heart Failure. <em>Circulation</em>, 136(17), 1643–1658."
  },
  {
    inline: "(McMurray et al., 2019)",
    ref: "McMurray, J. J. V., Solomon, S. D., Inzucchi, S. E., et al. (2019). Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. <em>New England Journal of Medicine</em>, 381(21), 1995–2008."
  },
  {
    inline: "(Packer et al., 2020)",
    ref: "Packer, M., Anker, S. D., Butler, J., et al. (2020). Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. <em>New England Journal of Medicine</em>, 383(15), 1413–1424."
  }
];

const TAB2_AUDIT_DATA = {
  "12": {
    verdictClass: "verdict-emerald",
    verdictText: "● [12] 94% Supported • Emerald Verified",
    title: "Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction",
    authors: "J.J.V. McMurray et al. (2019) • New England Journal of Medicine",
    claim: "\"Cardioprotective SGLT2 inhibition consistently attenuates hospitalizations for heart failure in human cohorts with reduced ejection fraction [12].\"",
    quote: "\"Hospitalization for heart failure occurred in 237 patients (10.0%) in the dapagliflozin group and in 326 patients (13.7%) in the placebo group (hazard ratio, 0.70; 95% CI, 0.59 to 0.83).\"",
    note: "<strong>Epistemic Entailment Verdict:</strong> Direct Phase-III human RCT evidence (<code>N = 4,744</code>) directly entails the author's clinical claim."
  },
  "19": {
    verdictClass: "verdict-amber",
    verdictText: "▲ [19] Scope Mismatch / Overstated Claim • Amber Caution",
    title: "Empagliflozin Inhibits Cardiac Na+/H+ Exchanger-1 in Isolated Murine Myocytes",
    authors: "A. Baartscheer et al. (2017) • Diabetologia (Preclinical Study)",
    claim: "\"Furthermore, direct myocardial Na+/H+ exchanger-1 (NHE1) blockade has been conclusively proven in large Phase-III human randomized trials to reverse ventricular remodeling [19].\"",
    quote: "\"In isolated ventricular myocytes from healthy rabbits and mice (n = 14), acute empagliflozin superfusion reduced cytoplasmic sodium and calcium concentrations via NHE flux inhibition.\"",
    note: "<strong>Epistemic Scope Warning:</strong> Reference <code>[19]</code> is an acute ex-vivo murine/rabbit myocyte experiment (<code>n = 14</code>), not a Phase-III human randomized trial. Qualify your claim scope."
  },
  "27": {
    verdictClass: "verdict-rose",
    verdictText: "✕ [27] Misquoted / Contradictory Evidence • Rose Alert",
    title: "Long-Term Loop Diuretic Monotherapy and Mortality in Chronic Heart Failure",
    authors: "K.F. Adams et al. • American Heart Journal",
    claim: "\"Finally, high-dose loop diuretic monotherapy significantly reduces 5-year all-cause cardiovascular mortality in chronic HFrEF [27].\"",
    quote: "\"High-dose loop diuretic monotherapy was not associated with a reduction in 5-year all-cause cardiovascular mortality (adjusted HR 1.08; 95% CI, 0.91–1.28; p = 0.42) and correlated with neurohormonal activation.\"",
    note: "<strong>Epistemic Contradiction Alert:</strong> Reference <code>[27]</code> reported <em>no statistically significant mortality reduction (p = 0.42)</em>, directly contradicting the citing sentence."
  }
};

const TAB3_STYLES = {
  apa: {
    heading: "Synchronized Bibliography • APA 7th Edition",
    cite1: "(Lytvyn & Bjornstad, 2017; McMurray et al., 2019)",
    cite2: "(Packer et al., 2020)",
    bib: [
      "Lytvyn, Y., & Bjornstad, P. (2017). Sodium Glucose Cotransporter-2 Inhibition in Heart Failure. <em>Circulation</em>, 136(17), 1643–1658.",
      "McMurray, J. J. V., Solomon, S. D., Inzucchi, S. E., et al. (2019). Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. <em>New England Journal of Medicine</em>, 381(21), 1995–2008.",
      "Packer, M., Anker, S. D., Butler, J., et al. (2020). Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. <em>New England Journal of Medicine</em>, 383(15), 1413–1424."
    ]
  },
  vancouver: {
    heading: "Synchronized Bibliography • Vancouver (ICMJE Numbered)",
    cite1: "[1,2]",
    cite2: "[3]",
    bib: [
      "Lytvyn Y, Bjornstad P. Sodium Glucose Cotransporter-2 Inhibition in Heart Failure. Circulation. 2017;136(17):1643-58.",
      "McMurray JJV, Solomon SD, Inzucchi SE, et al. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. N Engl J Med. 2019;381(21):1995-2008.",
      "Packer M, Anker SD, Butler J, et al. Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. N Engl J Med. 2020;383(15):1413-24."
    ]
  },
  nature: {
    heading: "Synchronized Bibliography • Nature Portfolio Superscript",
    cite1: "¹,²",
    cite2: "³",
    bib: [
      "Lytvyn, Y. & Bjornstad, P. Sodium Glucose Cotransporter-2 Inhibition in Heart Failure. <em>Circulation</em> <strong>136</strong>, 1643–1658 (2017).",
      "McMurray, J. J. V. et al. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. <em>N. Engl. J. Med.</em> <strong>381</strong>, 1995–2008 (2019).",
      "Packer, M. et al. Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. <em>N. Engl. J. Med.</em> <strong>383</strong>, 1413–1424 (2020)."
    ]
  },
  ama: {
    heading: "Synchronized Bibliography • AMA 11th / NEJM Medical",
    cite1: "<sup>1,2</sup>",
    cite2: "<sup>3</sup>",
    bib: [
      "Lytvyn Y, Bjornstad P. Sodium glucose cotransporter-2 inhibition in heart failure. <em>Circulation</em>. 2017;136(17):1643-1658. doi:10.1161/CIRCULATIONAHA.117.030012",
      "McMurray JJV, Solomon SD, Inzucchi SE, et al. Dapagliflozin in patients with heart failure and reduced ejection fraction. <em>N Engl J Med</em>. 2019;381(21):1995-2008. doi:10.1056/NEJMoa1911303",
      "Packer M, Anker SD, Butler J, et al. Cardiovascular and renal outcomes with empagliflozin in heart failure. <em>N Engl J Med</em>. 2020;383(15):1413-1424. doi:10.1056/NEJMoa2022190"
    ]
  },
  harvard: {
    heading: "Synchronized Bibliography • Harvard Author-Date",
    cite1: "(Lytvyn and Bjornstad 2017; McMurray et al. 2019)",
    cite2: "(Packer et al. 2020)",
    bib: [
      "Lytvyn, Y. and Bjornstad, P., 2017. Sodium Glucose Cotransporter-2 Inhibition in Heart Failure. <em>Circulation</em>, 136(17), pp.1643–1658.",
      "McMurray, J.J.V., Solomon, S.D., Inzucchi, S.E. et al., 2019. Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction. <em>New England Journal of Medicine</em>, 381(21), pp.1995–2008.",
      "Packer, M., Anker, S.D., Butler, J. et al., 2020. Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure. <em>New England Journal of Medicine</em>, 383(15), pp.1413–1424."
    ]
  }
};

function initOrbShowcase2A() {
  const tabBtns = document.querySelectorAll(".orb-tab-btn");
  const tabPanels = document.querySelectorAll(".orb-tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-orb-tab");
      tabBtns.forEach((b) => {
        const isCurrent = b === btn;
        b.classList.toggle("active", isCurrent);
        b.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });
      tabPanels.forEach((panel) => {
        panel.hidden = panel.id !== `orb-tab-panel-${targetTab}`;
      });
    });
  });

  // Tab 1: Review (3) Candidate Switcher
  const candCards = document.querySelectorAll("#tab1-candidate-list .candidate-card");
  const candBtns = document.querySelectorAll("[data-candidate-btn]");
  const inlineCiteEl = document.getElementById("tab1-active-inline-cite");
  const refTextEl = document.getElementById("tab1-active-ref-text");

  function selectCandidate(index) {
    const data = TAB1_CANDIDATES[index];
    if (!data) return;
    if (inlineCiteEl) inlineCiteEl.textContent = data.inline;
    if (refTextEl) refTextEl.innerHTML = data.ref;

    candCards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
    candBtns.forEach((btn, i) => {
      const isCurrent = i === index;
      btn.classList.toggle("active", isCurrent);
      btn.textContent = isCurrent ? "✓ Currently Cited" : "⇄ Switch to this";
    });
  }

  candBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-candidate-btn") || "0", 10);
      selectCandidate(idx);
    });
  });

  // Tab 2: In-Paper Citation Audit ([12], [19], [27])
  const auditTriggers = document.querySelectorAll("[data-audit-id]");
  const verdictPill = document.getElementById("tab2-verdict-pill");
  const refTitle = document.getElementById("tab2-ref-title");
  const refAuthors = document.getElementById("tab2-ref-authors");
  const citingClaim = document.getElementById("tab2-citing-claim");
  const sourceQuote = document.getElementById("tab2-source-quote");
  const epistemicNote = document.getElementById("tab2-epistemic-note");

  function selectAuditMarker(id) {
    const entry = TAB2_AUDIT_DATA[id];
    if (!entry) return;
    if (verdictPill) {
      verdictPill.className = `audit-verdict-pill ${entry.verdictClass}`;
      verdictPill.textContent = entry.verdictText;
    }
    if (refTitle) refTitle.textContent = entry.title;
    if (refAuthors) refAuthors.textContent = entry.authors;
    if (citingClaim) citingClaim.textContent = entry.claim;
    if (sourceQuote) sourceQuote.textContent = entry.quote;
    if (epistemicNote) epistemicNote.innerHTML = entry.note;

    document.querySelectorAll(".inline-audit-marker").forEach((m) => {
      m.classList.toggle("active", m.getAttribute("data-audit-id") === id);
    });
  }

  auditTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const id = trigger.getAttribute("data-audit-id");
      if (id) selectAuditMarker(id);
    });
  });

  // Tab 3: 1-Click Citation Style Transmuter & Natural Language Presets
  const stylePills = document.querySelectorAll(".style-pill");
  const cite1El = document.getElementById("tab3-cite-1");
  const cite2El = document.getElementById("tab3-cite-2");
  const bibHeadingEl = document.getElementById("tab3-bib-heading");
  const bibListEl = document.getElementById("tab3-bib-list");
  const nlInputEl = document.getElementById("tab3-nl-input");
  const nlPresetBtns = document.querySelectorAll(".nl-preset-btn");

  function applyCitationStyle(styleKey) {
    const schema = TAB3_STYLES[styleKey];
    if (!schema) return;

    stylePills.forEach((pill) => {
      pill.classList.toggle("active", pill.getAttribute("data-style") === styleKey);
    });

    if (cite1El) cite1El.innerHTML = schema.cite1;
    if (cite2El) cite2El.innerHTML = schema.cite2;
    if (bibHeadingEl) bibHeadingEl.textContent = schema.heading;
    if (bibListEl) {
      bibListEl.innerHTML = schema.bib.map((item) => `<li>${item}</li>`).join("");
    }
  }

  stylePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const styleKey = pill.getAttribute("data-style");
      if (styleKey) applyCitationStyle(styleKey);
    });
  });

  nlPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const styleKey = btn.getAttribute("data-nl-style");
      const cmdText = btn.getAttribute("data-nl-cmd");
      if (nlInputEl && cmdText) nlInputEl.value = cmdText;
      if (styleKey) applyCitationStyle(styleKey);
    });
  });
}

/* ============================================================================
   6. SECTION 2B: FULL-BLEED 3-PANE CENTRAL SPATIAL VAULT (#11, #12, #13)
   ============================================================================ */
const VAULT_PAPERS = {
  lytvyn: {
    journalHeader: "CIRCULATION • STATE-OF-THE-ART REVIEW",
    pageHeader: "Page 4 of 16",
    title: "Sodium Glucose Cotransporter-2 Inhibition in Heart Failure: Potential Mechanisms, Clinical Applications, and Summary of Clinical Trials",
    authors: "Yuliya Lytvyn, PhD; Petter Bjornstad, MD; Jacob A. Udell, MD, MPH; Julie A. Lovshin, MD, PhD; David Z.I. Cherney, MD, PhD (2017)",
    jumpText: "Page 4 • Results — Jump to Verified Citation Passage",
    metaPub: "Circulation (AHA) • Oct 2017",
    metaDoi: "10.1161/CIRCULATIONAHA.117.030012",
    metaRag: "✓ 68 Passages Indexed (<2ms)"
  },
  mcmurray: {
    journalHeader: "NEW ENGLAND JOURNAL OF MEDICINE • DAPA-HF TRIAL",
    pageHeader: "Page 6 of 14",
    title: "Dapagliflozin in Patients with Heart Failure and Reduced Ejection Fraction",
    authors: "John J.V. McMurray, MD; Scott D. Solomon, MD; Silvio E. Inzucchi, MD; Lars Køber, MD, DMSc, et al. (2019)",
    jumpText: "Page 6 • Primary Outcomes — Jump to Verified DAPA-HF Hazard Ratio",
    metaPub: "New England Journal of Medicine • Nov 2019",
    metaDoi: "10.1056/NEJMoa1911303",
    metaRag: "✓ 54 Passages Indexed (<2ms)"
  },
  packer: {
    journalHeader: "NEW ENGLAND JOURNAL OF MEDICINE • EMPEROR-REDUCED",
    pageHeader: "Page 5 of 12",
    title: "Cardiovascular and Renal Outcomes with Empagliflozin in Heart Failure",
    authors: "Milton Packer, MD; Stefan D. Anker, MD, PhD; Javed Butler, MD, MPH; Gerasimos Filippatos, MD, et al. (2020)",
    jumpText: "Page 5 • Composite Endpoint — Jump to EMPEROR-Reduced Passage",
    metaPub: "New England Journal of Medicine • Oct 2020",
    metaDoi: "10.1056/NEJMoa2022190",
    metaRag: "✓ 61 Passages Indexed (<2ms)"
  }
};

function initSpatialVault2B() {
  const vaultTabs = document.querySelectorAll(".vault-tab");
  const journalHead = document.getElementById("pdf-journal-header");
  const pageHead = document.getElementById("pdf-page-num-header");
  const artTitle = document.getElementById("pdf-article-title");
  const artAuthors = document.getElementById("pdf-article-authors");
  const ragJumpText = document.getElementById("rag-jump-text");
  const markP4 = document.getElementById("pdf-mark-p4");
  const markP6 = document.getElementById("pdf-mark-p6");

  const metaPubEl = document.getElementById("mp-meta-pub");
  const metaDoiEl = document.getElementById("mp-meta-doi");
  const metaRagEl = document.getElementById("mp-meta-rag");

  vaultTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-vault-paper") || "lytvyn";
      const info = VAULT_PAPERS[key];
      if (!info) return;

      vaultTabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      if (journalHead) journalHead.textContent = info.journalHeader;
      if (pageHead) pageHead.textContent = info.pageHeader;
      if (artTitle) artTitle.textContent = info.title;
      if (artAuthors) artAuthors.textContent = info.authors;
      if (ragJumpText) ragJumpText.textContent = info.jumpText;

      if (metaPubEl) metaPubEl.textContent = info.metaPub;
      if (metaDoiEl) metaDoiEl.textContent = info.metaDoi;
      if (metaRagEl) metaRagEl.textContent = info.metaRag;

      if (key === "mcmurray") {
        if (markP4) markP4.classList.remove("active-passage");
        if (markP6) markP6.classList.add("active-passage");
      } else {
        if (markP4) markP4.classList.add("active-passage");
        if (markP6) markP6.classList.remove("active-passage");
      }
    });
  });

  // Left Folders Rail
  const folderItems = document.querySelectorAll(".folder-item");
  const railToast = document.getElementById("vault-rail-toast");
  folderItems.forEach((item) => {
    item.addEventListener("click", () => {
      folderItems.forEach((f) => f.classList.toggle("active", f === item));
      const label = item.querySelector("span")?.textContent || "Collection";
      if (railToast) railToast.textContent = `✓ Viewing ${label.trim()}`;
    });
  });

  const autoSortBtn = document.getElementById("vault-autosort-btn");
  if (autoSortBtn && railToast) {
    autoSortBtn.addEventListener("click", () => {
      railToast.textContent = "⚡ Auto-Sorted 148 PDFs into 4 Clinical Collections";
    });
  }

  const zoteroBtn = document.getElementById("vault-zotero-btn");
  if (zoteroBtn && railToast) {
    zoteroBtn.addEventListener("click", () => {
      railToast.textContent = "📥 Zotero Library Synced (148 PDFs • 100% Compatible)";
    });
  }

  // Floating Reader Toolbar Tools & Color Swatches
  const SWATCH_COLORS = {
    emerald: { bg: "rgba(16, 185, 129, 0.22)", border: "#10B981" },
    amber: { bg: "rgba(245, 163, 20, 0.24)", border: "#F5A314" },
    sapphire: { bg: "rgba(46, 166, 250, 0.24)", border: "#2EA6FA" },
    violet: { bg: "rgba(158, 122, 250, 0.24)", border: "#9E7AFA" },
    rose: { bg: "rgba(245, 92, 117, 0.24)", border: "#F55C75" }
  };

  const swatches = document.querySelectorAll(".color-swatch");
  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      swatches.forEach((s) => s.classList.toggle("active", s === swatch));
      const colorKey = swatch.getAttribute("data-swatch") || "emerald";
      const palette = SWATCH_COLORS[colorKey] || SWATCH_COLORS.emerald;
      document.querySelectorAll(".pdf-highlight-span.active-passage").forEach((el) => {
        el.style.backgroundColor = palette.bg;
        el.style.borderBottomColor = palette.border;
      });
    });
  });

  const toolBtns = document.querySelectorAll("[data-reader-tool]");
  toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tool = btn.getAttribute("data-reader-tool");
      toolBtns.forEach((b) => b.classList.toggle("active", b === btn));
      const activeMarks = document.querySelectorAll(".pdf-highlight-span.active-passage");
      activeMarks.forEach((el) => {
        if (tool === "eraser") {
          el.style.backgroundColor = "transparent";
          el.style.borderBottomColor = "transparent";
        } else if (tool === "underline") {
          el.style.backgroundColor = "transparent";
          el.style.borderBottom = "2px solid #2EA6FA";
        } else {
          el.style.backgroundColor = "rgba(16, 185, 129, 0.22)";
          el.style.borderBottom = "2px solid #10B981";
        }
      });
    });
  });

  const citeBtn = document.getElementById("vault-cite-btn");
  if (citeBtn) {
    citeBtn.addEventListener("click", () => {
      citeBtn.textContent = "✓ Cited!";
      setTimeout(() => {
        citeBtn.innerHTML = '<span aria-hidden="true">❝</span> Cite';
      }, 1600);
    });
  }

  const airdropBtn = document.getElementById("airdrop-fallback-btn");
  if (airdropBtn) {
    airdropBtn.addEventListener("click", () => {
      airdropBtn.textContent = "✓ AirDrop Packet Ready for iPad";
    });
  }

  // Right Multipurpose Panel: Metadata | Chat switcher + Link to Google + View in PDF chips
  const mpTabs = document.querySelectorAll("[data-mp-mode]");
  const viewChat = document.getElementById("mp-view-chat");
  const viewMeta = document.getElementById("mp-view-metadata");

  mpTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const mode = tab.getAttribute("data-mp-mode");
      mpTabs.forEach((t) => {
        const isCurrent = t === tab;
        t.classList.toggle("active", isCurrent);
        t.setAttribute("aria-selected", isCurrent ? "true" : "false");
      });
      if (viewChat && viewMeta) {
        viewChat.hidden = mode !== "chat";
        viewMeta.hidden = mode !== "metadata";
      }
    });
  });

  const byokBtn = document.getElementById("byok-google-btn");
  const byokLabel = document.getElementById("byok-google-label");
  if (byokBtn && byokLabel) {
    byokBtn.addEventListener("click", () => {
      const isLinked = byokBtn.classList.toggle("is-linked");
      byokLabel.textContent = isLinked ? "✓ Gemini Linked" : "Link to Google";
    });
  }

  function bindJumpChips() {
    const jumpChips = document.querySelectorAll(".view-in-pdf-chip");
    jumpChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const target = chip.getAttribute("data-jump-target");
        jumpChips.forEach((c) => c.classList.toggle("active", c === chip));

        if (target === "p6") {
          if (markP4) markP4.classList.remove("active-passage");
          if (markP6) {
            markP6.classList.add("active-passage");
            markP6.style.backgroundColor = "rgba(16, 185, 129, 0.24)";
          }
          if (pageHead) pageHead.textContent = "Page 6 of 16";
          if (ragJumpText) ragJumpText.textContent = "Page 6 • Discussion — Jump to Verified DAPA-HF Passage";
        } else {
          if (markP6) markP6.classList.remove("active-passage");
          if (markP4) {
            markP4.classList.add("active-passage");
            markP4.style.backgroundColor = "rgba(16, 185, 129, 0.24)";
          }
          if (pageHead) pageHead.textContent = "Page 4 of 16";
          if (ragJumpText) ragJumpText.textContent = "Page 4 • Results — Jump to Verified Citation Passage";
        }
      });
    });
  }

  bindJumpChips();

  // Interactive Multi-Paper Chat Input Bar at Bottom of Right Pane
  const chatForm = document.getElementById("mp-chat-form");
  const chatInput = document.getElementById("mp-chat-input");
  const queryDisplay = document.getElementById("mp-query-display");
  const aiRespBox = document.getElementById("mp-ai-response-box");

  if (chatForm && chatInput && queryDisplay && aiRespBox) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const q = chatInput.value.trim();
      if (!q) return;

      queryDisplay.textContent = `"${q}"`;
      chatInput.value = "";

      aiRespBox.innerHTML = `
        <div class="ai-resp-title">✦ Grounded Multi-Paper Synthesis:</div>
        <div class="synthesis-item">
          <p>
            <strong>Cross-Trial Concordance:</strong> Across CANVAS (<code>HR 0.67</code>), DAPA-HF (<code>HR 0.70</code>), and EMPEROR-Reduced (<code>HR 0.75</code>), SGLT2 inhibition consistently reduced heart failure hospitalization independent of glycemic status.
          </p>
          <button type="button" class="view-in-pdf-chip active" data-jump-target="p4">
            📄 View in PDF (Page 4) ↗
          </button>
        </div>
        <div class="synthesis-item">
          <p>
            <strong>Non-Diabetic Subgroup (DAPA-HF &amp; EMPEROR):</strong> Treatment benefit remained identical between patients with and without type 2 diabetes (<code>P &lt; 0.001</code>).
          </p>
          <button type="button" class="view-in-pdf-chip" data-jump-target="p6">
            📄 View in PDF (Page 6) ↗
          </button>
        </div>
      `;
      bindJumpChips();
    });
  }
}

/* ============================================================================
   7. SECTION 4: INTERACTIVE 5-TIER PRICING, MODULAR DECOY CALCULATOR
      & CLOUDFLARE WORKER RAZORPAY CHECKOUT MACHINERY (#15)
   ============================================================================ */
const PRICING_BASE = {
  inr: {
    symbol: "₹",
    free: { monthly: 0, annualMonthly: 0, annualTotal: 0 },
    scholar: { monthly: 299, annualMonthly: 250, annualTotal: 2999 },
    pro: { monthly: 499, annualMonthly: 416, annualTotal: 4999 },
    proElite: { monthly: 999, annualMonthly: 833, annualTotal: 9999 },
    lab: { monthly: 1499, annualMonthly: 1250, annualTotal: 14999 },
    addons: {
      scholar: { ms1: 50, ms3: 150, shared1: 50, unlimSync: 250 },
      pro: { cloudAi: 350, unlimSync: 250, shared1: 50, collab1: 250 },
      proElite: { extraSeat: 500 }
    }
  },
  usd: {
    symbol: "$",
    free: { monthly: 0, annualMonthly: 0, annualTotal: 0 },
    scholar: { monthly: 12, annualMonthly: 10, annualTotal: 120 },
    pro: { monthly: 22, annualMonthly: 18, annualTotal: 216 },
    proElite: { monthly: 39, annualMonthly: 32, annualTotal: 384 },
    lab: { monthly: 59, annualMonthly: 49, annualTotal: 588 },
    addons: {
      scholar: { ms1: 3, ms3: 8, shared1: 3, unlimSync: 10 },
      pro: { cloudAi: 14, unlimSync: 10, shared1: 3, collab1: 10 },
      proElite: { extraSeat: 20 }
    }
  }
};

function getOrCreateWebDeviceId() {
  const key = "kyodo_web_device_id";
  try {
    let existing = localStorage.getItem(key);
    if (existing && existing.length >= 8) return existing;
    const rand =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, rand);
    return rand;
  } catch (_) {
    return `web-${Date.now().toString(36)}`;
  }
}

function getWebDeviceShortCode(deviceId) {
  return (
    String(deviceId || "ALL")
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6) || "ALL"
  );
}

let activeWebPaymentPoller = null;
let activeLocalDaemonRetryTimer = null;
let handledSubscriptionCode = null;

async function notifyLocalKyodoDaemon(subscriptionCode) {
  try {
    const resp = await fetch("http://127.0.0.1:19876/v1/payments/local-activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription_code: subscriptionCode })
    });
    if (resp.ok) return true;
  } catch (_) {}
  return false;
}

async function triggerPostPaymentActivationFlow(subscriptionCode) {
  const code = String(subscriptionCode || "").trim();
  if (!code || handledSubscriptionCode === code) return;
  handledSubscriptionCode = code;

  if (activeWebPaymentPoller) {
    clearInterval(activeWebPaymentPoller);
    activeWebPaymentPoller = null;
  }

  try {
    localStorage.setItem("kyodo_latest_subscription_code", code);
  } catch (_) {}

  // 1. Attempt to auto-unlock a running local Kyodo Mac daemon immediately
  const unlockedLocally = await notifyLocalKyodoDaemon(code);

  // 2. Open #download-modal and unhide #modal-license-unlocked-banner
  const downloadModal = document.getElementById("download-modal");
  const bannerEl = document.getElementById("modal-license-unlocked-banner");
  const keyTextEl = document.getElementById("modal-license-key-text");
  const noteEl = document.getElementById("modal-unlock-status-note");

  if (keyTextEl) keyTextEl.textContent = code;
  if (bannerEl) bannerEl.hidden = false;

  if (noteEl) {
    noteEl.textContent = unlockedLocally
      ? "Your running Kyodo Mac app has been unlocked automatically!"
      : "Kyodo.dmg download started automatically. Paste this key in Kyodo after installing, or keep this tab open while launching Kyodo for instant auto-unlock.";
  }

  if (downloadModal) {
    if (typeof downloadModal.showModal === "function") {
      if (!downloadModal.open) downloadModal.showModal();
    } else {
      downloadModal.setAttribute("open", "");
    }
  }

  // 3. If the local Mac daemon wasn't running yet, auto-trigger the .dmg download
  //    and keep a 4-second background retry loop for 5 minutes so launching Kyodo.app
  //    after installation unlocks automatically without pasting the key.
  if (!unlockedLocally) {
    startDirectDmgDownload();

    if (activeLocalDaemonRetryTimer) clearInterval(activeLocalDaemonRetryTimer);
    let attempts = 0;
    activeLocalDaemonRetryTimer = setInterval(async () => {
      attempts++;
      if (attempts > 75) {
        clearInterval(activeLocalDaemonRetryTimer);
        activeLocalDaemonRetryTimer = null;
        return;
      }
      const ok = await notifyLocalKyodoDaemon(code);
      if (ok) {
        clearInterval(activeLocalDaemonRetryTimer);
        activeLocalDaemonRetryTimer = null;
        if (noteEl) {
          noteEl.textContent = "Your running Kyodo Mac app has been unlocked automatically!";
        }
      }
    }, 4000);
  }
}

function startWebPaymentAutoUnlockAndDownloadPoller() {
  const deviceId = getOrCreateWebDeviceId();
  const deviceShortCode = getWebDeviceShortCode(deviceId);

  if (activeWebPaymentPoller) clearInterval(activeWebPaymentPoller);

  const pollOnce = async () => {
    try {
      const qs = new URLSearchParams({
        device_id: deviceId,
        device_short_code: deviceShortCode
      });
      const res = await fetch(`${KYODO_WORKER_BASE_URL}/v1/payments/status?${qs.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && (data.active || data.has_active_subscription) && data.subscription_code) {
        await triggerPostPaymentActivationFlow(data.subscription_code);
      }
    } catch (_) {}
  };

  pollOnce();
  activeWebPaymentPoller = setInterval(pollOnce, 3000);
}

function initPricingCalculator() {
  let currentCurrency = "inr";
  let currentBilling = "annual";

  const state = {
    scholar: { ms1: 0, ms3: 0, shared1: 0, unlimSync: 0 },
    pro: { cloudAi: 0, unlimSync: 0, shared1: 0, collab1: 0 },
    proElite: { extraSeat: 0 },
    lab: { seats: 2 }
  };

  /**
   * Encodes the selected card add-ons into the canonical 6-slot token format
   * expected by the Cloudflare Worker `/v1/checkout` endpoint:
   *   S<s>B<b>D<d>U<u>L<l>H<h>
   */
  function encodeCanonicalAddOnsToken(tierKey) {
    let s = 0, b = 0, d = 0, u = 0, l = 0, h = 0;

    if (tierKey === "scholar") {
      s = state.scholar.ms1 || 0;
      b = state.scholar.ms3 || 0;
      u = state.scholar.unlimSync ? 1 : 0;
      d = u ? 0 : (state.scholar.shared1 || 0);
    } else if (tierKey === "pro") {
      l = state.pro.cloudAi ? 1 : 0;
      u = state.pro.unlimSync ? 1 : 0;
      d = u ? 0 : (state.pro.shared1 || 0);
      h = state.pro.collab1 || 0;
    } else if (tierKey === "pro_elite" || tierKey === "proElite") {
      h = state.proElite.extraSeat || 0;
    }

    return `S${s}B${b}D${d}U${u}L${l}H${h}`;
  }

  function buildCheckoutURL(tierKey) {
    const deviceId = getOrCreateWebDeviceId();
    const deviceShortCode = getWebDeviceShortCode(deviceId);
    const canonicalTier =
      tierKey === "proElite" ? "pro_elite" : tierKey === "lab" ? "b2b_lab" : tierKey;
    const cycle = currentBilling === "annual" ? "yearly" : "monthly";
    const currency = currentCurrency === "inr" ? "INR" : "USD";
    const addons = encodeCanonicalAddOnsToken(canonicalTier);
    const seats = canonicalTier === "b2b_lab" ? state.lab.seats : 1;

    const params = new URLSearchParams({
      device: deviceShortCode,
      device_id: deviceId,
      device_short_code: deviceShortCode,
      tier: canonicalTier,
      cycle,
      currency,
      addons,
      seats: String(seats),
      source: "web"
    });

    return `${KYODO_WORKER_BASE_URL}/v1/checkout?${params.toString()}`;
  }

  const btnInr = document.getElementById("currency-btn-inr");
  const btnUsd = document.getElementById("currency-btn-usd");
  const btnMonthly = document.getElementById("billing-btn-monthly");
  const btnAnnual = document.getElementById("billing-btn-annual");

  const priceFreeEl = document.getElementById("price-free");
  const subFreeEl = document.getElementById("sub-free");
  const priceScholarEl = document.getElementById("price-scholar");
  const subScholarEl = document.getElementById("sub-scholar");
  const priceProEl = document.getElementById("price-pro");
  const subProEl = document.getElementById("sub-pro");
  const priceProEliteEl = document.getElementById("price-pro-elite");
  const subProEliteEl = document.getElementById("sub-pro-elite");
  const priceLabEl = document.getElementById("price-lab");
  const subLabEl = document.getElementById("sub-lab");
  const labTotalSummaryEl = document.getElementById("lab-total-summary");

  const rowScholarShared1 = document.getElementById("row-scholar-shared1");
  const costScholarShared1 = document.getElementById("cost-scholar-shared1");
  const rowProShared1 = document.getElementById("row-pro-shared1");
  const costProShared1 = document.getElementById("cost-pro-shared1");

  const checkoutBtnScholar = document.getElementById("checkout-btn-scholar");
  const checkoutBtnPro = document.getElementById("checkout-btn-pro");
  const checkoutBtnProElite = document.getElementById("checkout-btn-pro-elite");
  const checkoutBtnLab = document.getElementById("checkout-btn-lab");

  const svBanner = document.getElementById("smart-value-banner");
  const svTitle = document.getElementById("sv-banner-title");
  const svDesc = document.getElementById("sv-banner-desc");
  const svUpgradeBtn = document.getElementById("sv-upgrade-btn");

  function formatNumber(n) {
    return n.toLocaleString(currentCurrency === "inr" ? "en-IN" : "en-US");
  }

  function calculatePricing() {
    const cfg = PRICING_BASE[currentCurrency];
    const sym = cfg.symbol;
    const isAnnual = currentBilling === "annual";

    // Update Add-on cost labels
    document.querySelectorAll(".addon-cost[data-cost-inr]").forEach((el) => {
      el.textContent = currentCurrency === "inr"
        ? el.getAttribute("data-cost-inr")
        : el.getAttribute("data-cost-usd");
    });

    // Supersede shared1 when unlimSync > 0
    const scholarSharedEffective = state.scholar.unlimSync > 0 ? 0 : state.scholar.shared1;
    if (rowScholarShared1) {
      rowScholarShared1.classList.toggle("is-superseded", state.scholar.unlimSync > 0);
    }
    if (costScholarShared1 && state.scholar.unlimSync > 0) {
      costScholarShared1.textContent = "Included in Unlimited Sync";
    }

    const proSharedEffective = state.pro.unlimSync > 0 ? 0 : state.pro.shared1;
    if (rowProShared1) {
      rowProShared1.classList.toggle("is-superseded", state.pro.unlimSync > 0);
    }
    if (costProShared1 && state.pro.unlimSync > 0) {
      costProShared1.textContent = "Included in Unlimited Sync";
    }

    // 1. Free / Basic
    if (priceFreeEl) priceFreeEl.textContent = `${sym}0`;
    if (subFreeEl) subFreeEl.textContent = "No credit card required";

    // 2. Scholar
    const scholarBaseMo = isAnnual ? cfg.scholar.annualMonthly : cfg.scholar.monthly;
    const scholarAddonsMo =
      state.scholar.ms1 * cfg.addons.scholar.ms1 +
      state.scholar.ms3 * cfg.addons.scholar.ms3 +
      scholarSharedEffective * cfg.addons.scholar.shared1 +
      state.scholar.unlimSync * cfg.addons.scholar.unlimSync;
    const scholarTotalMo = scholarBaseMo + scholarAddonsMo;
    const scholarAnnualBilled = cfg.scholar.annualTotal + scholarAddonsMo * 12;

    if (priceScholarEl) priceScholarEl.textContent = `${sym}${formatNumber(scholarTotalMo)}`;
    if (subScholarEl) {
      if (isAnnual) {
        subScholarEl.textContent = `Billed ${sym}${formatNumber(scholarAnnualBilled)}/yr (Standard ${sym}${cfg.scholar.monthly}/mo)`;
      } else {
        subScholarEl.textContent = `Billed monthly • Save ~17% on Annual (${sym}${cfg.scholar.annualMonthly}/mo)`;
      }
    }
    if (checkoutBtnScholar) {
      checkoutBtnScholar.textContent = isAnnual
        ? `Subscribe to Scholar (${sym}${formatNumber(scholarAnnualBilled)}/yr)`
        : `Subscribe to Scholar (${sym}${formatNumber(scholarTotalMo)}/mo)`;
    }

    // 3. Pro
    const proBaseMo = isAnnual ? cfg.pro.annualMonthly : cfg.pro.monthly;
    const proAddonsMo =
      state.pro.cloudAi * cfg.addons.pro.cloudAi +
      state.pro.unlimSync * cfg.addons.pro.unlimSync +
      proSharedEffective * cfg.addons.pro.shared1 +
      state.pro.collab1 * cfg.addons.pro.collab1;
    const proTotalMo = proBaseMo + proAddonsMo;
    const proAnnualBilled = cfg.pro.annualTotal + proAddonsMo * 12;

    if (priceProEl) priceProEl.textContent = `${sym}${formatNumber(proTotalMo)}`;
    if (subProEl) {
      if (isAnnual) {
        subProEl.textContent = `Billed ${sym}${formatNumber(proAnnualBilled)}/yr (Standard ${sym}${cfg.pro.monthly}/mo)`;
      } else {
        subProEl.textContent = `Billed monthly • Save ~17% on Annual (${sym}${cfg.pro.annualMonthly}/mo)`;
      }
    }
    if (checkoutBtnPro) {
      checkoutBtnPro.textContent = isAnnual
        ? `Subscribe to Pro (${sym}${formatNumber(proAnnualBilled)}/yr)`
        : `Subscribe to Pro (${sym}${formatNumber(proTotalMo)}/mo)`;
    }

    // 4. Pro-Elite
    const eliteBaseMo = isAnnual ? cfg.proElite.annualMonthly : cfg.proElite.monthly;
    const eliteAddonsMo = state.proElite.extraSeat * cfg.addons.proElite.extraSeat;
    const eliteTotalMo = eliteBaseMo + eliteAddonsMo;
    const eliteAnnualBilled = cfg.proElite.annualTotal + eliteAddonsMo * 12;

    if (priceProEliteEl) priceProEliteEl.textContent = `${sym}${formatNumber(eliteTotalMo)}`;
    if (subProEliteEl) {
      if (isAnnual) {
        subProEliteEl.textContent = `Billed ${sym}${formatNumber(eliteAnnualBilled)}/yr (Standard ${sym}${cfg.proElite.monthly}/mo)`;
      } else {
        subProEliteEl.textContent = `Billed monthly • Save ~17% on Annual (${sym}${cfg.proElite.annualMonthly}/mo)`;
      }
    }
    if (checkoutBtnProElite) {
      checkoutBtnProElite.textContent = isAnnual
        ? `Subscribe to Pro-Elite (${sym}${formatNumber(eliteAnnualBilled)}/yr)`
        : `Subscribe to Pro-Elite (${sym}${formatNumber(eliteTotalMo)}/mo)`;
    }

    // 5. B2B Lab
    const labSeatMo = isAnnual ? cfg.lab.annualMonthly : cfg.lab.monthly;
    const labTotalMo = labSeatMo * state.lab.seats;
    const labAnnualBilled = cfg.lab.annualTotal * state.lab.seats;
    if (priceLabEl) priceLabEl.textContent = `${sym}${formatNumber(labSeatMo)}`;
    if (subLabEl) {
      if (isAnnual) {
        subLabEl.textContent = `Billed ${sym}${formatNumber(cfg.lab.annualTotal)}/seat/yr (Standard ${sym}${formatNumber(cfg.lab.monthly)}/mo)`;
      } else {
        subLabEl.textContent = `Billed monthly • Save ~17% on Annual (${sym}${formatNumber(cfg.lab.annualMonthly)}/seat/mo)`;
      }
    }
    if (labTotalSummaryEl) {
      labTotalSummaryEl.textContent = `Total: ${sym}${formatNumber(labTotalMo)} / mo (${state.lab.seats} seats)`;
    }
    if (checkoutBtnLab) {
      checkoutBtnLab.textContent = isAnnual
        ? `Subscribe Lab (${state.lab.seats} Seats • ${sym}${formatNumber(labAnnualBilled)}/yr)`
        : `Subscribe Lab (${state.lab.seats} Seats • ${sym}${formatNumber(labTotalMo)}/mo)`;
    }

    // Smart Value Recommendation Banner (Decoy Ladder Engine)
    if (svBanner && svTitle && svDesc && svUpgradeBtn) {
      if (proAddonsMo > 0 && proTotalMo >= eliteBaseMo) {
        svBanner.hidden = false;
        svTitle.textContent = `⚡ Better Value Available — Switch to Pro-Elite (${sym}${formatNumber(eliteBaseMo)}/mo) & Save`;
        svDesc.textContent = `Your customized Pro plan (${sym}${formatNumber(proTotalMo)}/mo) reaches or exceeds Pro-Elite. Upgrade to Pro-Elite to get Out-of-the-Box Cloud AI, AutoFolder Librarian, 2-Scholar Duet Vault, and Cast to iPad Canvas included.`;
        svUpgradeBtn.setAttribute("data-target-tier", "pro-elite");
        svUpgradeBtn.textContent = "✦ Switch to Pro-Elite & Save →";
      } else if (scholarAddonsMo > 0 && scholarTotalMo >= proBaseMo) {
        svBanner.hidden = false;
        svTitle.textContent = `⚡ Better Value Available — Switch to Pro (${sym}${formatNumber(proBaseMo)}/mo) & Save`;
        svDesc.textContent = `Your customized Scholar plan (${sym}${formatNumber(scholarTotalMo)}/mo) reaches or exceeds Pro. Switch to Pro for Unlimited LiveCite Docs, Multi-Paper LiveChat, and Zotero, Mendeley & EndNote Co-Author Sync.`;
        svUpgradeBtn.setAttribute("data-target-tier", "pro");
        svUpgradeBtn.textContent = "✦ Switch to Pro & Save →";
      } else {
        svBanner.hidden = true;
      }
    }
  }

  // Currency Toggle Listeners
  if (btnInr && btnUsd) {
    btnInr.addEventListener("click", () => {
      currentCurrency = "inr";
      btnInr.classList.add("active");
      btnUsd.classList.remove("active");
      calculatePricing();
    });
    btnUsd.addEventListener("click", () => {
      currentCurrency = "usd";
      btnUsd.classList.add("active");
      btnInr.classList.remove("active");
      calculatePricing();
    });
  }

  // Billing Cycle Listeners
  if (btnMonthly && btnAnnual) {
    btnMonthly.addEventListener("click", () => {
      currentBilling = "monthly";
      btnMonthly.classList.add("active");
      btnAnnual.classList.remove("active");
      calculatePricing();
    });
    btnAnnual.addEventListener("click", () => {
      currentBilling = "annual";
      btnAnnual.classList.add("active");
      btnMonthly.classList.remove("active");
      calculatePricing();
    });
  }

  // Add-On Stepper Buttons
  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tier = btn.getAttribute("data-tier");
      const addon = btn.getAttribute("data-addon");
      const dir = parseInt(btn.getAttribute("data-dir") || "1", 10);
      if (!tier || !addon || !state[tier]) return;

      const currentVal = state[tier][addon] || 0;
      let nextVal = currentVal + dir;

      if (tier === "lab" && addon === "seats") {
        nextVal = Math.max(2, Math.min(100, nextVal));
      } else if (addon === "unlimSync" || addon === "cloudAi") {
        nextVal = Math.max(0, Math.min(1, nextVal));
      } else if (addon === "ms3") {
        nextVal = Math.max(0, Math.min(5, nextVal));
      } else {
        nextVal = Math.max(0, Math.min(20, nextVal));
      }

      state[tier][addon] = nextVal;
      const valSpan = document.getElementById(`val-${tier}-${addon}`);
      if (valSpan) valSpan.textContent = String(nextVal);
      calculatePricing();
    });
  });

  // Wire Paid Tier Checkout Buttons to Cloudflare Worker Razorpay Endpoint
  // and start the live post-payment auto-unlock & auto-download poller (#3)
  document.querySelectorAll("[data-checkout-tier]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tierKey = btn.getAttribute("data-checkout-tier") || "pro";
      const checkoutUrl = buildCheckoutURL(tierKey);
      startWebPaymentAutoUnlockAndDownloadPoller();
      window.open(checkoutUrl, "_blank");
    });
  });

  // Listen for instant postMessage from the checkout window if opened in the same browser
  window.addEventListener("message", (event) => {
    if (
      event.data &&
      event.data.type === "KYODO_PAYMENT_UNLOCKED" &&
      event.data.subscription_code
    ) {
      triggerPostPaymentActivationFlow(event.data.subscription_code);
    }
  });

  // Check URL parameters on page load in case the user returns with ?subscription_code=KYODO-SUB-... or ?paid=1
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const returnedCode = (urlParams.get("subscription_code") || "").trim();
    const isPaidFlag = urlParams.get("paid") === "1" || urlParams.get("paid") === "true";
    if (returnedCode && returnedCode.startsWith("KYODO-SUB-")) {
      triggerPostPaymentActivationFlow(returnedCode);
    } else if (isPaidFlag) {
      startWebPaymentAutoUnlockAndDownloadPoller();
    }
  } catch (_) {}

  // Smart Value Banner Upgrade Action
  if (svUpgradeBtn) {
    svUpgradeBtn.addEventListener("click", () => {
      const target = svUpgradeBtn.getAttribute("data-target-tier");
      if (target === "pro") {
        state.scholar = { ms1: 0, ms3: 0, shared1: 0, unlimSync: 0 };
        ["ms1", "ms3", "shared1", "unlimSync"].forEach((k) => {
          const el = document.getElementById(`val-scholar-${k}`);
          if (el) el.textContent = "0";
        });
        document.getElementById("tier-card-pro")?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (target === "pro-elite") {
        state.pro = { cloudAi: 0, unlimSync: 0, shared1: 0, collab1: 0 };
        ["cloudAi", "unlimSync", "shared1", "collab1"].forEach((k) => {
          const el = document.getElementById(`val-pro-${k}`);
          if (el) el.textContent = "0";
        });
        document.getElementById("tier-card-pro-elite")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      calculatePricing();
    });
  }

  calculatePricing();
}

/* ============================================================================
   8. 30-SEAT CLOSED BETA VERIFICATION PIPELINE & DECLARATIVE MODAL FALLBACKS
   ============================================================================ */
const CLIENT_DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "fakeinbox.com",
  "getnada.com"
]);

function initFormsAndModals() {
  const copyLicenseBtn = document.getElementById("modal-copy-license-btn");
  const licenseKeyTextEl = document.getElementById("modal-license-key-text");
  if (copyLicenseBtn && licenseKeyTextEl) {
    copyLicenseBtn.addEventListener("click", async () => {
      const code = (licenseKeyTextEl.textContent || "").trim();
      if (!code) return;
      const orig = copyLicenseBtn.textContent;
      try {
        await navigator.clipboard.writeText(code);
        copyLicenseBtn.textContent = "✓ Copied!";
      } catch (_) {
        copyLicenseBtn.textContent = "✓ Key Ready";
      }
      setTimeout(() => {
        copyLicenseBtn.textContent = orig;
      }, 2000);
    });
  }

  // Dynamic "Other (Specify below...)" visibility for Discipline & Editor
  const disciplineSelect = document.getElementById("beta-discipline");
  const disciplineOtherWrap = document.getElementById("beta-discipline-other-wrap");
  if (disciplineSelect && disciplineOtherWrap) {
    disciplineSelect.addEventListener("change", () => {
      disciplineOtherWrap.hidden = disciplineSelect.value !== "other";
    });
  }

  const editorSelect = document.getElementById("beta-editor");
  const editorOtherWrap = document.getElementById("beta-editor-other-wrap");
  if (editorSelect && editorOtherWrap) {
    editorSelect.addEventListener("change", () => {
      editorOtherWrap.hidden = editorSelect.value !== "other";
    });
  }

  // Dynamic Researcher Profile Placeholder
  const profileTypeSelect = document.getElementById("beta-profile-type");
  const profileIdInput = document.getElementById("beta-profile-id");
  const PROFILE_PLACEHOLDERS = {
    linkedin: "e.g., linkedin.com/in/yourname",
    orcid: "e.g., 0000-0002-1825-0097 or orcid.org/0000-...",
    google_scholar: "e.g., scholar.google.com/citations?user=...",
    researchgate: "e.g., researchgate.net/profile/Your-Name"
  };
  if (profileTypeSelect && profileIdInput) {
    profileTypeSelect.addEventListener("change", () => {
      const ph = PROFILE_PLACEHOLDERS[profileTypeSelect.value];
      if (ph) profileIdInput.setAttribute("placeholder", ph);
    });
  }

  const betaModal = document.getElementById("beta-modal");
  const downloadModal = document.getElementById("download-modal");
  const betaConfirmedBanner = document.getElementById("modal-beta-confirmed-banner");
  const betaConfirmedTitle = document.getElementById("modal-beta-confirmed-title");
  const betaConfirmedNote = document.getElementById("modal-beta-confirmed-note");

  const betaForm = document.getElementById("beta-claim-form");
  const feedbackEl = document.getElementById("beta-form-feedback");
  const submitBtn = document.getElementById("beta-submit-btn");

  const otpStepBox = document.getElementById("beta-otp-step-box");
  const otpEmailDisplay = document.getElementById("beta-otp-email-display");
  const otpInput = document.getElementById("beta-otp-input");
  const otpVerifyBtn = document.getElementById("beta-verify-code-btn");
  const otpFeedbackEl = document.getElementById("beta-otp-feedback");
  const backToStep1Btn = document.getElementById("beta-back-to-step1-btn");
  const skipToTrialBtn = document.getElementById("beta-skip-to-trial-dmg-btn");

  let activeBetaStatusPoller = null;
  let pendingBetaEmail = "";
  let betaAlreadyCompleted = false;

  function showFormFeedback(el, msg, isError = false) {
    if (!el) return;
    el.hidden = false;
    el.classList.toggle("is-error", isError);
    el.innerHTML = msg;
  }

  function completeBetaVerificationAndDownload({ seatNumber = 1, name = "Researcher", email = "" }) {
    if (betaAlreadyCompleted) return;
    betaAlreadyCompleted = true;

    if (activeBetaStatusPoller) {
      clearInterval(activeBetaStatusPoller);
      activeBetaStatusPoller = null;
    }

    if (betaModal && betaModal.open && typeof betaModal.close === "function") {
      betaModal.close();
    }

    if (betaConfirmedBanner) {
      betaConfirmedBanner.hidden = false;
    }
    if (betaConfirmedTitle) {
      betaConfirmedTitle.textContent = `✅ Founding Scholar Seat #${seatNumber} of 30 Confirmed — Downloading Kyodo.dmg...`;
    }
    if (betaConfirmedNote) {
      betaConfirmedNote.textContent = `Welcome to the Founding Cohort, ${name}${email ? ` (${email})` : ""}! Your Kyodo.dmg download has started automatically — join our Discord or WhatsApp scholars group below to share direct workflow feedback with the founding team.`;
    }

    if (downloadModal) {
      if (typeof downloadModal.showModal === "function") {
        if (!downloadModal.open) downloadModal.showModal();
      } else {
        downloadModal.setAttribute("open", "");
      }
    }

    startDirectDmgDownload();
  }

  function startBetaEmailLinkStatusPoller(emailNorm) {
    if (activeBetaStatusPoller) clearInterval(activeBetaStatusPoller);
    if (!emailNorm) return;

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `${KYODO_WORKER_BASE_URL}/v1/beta/status?email=${encodeURIComponent(emailNorm)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.verified) {
          completeBetaVerificationAndDownload({
            seatNumber: data.seat_number || 1,
            name: data.name || (document.getElementById("beta-name")?.value || "Researcher").trim(),
            email: emailNorm
          });
        }
      } catch (_) {}
    };

    activeBetaStatusPoller = setInterval(pollStatus, 3000);
  }

  // "Skip Cohort & Download Kyodo.dmg (14-Day Free Trial)" button inside #beta-modal
  if (skipToTrialBtn) {
    skipToTrialBtn.addEventListener("click", () => {
      if (activeBetaStatusPoller) {
        clearInterval(activeBetaStatusPoller);
        activeBetaStatusPoller = null;
      }
      if (betaModal && betaModal.open && typeof betaModal.close === "function") {
        betaModal.close();
      }
      if (downloadModal) {
        if (typeof downloadModal.showModal === "function") {
          if (!downloadModal.open) downloadModal.showModal();
        } else {
          downloadModal.setAttribute("open", "");
        }
      }
      startDirectDmgDownload();
    });
  }

  // Step 1 Form Submit -> Request 6-digit OTP & Email Confirmation Link
  if (betaForm && feedbackEl) {
    betaForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      feedbackEl.hidden = true;

      const nameVal = (document.getElementById("beta-name")?.value || "").trim();
      const emailVal = (document.getElementById("beta-email")?.value || "").trim().toLowerCase();
      const profileTypeVal = (profileTypeSelect?.value || "linkedin").trim();
      const profileIdVal = (profileIdInput?.value || "").trim();
      const disciplineVal = (disciplineSelect?.value || "clinical-medicine").trim();
      const disciplineOtherVal = (document.getElementById("beta-discipline-other")?.value || "").trim();
      const editorVal = (editorSelect?.value || "word").trim();
      const editorOtherVal = (document.getElementById("beta-editor-other")?.value || "").trim();

      if (!nameVal || nameVal.length < 2) {
        showFormFeedback(feedbackEl, "Please enter your full name and academic/clinical title.", true);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)) {
        showFormFeedback(feedbackEl, "Please enter a valid academic or institutional email address.", true);
        return;
      }

      const emailDomain = emailVal.split("@")[1] || "";
      for (const blocked of CLIENT_DISPOSABLE_EMAIL_DOMAINS) {
        if (emailDomain === blocked || emailDomain.endsWith(`.${blocked}`)) {
          showFormFeedback(
            feedbackEl,
            "Disposable temporary email addresses are not eligible for the 30-seat founding cohort.",
            true
          );
          return;
        }
      }

      if (!profileIdVal || profileIdVal.length < 4) {
        showFormFeedback(
          feedbackEl,
          "Please provide your verifiable LinkedIn URL, ORCID iD, Google Scholar, or ResearchGate profile — or click <strong>Skip Cohort &amp; Download Kyodo.dmg (14-Day Free Trial)</strong> below.",
          true
        );
        return;
      }

      if (disciplineVal === "other" && !disciplineOtherVal) {
        showFormFeedback(feedbackEl, "Please specify your research discipline.", true);
        return;
      }

      if (editorVal === "other" && !editorOtherVal) {
        showFormFeedback(feedbackEl, "Please specify your primary writing environment.", true);
        return;
      }

      const origBtnLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Verification Code & Confirmation Link...";
      }

      try {
        const returnUrl = `${window.location.origin}${window.location.pathname}`;
        const res = await fetch(`${KYODO_WORKER_BASE_URL}/v1/beta/request-verification`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            profile_type: profileTypeVal,
            profile_id: profileIdVal,
            discipline: disciplineVal,
            discipline_other: disciplineOtherVal,
            editor: editorVal,
            editor_other: editorOtherVal,
            return_url: returnUrl
          })
        });

        const data = await res.json();
        if (!res.ok) {
          showFormFeedback(
            feedbackEl,
            data.message || "Could not send verification email. Please verify your details and try again.",
            true
          );
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origBtnLabel;
          }
          return;
        }

        pendingBetaEmail = emailVal;
        betaAlreadyCompleted = false;
        betaForm.hidden = true;
        if (otpStepBox) otpStepBox.hidden = false;
        if (otpEmailDisplay) otpEmailDisplay.textContent = emailVal;
        if (otpInput) {
          otpInput.value = "";
          otpInput.focus();
        }

        if (data.fallback_demo_code && otpFeedbackEl) {
          showFormFeedback(
            otpFeedbackEl,
            `✓ Verification code generated: <code>${data.fallback_demo_code}</code> (Enter this 6-digit code above to confirm immediately).`,
            false
          );
        } else if (otpFeedbackEl) {
          otpFeedbackEl.hidden = true;
        }

        startBetaEmailLinkStatusPoller(emailVal);
      } catch (_) {
        showFormFeedback(
          feedbackEl,
          "Network error while contacting the verification server. Please check your connection or use the 14-Day Free Trial download below.",
          true
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origBtnLabel;
        }
      }
    });
  }

  // Step 2: Confirm 6-Digit Code Button
  async function verifySixDigitCode() {
    if (!otpInput || !otpFeedbackEl) return;
    const codeVal = (otpInput.value || "").trim();
    if (!/^\d{6}$/.test(codeVal)) {
      showFormFeedback(otpFeedbackEl, "Please enter the 6-digit numeric verification code from your email.", true);
      return;
    }

    const origLabel = otpVerifyBtn ? otpVerifyBtn.textContent : "";
    if (otpVerifyBtn) {
      otpVerifyBtn.disabled = true;
      otpVerifyBtn.textContent = "Verifying Code...";
    }

    try {
      const res = await fetch(`${KYODO_WORKER_BASE_URL}/v1/beta/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingBetaEmail,
          code: codeVal
        })
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        showFormFeedback(
          otpFeedbackEl,
          data.message || "Incorrect 6-digit verification code. Please double-check your email.",
          true
        );
        return;
      }

      completeBetaVerificationAndDownload({
        seatNumber: data.seat_number || 1,
        name: data.name || (document.getElementById("beta-name")?.value || "Researcher").trim(),
        email: pendingBetaEmail
      });
    } catch (_) {
      showFormFeedback(otpFeedbackEl, "Could not verify code due to a network error. Please try again.", true);
    } finally {
      if (otpVerifyBtn) {
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.textContent = origLabel;
      }
    }
  }

  if (otpVerifyBtn) {
    otpVerifyBtn.addEventListener("click", verifySixDigitCode);
  }
  if (otpInput) {
    otpInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        verifySixDigitCode();
      }
    });
  }

  // Step 2 -> Back to Step 1 button
  if (backToStep1Btn && betaForm && otpStepBox) {
    backToStep1Btn.addEventListener("click", () => {
      if (activeBetaStatusPoller) {
        clearInterval(activeBetaStatusPoller);
        activeBetaStatusPoller = null;
      }
      otpStepBox.hidden = true;
      betaForm.hidden = false;
    });
  }

  // Auto-open #download-modal and trigger Kyodo.dmg download when redirected back from email confirmation link (?beta_verified=1)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("beta_verified") === "1") {
      const seat = parseInt(params.get("seat") || "1", 10) || 1;
      const name = params.get("name") || "Founding Scholar";
      const email = params.get("email") || "";
      completeBetaVerificationAndDownload({ seatNumber: seat, name, email });
    }
  } catch (_) {}

  if (!("commandForElement" in HTMLButtonElement.prototype)) {
    document.querySelectorAll("button[commandfor][command]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("commandfor");
        const cmd = btn.getAttribute("command");
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        if (cmd === "show-modal" && typeof target.showModal === "function") {
          if (!target.open) target.showModal();
        } else if (cmd === "close" && typeof target.close === "function") {
          if (target.open) target.close();
        } else if (cmd === "toggle-popover" && typeof target.togglePopover === "function") {
          target.togglePopover();
        } else if (cmd === "hide-popover" && typeof target.hidePopover === "function") {
          target.hidePopover();
        }
      });
    });
  }

  // Deep-link support for /#privacy and /#privacy-policy (r/macapps Rule 6 & Chrome Web Store)
  function checkPrivacyHashDeepLink() {
    const hash = (window.location.hash || "").trim().toLowerCase();
    if (hash === "#privacy" || hash === "#privacy-policy") {
      const privacyModal = document.getElementById("privacy-modal");
      if (privacyModal) {
        if (typeof privacyModal.showModal === "function") {
          if (!privacyModal.open) privacyModal.showModal();
        } else {
          privacyModal.setAttribute("open", "");
        }
      }
    }
  }

  checkPrivacyHashDeepLink();
  window.addEventListener("hashchange", checkPrivacyHashDeepLink);
}

/* ============================================================================
   9. SCROLL-DRIVEN ANIMATION FALLBACK (modern-web-guidance: scroll-entry-exit-effects)
   ============================================================================ */
function initScrollRevealFallback() {
  if (
    !CSS.supports("(animation-timeline: view()) and (animation-range: entry)") &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const ratio = Math.min(1, entry.intersectionRatio / 0.35);
          entry.target.style.opacity = String(0.15 + ratio * 0.85);
          entry.target.style.transform = `translateY(${(1 - ratio) * 24}px)`;
        }
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i / 20)
      }
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => {
      observer.observe(el);
    });
  }
}

/* ============================================================================
   10. SECTION 1 (#bottleneck): CONCEPT 1 — STICKY SCROLL-DRIVEN 2/3 LEFT + 1/3 RIGHT STAGE
       - Beat 1 (0.00 <= progress < 0.34): Card 0 (Epistemic Amnesia) expanded; Cards 1 & 2 stacked
       - Beat 2 (0.34 <= progress < 0.67): Card 1 (Blind Reference Managers) expanded; Cards 0 & 2 stacked
       - Beat 3 (0.67 <= progress <= 1.00): Card 2 (AI Ghostwriting & Cloud Leaks) expanded; Cards 0 & 1 stacked
   ============================================================================ */
function initBottleneckExpansion() {
  const track = document.getElementById("bottleneck-sticky-track");
  const grid = document.getElementById("bottleneck-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".bottleneck-card"));
  if (!cards.length) return;

  const fill0 = document.getElementById("bn-meter-fill-0");
  const fill1 = document.getElementById("bn-meter-fill-1");
  const fill2 = document.getElementById("bn-meter-fill-2");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentActiveIdx = -1;

  function clamp01(val) {
    return Math.max(0, Math.min(1, val));
  }

  function assignCardClasses(activeIdx) {
    grid.classList.add("has-expanded");
    let stackSlot = 1;

    cards.forEach((card, idx) => {
      card.classList.remove("is-stack-slot-1", "is-stack-slot-2");
      if (idx === activeIdx) {
        card.classList.add("is-expanded");
        card.classList.remove("is-stacked");
        card.setAttribute("aria-expanded", "true");
      } else {
        card.classList.remove("is-expanded");
        card.classList.add("is-stacked", `is-stack-slot-${stackSlot}`);
        card.setAttribute("aria-expanded", "false");
        stackSlot = Math.min(2, stackSlot + 1);
      }
    });
  }

  function applyBottleneckBeat(activeIdx, rawProgress) {
    if (activeIdx !== currentActiveIdx) {
      const shouldAnimateFlip =
        currentActiveIdx !== -1 &&
        !reducedMotion &&
        window.innerWidth > 680 &&
        typeof cards[0].animate === "function";

      if (shouldAnimateFlip) {
        // 1. FIRST: Capture bounding boxes before changing grid slots
        const firstRects = cards.map((c) => c.getBoundingClientRect());

        // 2. LAST: Apply new grid classes & measure final positions
        assignCardClasses(activeIdx);
        const lastRects = cards.map((c) => c.getBoundingClientRect());

        // 3. INVERT & PLAY: Smooth 60fps spatial glide via Web Animations API
        cards.forEach((card, idx) => {
          const dx = firstRects[idx].left - lastRects[idx].left;
          const dy = firstRects[idx].top - lastRects[idx].top;

          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            if (card._flipAnim && typeof card._flipAnim.cancel === "function") {
              card._flipAnim.cancel();
            }
            const isExpanding = idx === activeIdx;
            const startScale = isExpanding ? 0.93 : 1.04;
            const startOpacity = isExpanding ? 0.78 : 0.72;
            const endOpacity = isExpanding ? 1 : 0.88;

            card._flipAnim = card.animate(
              [
                {
                  transform: `translate3d(${(dx * 0.65).toFixed(1)}px, ${(dy * 0.65).toFixed(1)}px, 0) scale(${startScale})`,
                  opacity: startOpacity
                },
                {
                  transform: "translate3d(0, 0, 0) scale(1)",
                  opacity: endOpacity
                }
              ],
              {
                duration: 520,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)"
              }
            );
          }
        });
      } else {
        assignCardClasses(activeIdx);
      }

      currentActiveIdx = activeIdx;
    }

    const p = clamp01(rawProgress);
    const prog0 = clamp01(p / 0.34);
    const prog1 = clamp01((p - 0.34) / 0.33);
    const prog2 = clamp01((p - 0.67) / 0.33);

    if (fill0) fill0.style.width = `${(prog0 * 100).toFixed(1)}%`;
    if (fill1) fill1.style.width = `${(prog1 * 100).toFixed(1)}%`;
    if (fill2) fill2.style.width = `${(prog2 * 100).toFixed(1)}%`;
  }

  function scrollToCardBeat(card, idx) {
    const targetProg = clamp01(Number(card.getAttribute("data-target-progress")) || (idx === 0 ? 0.14 : idx === 1 ? 0.50 : 0.84));
    applyBottleneckBeat(idx, targetProg);

    if (track && window.innerWidth > 680) {
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const pinTop = 86;
      const totalPinnedTravel = Math.max(1, track.offsetHeight - vh);
      const trackPageTop = track.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = trackPageTop - pinTop + targetProg * (totalPinnedTravel * 0.90);
      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
    }
  }

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      scrollToCardBeat(card, idx);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToCardBeat(card, idx);
      }
    });
  });

  if (reducedMotion || !track) {
    applyBottleneckBeat(0, 0.34);
    return;
  }

  let ticking = false;

  function updateBottleneckScroll() {
    if (window.innerWidth <= 680) {
      ticking = false;
      return;
    }

    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const rect = track.getBoundingClientRect();
    const pinTop = 86;
    const totalPinnedTravel = Math.max(1, track.offsetHeight - vh);
    const pinnedProg = clamp01((pinTop - rect.top) / (totalPinnedTravel * 0.90));

    const activeIdx = pinnedProg < 0.34 ? 0 : pinnedProg < 0.67 ? 1 : 2;
    applyBottleneckBeat(activeIdx, pinnedProg);

    ticking = false;
  }

  function requestBottleneckTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateBottleneckScroll);
    }
  }

  window.addEventListener("scroll", requestBottleneckTick, { passive: true });
  window.addEventListener("resize", requestBottleneckTick, { passive: true });

  updateBottleneckScroll();
}

/* ============================================================================
   11. SECTION 2A (#features): APPLE "GET TO KNOW MACBOOK PRO" COMPANION STAGE
   ============================================================================ */
function initAppleCompanionStage() {
  const pills = Array.from(document.querySelectorAll("[data-companion-task]"));
  const winTitle = document.getElementById("companion-window-title");
  const taskVideo = document.getElementById("companion-task-video");
  const placeholder = document.getElementById("companion-video-placeholder");
  const placeholderTitle = document.getElementById("companion-placeholder-title");

  if (!pills.length) return;

  const TITLES = {
    grounding: "Live Claim Grounding — Word, Google Docs & Notes",
    audit: "In-Paper Citation Audit — PDFs & Web Journals",
    transmutation: "1-Click Style Transmutation — APA ↔ Vancouver ↔ Nature"
  };

  const SHORT_TITLES = {
    grounding: "Live Claim Grounding",
    audit: "In-Paper Citation Audit",
    transmutation: "1-Click Style Transmutation"
  };

  function activateCompanionTask(taskKey) {
    pills.forEach((pill) => {
      const isMatch = pill.getAttribute("data-companion-task") === taskKey;
      pill.classList.toggle("active", isMatch);
      pill.setAttribute("aria-selected", isMatch ? "true" : "false");
    });

    if (winTitle && TITLES[taskKey]) {
      winTitle.textContent = TITLES[taskKey];
    }

    const configuredVideoUrl =
      (COMPANION_TASK_VIDEO_URLS && COMPANION_TASK_VIDEO_URLS[taskKey]) || "";

    if (taskVideo) {
      if (configuredVideoUrl) {
        if (placeholder) placeholder.hidden = true;
        taskVideo.hidden = false;

        if (taskVideo.getAttribute("src") !== configuredVideoUrl) {
          taskVideo.classList.add("is-fading");
          setTimeout(() => {
            taskVideo.setAttribute("src", configuredVideoUrl);
            taskVideo.load();
            taskVideo.play().catch(() => {});
            taskVideo.classList.remove("is-fading");
          }, 140);
        } else {
          taskVideo.classList.remove("is-fading");
          taskVideo.play().catch(() => {});
        }
      } else {
        if (!taskVideo.paused) taskVideo.pause();
        taskVideo.hidden = true;
        if (placeholder) {
          if (placeholderTitle && SHORT_TITLES[taskKey]) {
            placeholderTitle.textContent = SHORT_TITLES[taskKey];
          }
          placeholder.hidden = false;
        }
      }
    }
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const taskKey = pill.getAttribute("data-companion-task");
      if (taskKey) activateCompanionTask(taskKey);
    });
  });

  // Ensure initial default state ("grounding") plays immediately
  activateCompanionTask("grounding");
}

/* ============================================================================
   12A. ISOLATED VAULT LIVECHAT 4-STAGE SCROLL-VIDEO CONTROLLER
        progress: 0.00 -> 1.00 while Row 1 is sticky-locked in #vault-row-1-track
        - Stage 1 (0.00 – 0.14): Holds initial state with Paper 1 ((1 PAPER)) and greeting visible.
        - Stage 2 (0.14 – 0.48): Paper 2 animates into pipeline ((2 PAPERS)); question types into #lc-typing-text.
        - Stage 3 (0.48 – 0.68): Question posts from composer up into chat stream as blue bubble under You.
        - Stage 4 (0.68 – 1.00): Grounded answer card + SOURCES IN PDF slides in from below (translateY(28px) -> 0).
   ============================================================================ */
const LIVECHAT_PROMPT_TEXT = "Compare and contrast the NOBLE and EXCEL trials.";

function updateLiveChatScrollVideo(rawProgress) {
  const panel = document.getElementById("vault-slide-left");
  if (!panel) return;

  const progress = Math.max(0, Math.min(1, Number(rawProgress) || 0));
  const pipelineBox = document.getElementById("lc-pipeline-box");
  const paperCountEl = document.getElementById("lc-paper-count");
  const paper2Chip = document.getElementById("lc-paper-2-chip");
  const chatStream = document.getElementById("vault-chat-stream");
  const postedQuestion = document.getElementById("lc-posted-question");
  const answerBlock = document.getElementById("lc-answer-block");
  const composerBar = document.getElementById("lc-composer-bar");
  const placeholderEl = document.getElementById("lc-composer-placeholder");
  const typingTextEl = document.getElementById("lc-typing-text");
  const typingCursorEl = document.getElementById("lc-typing-cursor");
  const sendBtnEl = document.getElementById("lc-send-btn");

  const isFinalDwell = progress >= 0.88;
  const inStage1or2A = progress < 0.34;
  const inStage3 = progress >= 0.48 && progress < 0.68;
  const inStage4Focus = progress >= 0.68 && !isFinalDwell;

  // Stage 2A (0.14 -> 0.28): Paper 2 chip animates into MULTI-PAPER RAG PIPELINE box
  const p2Prog = Math.max(0, Math.min(1, (progress - 0.14) / 0.14));
  if (paper2Chip) {
    const p2MaxH = p2Prog * 36;
    paper2Chip.style.maxHeight = `${p2MaxH.toFixed(1)}px`;
    paper2Chip.style.opacity = p2Prog.toFixed(3);
    paper2Chip.style.transform = `translate3d(0, ${((1 - p2Prog) * -6).toFixed(1)}px, 0)`;
    paper2Chip.style.paddingTop = `${(p2Prog * 6).toFixed(1)}px`;
    paper2Chip.style.paddingBottom = `${(p2Prog * 6).toFixed(1)}px`;
    paper2Chip.style.marginTop = `${((p2Prog - 1) * 6).toFixed(1)}px`;
    paper2Chip.setAttribute("aria-hidden", p2Prog < 0.5 ? "true" : "false");
  }
  if (chatStream) {
    chatStream.style.setProperty("--lc-p2-comp", `${((1 - p2Prog) * 36).toFixed(1)}px`);
  }
  if (paperCountEl) {
    const isLinked = progress >= 0.19;
    paperCountEl.textContent = isLinked ? "(2 PAPERS LINKED)" : "(1 PAPER)";
    paperCountEl.classList.toggle("is-linked-active", isLinked);
  }

  // Spotlight Focus & Soft Dimming on #lc-pipeline-box
  if (pipelineBox) {
    pipelineBox.classList.toggle("is-spotlight-focus", inStage1or2A);
    if (isFinalDwell || progress < 0.48) {
      pipelineBox.style.opacity = "1";
    } else if (inStage3) {
      pipelineBox.style.opacity = "0.72";
    } else {
      pipelineBox.style.opacity = "0.76";
    }
  }

  // Stage 2B (0.14 -> 0.48): Deterministic character-by-character typing in #lc-typing-text
  const inTypingStage = progress >= 0.14 && progress < 0.48;
  const inTypingSpotlight = progress >= 0.22 && progress < 0.48;
  const typingProg = Math.max(0, Math.min(1, (progress - 0.14) / 0.32));
  const charCount = inTypingStage
    ? Math.max(1, Math.min(LIVECHAT_PROMPT_TEXT.length, Math.floor(typingProg * LIVECHAT_PROMPT_TEXT.length)))
    : 0;

  if (typingTextEl && placeholderEl) {
    if (inTypingStage) {
      placeholderEl.hidden = true;
      typingTextEl.textContent = LIVECHAT_PROMPT_TEXT.slice(0, charCount);
    } else {
      typingTextEl.textContent = "";
      placeholderEl.hidden = false;
      placeholderEl.textContent =
        progress >= 0.19
          ? "Ask across all 2 selected papers..."
          : "Ask about claims, methods, or findings in this PDF...";
    }
  }

  if (typingCursorEl) {
    typingCursorEl.classList.toggle("is-active", inTypingStage);
  }
  if (composerBar) {
    composerBar.classList.toggle("is-typing", inTypingSpotlight);
  }
  if (sendBtnEl) {
    sendBtnEl.classList.toggle("is-ready", inTypingStage && charCount > 2);
  }

  // Stage 3 (0.48 -> 0.68): Question posts from composer into chat stream as blue bubble under You
  const postProg = Math.max(0, Math.min(1, (progress - 0.48) / 0.16));
  const postEase = 1 - Math.pow(1 - postProg, 3);
  if (postedQuestion) {
    const postY = (1 - postEase) * 20;
    const postScale = inStage3 ? 1 + 0.03 * Math.sin(postEase * Math.PI) : 1;
    postedQuestion.style.maxHeight = `${(postEase * 96).toFixed(1)}px`;
    const targetPostOpacity = inStage4Focus ? postEase * 0.85 : postEase;
    postedQuestion.style.opacity = targetPostOpacity.toFixed(3);
    postedQuestion.style.transform = `translate3d(0, ${postY.toFixed(1)}px, 0) scale(${postScale.toFixed(3)})`;
    postedQuestion.style.pointerEvents = postEase > 0.5 ? "auto" : "none";
    postedQuestion.classList.toggle("is-spotlight-focus", inStage3);
  }

  // Stage 4 (0.68 -> 1.00): Scannable 3-takeaway answer card + SOURCES IN PDF slides in from below (28px -> 0)
  const ansProg = Math.max(0, Math.min(1, (progress - 0.68) / 0.24));
  const ansEase = 1 - Math.pow(1 - ansProg, 3);
  if (answerBlock) {
    const ansY = (1 - ansEase) * 28;
    answerBlock.style.maxHeight = `${(ansEase * 520).toFixed(1)}px`;
    answerBlock.style.opacity = ansEase.toFixed(3);
    answerBlock.style.transform = `translate3d(0, ${ansY.toFixed(1)}px, 0)`;
    answerBlock.style.pointerEvents = ansEase > 0.5 ? "auto" : "none";
    answerBlock.classList.toggle("is-spotlight-focus", inStage4Focus);
  }

  // Synchronize 3-Step Story Tracker on #vault-desc-right
  if (typeof window.updateLiveChatStorySteps === "function") {
    window.updateLiveChatStorySteps(progress);
  }
}

window.updateLiveChatScrollVideo = updateLiveChatScrollVideo;

/* ============================================================================
   12A-2. SYNCHRONIZED 3-STEP LIVECITE STORY TRACKER (#vault-livecite-steps)
          - Step 1 (0.00 <= progress < 0.48): Link Multiple Papers & Ask Together
          - Step 2 (0.48 <= progress < 0.74): Interrogate Shared Endpoints Side-by-Side
          - Step 3 (0.74 <= progress <= 1.00): Color-Coded Takeaways & 1-Click PDF Jump
   ============================================================================ */
function updateLiveChatStorySteps(rawProgress) {
  const progress = Math.max(0, Math.min(1, Number(rawProgress) || 0));
  const step1 = document.getElementById("lc-story-step-1");
  const step2 = document.getElementById("lc-story-step-2");
  const step3 = document.getElementById("lc-story-step-3");
  if (!step1 && !step2 && !step3) return;

  const fill1 = document.getElementById("lc-step-fill-1");
  const fill2 = document.getElementById("lc-step-fill-2");
  const fill3 = document.getElementById("lc-step-fill-3");

  const activeStep = progress < 0.48 ? 1 : progress < 0.74 ? 2 : 3;
  const isFinalDwell = progress >= 0.88;

  const prog1 = Math.max(0, Math.min(1, progress / 0.48));
  const prog2 = Math.max(0, Math.min(1, (progress - 0.48) / 0.26));
  const prog3 = Math.max(0, Math.min(1, (progress - 0.74) / 0.20));

  if (fill1) fill1.style.width = `${(prog1 * 100).toFixed(1)}%`;
  if (fill2) fill2.style.width = `${(prog2 * 100).toFixed(1)}%`;
  if (fill3) fill3.style.width = `${(prog3 * 100).toFixed(1)}%`;

  const steps = [
    { el: step1, idx: 1 },
    { el: step2, idx: 2 },
    { el: step3, idx: 3 }
  ];

  steps.forEach(({ el, idx }) => {
    if (!el) return;
    const isActive = idx === activeStep;
    const isComplete = idx < activeStep || isFinalDwell;
    el.classList.toggle("is-active", isActive);
    el.classList.toggle("is-complete", isComplete && !isActive);
    el.classList.toggle("is-dwell-settled", isFinalDwell);
  });
}

window.updateLiveChatStorySteps = updateLiveChatStorySteps;

/* ============================================================================
   12A-3. CONCEPT A: 3-STAGE AUTONOMOUS LIBRARIAN SCROLL CONTROLLER (ROW 2)
          progress: 0.00 -> 1.00 while Row 2 is sticky-locked in #vault-row-2-track
          - Stage 1 (0.00 <= progress < 0.36): Raw Cryptic PDF Spotlight
          - Stage 2 (0.36 <= progress < 0.68): Instant Renaming & Topic Tagging Spotlight
          - Stage 3 (0.68 <= progress <= 1.00): Autonomous Folder Routing & Counter Tick-Up
   ============================================================================ */
function updateVaultLibrarianStory(rawProgress) {
  const progress = Math.max(0, Math.min(1, Number(rawProgress) || 0));

  const step1 = document.getElementById("vl-story-step-1");
  const step2 = document.getElementById("vl-story-step-2");
  const step3 = document.getElementById("vl-story-step-3");
  const fill1 = document.getElementById("vl-step-fill-1");
  const fill2 = document.getElementById("vl-step-fill-2");
  const fill3 = document.getElementById("vl-step-fill-3");

  const intakeCard = document.getElementById("vl-intake-card");
  const intakeTitle = document.getElementById("vl-intake-title");
  const intakeStatus = document.getElementById("vl-intake-status");
  const fluidBar = document.getElementById("vl-fluid-bar");
  const fluidBarFill = document.getElementById("vl-fluid-bar-fill");
  const tagPillsRow = document.getElementById("vl-tag-pills-row");

  const foldersRail = document.getElementById("vl-folders-rail");
  const sglt2Folder = document.getElementById("vl-folder-sglt2");
  const sglt2PlusBadge = document.getElementById("vl-sglt2-plus-badge");
  const countSglt2 = document.getElementById("vl-count-sglt2");
  const countAll = document.getElementById("vl-count-all");
  const peekCount = document.getElementById("vl-peek-count");
  const existingRows = Array.from(document.querySelectorAll(".vl-existing-row"));

  const isStage1 = progress < 0.36;
  const isStage2 = progress >= 0.36 && progress < 0.68;
  const isStage3 = progress >= 0.68;
  const isFinalDwell = progress >= 0.88;

  const activeStep = isStage1 ? 1 : isStage2 ? 2 : 3;

  const prog1 = Math.max(0, Math.min(1, progress / 0.36));
  const prog2 = Math.max(0, Math.min(1, (progress - 0.36) / 0.32));
  const prog3 = Math.max(0, Math.min(1, (progress - 0.68) / 0.24));

  if (fill1) fill1.style.width = `${(prog1 * 100).toFixed(1)}%`;
  if (fill2) fill2.style.width = `${(prog2 * 100).toFixed(1)}%`;
  if (fill3) fill3.style.width = `${(prog3 * 100).toFixed(1)}%`;

  [
    { el: step1, idx: 1 },
    { el: step2, idx: 2 },
    { el: step3, idx: 3 }
  ].forEach(({ el, idx }) => {
    if (!el) return;
    const isActive = idx === activeStep;
    const isComplete = idx < activeStep || isFinalDwell;
    el.classList.toggle("is-active", isActive);
    el.classList.toggle("is-complete", isComplete && !isActive);
    el.classList.toggle("is-dwell-settled", isFinalDwell);
  });

  if (intakeCard) {
    intakeCard.classList.toggle("is-stage-1", isStage1);
    intakeCard.classList.toggle("is-stage-2", isStage2);
    intakeCard.classList.toggle("is-stage-3", isStage3);
    intakeCard.classList.toggle("is-spotlight-focus", isStage1 || isStage2);
  }

  if (isStage1) {
    if (intakeTitle) intakeTitle.textContent = "📄 nejmoa2022190_downloaded_v2.pdf";
    if (intakeStatus) intakeStatus.textContent = "⚡ Reading & Extracting…";
    if (fluidBar) fluidBar.hidden = false;
    if (fluidBarFill) fluidBarFill.style.width = `${(18 + prog1 * 82).toFixed(1)}%`;
    if (tagPillsRow) tagPillsRow.hidden = true;
  } else if (isStage2) {
    if (intakeTitle) intakeTitle.textContent = "Packer, Anker et al. (2020) • NEJM";
    if (intakeStatus) intakeStatus.textContent = "✦ Auto-Tagged";
    if (fluidBar) fluidBar.hidden = true;
    if (tagPillsRow) tagPillsRow.hidden = false;
  } else {
    if (intakeTitle) intakeTitle.textContent = "Packer, Anker et al. (2020) • NEJM";
    if (intakeStatus) intakeStatus.textContent = "✓ Auto-Filed → SGLT2 Trials";
    if (fluidBar) fluidBar.hidden = true;
    if (tagPillsRow) tagPillsRow.hidden = false;
  }

  // Stage 3 folder routing spotlight & counter tick-up
  const isFiled = progress >= 0.72;
  if (sglt2Folder) {
    sglt2Folder.classList.toggle("is-autofile-target", isStage3);
    sglt2Folder.classList.toggle("is-spotlight-focus", isStage3 && !isFinalDwell);
  }
  if (sglt2PlusBadge) {
    sglt2PlusBadge.hidden = !isFiled;
  }
  if (countSglt2) countSglt2.textContent = isFiled ? "34" : "33";
  if (countAll) countAll.textContent = isFiled ? "148" : "147";
  if (peekCount) peekCount.textContent = isFiled ? "34" : "33";

  // Soft dimming during Stage 1/2 so eye locks onto #vl-intake-card, restoring to 1 at Stage 3 / Final Dwell
  if (foldersRail) {
    foldersRail.style.opacity = isStage1 || isStage2 ? "0.48" : "1";
  }
  existingRows.forEach((row) => {
    row.style.opacity = isStage1 || isStage2 ? "0.38" : isFinalDwell ? "1" : "0.78";
  });
}

window.updateVaultLibrarianStory = updateVaultLibrarianStory;

/* ============================================================================
   12B. SECTION 2B (#spatial-vault): SYNCHRONIZED SCROLL CHOREOGRAPHY
        - Sticky Scroll-Lock Tracks (#vault-row-1-track & #vault-row-2-track)
        - Horizontal Panel Slide-In (translateX(-56px / +56px) -> 0)
        - Down-to-Up Editorial Text Reveal (translateY(48px) -> 0, opacity 0 -> 1)
        - 4-Stage LiveChat & 3-Stage Autonomous Librarian Playback Hooks
   ============================================================================ */
function initSpatialVaultStaggerScroll() {
  const row1Track = document.getElementById("vault-row-1-track");
  const row2Track = document.getElementById("vault-row-2-track");
  const row1 = document.getElementById("vault-row-1") || document.querySelector(".vault-row-1");
  const row2 = document.getElementById("vault-row-2") || document.querySelector(".vault-row-2");
  const leftPanel = document.getElementById("vault-slide-left");
  const rightPanel = document.getElementById("vault-slide-right");
  const descRight = document.getElementById("vault-desc-right") || document.querySelector(".vault-desc-right");
  const descLeft = document.getElementById("vault-desc-left") || document.querySelector(".vault-desc-left");

  const row1EditorialItems = descRight
    ? Array.from(descRight.querySelectorAll(".vault-editorial-up"))
    : [];
  const row2EditorialItems = descLeft
    ? Array.from(descLeft.querySelectorAll(".vault-editorial-up"))
    : [];
  const risingFolders = Array.from(document.querySelectorAll(".vault-rising-folder"));
  const peekArticles = rightPanel
    ? Array.from(rightPanel.querySelectorAll(".peek-article-row"))
    : [];

  if (!leftPanel && !rightPanel) return;

  // Click-to-seek on Row 1 (#vault-livecite-steps) and Row 2 (#vault-librarian-steps) Story Tracker cards
  const row1Steps = Array.from(document.querySelectorAll("#vault-livecite-steps .ved-story-step[data-target-progress]"));
  row1Steps.forEach((stepEl) => {
    stepEl.addEventListener("click", () => {
      if (!row1Track) return;
      const targetProg = Math.max(0, Math.min(1, Number(stepEl.getAttribute("data-target-progress")) || 0));
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const pinTop = 74;
      const totalPinnedTravel = Math.max(1, row1Track.offsetHeight - vh);
      const trackPageTop = row1Track.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = trackPageTop - pinTop + targetProg * (totalPinnedTravel * 0.88);
      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
    });
  });

  const row2Steps = Array.from(document.querySelectorAll("#vault-librarian-steps .ved-story-step[data-target-progress]"));
  row2Steps.forEach((stepEl) => {
    stepEl.addEventListener("click", () => {
      if (!row2Track) return;
      const targetProg = Math.max(0, Math.min(1, Number(stepEl.getAttribute("data-target-progress")) || 0));
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      const pinTop = 92;
      const totalPinnedTravel = Math.max(1, row2Track.offsetHeight - vh);
      const trackPageTop = row2Track.getBoundingClientRect().top + window.scrollY;
      const targetScrollY = trackPageTop - pinTop + targetProg * (totalPinnedTravel * 0.88);
      window.scrollTo({ top: Math.max(0, targetScrollY), behavior: "smooth" });
    });
  });

  function notifyLiveChatVideo(progress) {
    if (typeof updateLiveChatScrollVideo === "function") {
      updateLiveChatScrollVideo(progress);
    } else if (typeof window.updateLiveChatScrollVideo === "function") {
      window.updateLiveChatScrollVideo(progress);
    }
  }

  function notifyLibrarianStory(progress) {
    if (typeof updateVaultLibrarianStory === "function") {
      updateVaultLibrarianStory(progress);
    } else if (typeof window.updateVaultLibrarianStory === "function") {
      window.updateVaultLibrarianStory(progress);
    }
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    notifyLiveChatVideo(1);
    notifyLibrarianStory(1);
    return;
  }

  let ticking = false;

  function clamp01(val) {
    return Math.max(0, Math.min(1, val));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateEditorialDownToUp(containerEl, childItems, rawProg) {
    if (!containerEl) return;
    const colEase = easeOutCubic(clamp01(rawProg / 0.72));
    const colY = (1 - colEase) * 24;
    containerEl.style.transform = `translate3d(0, ${colY.toFixed(1)}px, 0)`;

    childItems.forEach((el, idx) => {
      const staggerStart = idx * 0.11;
      const itemWindow = Math.max(0.28, 0.86 - staggerStart);
      const itemProg = easeOutCubic(clamp01((rawProg - staggerStart) / itemWindow));
      const riseY = (1 - itemProg) * 48;
      el.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0)`;
      el.style.opacity = itemProg.toFixed(3);
    });
  }

  function updateVaultScrollState() {
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;

    // ROW 1: Sticky Scroll-Lock Track (#vault-row-1-track)
    if (leftPanel) {
      const trackEl = row1Track || row1 || leftPanel;
      const trackRect = trackEl.getBoundingClientRect();
      const pinTop = 74;

      const entranceRaw1 = clamp01((vh * 0.94 - trackRect.top) / Math.max(1, vh * 0.94 - pinTop));
      const entranceEase1 = easeOutCubic(entranceRaw1);
      const slideXLeft = (1 - entranceEase1) * -56;
      leftPanel.style.transform = `translate3d(${slideXLeft.toFixed(1)}px, 0, 0)`;
      leftPanel.style.opacity = (0.22 + entranceEase1 * 0.78).toFixed(3);

      animateEditorialDownToUp(descRight, row1EditorialItems, entranceRaw1);

      const totalPinnedTravel = row1Track
        ? Math.max(1, row1Track.offsetHeight - vh)
        : Math.max(1, vh * 0.74);
      const pinnedProg = row1Track
        ? clamp01((pinTop - trackRect.top) / (totalPinnedTravel * 0.88))
        : clamp01((vh * 0.90 - trackRect.top) / (vh * 0.74));
      notifyLiveChatVideo(pinnedProg);
    }

    // ROW 2: Sticky Scroll-Lock Track (#vault-row-2-track)
    // 1. Entrance (bottom of viewport -> top <= 92px): Slide #vault-slide-right in from right (+56px -> 0)
    //    and lift #vault-desc-left editorial items down-to-up (48px -> 0).
    // 2. Pinned travel (top <= 92px): Lock Row 2 in place while driving all 3 stages of
    //    updateVaultLibrarianStory(pinnedProg2) from 0.0 -> 1.0.
    if (rightPanel) {
      const track2El = row2Track || row2 || rightPanel;
      const rect2 = track2El.getBoundingClientRect();
      const pinTop = 92;

      const entranceRaw2 = clamp01((vh * 0.94 - rect2.top) / Math.max(1, vh * 0.94 - pinTop));
      const entranceEase2 = easeOutCubic(entranceRaw2);
      const slideXRight = (1 - entranceEase2) * 56;
      rightPanel.style.transform = `translate3d(${slideXRight.toFixed(1)}px, 0, 0)`;
      rightPanel.style.opacity = (0.18 + entranceEase2 * 0.82).toFixed(3);

      animateEditorialDownToUp(descLeft, row2EditorialItems, entranceRaw2);

      risingFolders.forEach((folder, idx) => {
        const staggerStart = idx * 0.11;
        const itemProg = easeOutCubic(
          clamp01((entranceRaw2 - staggerStart) / Math.max(0.26, 0.88 - staggerStart))
        );
        const riseY = (1 - itemProg) * 26;
        folder.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0)`;
        folder.style.opacity = (0.12 + itemProg * 0.88).toFixed(3);
      });

      peekArticles.forEach((card, idx) => {
        const staggerStart = 0.12 + idx * 0.13;
        const cardProg = easeOutCubic(
          clamp01((entranceRaw2 - staggerStart) / Math.max(0.26, 0.9 - staggerStart))
        );
        const riseY = (1 - cardProg) * 30;
        card.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0)`;
      });

      const totalPinnedTravel2 = row2Track
        ? Math.max(1, row2Track.offsetHeight - vh)
        : Math.max(1, vh * 0.72);
      const pinnedProg2 = row2Track
        ? clamp01((pinTop - rect2.top) / (totalPinnedTravel2 * 0.88))
        : clamp01((vh * 0.90 - rect2.top) / (vh * 0.72));
      notifyLibrarianStory(pinnedProg2);
    }

    ticking = false;
  }

  function requestVaultTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateVaultScrollState);
    }
  }

  window.addEventListener("scroll", requestVaultTick, { passive: true });
  window.addEventListener("resize", requestVaultTick, { passive: true });

  updateVaultScrollState();
}

/* ============================================================================
   12C. SECTION 3 (#compare): HARMONIOUS SYNCHRONIZED RISING TABLE ROWS
   ============================================================================ */
function initCompareTableRowRise() {
  const compareSection = document.getElementById("compare");
  if (!compareSection) return;

  const table = compareSection.querySelector(".semantic-compare-table");
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("thead tr, tbody tr"));
  if (!rows.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    rows.forEach((row) => {
      row.style.opacity = "1";
      row.style.transform = "none";
    });
    return;
  }

  let ticking = false;

  function clamp01(val) {
    return Math.max(0, Math.min(1, val));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function updateCompareRows() {
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const rect = table.getBoundingClientRect();

    // Overall section entrance progress: 0 when table top enters 92% of viewport -> 1 when it reaches 36% of viewport
    const rawProg = clamp01((vh * 0.92 - rect.top) / Math.max(1, vh * 0.56));

    rows.forEach((row, idx) => {
      const staggerStart = idx * 0.075;
      const itemWindow = Math.max(0.26, 0.88 - staggerStart);
      const itemProg = easeOutCubic(clamp01((rawProg - staggerStart) / itemWindow));
      const riseY = (1 - itemProg) * 28;
      row.style.transform = `translate3d(0, ${riseY.toFixed(1)}px, 0)`;
      row.style.opacity = itemProg.toFixed(3);
    });

    ticking = false;
  }

  function requestCompareTick() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateCompareRows);
    }
  }

  window.addEventListener("scroll", requestCompareTick, { passive: true });
  window.addEventListener("resize", requestCompareTick, { passive: true });

  updateCompareRows();
}

/* ============================================================================
   13. SECTION 4 (#pricing): SMOOTH ANIMATED 28-ROW MATRIX ACCORDION
   ============================================================================ */
function initSmoothMatrixAccordion() {
  const trigger = document.getElementById("matrix-accordion-trigger");
  const collapse = document.getElementById("matrix-accordion-collapse");
  if (!trigger || !collapse) return;

  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    const nextState = !isExpanded;
    trigger.setAttribute("aria-expanded", nextState ? "true" : "false");
    collapse.classList.toggle("is-open", nextState);
  });
}

/* ============================================================================
   14. SECTION 5 (#security-founders): SCROLL-DRIVEN TELEMETRY COUNTDOWN
   ============================================================================ */
function initTelemetryScrollCountdown() {
  const strip = document.getElementById("telemetry-countdown-strip");
  const ramEl = document.getElementById("telemetry-val-ram");
  const cpuEl = document.getElementById("telemetry-val-cpu");
  const lookupEl = document.getElementById("telemetry-val-lookup");

  if (!strip || !ramEl || !cpuEl || !lookupEl) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    ramEl.textContent = "< 20 MB";
    cpuEl.textContent = "0.00%";
    lookupEl.textContent = "< 2 ms";
    return;
  }

  let ticking = false;

  function updateTelemetryNumbers() {
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const rect = strip.getBoundingClientRect();
    const stripCenter = rect.top + rect.height * 0.5;
    const screenCenter = vh * 0.5;

    // Progress = 0 when strip enters bottom of screen (stripCenter = vh)
    // Progress = 1 when strip reaches or passes screen center (stripCenter <= screenCenter)
    const rawProgress = (vh - stripCenter) / Math.max(1, vh - screenCenter);
    const progress = Math.max(0, Math.min(1, rawProgress));
    // Ease-out cubic so numbers settle smoothly into their final target at screen center
    const eased = 1 - Math.pow(1 - progress, 3);

    if (progress >= 0.995) {
      ramEl.textContent = "< 20 MB";
      cpuEl.textContent = "0.00%";
      lookupEl.textContent = "< 2 ms";
    } else {
      const currentRam = Math.round(850 - (850 - 20) * eased);
      const currentCpu = Math.max(0, 18 * (1 - eased));
      const currentLookup = Math.round(120 - (120 - 2) * eased);

      ramEl.textContent = `${currentRam} MB`;
      cpuEl.textContent = `${currentCpu.toFixed(2)}%`;
      lookupEl.textContent = `${currentLookup} ms`;
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateTelemetryNumbers);
      }
    },
    { passive: true }
  );

  updateTelemetryNumbers();
}

/* ============================================================================
   INITIALIZE ALL MODULES ON DOM READY
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initPlaceholderLinks();
  initThemeToggle();
  initHeroSlide1Demo();
  initVideoCarousel();
  initBottleneckExpansion();
  initAppleCompanionStage();
  initOrbShowcase2A();
  initSpatialVault2B();
  initSpatialVaultStaggerScroll();
  initCompareTableRowRise();
  initPricingCalculator();
  initSmoothMatrixAccordion();
  initTelemetryScrollCountdown();
  initFormsAndModals();
  initScrollRevealFallback();
});
