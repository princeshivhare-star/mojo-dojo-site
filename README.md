# Mojo Dojo — Marketing Site

A from-scratch rebuild of the Mojo Dojo homepage: plain HTML/CSS/JS, no build
step, no framework — so it deploys anywhere (including Vercel) with zero config.

## What's implemented

1. **Autolayout everywhere** — every section uses Flexbox or CSS Grid (nav,
   hero, video grid, cards, case-study card, footer columns). Nothing relies
   on fixed pixel positioning; it reflows down to mobile.
2. **Distinct hover animation on every interactive element** — the primary
   CTA, the outline button, the nav CTA, the "Explore all services" ghost
   button, nav links, "Learn more" links, footer links, and social links each
   have their *own* subtle micro-interaction (lift + glow, border wipe,
   underline sweep, arrow slide, icon rotate, etc.) rather than one animation
   reused everywhere.
3. **Video** — linked to `https://www.youtube.com/watch?v=11tgHWHT_Wk&t=2s`.
   Hovering the thumbnail grid gives a subtle zoom; clicking the play button
   (or the grid) swaps it for an inline, autoplaying YouTube embed in the same
   tab — no redirect, no new tab.
4. **Count-up numbers** — every stat (353%, 80%, 50%, $400k, 70%, +142%,
   −34%, $12.4M) animates from 0 the first time it scrolls into view.
5. **Brand-color grain effect** — an SVG `feTurbulence` filter tinted in the
   brand red, layered over a soft red/black radial glow, positioned top-right
   of the hero (the area you circled).

Layout/alignment mirrors the reference screenshots and Figma file.

## Project structure

```
index.html          — all markup/sections
css/styles.css       — layout, tokens, animations
js/script.js         — reveal-on-scroll, count-up, video embed, nav
assets/              — logo (red + white), generated testimonial art
vercel.json          — cache headers for static assets
```

## Run it locally

No build tools needed — just open `index.html`, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploy to Vercel

**Option A — Vercel CLI (fastest)**
```bash
npm i -g vercel
cd mojo-dojo
vercel --prod
```
Follow the prompts (link/create a project). It's a static site, so Vercel
needs no build command or output directory — it just serves the folder.

**Option B — GitHub + Vercel dashboard**
```bash
cd mojo-dojo
git init
git add .
git commit -m "Mojo Dojo site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```
Then at vercel.com → **Add New Project** → import that repo → Deploy
(leave framework preset as "Other", no build command required).

**Option C — Drag and drop**
Go to vercel.com/new, drag the `mojo-dojo` folder onto the page.

## Swapping in real photography

The six testimonial tiles currently use generated red-duotone placeholder
art (`assets/testimonial-1.jpg` … `testimonial-6.jpg`) standing in for real
client photos. Drop your real images in with the same filenames (or update
the `background-image` paths in `index.html`) to swap them in — the overlay
gradient, text, and hover zoom all keep working unchanged.
