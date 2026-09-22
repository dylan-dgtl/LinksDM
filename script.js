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
    "Ad Intelligence"
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

// Formats a data.js "YYYY-MM-DD" dateAdded value for display (e.g. "Sep 10,
// 2026"). Parsed and formatted in UTC so the date shown always matches what
// was typed in data.js, regardless of the visitor's local timezone.
function formatDateAdded(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
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

function rowHtml(link, isExtra, opts) {
  opts = opts || {};
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

  const dateLabel = formatDateAdded(link.dateAdded);
  const dateHtml = opts.showDate && dateLabel
    ? `<span class="row-date">${escapeHtml(dateLabel)}</span>`
    : "";

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
          ${dateHtml}
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

// Row renderer for the "New" page's 4-column table (site / category /
// description / date added). Kept separate from rowHtml() so the stacked
// card style used everywhere else (home, category pages) is untouched.
function newTableRowHtml(link) {
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

  const dateLabel = formatDateAdded(link.dateAdded) || "—";

  return `
    <a class="new-row"
       href="${escapeHtml(withSource(link.url))}"
       target="_blank"
       rel="noopener noreferrer"
       data-title="${escapeHtml((link.title || "").toLowerCase())}"
       data-desc="${escapeHtml((link.description || "").toLowerCase())}">
      <span class="new-col new-col-site">
        <span class="row-logo">${logo}</span>
        <span class="new-site-name">${escapeHtml(link.title)}</span>
      </span>
      <span class="new-col new-col-category">${escapeHtml(link.category || "")}</span>
      <span class="new-col new-col-desc">${escapeHtml(link.description || "")}</span>
      <span class="new-col new-col-date">${escapeHtml(dateLabel)}</span>
    </a>
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
      ${hasMore ? `<a class="see-all" href="${categoryHref(heading)}">See all <span class="arrow">→</span></a>` : ""}
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

// Unlike swapCategoryPositions (which trades two categories' positions
// wherever they each landed), this pins strict adjacency: catToMove is
// pulled out of wherever the automatic balancing put it and reinserted
// directly after afterCat in whichever column afterCat ended up in,
// shifting anything below it in that column down by one. No-op if either
// category is missing (e.g. no links in it, or too few columns at this
// width for both to appear).
function pinCategoryAfter(colEntries, catToMove, afterCat) {
  let moveLoc = null;
  colEntries.forEach((entries, colIdx) => {
    entries.forEach((entry, idx) => {
      if (entry.cat === catToMove) moveLoc = { colIdx, idx };
    });
  });
  if (!moveLoc) return;

  const [entry] = colEntries[moveLoc.colIdx].splice(moveLoc.idx, 1);

  let afterLoc = null;
  colEntries.forEach((entries, colIdx) => {
    entries.forEach((e, idx) => {
      if (e.cat === afterCat) afterLoc = { colIdx, idx };
    });
  });
  if (!afterLoc) {
    // afterCat not found (shouldn't happen) — put catToMove back where it was.
    colEntries[moveLoc.colIdx].splice(moveLoc.idx, 0, entry);
    return;
  }

  colEntries[afterLoc.colIdx].splice(afterLoc.idx + 1, 0, entry);
}

// Pins catToMove as the very first entry of a specific column index (0-based,
// left to right), removing it from wherever it landed. Unlike
// pinCategoryAfter (which only guarantees adjacency to another category),
// this guarantees a column START position — the one spot every column lines
// up on regardless of how much content the others hold — so two categories
// each pinned to the start of their own column render side by side instead
// of one merely following the other. No-op if that column index doesn't
// exist at the current width (e.g. index 2 on tablet's 2 columns, or index
// 1/2 on the single mobile column) or if catToMove itself isn't present.
function pinCategoryToColumnStart(colEntries, catToMove, colIndex) {
  if (colIndex < 0 || colIndex >= colEntries.length) return;

  let moveLoc = null;
  colEntries.forEach((entries, colIdx) => {
    entries.forEach((entry, idx) => {
      if (entry.cat === catToMove) moveLoc = { colIdx, idx };
    });
  });
  if (!moveLoc) return;

  const [entry] = colEntries[moveLoc.colIdx].splice(moveLoc.idx, 1);
  colEntries[colIndex].unshift(entry);
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

  // Manual overrides below chain several categories into fixed groups,
  // regardless of where the automatic balancing above first puts them.
  // Each column's running total is kept in mind when placing these (see the
  // comments on each), so the three columns land close to even overall even
  // though their contents are hand-picked rather than purely automatic.
  // Re-check the column heights (grid.querySelectorAll(".grid-col") in a
  // browser console works) after adding or removing links, since a
  // category's row count shifting can throw this off — that's what
  // triggered the reshuffle below in the first place.

  // Column 1: AI Tools, Marketing, Hosting, Website Platforms, Wallpapers —
  // AI Tools leads as it did originally, with Marketing directly after it
  // (same pairing as always, nothing moved to the top). Hosting, then
  // Website Platforms and Wallpapers, round the column out.
  pinCategoryAfter(colEntries, "Marketing", "AI Tools");
  pinCategoryAfter(colEntries, "Hosting", "Marketing");
  pinCategoryAfter(colEntries, "Website Platforms", "Hosting");
  pinCategoryAfter(colEntries, "Wallpapers", "Website Platforms");

  if (colCount === 1) {
    // No 2nd column exists on the single mobile column, so keep SEO
    // Analytics directly after Marketing instead — they still read one
    // after the other.
    pinCategoryAfter(colEntries, "SEO Analytics", "Marketing");
  } else {
    // Desktop / tablet: SEO Analytics goes directly under Design
    // Inspiration — which, like AI Tools, is a full 8-row category — so it
    // lands in column 2 at roughly the same height as Marketing sits in
    // column 1, reading as side by side rather than one column leading
    // with Marketing itself.
    pinCategoryAfter(colEntries, "SEO Analytics", "Design Inspiration");
  }
  if (colCount === 3) {
    // Desktop: AI Design leads column 3, starting at the same height as
    // Design Inspiration atop column 2 (both full 8-row categories), so the
    // two read as side by side — same pattern as Marketing/SEO Analytics.
    pinCategoryToColumnStart(colEntries, "AI Design", 2);
  } else {
    // Tablet / mobile: no 3rd column exists to place AI Design in on its
    // own, so keep it directly after SEO Analytics instead — still grouped
    // with Design Inspiration's column, just stacked rather than side by
    // side.
    pinCategoryAfter(colEntries, "AI Design", "SEO Analytics");
  }
  pinCategoryAfter(colEntries, "AI Video Generation", "AI Design");

  if (colCount === 2) {
    // Tablet (2 columns): there's no 3rd column to hold this grouping on
    // its own, and stacking all of it behind one of the two columns leaves
    // that column roughly twice the other's height. Splitting it across
    // both columns instead — Domains/Fonts/Productivity & Business behind
    // column 1, Icons & Stock Photos/Curated Physical Goods/Learning behind
    // column 2 — keeps the two close to even.
    pinCategoryAfter(colEntries, "Domains", "Wallpapers");
    pinCategoryAfter(colEntries, "Fonts", "Domains");
    pinCategoryAfter(colEntries, "Productivity & Business", "Fonts");
    swapCategoryPositions(colEntries, "Domains", "Fonts");

    pinCategoryAfter(colEntries, "Icons & Stock Photos", "AI Video Generation");
    pinCategoryAfter(colEntries, "Curated Physical Goods", "Icons & Stock Photos");
    pinCategoryAfter(colEntries, "Learning", "Curated Physical Goods");
  } else {
    // Desktop (3 columns): now that AI Design/AI Video Generation lead
    // column 3 above, Icons & Stock Photos and Productivity & Business join
    // column 2 (behind SEO Analytics) instead, while Domains, Fonts,
    // Curated Physical Goods, and Learning join column 3 (behind AI Video
    // Generation) — splitting what used to be one column's worth of
    // categories keeps all three columns close to even now that column 3
    // starts with two more categories than it used to. Learning still stays
    // directly under Curated Physical Goods, and Domains and Fonts stay
    // next to each other, still trading which one renders first. (On the
    // single mobile column this chain still runs — it just becomes reading
    // order rather than two columns.)
    pinCategoryAfter(colEntries, "Icons & Stock Photos", "SEO Analytics");
    pinCategoryAfter(colEntries, "Productivity & Business", "Icons & Stock Photos");
    pinCategoryAfter(colEntries, "Domains", "AI Video Generation");
    pinCategoryAfter(colEntries, "Fonts", "Domains");
    pinCategoryAfter(colEntries, "Curated Physical Goods", "Fonts");
    pinCategoryAfter(colEntries, "Learning", "Curated Physical Goods");
    swapCategoryPositions(colEntries, "Domains", "Fonts");
  }

  if (colCount === 1) {
    // Mobile only: AI Design and AI Video Generation render directly under
    // AI Tools, ahead of Marketing/SEO Analytics and everything else — a
    // reading-order preference specific to the single mobile column, so it
    // doesn't touch the desktop or tablet layouts above.
    pinCategoryAfter(colEntries, "AI Design", "AI Tools");
    pinCategoryAfter(colEntries, "AI Video Generation", "AI Design");
  }

  grid.innerHTML = colEntries
    .map(entries => `<div class="grid-col">${entries.map(e => e.html).join("")}</div>`)
    .join("");
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

  list.innerHTML = recent.map(link => newTableRowHtml(link)).join("");

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
// AI PROMPTS — Basic / Detailed (each expands its own in-place panel when
// it has a data-target) + copy button. Most cards' Detailed is still a
// plain link (to ai-prompts.html, or a # placeholder for the future
// Shopify product) rather than a button with data-target, so those are
// left alone here and behave as normal links — this only wires up
// buttons that actually have a panel to open.
// Within a single card, only one panel (Basic or Detailed) can be open
// at a time — opening one closes the other; clicking the open one again
// closes it.
// Runs on any page with a #promptGrid (ai-prompts.html, index.html).
// ============================================================
(function setupPromptCards() {
  const grid = document.getElementById("promptGrid");
  if (!grid) return;

  grid.querySelectorAll(".prompt-card").forEach(card => {
    const toggles = [];
    card.querySelectorAll(".prompt-btn-basic, .prompt-btn-detailed").forEach(btn => {
      if (!btn.dataset.target) return; // plain link, e.g. Detailed -> ai-prompts.html or a # placeholder
      const panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      toggles.push({ btn, panel, label: btn.textContent.trim() });
    });

    toggles.forEach(({ btn, panel }) => {
      btn.addEventListener("click", () => {
        const willOpen = !panel.classList.contains("is-open");

        // Close every panel in this card first, so Basic and Detailed
        // are never both visible at once.
        toggles.forEach(t => {
          t.panel.classList.remove("is-open");
          t.btn.classList.remove("is-open");
          t.btn.textContent = t.label;
        });

        if (willOpen) {
          panel.classList.add("is-open");
          btn.classList.add("is-open");
          btn.textContent = "Hide";
        }
      });
    });
  });

  // Document-wide (not just inside #promptGrid) so the Image Prompts
  // section's copy buttons, which sit outside the grid, work the same way.
  document.querySelectorAll(".prompt-copy-btn").forEach(btn => {
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

// ============================================================
// LIVE LINK COUNT (footer, shared sitewide + the homepage hero, which
// has its own matching green-light badge under the subtext).
// ============================================================
(function setupLinkCounts() {
  const countEls = [
    document.getElementById("footerLinkCount"),
    document.getElementById("heroLinkCount"),
  ].filter(Boolean);
  if (!countEls.length) return;

  if (typeof LINKS === "undefined") {
    // Page doesn't load data.js (nothing to count) — hide the line(s)
    // instead of showing an inaccurate or stuck "Loading…" state.
    countEls.forEach(el => { el.parentElement.hidden = true; });
    return;
  }

  const count = LINKS.length;
  const text = `${count} link${count === 1 ? "" : "s"}. Updated weekly`;
  countEls.forEach(el => { el.textContent = text; });
})();

(function setupSubscribeForm() {
  const form = document.getElementById("subscribeForm");
  if (!form) return;
  const emailInput = document.getElementById("subscribeEmail");
  const msg = document.getElementById("subscribeMsg");

  // NOTE: this only confirms the submission in the UI. To actually collect
  // subscribers, point this form at an email provider (Mailchimp, Beehiiv,
  // ConvertKit, Klaviyo, etc.) — either by swapping this handler for that
  // provider's form action/endpoint, or by posting `email` to it here.
  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    msg.textContent = "Thanks — you're on the list.";
    msg.hidden = false;
    form.reset();
  });
})();
