// ============================================================
// LINKSTASH — RENDER LOGIC
// You shouldn't need to edit this file. Add links in data.js.
// ============================================================

const ROW_LIMIT = 8; // rows shown per category before "See all"
const LATEST_LIMIT = 10; // links shown in the Latest strip

// Fixed display order for the "Browse by category" pill nav and the "All
// links" page. Categories not listed here (e.g. a brand new one just added
// to data.js) still show up automatically — they're appended at the end in
// the order they first appear in LINKS — so nothing ever silently vanishes
// from the nav, it just lands at the tail until this list is updated.
const CATEGORY_ORDER = [
  "AI Tools",
  "Design Inspiration",
  "AI Design",
  "Website Platforms",
  "Fonts",
  "SEO Analytics",
  "Marketing",
  "Hosting",
  "Icons & Stock Photos",
  "Domains",
  "Learning",
  "Productivity & Business",
  "Wallpapers",
  "AI Video Generation",
  "Curated Physical Goods"
];

// Some categories are broken into subcategories (an optional `subcategory`
// field on the link entry in data.js). category.html groups that category's
// links under a heading per subcategory instead of one flat list, in this
// fixed order. A category not listed here (or a link with no `subcategory`
// set) just renders as a flat list like before — this is additive, nothing
// else changes. A subcategory that shows up in data.js but isn't listed here
// is appended at the end rather than dropped.
const SUBCATEGORY_ORDER = {
  "Marketing": [
    "SEO & Analytics",
    "Social Media Management",
    "Email Marketing",
    "AI Copywriting",
    "Landing Pages",
    "Marketing Project Management",
    "Competitive & Ad Intelligence"
  ]
};

const PLACEHOLDER_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
    <rect x="3" y="3" width="18" height="18" rx="3"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="M21 15l-5-5L5 21"></path>
  </svg>
`;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

// Tags every outbound link with ?utm_source=linksdm.com (or &utm_source=...
// if the URL already has query params) so it shows up in the destination
// site's analytics as traffic that came from LinksDM — same idea as
// Link Lowdown does with linklowdown.com. Only appends if the URL doesn't
// already carry a utm_source (never overwrites one a link was submitted
// with), and leaves the URL untouched if it isn't a valid absolute URL.
function withSource(url) {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("utm_source")) {
      u.searchParams.set("utm_source", "linksdm.com");
    }
    return u.toString();
  } catch (e) {
    return url;
  }
}

// Called via onerror when a favicon/logo image fails to load — swaps
// the broken <img> out for the plain placeholder icon. Defined as a
// named global function (rather than inlining the SVG markup into the
// onerror="..." attribute) so quote characters inside the SVG never
// conflict with the surrounding HTML attribute quoting.
function showPlaceholderIcon(imgEl) {
  if (imgEl && imgEl.parentElement) {
    imgEl.parentElement.innerHTML = PLACEHOLDER_ICON;
  }
}

// Two public favicon lookup services, tried in order. DuckDuckGo's goes
// first because it fetches a site's actual declared icon directly; for
// domains it hasn't got, the request errors and we cleanly fall through.
// Google's s2 service goes second as backup — it almost never errors,
// but for less-crawled domains it can silently return its own generic
// placeholder icon instead of failing, so it isn't reliable as the only
// source. If both fail, tryNextFavicon falls back to the plain square.
function faviconSources(domain) {
  return [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?sz=64&domain=${domain}`
  ];
}

function tryNextFavicon(imgEl, domain, nextIndex) {
  const sources = faviconSources(domain);
  if (!imgEl || nextIndex >= sources.length) {
    showPlaceholderIcon(imgEl);
    return;
  }
  imgEl.onerror = () => tryNextFavicon(imgEl, domain, nextIndex + 1);
  imgEl.src = sources[nextIndex];
}

