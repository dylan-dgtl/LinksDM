#!/usr/bin/env node
// ============================================================
// LINKSDM — BUILD-TIME PRE-RENDER
// ============================================================
// Netlify runs this before every deploy (see netlify.toml). It reads
// data.js and writes the resulting link listings directly into the
// static HTML files — the homepage columns, the Latest strip, each
// category page's link list, the New page's table, the "Browse by
// category" pill nav, and the link-count lines in the header/footer —
// so Google (and any visitor before script.js finishes loading) sees
// real, crawlable content on the very first response instead of an
// empty container that only fills in after JavaScript runs.
//
// script.js still renders all of this client-side too, exactly as
// before — nothing about the live site's interactivity (search,
// removing a link, the responsive masonry columns) changes. This
// script only fills in the *starting* HTML so there's real text there
// before script.js has a chance to run. If this build step is ever
// skipped, the pages still work exactly as they did before Stage 3 —
// the containers just start empty and script.js fills them in, same
// as always.
//
// HOW THIS STAYS IN SYNC WITH script.js
// A few pieces of display logic (row card markup, category order,
// subcategory grouping, the URL slug for each category) are
// necessarily duplicated here, because this runs in Node at build
// time with no browser/DOM available, so script.js's DOM-based
// renderers can't be reused directly. If you change one of the
// marked "keep in sync with script.js" spots below, make the matching
// change in script.js (or vice versa). The homepage's exact column
// balancing (the hand-tuned pinCategoryAfter/... calls in script.js)
// is intentionally NOT duplicated here — this script uses the same
// simple "shortest column first" balancing script.js starts from,
// without the manual overrides, since script.js repaints the
// homepage columns immediately on load anyway. The pre-rendered
// version only needs to hold real content for that brief window
// before JS runs (and for crawlers that don't run JS at all); it
// doesn't need to be pixel-identical to the final tuned layout.
// ============================================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");

// ---------- load data.js's LINKS array ----------

function loadLinks() {
  const dataPath = path.join(ROOT, "data.js");
  const raw = fs.readFileSync(dataPath, "utf8");
  // data.js declares `const LINKS = [...]`. Run it in its own sandbox and
  // grab the array as the script's completion value.
  const code = raw.replace(/\bconst\s+LINKS\b/, "var LINKS") + "\n;LINKS;";
  return vm.runInNewContext(code, {}, { filename: "data.js" });
}

// ---------- ported display logic (keep in sync with script.js) ----------

const ROW_LIMIT = 8; // keep in sync with script.js
const LATEST_LIMIT = 10; // keep in sync with script.js
const NEW_PAGE_WINDOW_DAYS = 30; // keep in sync with script.js

// keep in sync with script.js
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
  "Curated Physical Goods",
];

// keep in sync with script.js
const SUBCATEGORY_ORDER = {
  Marketing: [
    "SEO & Analytics",
    "Social Media Management",
    "Email Marketing",
    "AI Copywriting",
    "Landing Pages",
    "Marketing Project Management",
    "Ad Intelligence",
  ],
};

const PLACEHOLDER_ICON = `
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
    <rect x="3" y="3" width="18" height="18" rx="3"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="M21 15l-5-5L5 21"></path>
  </svg>
`;

