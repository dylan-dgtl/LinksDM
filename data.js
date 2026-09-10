// ============================================================
// LINKSTASH — YOUR LINK DATA
// ============================================================
// This is the only file you need to touch to add, edit, or
// remove links. Each link is one object in the LINKS array
// below. Copy the template, fill it in, save the file.
//
// FIELD GUIDE
//   title       — Short name shown on the row (e.g. "Figma")
//   url         — Full link, including https://
//   description — 1 short sentence, shown under the title
//   category    — Groups the link into a column. Use an
//                 existing category to add to that column,
//                 or type a brand new one to create a column.
//   dateAdded   — "YYYY-MM-DD". Controls the "Latest" column
//                 (newest first).
//   logo        — OPTIONAL. Path or URL to a small square
//                 logo image for this link. Leave as "" and
//                 a plain placeholder square is shown instead.
//
// HOW TO ADD A LOGO IMAGE
//   1. Save the logo as a small square image (roughly
//      100x100px works well) — PNG, JPG, or SVG.
//   2. If you're running the multi-file version (index.html +
//      style.css + script.js + data.js), create a "logos"
//      folder next to data.js, drop the image in there, and
//      set:  logo: "logos/figma.png"
//   3. If you're using the single-file version, use a full
//      image URL instead (e.g. one already hosted somewhere),
//      or convert the image to a base64 data URI and paste it
//      directly, e.g.  logo: "data:image/png;base64,iVBOR..."
//      (Any base64 image converter online can generate this.)
//
// TEMPLATE (copy this block, paste above the closing "];")
//   {
//     title: "",
//     url: "",
//     description: "",
//     category: "",
//     dateAdded: "2026-08-15",
//     logo: ""
//   },
// ============================================================

