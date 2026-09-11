# LinksDM — Setup & Maintenance Guide

This is your personal link library, styled to match Link Lowdown's layout: clean rows grouped into category columns, a "Latest" column, a small logo square beside each name, and instant search. It's a plain HTML/CSS/JS site with no backend, no database, and no subscription required.

## What you got

```
linksdm/
├── index.html        → home page structure
├── category.html     → "Browse by category" page — the full list for one category
├── new.html          → "New" page — everything added in the last 30 days
├── ai-prompts.html   → "AI Prompts" page — free Basic prompts + Detailed upsell buttons
├── submit.html       → "Submit" page — public form for link suggestions
├── thank-you.html    → confirmation page shown after a link submission
├── contact.html      → "Contact Us" page — public form to message you directly
├── message-sent.html → confirmation page shown after a contact message
├── style.css         → all styling/design
├── script.js         → renders the rows, search, and "See all" expand (you shouldn't need to touch most of this)
├── data.js           → YOUR LINKS live here — this is the only file you'll edit regularly
└── GUIDE.md          → this file
```

It currently holds 89 links across 15 categories (AI Tools, Design Inspiration, AI Design, Website Platforms, Fonts, SEO Analytics, Marketing, Hosting, Icons & Stock Photos, Domains, Learning, Productivity & Business, Wallpapers, AI Video Generation, Curated Physical Goods).

Each category is shown as its own column (like Link Lowdown), with a "Latest" column first showing your most recently added links across every category. Columns longer than 8 links show a **See all →** link to expand the rest, so the page stays scannable.

Below "Latest" is a row of category pills. "All" just takes you back to this home page (which already shows every category). Clicking any other pill opens `category.html`, which shows that category's complete, alphabetized list on its own page (no 8-link cap there). The pill order is controlled by `CATEGORY_ORDER` near the top of `script.js` — a brand new category you add in `data.js` still shows up in the nav automatically (it's just appended at the end until you add it to that list too).

At the bottom of the home page, and again on its own dedicated `ai-prompts.html` page (linked from the header nav), is an **AI Prompts** section: cards with a category tag, title, and short description, each with two buttons. **Basic** expands the card in place to reveal a free, ready-to-use prompt with a "Copy prompt" button. **Detailed** currently links to `ai-prompts.html` on the home page card row, and to a `#` placeholder on the dedicated page — swap those `href`s to your Shopify product/collection URL once it's live. Prompt cards aren't stored in `data.js`; each one is its own block of HTML directly in `index.html` / `ai-prompts.html` (look for `<div class="prompt-card">`), so to add, edit, or remove a prompt, copy/edit/delete that whole block in both places to keep the home page preview and the full page in sync. The toggle/copy behavior lives in `script.js` under "AI PROMPTS" and runs automatically on any page with a `#promptGrid` element — you shouldn't need to touch it.

## 1. Preview it right now

No installation needed. Just double-click `index.html` and it opens in your browser. Everything — search, category filters, the Latest section — works locally before you deploy anything.

## 2. Add a link

Open `data.js`. Every link is one block like this inside the `LINKS` array:

```js
{
  title: "Figma",
  url: "https://www.figma.com",
  description: "Collaborative interface design tool.",
  category: "Design Apps",
  dateAdded: "2026-08-15",
  logo: ""
},
```

To add a new link:

1. Copy an existing block.
2. Paste it anywhere inside the `LINKS = [ ... ]` array.
3. Fill in `title`, `url`, `description`, `category`, and today's `dateAdded` (format `YYYY-MM-DD`).
4. Leave `logo` as `""` for now, or add an image path (see below).
5. Save the file and refresh the page.

## 3. Add a logo image

Every row has a small square beside the name. By default, LinksDM automatically pulls each site's own favicon through two public favicon-lookup services, tried in order (a static site can't read another site's HTML directly to find its icon, so this is the practical workaround). It only falls back to a plain placeholder square if a site genuinely has no icon either service can find.

If you'd rather use your own image instead of the auto-fetched one:

1. Save the logo as a small square image (roughly 100×100px works best) — PNG, JPG, or SVG.
2. Create a folder named `logos` next to `data.js`, and drop the image in there.
3. Point the link's `logo` field at it:

```js
logo: "logos/figma.png"
```

That's it — refresh and the image replaces the placeholder square automatically. If you'd rather link to an image already hosted somewhere (e.g. a brand's own logo URL), just paste the full URL into `logo` instead.

## 4. Add a new category

There's no separate place to "create" a category. Just type a new value into the `category` field of any link (e.g. `"category": "Video Tools"`), and the site automatically generates a new column for it. Delete all links in a category and the column disappears on its own.

Remember to also add a matching `<option>` to the Category dropdown in `submit.html` (see section 7) so public submissions can pick it too.

### Subcategories (optional)

A category can be split into subcategories, like **Marketing** is (SEO & Analytics, Social Media Management, Email Marketing, AI Copywriting, Landing Pages, Marketing Project Management, Competitive & Ad Intelligence). Add a `subcategory` field alongside `category` on any link:

```js
{
  title: "Buffer",
  url: "https://buffer.com",
  description: "Schedule and publish social media posts across multiple platforms from one calendar.",
  category: "Marketing",
  subcategory: "Social Media Management",
  dateAdded: "2026-09-10",
  logo: ""
},
```

This only changes that category's own page (`category.html`) — instead of one flat alphabetized list, it groups links under a heading per subcategory. The home page column preview for that category is unaffected (it still shows a flat, mixed preview with a "See all →" link). The order subcategories appear in is controlled by `SUBCATEGORY_ORDER` near the top of `script.js`, right under `CATEGORY_ORDER` — add a new category's name there as a key with an array of its subcategory names in the order you want them to appear. A subcategory left off that list still shows up, just appended at the end. Categories with no `subcategory` field on any of their links render exactly as before — this feature is entirely opt-in per category.

## 5. Edit or remove a link

Find the block in `data.js`, change the fields, or delete the whole `{ ... },` block. Save and refresh.

You can also remove a link straight from the site itself: hover over any row and a small trash icon appears on the right. Clicking it asks you to confirm, then:

- If it's one of your regular links from `data.js`, there's nothing running on the page that can edit that file, so it's hidden in that browser only, and a message reminds you to also delete its block from `data.js` if you want it gone everywhere, not just there.

If you ever want to bring back everything you've hidden this way in a browser, open that browser's dev tools console on the site and run:

```js
localStorage.removeItem("linksdm_hidden_links");
```

then refresh the page.

## 6. The hero section

Under the header is a small intro block: your mascot image beside a heading and one line of supporting copy. It's plain HTML in `index.html` (look for `<section class="hero-bar">`), so to change the wording, just edit the text inside the `<h3>` and `<p>` tags directly and refresh.

## 7. The header navigation, the footer, and the New / Submit / Contact pages

The header (top of every page) has three links: **Home**, **New**, and **Submit**. The footer (bottom of every page) repeats those plus a fourth: **Contact Us**.

- **Home** (`index.html`) is the main page you already know.
- **New Links** (`new.html`) shows every link added in the last 30 days, newest first, as one flat list (no categories). The window is controlled by `NEW_PAGE_WINDOW_DAYS` near the top-middle of `script.js` — change that number if you want a longer or shorter window.
- **Submit a Link** (`submit.html`) is a public form anyone visiting the site can use to suggest a link, with fields for Name, Link, Category, and Description. Link and Category are required. Submitting it takes them to `thank-you.html` and sends **you** an email with what they entered.
- **Contact Us** (`contact.html`, footer only) is a public form for general questions or feedback, with fields for Name, Email, and Message. Submitting it takes them to `message-sent.html` and, same as Submit, sends **you** an email.

**How the email works:** both forms use Netlify's built-in form handling (no backend code, no third-party service to sign up for). Once you deploy this folder to your Netlify site, Netlify automatically detects both forms and starts collecting submissions in your Netlify dashboard under the site's **Forms** tab, listed separately as "submit-link" and "contact". By default, Netlify emails the site owner (your Netlify account email) for every new submission on every form. The first time you deploy this update, it's worth double-checking that's turned on: go to **Site settings → Forms → Form notifications**, and confirm an email notification is set up. If you only see one notification and it's scoped to a single form, either add a second one for the other form or switch it to cover all forms on the site.

A few things worth knowing:

- Both forms only work once the site is actually live on Netlify. Opening `submit.html` or `contact.html` locally (double-clicking the file) will show the form, but submitting it won't go anywhere or send an email, since there's no Netlify server involved locally.
- Nothing gets added to `data.js` automatically from the Submit form. A submission is just an email to review — if you like it, add it to `data.js` yourself the normal way (see section 2).
- Both forms have a hidden honeypot field built in as basic spam protection (real visitors never see it; bots that auto-fill every field on a page will trip it, and Netlify quietly discards those submissions).
- On the Submit form, Category is a dropdown listing the exact category names currently in `data.js`, so submissions come in pre-sorted into a category you already use. If you add a new category to `data.js` (see section 4), remember to add a matching `<option>` to the dropdown in `submit.html` too — it doesn't update itself.

## 8. Put it online (free, ~5 minutes)

You don't need Wix, Squarespace, or any paid host for this — it's static files, so any free static host works. Two easy options:

### Option A — Netlify Drop (fastest, no account required to start)

1. Go to **app.netlify.com/drop**.
2. Drag the whole `linksdm` folder onto the page.
3. Netlify gives you a live URL immediately (something like `random-name-123.netlify.app`).
4. To keep it long-term and get a stable name, create a free Netlify account and claim the site, then rename it in **Site settings → Change site name**. Since you already own `linksdm.com`, add it as a custom domain in **Site settings → Domain management** and point your domain's DNS at Netlify.

### Option B — GitHub Pages (best if you want version history)

1. Create a free GitHub account if you don't have one, and a new repository (e.g. `linksdm`).
2. Upload all the files in the folder (`index.html`, `new.html`, `submit.html`, `thank-you.html`, `contact.html`, `message-sent.html`, `style.css`, `script.js`, `data.js`) to the repo.
3. Go to **Settings → Pages**, set the source branch to `main` and folder to `/root`, save.
4. GitHub gives you a live URL like `yourusername.github.io/linksdm`. To use `linksdm.com` instead, add it as a custom domain under **Settings → Pages → Custom domain**.
5. From then on, editing `data.js` directly in GitHub's web editor and committing the change updates the live site automatically within a minute or two.

**Heads up if you go this route:** the Submit and Contact pages' email notifications (section 7) only work on Netlify. GitHub Pages has no equivalent built in, so both forms would need a different service (like Formspree) to send you an email instead.

## 9. Optional: your own domain

Both Netlify and GitHub Pages let you point a custom domain (e.g. `links.yourname.com`) at the site for free — you just need to own the domain (through whatever registrar you already use for client domains) and add a CNAME record. Netlify's dashboard has a one-click "Add custom domain" flow with instructions for the exact DNS record to add.

## 10. Quick access day-to-day

* **Desktop:** bookmark the live URL, or pin the tab.
* **Phone (iOS/Android):** open the site in your browser, then use "Add to Home Screen." It behaves like a lightweight app icon.

## 11. Ideas if you want to extend it later

These aren't built in, but are natural next steps if you outgrow the basic version:

* **Tags in addition to categories** — add a `tags: ["free", "ai"]` field per link and extend `script.js` to filter by tag as well as category.
* **Dark mode** — add a toggle button and a `data-theme` attribute with a second set of CSS variables.
* **Quick-add without opening a code editor** — connect `data.js` to a Google Sheet or Airtable base via their API so you can add a link from your phone without touching code. This requires a small script change and is a good follow-up task if you want it.
* **RSS feed** — generate a simple `feed.xml` from `data.js` if you ever want to subscribe to your own new-link additions in a reader.

If you want help with any of the above, or want the sample links replaced with a specific starting set for your own workflow, just ask.