function rowHtml(link, isExtra) {
  // Use a manually set logo if one is provided in data.js. Otherwise,
  // auto-fetch the site's favicon, trying DuckDuckGo's lookup first and
  // Google's as backup (see faviconSources above) before giving up and
  // showing the plain placeholder square.
  const domain = getDomain(link.url);
  let logo;
  if (link.logo) {
    logo = `<img src="${escapeHtml(link.logo)}" alt="" loading="lazy" onerror="showPlaceholderIcon(this)">`;
  } else if (domain) {
    const firstSrc = faviconSources(domain)[0];
    logo = `<img src="${escapeHtml(firstSrc)}" alt="" loading="lazy" onerror="tryNextFavicon(this, '${escapeHtml(domain)}', 1)">`;
  } else {
    logo = PLACEHOLDER_ICON;
  }

  return `
    <div class="link-row${isExtra ? " extra-row" : ""}"
       data-title="${escapeHtml((link.title || "").toLowerCase())}"
       data-desc="${escapeHtml((link.description || "").toLowerCase())}">
      <a class="row-link"
         href="${escapeHtml(withSource(link.url))}"
         target="_blank"
         rel="noopener noreferrer">
        <span class="row-logo">${logo}</span>
        <span class="row-text">
          <span class="row-title">${escapeHtml(link.title)}</span>
          <p class="row-desc">${escapeHtml(link.description || "")}</p>
        </span>
      </a>
      <button type="button"
              class="row-delete"
              data-url="${escapeHtml(link.url)}"
              onclick="removeLink(event, this.dataset.url)"
              title="Remove this link"
              aria-label="Remove ${escapeHtml(link.title)}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 7h16"></path>
          <path d="M9 7V4h6v3"></path>
          <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"></path>
        </svg>
      </button>
    </div>
  `;
}

function latestCardHtml(link) {
  const domain = getDomain(link.url);
  let logo;
  if (link.logo) {
    logo = `<img src="${escapeHtml(link.logo)}" alt="" loading="lazy" onerror="showPlaceholderIcon(this)">`;
  } else if (domain) {
    const firstSrc = faviconSources(domain)[0];
    logo = `<img src="${escapeHtml(firstSrc)}" alt="" loading="lazy" onerror="tryNextFavicon(this, '${escapeHtml(domain)}', 1)">`;
  } else {
    logo = PLACEHOLDER_ICON;
  }

  return `
    <a class="latest-card"
       href="${escapeHtml(withSource(link.url))}"
       target="_blank"
       rel="noopener noreferrer">
      <span class="row-logo">${logo}</span>
      <span class="latest-card-text">
        <span class="row-title">${escapeHtml(link.title)}</span>
        <p class="row-desc">${escapeHtml(link.description || "")}</p>
      </span>
    </a>
  `;
}

function renderLatestStrip(items) {
  const strip = document.getElementById("latestStrip");
  if (!strip) return;
  strip.innerHTML = items.map(latestCardHtml).join("");
}

function columnHtml(id, heading, items, opts) {
  opts = opts || {};
  const limit = opts.limit || ROW_LIMIT;
  const allowSeeAll = opts.allowSeeAll !== false;
  const rowsHtml = items
    .map((link, i) => rowHtml(link, allowSeeAll && i >= limit))
    .join("");
  const hasMore = allowSeeAll && items.length > limit;

  return `
    <div class="link-column" data-col-id="${id}">
      <h3 class="col-heading">${escapeHtml(heading)}</h3>
      <div class="row-list">${rowsHtml}</div>
      ${hasMore ? `<button class="see-all" type="button">See all <span class="arrow">→</span></button>` : ""}
    </div>
  `;
}

// ============================================================
// CUSTOM LINKS (added via the "Add a new link" box)
// ============================================================
// Quick-added links have nowhere permanent to live (this is a static
// site with no database), so they're saved to this browser's
// localStorage — they'll keep showing up here on this device, but
// won't appear for anyone else or on your other devices until you
// copy the generated snippet into data.js.
// ============================================================

const CUSTOM_LINKS_KEY = "linksdm_custom_links";