const LINKS = [

  // ---------- AI Tools ----------
  {
    title: "ChatGPT",
    url: "https://chatgpt.com",
    description: "General-purpose AI assistant for research, drafting, and brainstorming.",
    category: "AI Tools",
    dateAdded: "2026-08-14",
    logo: ""
  },
  {
    title: "Claude",
    url: "https://claude.ai",
    description: "AI assistant for writing, research, and coding help.",
    category: "AI Tools",
    dateAdded: "2026-08-10",
    logo: ""
  },
  {
    title: "Cursor",
    url: "https://cursor.com",
    description: "AI code editor and agent that turns prompts and ideas into working code.",
    category: "AI Tools",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/cursor.png"
  },
  {
    title: "Google Gemini",
    url: "https://gemini.google.com",
    description: "Google's AI assistant for chat, research, and everyday productivity tasks.",
    category: "AI Tools",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Gumloop",
    url: "https://www.gumloop.com/pipeline",
    description: "No-code AI automation builder for connecting tools and workflows.",
    category: "AI Tools",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Midjourney",
    url: "https://www.midjourney.com",
    description: "AI image generation for concepts, mockups, and creative visuals.",
    category: "AI Tools",
    dateAdded: "2026-07-20",
    logo: ""
  },
  {
    title: "Perplexity",
    url: "https://www.perplexity.ai",
    description: "AI search engine that answers questions with cited sources.",
    category: "AI Tools",
    dateAdded: "2026-07-29",
    logo: ""
  },
  {
    title: "Skills.sh",
    url: "https://www.skills.sh/",
    description: "Directory for discovering and installing skills built for AI agents.",
    category: "AI Tools",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/skills-sh.png"
  },
  {
    title: "Supahero",
    url: "https://supahero.io/",
    description: "Curated library of standout website hero section designs for inspiration.",
    category: "AI Tools",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/supahero.png"
  },

  // ---------- Design Inspiration ----------
  {
    title: "Apple Design Awards",
    url: "https://developer.apple.com/design/awards/",
    description: "Apple's yearly showcase of standout app and game design across six award categories.",
    category: "Design Inspiration",
    dateAdded: "2026-09-09",
    logo: ""
  },
  {
    title: "Awwwards",
    url: "https://www.awwwards.com",
    description: "Showcase of award-winning website design and web trends.",
    category: "Design Inspiration",
    dateAdded: "2026-08-01",
    logo: ""
  },
  {
    title: "Behance",
    url: "https://www.behance.net",
    description: "Portfolio platform for browsing creative and branding work.",
    category: "Design Inspiration",
    dateAdded: "2026-06-30",
    logo: ""
  },
  {
    title: "Cosmos",
    url: "https://www.cosmos.so",
    description: "Visual bookmarking tool for curating and organizing design inspiration.",
    category: "Design Inspiration",
    dateAdded: "2026-08-23",
    logo: "assets/favicons/cosmos.png"
  },
  {
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Design inspiration and portfolios from designers worldwide.",
    category: "Design Inspiration",
    dateAdded: "2026-08-12",
    logo: ""
  },
  {
    title: "Logosystem",
    url: "https://logosystem.co/",
    description: "Curated library of logos, wordmarks, and animated marks for branding inspiration.",
    category: "Design Inspiration",
    dateAdded: "2026-09-09",
    logo: ""
  },
  {
    title: "Mobbin",
    url: "https://mobbin.com",
    description: "Searchable library of real mobile and web app UI screens.",
    category: "Design Inspiration",
    dateAdded: "2026-07-15",
    logo: ""
  },
  {
    title: "Pexels",
    url: "https://www.pexels.com",
    description: "Free stock photos and videos for commercial use.",
    category: "Design Inspiration",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Same Energy",
    url: "https://same.energy",
    description: "AI-powered visual search engine for finding images with a similar look and feel.",
    category: "Design Inspiration",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Shopify Editions",
    url: "https://www.shopify.com/editions",
    description: "Shopify's biannual showcase of major new commerce features and platform updates.",
    category: "Design Inspiration",
    dateAdded: "2026-09-09",
    logo: ""
  },

  // ---------- AI Design ----------
  {
    title: "Getdesign.md",
    url: "https://getdesign.md",
    description: "Browse AI-readable design breakdowns, or request a custom one.",
    category: "AI Design",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Impeccable",
    url: "https://impeccable.style/",
    description: "Gives AI coding agents a better eye for design, cutting generic \"AI slop\" for cleaner UIs.",
    category: "AI Design",
    dateAdded: "2026-08-25",
    logo: "assets/favicons/impeccable.svg"
  },
  {
    title: "Refero Styles",
    url: "https://styles.refero.design/",
    description: "Curated library of AI-readable design systems from popular product websites.",
    category: "AI Design",
    dateAdded: "2026-09-06",
    logo: "assets/favicons/refero-styles.png"
  },
  {
    title: "TypeUI",
    url: "https://www.typeui.sh/",
    description: "Design better websites with AI, then track visitor behavior and performance with TypeUI Insights.",
    category: "AI Design",
    dateAdded: "2026-08-26",
    logo: "assets/favicons/typeui.png"
  },
  {
    title: "UI UX Pro Max",
    url: "https://ui-ux-pro-max-skill.nextlevelbuilder.io/",
    description: "Design intelligence skill for AI assistants: UI styles, palettes, and UX guidelines.",
    category: "AI Design",
    dateAdded: "2026-08-25",
    logo: "assets/favicons/ui-ux-pro-max.svg"
  },

  // ---------- Website Platforms ----------
  {
    title: "Framer",
    url: "https://www.framer.com",
    description: "Design and publish responsive websites with built-in animations and a CMS.",
    category: "Website Platforms",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Shopify",
    url: "https://www.shopify.com",
    description: "E-commerce platform for building and managing online stores.",
    category: "Website Platforms",
    dateAdded: "2026-06-02",
    logo: ""
  },
  {
    title: "Squarespace",
    url: "https://www.squarespace.com",
    description: "All-in-one website builder popular with small businesses.",
    category: "Website Platforms",
    dateAdded: "2026-07-22",
    logo: ""
  },
  {
    title: "Webflow",
    url: "https://webflow.com",
    description: "Visual web design tool with clean code export and CMS options.",
    category: "Website Platforms",
    dateAdded: "2026-06-18",
    logo: ""
  },
  {
    title: "Wix Studio",
    url: "https://www.wix.com/studio",
    description: "Advanced web design platform built for freelancers and agencies.",
    category: "Website Platforms",
    dateAdded: "2026-08-05",
    logo: ""
  },
  {
    title: "WordPress",
    url: "https://wordpress.org",
    description: "Widely used CMS and website platform with extensive plugin and theme support.",
    category: "Website Platforms",
    dateAdded: "2026-08-23",
    logo: ""
  },

  // ---------- Hosting ----------
  {
    title: "Cloudflare",
    url: "https://www.cloudflare.com",
    description: "CDN, DNS, and security platform that speeds up and protects websites.",
    category: "Hosting",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Hostinger",
    url: "https://www.hostinger.com",
    description: "Web hosting provider offering shared, VPS, and cloud hosting plans.",
    category: "Hosting",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Netlify",
    url: "https://www.netlify.com",
    description: "Hosting and deployment platform for static sites and web apps.",
    category: "Hosting",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Railway",
    url: "https://railway.app",
    description: "Cloud platform for deploying and hosting apps and backend services.",
    category: "Hosting",
    dateAdded: "2026-08-23",
    logo: ""
  },

  // ---------- Domains ----------
  {
    title: "Cloudflare Registrar",
    url: "https://www.cloudflare.com/products/registrar/",
    description: "Domain registration and renewals at cost, with no markup or hidden fees.",
    category: "Domains",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/cloudflare-registrar.png"
  },
  {
    title: "Dynadot",
    url: "https://www.dynadot.com",
    description: "Domain registration and management with DNS, privacy, and transfer tools.",
    category: "Domains",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/dynadot.png"
  },
  {
    title: "Namecheap",
    url: "https://www.namecheap.com",
    description: "Affordable domain registrar with 24/7 support.",
    category: "Domains",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/namecheap.png"
  },
  {
    title: "Porkbun",
    url: "https://porkbun.com",
    description: "Domain registrar for buying and managing domain names.",
    category: "Domains",
    dateAdded: "2026-08-23",
    logo: ""
  },

  // ---------- SEO Analytics ----------
  {
    title: "Ahrefs",
    url: "https://ahrefs.com",
    description: "SEO toolset for backlink research, keyword research, and site audits.",
    category: "SEO Analytics",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Google Ads",
    url: "https://ads.google.com",
    description: "Run search, display, and video ad campaigns to drive traffic and leads.",
    category: "SEO Analytics",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Google Search Console",
    url: "https://search.google.com/search-console/about",
    description: "Monitor how Google indexes and ranks your sites.",
    category: "SEO Analytics",
    dateAdded: "2026-07-25",
    logo: ""
  },
  {
    title: "Google Trends",
    url: "https://trends.google.com",
    description: "Explore search interest over time and by region for any keyword.",
    category: "SEO Analytics",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "PageSpeed Insights",
    url: "https://pagespeed.web.dev",
    description: "Test page load speed and Core Web Vitals for any URL.",
    category: "SEO Analytics",
    dateAdded: "2026-06-14",
    logo: ""
  },
  {
    title: "Semrush",
    url: "https://www.semrush.com",
    description: "SEO and competitive research: keywords, backlinks, site audits.",
    category: "SEO Analytics",
    dateAdded: "2026-08-08",
    logo: ""
  },
  {
    title: "Ubersuggest",
    url: "https://neilpatel.com/ubersuggest",
    description: "Keyword research, content ideas, and site audit tool.",
    category: "SEO Analytics",
    dateAdded: "2026-07-10",
    logo: ""
  },

  // ---------- Icons & Stock Photos ----------
  {
    title: "Coolors",
    url: "https://coolors.co",
    description: "Fast color palette generator with export options.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-06-05",
    logo: "assets/favicons/coolors.png"
  },
  {
    title: "Flaticon",
    url: "https://www.flaticon.com",
    description: "Large library of free and premium icons.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-07-18",
    logo: ""
  },
  {
    title: "Iconify",
    url: "https://icon-sets.iconify.design/",
    description: "Search engine for 350,000+ open-source icons across 220+ icon sets.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-09-09",
    logo: ""
  },
  {
    title: "Iconsax",
    url: "https://iconsax.io/",
    description: "Icon library with 50,000+ icons in multiple styles and framework plugins.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-09-01",
    logo: "assets/favicons/iconsax.png"
  },
  {
    title: "Its Hover",
    url: "https://www.itshover.com/icons",
    description: "Copy-paste animated icons with smooth hover effects, built for shadcn.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-09-01",
    logo: "assets/favicons/itshover.png"
  },
  {
    title: "Lucide",
    url: "https://lucide.dev/",
    description: "Open-source icon toolkit with a clean, consistent style for web and app UI.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-09-09",
    logo: ""
  },
  {
    title: "Morphicons",
    url: "https://www.morphicons.com/",
    description: "SVG icon library with smooth morphing animations between icon sets.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-09-01",
    logo: "assets/favicons/morphicons.png"
  },
  {
    title: "Unsplash",
    url: "https://unsplash.com",
    description: "Free high-resolution stock photography.",
    category: "Icons & Stock Photos",
    dateAdded: "2026-08-02",
    logo: ""
  },

  // ---------- Fonts ----------
  {
    title: "Best Free Fonts",
    url: "https://bestfreefonts.com/",
    description: "Curated directory of free fonts for branding, web, and editorial design.",
    category: "Fonts",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/bestfreefonts.png"
  },
  {
    title: "Fonts In Use",
    url: "https://fontsinuse.com",
    description: "Searchable archive of real-world typography examples by typeface.",
    category: "Fonts",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Fontshare",
    url: "https://www.fontshare.com",
    description: "Free fonts from Indian Type Foundry, licensed free for web and print.",
    category: "Fonts",
    dateAdded: "2026-08-23",
    logo: ""
  },
  {
    title: "Google Fonts",
    url: "https://fonts.google.com",
    description: "Free, open-source web fonts for any project.",
    category: "Fonts",
    dateAdded: "2026-06-25",
    logo: "assets/favicons/google-fonts.png"
  },

  // ---------- Productivity & Business ----------
  {
    title: "Calendly",
    url: "https://calendly.com",
    description: "Scheduling links for client discovery calls and meetings.",
    category: "Productivity & Business",
    dateAdded: "2026-07-27",
    logo: ""
  },
  {
    title: "Loom",
    url: "https://www.loom.com",
    description: "Quick screen-recorded videos for client walkthroughs and feedback.",
    category: "Productivity & Business",
    dateAdded: "2026-07-05",
    logo: ""
  },
  {
    title: "Notion",
    url: "https://www.notion.com",
    description: "Docs, notes, and project tracking in one workspace.",
    category: "Productivity & Business",
    dateAdded: "2026-08-11",
    logo: ""
  },
  {
    title: "Trello",
    url: "https://trello.com",
    description: "Simple board-based task and project tracking.",
    category: "Productivity & Business",
    dateAdded: "2026-06-20",
    logo: ""
  },

  // ---------- Learning ----------
  {
    title: "Apple Human Interface Guidelines",
    url: "https://developer.apple.com/design/human-interface-guidelines/",
    description: "Official Apple guidance for designing interfaces across its platforms.",
    category: "Learning",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/apple-hig.png"
  },
  {
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "Reference and tutorials for CSS and front-end techniques.",
    category: "Learning",
    dateAdded: "2026-07-12",
    logo: ""
  },
  {
    title: "Degreeless.Design",
    url: "https://degreeless.design",
    description: "Curated design and UX resources and courses for self-taught designers.",
    category: "Learning",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/degreeless.png"
  },
  {
    title: "Indie Hackers",
    url: "https://www.indiehackers.com",
    description: "Community and stories from people building independent businesses.",
    category: "Learning",
    dateAdded: "2026-06-28",
    logo: ""
  },
  {
    title: "Intro to UI Design Fundamentals",
    url: "https://scrimba.com/intro-to-ui-design-fundamentals-c0q",
    description: "Free course teaching UI design fundamentals using just HTML and CSS.",
    category: "Learning",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/scrimba.png"
  },
  {
    title: "Laws of UX",
    url: "https://lawsofux.com",
    description: "UX psychology principles designers can apply when building interfaces.",
    category: "Learning",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/lawsofux.svg"
  },
  {
    title: "Smashing Magazine",
    url: "https://www.smashingmagazine.com",
    description: "Articles on web design, UX, and front-end development.",
    category: "Learning",
    dateAdded: "2026-08-06",
    logo: ""
  },
  {
    title: "Uxcel",
    url: "https://uxcel.com",
    description: "Interactive courses for learning UX design and product management skills.",
    category: "Learning",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/uxcel.png"
  },

  // ---------- Wallpapers ----------
  {
    title: "Elevate Digital Supply Wallpapers",
    url: "https://elevatedigitalsupply.com",
    description: "Premium 4K and 6K wallpaper packs for desktop and mobile, crafted for people who care about the details.",
    category: "Wallpapers",
    dateAdded: "2026-08-24",
    logo: ""
  },

  // ---------- Curated Physical Goods ----------
  {
    title: "Curated Supply",
    url: "https://www.curated.supply/",
    description: "Curated marketplace for premium tech, homeware, and lifestyle products.",
    category: "Curated Physical Goods",
    dateAdded: "2026-08-30",
    logo: "assets/favicons/curated-supply.png"
  },

  // ---------- AI Video Generation ----------
  {
    title: "Higgsfield",
    url: "https://higgsfield.ai",
    description: "AI video, image, and voice generation with cinematic camera controls.",
    category: "AI Video Generation",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/higgsfield.png"
  },
  {
    title: "Krea",
    url: "https://www.krea.ai/",
    description: "AI creative suite for generating and enhancing images and video.",
    category: "AI Video Generation",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/krea.png"
  },
  {
    title: "Runway",
    url: "https://runway.com/",
    description: "AI creative suite for generating and editing video, image, and audio content.",
    category: "AI Video Generation",
    dateAdded: "2026-08-31",
    logo: "assets/favicons/runway.png"
  },

  // ---- Marketing (grouped into subcategories on category.html) ----
  {
    title: "Buffer",
    url: "https://buffer.com",
    description: "Schedule and publish social media posts across multiple platforms from one calendar.",
    category: "Marketing",
    subcategory: "Social Media Management",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Hootsuite",
    url: "https://www.hootsuite.com",
    description: "All-in-one social media scheduling, inbox, and analytics dashboard.",
    category: "Marketing",
    subcategory: "Social Media Management",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Mailchimp",
    url: "https://mailchimp.com",
    description: "Email marketing platform with a campaign builder, automation, and audience management.",
    category: "Marketing",
    subcategory: "Email Marketing",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Klaviyo",
    url: "https://www.klaviyo.com",
    description: "Email and SMS marketing built for ecommerce brands.",
    category: "Marketing",
    subcategory: "Email Marketing",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Jasper",
    url: "https://www.jasper.ai",
    description: "AI writing assistant trained on your brand voice for marketing copy.",
    category: "Marketing",
    subcategory: "AI Copywriting",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Copy.ai",
    url: "https://www.copy.ai",
    description: "Template-driven AI copywriting for ads, emails, and social captions.",
    category: "Marketing",
    subcategory: "AI Copywriting",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Unbounce",
    url: "https://unbounce.com",
    description: "Landing page builder with built-in A/B testing for conversion rate optimization.",
    category: "Marketing",
    subcategory: "Landing Pages",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "Instapage",
    url: "https://instapage.com",
    description: "Landing page platform with AI-assisted split testing and personalization.",
    category: "Marketing",
    subcategory: "Landing Pages",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "ClickUp",
    url: "https://clickup.com",
    description: "Customizable workspace for planning, tracking, and reporting on marketing campaigns.",
    category: "Marketing",
    subcategory: "Marketing Project Management",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "monday.com",
    url: "https://monday.com",
    description: "Visual work management platform for campaign planning and team collaboration.",
    category: "Marketing",
    subcategory: "Marketing Project Management",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "SimilarWeb",
    url: "https://www.similarweb.com",
    description: "Traffic and digital performance benchmarking for any website.",
    category: "Marketing",
    subcategory: "Competitive & Ad Intelligence",
    dateAdded: "2026-09-10",
    logo: ""
  },
  {
    title: "SpyFu",
    url: "https://www.spyfu.com",
    description: "See a competitor's paid and organic keywords, ads, and ranking history.",
    category: "Marketing",
    subcategory: "Competitive & Ad Intelligence",
    dateAdded: "2026-09-10",
    logo: ""
  }

];