// Matches script.js's escapeHtml() (div.textContent = str; return div.innerHTML),
// which only ever needs to escape &, <, and > for text-node serialization.
function escapeHtml(str) {
  if (str == null) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

function formatDateAdded(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

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

function faviconSources(domain) {
  return [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?sz=64&domain=${domain}`,
  ];
}

function rowHtml(link, isExtra, opts) {
  opts = opts || {};
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
  const dateHtml = opts.showDate && dateLabel ? `<span class="row-date">${escapeHtml(dateLabel)}</span>` : "";

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

function categorySlug(cat) {
  return cat
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryHref(cat) {
  return `/category/${categorySlug(cat)}`;
}

function getCategories(links) {
  return [...new Set(links.map((l) => l.category))];
}

function getOrderedCategories(links) {
  const present = getCategories(links);
  const ordered = CATEGORY_ORDER.filter((c) => present.includes(c));
  const leftover = present.filter((c) => !CATEGORY_ORDER.includes(c));
  return [...ordered, ...leftover];
}

function renderCategoryNavHtml(links) {
  const categories = getOrderedCategories(links);
  const pills = [`<a class="category-pill category-pill-all" href="/">All</a>`].concat(
    categories.map((cat) => `<a class="category-pill" href="${categoryHref(cat)}">${escapeHtml(cat)}</a>`)
  );
  return pills.join("");
}

function columnHtml(id, heading, items) {
  const rowsHtml = items.map((link, i) => rowHtml(link, i >= ROW_LIMIT)).join("");
  const hasMore = items.length > ROW_LIMIT;

  return `
    <div class="link-column" data-col-id="${id}">
      <h3 class="col-heading">${escapeHtml(heading)}</h3>
      <div class="row-list">${rowsHtml}</div>
      ${hasMore ? `<a class="see-all" href="${categoryHref(heading)}">See all <span class="arrow">→</span></a>` : ""}
    </div>
  `;
}

// Simple "shortest column first" balancing — the same starting point
// script.js's renderColumns() uses before its hand-tuned pinCategoryAfter/
// swapCategoryPositions/pinCategoryToColumnStart overrides run. Those
// overrides are deliberately not duplicated here (see the file header) since
// script.js repaints this grid on load anyway; this only needs to hold real,
// reasonably-ordered content until then.
function renderColumnsHtml(links) {
  const colCount = 3;
  const categories = getOrderedCategories(links);
  const colEntries = Array.from({ length: colCount }, () => []);
  const colHeight = Array(colCount).fill(0);

  categories.forEach((cat, i) => {
    const items = links.filter((l) => l.category === cat);
    const heightEstimate = Math.min(items.length, ROW_LIMIT) + 1;

    let target = 0;
    for (let c = 1; c < colCount; c++) {
      if (colHeight[c] < colHeight[target]) target = c;
    }

    colEntries[target].push(columnHtml(`cat-${i}`, cat, items));
    colHeight[target] += heightEstimate;
  });

  return colEntries.map((entries) => `<div class="grid-col">${entries.join("")}</div>`).join("");
}

function renderLatestStripHtml(links) {
  const latest = [...links].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)).slice(0, LATEST_LIMIT);
  return latest.map(latestCardHtml).join("");
}

function renderNewLinksHtml(links) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NEW_PAGE_WINDOW_DAYS);
  const recent = links
    .filter((l) => new Date(l.dateAdded) >= cutoff)
    .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  return recent.map(newTableRowHtml).join("");
}

// Mirrors script.js's renderCategoryPage() per-category logic (minus the
// DOM/title/canonical/meta bits, which the category-*.html files already
// ship statically — see the Stage 2 commit).
function renderCategoryContent(links, catName) {
  const sortByTitle = (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  const items = links.filter((l) => l.category === catName).sort(sortByTitle);

  if (items.length === 0) {
    return {
      countText: "No links found in this category.",
      contentHtml: `<p class="empty-state">This category doesn't have any links yet.</p>`,
    };
  }

  const countText = `${items.length} link${items.length === 1 ? "" : "s"} in this category.`;

  const hasSubcategories = items.some((l) => l.subcategory);
  if (!hasSubcategories) {
    return {
      countText,
      contentHtml: `<div class="link-column"><div class="row-list">${items.map((l) => rowHtml(l, false)).join("")}</div></div>`,
    };
  }

  const grouped = {};
  items.forEach((l) => {
    const key = l.subcategory || "Other";
    (grouped[key] = grouped[key] || []).push(l);
  });

  const fixedOrder = SUBCATEGORY_ORDER[catName] || [];
  const present = Object.keys(grouped);
  const orderedKeys = [...fixedOrder.filter((k) => present.includes(k)), ...present.filter((k) => !fixedOrder.includes(k))];

  const contentHtml = `<div class="subcategory-groups">${orderedKeys
    .map(
      (key) => `
    <div class="link-column">
      <h2 class="subcategory-heading">${escapeHtml(key)}</h2>
      <div class="row-list">${grouped[key].map((l) => rowHtml(l, false)).join("")}</div>
    </div>
  `
    )
    .join("")}</div>`;

  return { countText, contentHtml };
}

function footerCountText(links) {
  const count = links.length;
  return `${count} link${count === 1 ? "" : "s"}. Updated weekly`;
}

// ---------- marker-based file patching ----------

function replaceBetweenMarkers(html, id, newInner) {
  const start = `<!--PRERENDER:${id}:START-->`;
  const end = `<!--PRERENDER:${id}:END-->`;
  const si = html.indexOf(start);
  const ei = html.indexOf(end);
  if (si === -1 || ei === -1 || ei < si) return html; // marker not present on this page — leave untouched
  return html.slice(0, si + start.length) + newInner + html.slice(ei);
}

function main() {
  const links = loadLinks();
  const navHtml = renderCategoryNavHtml(links);
  const footerText = footerCountText(links);
  const columnsHtml = renderColumnsHtml(links);
  const latestHtml = renderLatestStripHtml(links);
  const newLinksHtml = renderNewLinksHtml(links);

  const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
  let changed = 0;

  files.forEach((fname) => {
    const fpath = path.join(ROOT, fname);
    let html = fs.readFileSync(fpath, "utf8");
    const before = html;

    html = replaceBetweenMarkers(html, "footerLinkCount", footerText);
    html = replaceBetweenMarkers(html, "heroLinkCount", footerText);
    html = replaceBetweenMarkers(html, "categoryNav", navHtml);
    html = replaceBetweenMarkers(html, "columnsGrid", columnsHtml);
    html = replaceBetweenMarkers(html, "latestStrip", latestHtml);
    html = replaceBetweenMarkers(html, "newLinksList", newLinksHtml);

    // categoryCount / categoryContent are per-category — read the category
    // name straight off this page's own data-category attribute, so there's
    // no separate slug->name list here to fall out of sync with the
    // category-*.html files themselves.
    const catMatch = html.match(/id="categoryContent" class="category-content" data-category="([^"]*)"/);
    if (catMatch) {
      const catName = catMatch[1].replace(/&amp;/g, "&");
      const { countText, contentHtml } = renderCategoryContent(links, catName);
      html = replaceBetweenMarkers(html, "categoryCount", countText);
      html = replaceBetweenMarkers(html, "categoryContent", contentHtml);
    }

    if (html !== before) {
      fs.writeFileSync(fpath, html);
      changed++;
    }
  });

  console.log(`Pre-render complete: ${links.length} links, ${changed}/${files.length} HTML files updated.`);
}

main();