function loadCustomLinks() {
  try {
    const raw = localStorage.getItem(CUSTOM_LINKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomLinks(links) {
  try {
    localStorage.setItem(CUSTOM_LINKS_KEY, JSON.stringify(links));
  } catch (e) {
    // localStorage unavailable (private browsing, storage full, etc.) — no-op.
  }
}

// ============================================================
// REMOVING LINKS (the trash icon that appears on hover)
// ============================================================
// A quick-added link (see below) lives only in this browser's
// localStorage, so removing one deletes it for real. A default link
// from data.js is a hardcoded file though — there's nothing running
// here that can edit it — so removing one of those just hides it in
// this browser via its own localStorage list, and tells you to also
// delete its block from data.js if you want it gone everywhere.
// ============================================================

const HIDDEN_LINKS_KEY = "linksdm_hidden_links";

function loadHiddenLinks() {
  try {
    const raw = localStorage.getItem(HIDDEN_LINKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveHiddenLinks(hidden) {
  try {
    localStorage.setItem(HIDDEN_LINKS_KEY, JSON.stringify(hidden));
  } catch (e) {
    // localStorage unavailable (private browsing, storage full, etc.) — no-op.
  }
}

const statusFeedback = document.getElementById("statusFeedback");

function showFeedback(message) {
  if (!statusFeedback) return;
  statusFeedback.textContent = message;
  statusFeedback.hidden = false;
}

function removeLink(event, url) {
  event.preventDefault();
  event.stopPropagation();

  const link = getAllLinks().find(l => l.url === url);
  const label = link ? `"${link.title}"` : "This link";

  const confirmed = confirm(`Remove ${label}? This only affects your view in this browser.`);
  if (!confirmed) return;

  const customLinks = loadCustomLinks();
  const customIndex = customLinks.findIndex(l => l.url === url);
  const wasCustom = customIndex !== -1;

  if (wasCustom) {
    customLinks.splice(customIndex, 1);
    saveCustomLinks(customLinks);
  } else {
    const hidden = loadHiddenLinks();
    if (!hidden.includes(url)) {
      hidden.push(url);
      saveHiddenLinks(hidden);
    }
  }

  refreshView();

  showFeedback(
    wasCustom
      ? `Removed ${label}.`
      : `Hid ${label} in this browser. It's a default link from data.js, so delete its block there too if you want it gone everywhere, not just here.`
  );
}

function getAllLinks() {
  const hidden = loadHiddenLinks();
  return [...LINKS, ...loadCustomLinks()].filter(l => !hidden.includes(l.url));
}

function getCategories() {
  // Category list always comes from data.js, so the dropdown and the
  // columns stay a fixed, known set — a quick-added link picks one of
  // these rather than inventing new ones on the fly.
  return [...new Set(LINKS.map(l => l.category))];
}

// Same set of categories as getCategories(), but in the fixed display order
// from CATEGORY_ORDER (used by the pill nav and the "All links" page). Any
// category in data.js that isn't in CATEGORY_ORDER yet is appended at the
// end rather than dropped, so a brand new category still shows up.
function getOrderedCategories() {
  const present = getCategories();
  const ordered = CATEGORY_ORDER.filter(c => present.includes(c));
  const leftover = present.filter(c => !CATEGORY_ORDER.includes(c));
  return [...ordered, ...leftover];
}

function categoryHref(cat) {
  return `category.html?cat=${encodeURIComponent(cat)}`;
}

function renderCategoryNav() {
  const nav = document.getElementById("categoryNav");
  if (!nav) return;
  const categories = getOrderedCategories();
  const pills = [`<a class="category-pill category-pill-all" href="index.html">All</a>`]
    .concat(categories.map(cat => `<a class="category-pill" href="${categoryHref(cat)}">${escapeHtml(cat)}</a>`));
  nav.innerHTML = pills.join("");
}

// Number of side-by-side category columns at the current viewport width.
// Mirrors the breakpoints that used to live in the CSS grid (3 / 2 / 1),
// but now drives the masonry distribution below instead of a grid-template.
function getColumnCount() {
  const w = window.innerWidth;
  if (w <= 600) return 1;
  if (w <= 900) return 2;
  return 3;
}

// Distributes categories across columns by their own running height instead
// of a fixed left-to-right grid, so a short category (like Domains) doesn't
// wait behind a tall neighbor (like SEO & Google Analytics) that happens to
// share the same grid row — it moves up into whichever column has the least
// content so far, closing the gap between short categories stacked together.
// Swaps the rendered position of two categories after the automatic column
// balancing above has run, without disturbing where anything else landed.
// Finds each category wherever it ended up (any column, any index) and
// trades places directly. If either category is missing (e.g. no links in
// it, or too few columns at this width for both to appear), it's a no-op.
function swapCategoryPositions(colEntries, catA, catB) {
  let locA = null;
  let locB = null;
  colEntries.forEach((entries, colIdx) => {
    entries.forEach((entry, idx) => {
      if (entry.cat === catA) locA = { colIdx, idx };
      if (entry.cat === catB) locB = { colIdx, idx };
    });
  });
  if (!locA || !locB) return;

  const entryA = colEntries[locA.colIdx][locA.idx];
  const entryB = colEntries[locB.colIdx][locB.idx];
  colEntries[locA.colIdx][locA.idx] = entryB;
  colEntries[locB.colIdx][locB.idx] = entryA;
}

function renderColumns() {
  const grid = document.getElementById("columnsGrid");
  const allLinks = getAllLinks();
  const latest = [...allLinks]
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
    .slice(0, LATEST_LIMIT);

  const categories = getCategories();

  renderLatestStrip(latest);
  renderCategoryNav();

  const colCount = getColumnCount();
  const colEntries = Array.from({ length: colCount }, () => []); // [{ cat, html }]
  const colHeight = Array(colCount).fill(0);

  categories.forEach((cat, i) => {
    const items = allLinks.filter(l => l.category === cat);
    const heightEstimate = Math.min(items.length, ROW_LIMIT) + 1; // +1 for the heading

    let target = 0;
    for (let c = 1; c < colCount; c++) {
      if (colHeight[c] < colHeight[target]) target = c;
    }

    colEntries[target].push({ cat, html: columnHtml(`cat-${i}`, cat, items) });
    colHeight[target] += heightEstimate;
  });

  // Manual override: Domains and Fonts always trade visual positions,
  // whichever columns the automatic balancing above puts them in.
  swapCategoryPositions(colEntries, "Domains", "Fonts");

  grid.innerHTML = colEntries
    .map(entries => `<div class="grid-col">${entries.map(e => e.html).join("")}</div>`)
    .join("");

  grid.querySelectorAll(".see-all").forEach(btn => {
    btn.addEventListener("click", () => {
      const col = btn.closest(".link-column");
      const expanded = col.classList.toggle("expanded");
      btn.innerHTML = expanded
        ? `Show less <span class="arrow">→</span>`
        : `See all <span class="arrow">→</span>`;
    });
  });
}

const NEW_PAGE_WINDOW_DAYS = 30;

function renderNewLinksPage() {
  const list = document.getElementById("newLinksList");
  if (!list) return;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_PAGE_WINDOW_DAYS);

  const recent = getAllLinks()
    .filter(l => new Date(l.dateAdded) >= cutoff)
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

  list.innerHTML = recent.map(link => rowHtml(link, false)).join("");

  const emptyState = document.getElementById("newEmptyState");
  if (emptyState) emptyState.hidden = recent.length > 0;
}

// ============================================================
// CATEGORY PAGE (category.html?cat=Category+Name)
// ============================================================
// Shows the full, alphabetized, un-capped list for one category (no
// "See all" needed here, since it's not sharing space with other columns).
// The "All" pill lives on the homepage itself (index.html already shows
// every category), so a visit to this page with no ?cat= — or an
// unrecognized one — just goes back home rather than showing a blank page.

function renderCategoryPage() {
  const titleEl = document.getElementById("categoryTitle");
  const subtitleEl = document.getElementById("categorySubtitle");
  const container = document.getElementById("categoryContent");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("cat");

  if (!catParam) {
    window.location.replace("index.html");
    return;
  }

  const allLinks = getAllLinks();
  const sortByTitle = (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  const items = allLinks.filter(l => l.category === catParam).sort(sortByTitle);

  document.title = `${catParam} — LinksDM`;
  titleEl.textContent = catParam;

  if (items.length === 0) {
    subtitleEl.textContent = "No links found in this category.";
    container.innerHTML = `<p class="empty-state">This category doesn't have any links yet.</p>`;
    return;
  }

  subtitleEl.textContent = `${items.length} link${items.length === 1 ? "" : "s"} in this category.`;

  // If any link in this category has a `subcategory` set, group the whole
  // page by subcategory instead of one flat list (see SUBCATEGORY_ORDER).
  const hasSubcategories = items.some(l => l.subcategory);
  if (!hasSubcategories) {
    container.innerHTML = `<div class="link-column"><div class="row-list">${items.map(l => rowHtml(l, false)).join("")}</div></div>`;
    return;
  }

  const grouped = {};
  items.forEach(l => {
    const key = l.subcategory || "Other";
    (grouped[key] = grouped[key] || []).push(l);
  });

  const fixedOrder = SUBCATEGORY_ORDER[catParam] || [];
  const present = Object.keys(grouped);
  const orderedKeys = [...fixedOrder.filter(k => present.includes(k)), ...present.filter(k => !fixedOrder.includes(k))];

  container.innerHTML = `<div class="subcategory-groups">${orderedKeys.map(key => `
    <div class="link-column">
      <h2 class="subcategory-heading">${escapeHtml(key)}</h2>
      <div class="row-list">${grouped[key].map(l => rowHtml(l, false)).join("")}</div>
    </div>
  `).join("")}</div>`;
}

// Re-renders whichever view is on the current page (the category grid on
// index.html, the flat list on new.html, or the single/all category view
// on category.html) and re-applies the current search term where relevant.
// Called after a link is added or removed so every page stays in sync
// without needing to know which page it's on.
function refreshView() {
  if (document.getElementById("columnsGrid")) {
    renderColumns();
    const searchInputEl = document.getElementById("searchInput");
    if (searchInputEl) applySearch(searchInputEl.value);
  }
  if (document.getElementById("newLinksList")) {
    renderNewLinksPage();
  }
  if (document.getElementById("categoryContent")) {
    renderCategoryPage();
  }
}

function applySearch(term) {
  const t = term.trim().toLowerCase();
  const columns = document.querySelectorAll(".link-column");
  let totalMatches = 0;

  const latestSection = document.getElementById("latestSection");
  if (latestSection) latestSection.hidden = !!t;

  columns.forEach(col => {
    const seeAllBtn = col.querySelector(".see-all");

    if (!t) {
      col.hidden = false;
      col.querySelectorAll(".link-row").forEach(row => (row.style.display = ""));
      if (seeAllBtn) seeAllBtn.hidden = false;
      return;
    }

    let matches = 0;
    col.querySelectorAll(".link-row").forEach(row => {
      const isMatch =
        row.dataset.title.includes(t) || row.dataset.desc.includes(t);
      row.style.display = isMatch ? "flex" : "none";
      if (isMatch) matches++;
    });

    col.hidden = matches === 0;
    if (seeAllBtn) seeAllBtn.hidden = true;
    totalMatches += matches;
  });

  document.getElementById("emptyState").hidden = totalMatches > 0 || !t;
}

const searchInputEl = document.getElementById("searchInput");
if (searchInputEl) {
  searchInputEl.addEventListener("input", e => {
    applySearch(e.target.value);
  });
}

if (document.getElementById("columnsGrid")) {
  renderColumns();

  // Re-distribute the masonry columns only when the responsive column
  // count actually changes (3 / 2 / 1), not on every resize pixel.
  let lastColumnCount = getColumnCount();
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const current = getColumnCount();
      if (current !== lastColumnCount) {
        lastColumnCount = current;
        renderColumns();
        const searchInputEl = document.getElementById("searchInput");
        if (searchInputEl) applySearch(searchInputEl.value);
      }
    }, 150);
  });
}

if (document.getElementById("newLinksList")) {
  renderNewLinksPage();
}

if (document.getElementById("categoryContent")) {
  renderCategoryPage();
}

// ============================================================
// LATEST STRIP ARROWS
// ============================================================
(function setupLatestArrows() {
  const strip = document.getElementById("latestStrip");
  const prevBtn = document.getElementById("latestPrev");
  const nextBtn = document.getElementById("latestNext");
  if (!strip || !prevBtn || !nextBtn) return;

  function updateArrowState() {
    const maxScroll = strip.scrollWidth - strip.clientWidth;
    prevBtn.disabled = strip.scrollLeft <= 5;
    nextBtn.disabled = strip.scrollLeft >= maxScroll - 5;
  }

  function scrollByCards(direction) {
    const card = strip.querySelector(".latest-card");
    const step = card ? card.getBoundingClientRect().width + 16 : strip.clientWidth * 0.8;
    strip.scrollBy({ left: direction * step * 2, behavior: "smooth" });
  }

  prevBtn.addEventListener("click", () => scrollByCards(-1));
  nextBtn.addEventListener("click", () => scrollByCards(1));
  strip.addEventListener("scroll", updateArrowState);
  window.addEventListener("resize", updateArrowState);

  // Re-check after content renders (renderColumns runs synchronously above,
  // but a fresh MutationObserver keeps arrow state correct if items change later).
  const observer = new MutationObserver(updateArrowState);
  observer.observe(strip, { childList: true });

  updateArrowState();
})();

// ============================================================
// AI PROMPTS — Basic (expand) / Detailed (link out) + copy button
// Runs on any page with a #promptGrid (ai-prompts.html, index.html).
// ============================================================
(function setupPromptCards() {
  const grid = document.getElementById("promptGrid");
  if (!grid) return;

  grid.querySelectorAll(".prompt-btn-basic").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      const isOpen = panel.classList.toggle("is-open");
      btn.classList.toggle("is-open", isOpen);
      btn.textContent = isOpen ? "Hide" : "Basic";
    });
  });

  grid.querySelectorAll(".prompt-copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.copyTarget);
      const textEl = panel && panel.querySelector(".prompt-text");
      if (!textEl) return;
      navigator.clipboard?.writeText(textEl.textContent).catch(() => {});
      const original = btn.innerHTML;
      btn.textContent = "Copied!";
      setTimeout(() => { btn.innerHTML = original; }, 1500);
    });
  });
})();
